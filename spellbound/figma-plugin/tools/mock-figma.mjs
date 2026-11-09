// A strict stand-in for the Figma plugin API. Runs code.js the way Figma would and throws where Figma throws.
// throwing where real Figma throws for the mistakes that usually break plugins.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const missingFonts = new Set((process.env.MISSING_FONTS || '').split(',').filter(Boolean));
let nextId = 1;
const loaded = new Set();
const fontKey = f => f.family + '|' + f.style;
const AVAILABLE = ['Inter|Regular', 'Inter|Medium', 'Inter|Semi Bold', 'Inter|Bold', 'Instrument Serif|Regular', 'Instrument Serif|Italic', 'Playfair Display|Regular', 'Playfair Display|Italic'].filter(f => !missingFonts.has(f));
const CONTAINERS = new Set(['PAGE', 'FRAME', 'COMPONENT', 'COMPONENT_SET', 'INSTANCE', 'GROUP', 'SECTION']);
const BINDABLE = new Set(['itemSpacing', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'topLeftRadius', 'topRightRadius', 'bottomLeftRadius', 'bottomRightRadius', 'width', 'height', 'opacity', 'strokeWeight']);
const TRANSITIONS = new Set(['DISSOLVE', 'SMART_ANIMATE', 'MOVE_IN', 'MOVE_OUT', 'PUSH', 'SLIDE_IN', 'SLIDE_OUT', 'SCROLL_ANIMATE']);
const DIRECTIONAL = new Set(['MOVE_IN', 'MOVE_OUT', 'PUSH', 'SLIDE_IN', 'SLIDE_OUT']);
const styles = new Map();
let stats = { nodes: 0, reactions: 0, instances: 0, components: 0, texts: 0, boundVars: 0 };

function fail(msg) { throw new Error('[figma] ' + msg); }
const isAuto = n => n && n.layoutMode && n.layoutMode !== 'NONE';
function pageOf(n) { while (n && n.type !== 'PAGE') n = n.parent; return n; }
function insideInstance(n) { for (let p = n; p; p = p.parent) if (p.type === 'INSTANCE') return true; return false; }
function owningComponent(n) { for (let p = n; p; p = p.parent) { if (p.type === 'COMPONENT') return p.parent && p.parent.type === 'COMPONENT_SET' ? p.parent : p; } return null; }

const SIDE = ['strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight', 'topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius'];
class Node {
  constructor(type) {
    this.id = (nextId++) + ':1'; this.type = type; this.parent = null; this.name = type;
    this.x = 0; this.y = 0; this.width = 100; this.height = 100; this.visible = true; this.removed = false;
    this.fills = []; this.strokes = []; this.effects = []; this.reactions = [];
    this._layoutMode = 'NONE'; this._lsh = 'FIXED'; this._lsv = 'FIXED';
    if (CONTAINERS.has(type)) this.children = [];
    stats.nodes++;
  }
  get strokeWeight() { const w = ['strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight'].map(k => this['_' + k]); if (w.some(x => x !== undefined) && new Set(w.map(x => x === undefined ? this._sw : x)).size > 1) return figma.mixed; return this._sw === undefined ? 1 : this._sw; }
  set strokeWeight(v) { if (typeof v !== 'number') fail('strokeWeight must be a number (got ' + String(v) + ') on "' + this.name + '"'); this._sw = v; for (const k of ['strokeTopWeight', 'strokeRightWeight', 'strokeBottomWeight', 'strokeLeftWeight']) this['_' + k] = undefined; }
  get cornerRadius() { const r = ['topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius'].map(k => this['_' + k]); if (r.some(x => x !== undefined) && new Set(r.map(x => x === undefined ? this._cr : x)).size > 1) return figma.mixed; return this._cr || 0; }
  set cornerRadius(v) { if (typeof v !== 'number') fail('cornerRadius must be a number (got ' + String(v) + ') on "' + this.name + '"'); this._cr = v; for (const k of ['topLeftRadius', 'topRightRadius', 'bottomRightRadius', 'bottomLeftRadius']) this['_' + k] = undefined; }
  get layoutMode() { return this._layoutMode; }
  set layoutMode(v) { if (!['NONE', 'HORIZONTAL', 'VERTICAL', 'GRID'].includes(v)) fail('bad layoutMode ' + v); if (!['FRAME', 'COMPONENT', 'COMPONENT_SET', 'INSTANCE'].includes(this.type)) fail('layoutMode on ' + this.type); this._layoutMode = v; }
  set counterAxisAlignItems(v) { if (v === 'BASELINE' && this._layoutMode !== 'HORIZONTAL') fail('BASELINE needs a horizontal frame: ' + this.name); if (!['MIN', 'MAX', 'CENTER', 'BASELINE'].includes(v)) fail('bad counterAxisAlignItems ' + v); this._caa = v; }
  get counterAxisAlignItems() { return this._caa; }
  set primaryAxisAlignItems(v) { if (!['MIN', 'MAX', 'CENTER', 'SPACE_BETWEEN'].includes(v)) fail('bad primaryAxisAlignItems ' + v); this._paa = v; }
  get primaryAxisAlignItems() { return this._paa; }
  get layoutSizingHorizontal() { return this._lsh; }
  set layoutSizingHorizontal(v) { this._sizing('h', v); }
  get layoutSizingVertical() { return this._lsv; }
  set layoutSizingVertical(v) { this._sizing('v', v); }
  _sizing(axis, v) {
    if (v === 'FILL' && !isAuto(this.parent)) fail(`FILL can only be set on children of auto-layout frames (${this.type} "${this.name}" in ${this.parent ? this.parent.type + ' "' + this.parent.name + '"' : 'nothing'})`);
    if (v === 'FILL' && process.env.STRICT_FILL !== '0') {
      const along = (this.parent.layoutMode === 'HORIZONTAL') === (axis === 'h');
      const pSize = axis === 'h' ? this.parent._lsh : this.parent._lsv;
      if (pSize === 'HUG' && !(this.parent.type === 'COMPONENT_SET')) fail(`FILL on "${this.name}" while its parent "${this.parent.name}" still hugs that axis${along ? '' : ' (cross axis)'}`);
    }
    if (v === 'HUG' && !(isAuto(this) || this.type === 'TEXT')) fail(`HUG can only be set on auto-layout frames and text ("${this.name}")`);
    if (!['FIXED', 'HUG', 'FILL'].includes(v)) fail('bad sizing ' + v);
    if (axis === 'h') this._lsh = v; else this._lsv = v;
  }
  set layoutPositioning(v) { if (v === 'ABSOLUTE' && !isAuto(this.parent)) fail('ABSOLUTE needs an auto-layout parent: ' + this.name); this._lp = v; }
  get layoutPositioning() { return this._lp || 'AUTO'; }
  set layoutGrow(v) { if (!isAuto(this.parent)) fail('layoutGrow needs an auto-layout parent: ' + this.name); this._lg = v; }
  get layoutGrow() { return this._lg || 0; }
  set numberOfFixedChildren(v) { if (this.parent && this.parent.type !== 'PAGE') fail('numberOfFixedChildren only on top-level frames'); if (v > this.children.length) fail('more fixed children than children'); this._nfc = v; }
  get numberOfFixedChildren() { return this._nfc || 0; }
  set minHeight(v) { if (!isAuto(this) && !isAuto(this.parent)) fail('minHeight needs auto layout'); this._minH = v; }
  get minHeight() { return this._minH; }
  // text
  set fontName(f) { if (!loaded.has(fontKey(f))) fail('font not loaded: ' + fontKey(f)); this._font = f; }
  get fontName() { return this._font || { family: 'Inter', style: 'Regular' }; }
  set characters(s) { if (this.type !== 'TEXT') fail('characters on ' + this.type); if (!loaded.has(fontKey(this.fontName))) fail('characters before loading ' + fontKey(this.fontName)); if (typeof s !== 'string') fail('characters must be a string'); this._chars = s; this.width = Math.max(1, s.length * 7); this.height = 18; }
  get characters() { return this._chars || ''; }
  set textAutoResize(v) { if (!['NONE', 'WIDTH_AND_HEIGHT', 'HEIGHT', 'TRUNCATE'].includes(v)) fail('bad textAutoResize'); this._tar = v; }
  get textAutoResize() { return this._tar; }
  set textCase(v) { if (!['ORIGINAL', 'UPPER', 'LOWER', 'TITLE'].includes(v)) fail('bad textCase'); this._tc = v; }
  get textCase() { return this._tc; }
  // tree
  appendChild(c) { this.insertChild(this.children ? this.children.length : 0, c); }
  insertChild(i, c) {
    if (!this.children) fail(this.type + ' cannot have children');
    if (insideInstance(this)) fail('cannot add children inside an instance ("' + this.name + '")');
    if (c.type === 'PAGE') fail('cannot append a page');
    if (this.type === 'COMPONENT_SET' && c.type !== 'COMPONENT') fail('component sets only hold components');
    if (c.parent) { const a = c.parent.children; const k = a.indexOf(c); if (k < i && c.parent === this) i--; a.splice(k, 1); }
    if (i < 0 || i > this.children.length) fail('insertChild index out of range');
    this.children.splice(i, 0, c); c.parent = this;
    if (c.type === 'COMPONENT' && insideInstance(this)) fail('component inside instance');
  }
  remove() { if (this.parent) { const a = this.parent.children; a.splice(a.indexOf(this), 1); } this.parent = null; this.removed = true; }
  findAll(fn) { const out = []; const walk = n => { for (const k of n.children || []) { if (!fn || fn(k)) out.push(k); walk(k); } }; walk(this); return out; }
  findOne(fn) { return this.findAll(fn)[0] || null; }
  resize(w, h) { if (!(w >= 0.01) || !(h >= 0.01)) fail(`resize to ${w}x${h} on "${this.name}"`); this.width = w; this.height = h; }
  resizeWithoutConstraints(w, h) { this.resize(w, h); }
  rescale(s) { if (!(s > 0)) fail('rescale ' + s); this.width *= s; this.height *= s; this._scale = (this._scale || 1) * s; }
  setBoundVariable(field, v) { if (!BINDABLE.has(field)) fail('cannot bind ' + field); if (!v || !v.id) fail('bad variable'); if (v.resolvedType !== 'FLOAT') fail('only numbers bind to ' + field); stats.boundVars++; }
  async setReactionsAsync(list) {
    const page = pageOf(this);
    let top = this; while (top.parent && top.parent.type !== 'PAGE') top = top.parent;
    for (const r of list) {
      if (!r.trigger || !['ON_CLICK', 'AFTER_TIMEOUT', 'ON_HOVER', 'ON_PRESS', 'ON_DRAG'].includes(r.trigger.type)) fail('bad trigger');
      if (r.trigger.type === 'AFTER_TIMEOUT' && this !== top) fail('AFTER_TIMEOUT only on top-level frames ("' + this.name + '")');
      if (!Array.isArray(r.actions) || !r.actions.length) fail('reaction needs actions');
      for (const a of r.actions) {
        const d = all.get(a.destinationId);
        if (!d || d.removed) fail('destination missing for ' + this.name);
        if (!d.parent || d.parent.type !== 'PAGE') fail('destination must be a top-level frame: ' + d.name);
        if (pageOf(d) !== page) fail('destination on another page: ' + d.name);
        if (d === top) fail('navigating to itself from ' + this.name);
        const t = a.transition;
        if (!TRANSITIONS.has(t.type)) fail('bad transition ' + t.type);
        if (DIRECTIONAL.has(t.type) && (!t.direction || t.matchLayers === undefined)) fail('directional transition needs direction and matchLayers');
        if (!(t.duration > 0) || !t.easing) fail('transition needs duration and easing');
      }
    }
    this.reactions = list; stats.reactions += list.length;
  }
  async exportAsync(opts) { if (!opts || opts.format !== 'PNG') fail('export format'); if (pageOf(this) && !pageOf(this)) fail('page not loaded'); return new Uint8Array(8); }
  async setTextStyleIdAsync(id) { if (this.type !== 'TEXT') fail('text style on ' + this.type); if (!styles.has(id)) fail('unknown text style'); this.textStyleId = id; }
  async setVectorNetworkAsync(net) { if (this.type !== 'VECTOR') fail('vector network on ' + this.type); if (!net.vertices || !net.segments) fail('bad network'); this.vectorNetwork = net; }
  set constraints(c) { if (!c.horizontal || !c.vertical) fail('constraints need both axes'); this._con = c; }
  get constraints() { return this._con; }
  clone() {
    const c = cloneDeep(this, null);
    if (this.parent) { const a = this.parent.children; a.splice(a.indexOf(this) + 1, 0, c); c.parent = this.parent; }
    return c;
  }
  // components
  createInstance() {
    if (this.type !== 'COMPONENT') fail('createInstance on ' + this.type + ' "' + this.name + '"');
    const i = cloneDeep(this, null, 'INSTANCE'); i.mainComponent = this; i.parent = null;
    figma.currentPage.appendChild(i); stats.instances++;
    return i;
  }
  get defaultVariant() { if (this.type !== 'COMPONENT_SET') fail('defaultVariant on ' + this.type); return this.children[0]; }
  addComponentProperty(name, type, def) {
    if (!(this.type === 'COMPONENT_SET' || (this.type === 'COMPONENT' && !(this.parent && this.parent.type === 'COMPONENT_SET')))) fail('properties go on the component set, not on a variant ("' + this.name + '")');
    if (!['TEXT', 'BOOLEAN', 'INSTANCE_SWAP', 'VARIANT'].includes(type)) fail('bad property type');
    if (type === 'INSTANCE_SWAP' && !(all.get(def) && all.get(def).type === 'COMPONENT')) fail('INSTANCE_SWAP default must be a component id');
    this.defs = this.defs || {};
    const key = name + '#' + (nextId++) + ':0';
    this.defs[key] = { type, defaultValue: def };
    return key;
  }
  get componentPropertyDefinitions() { return this.defs || {}; }
  set componentPropertyReferences(refs) {
    const owner = owningComponent(this);
    if (!owner) fail('property reference outside a component: ' + this.name);
    for (const [field, key] of Object.entries(refs || {})) {
      const d = (owner.defs || {})[key];
      if (!d) fail(`reference to unknown property ${key} on "${this.name}"`);
      if (field === 'characters' && (this.type !== 'TEXT' || d.type !== 'TEXT')) fail('characters ref needs TEXT');
      if (field === 'visible' && d.type !== 'BOOLEAN') fail('visible ref needs BOOLEAN');
      if (field === 'mainComponent' && (this.type !== 'INSTANCE' || d.type !== 'INSTANCE_SWAP')) fail('mainComponent ref needs an instance + INSTANCE_SWAP');
    }
    this._refs = refs;
  }
  get componentPropertyReferences() { return this._refs || null; }
  setProperties(props) {
    if (this.type !== 'INSTANCE') fail('setProperties on ' + this.type);
    const main = this.mainComponent;
    const set = main.parent && main.parent.type === 'COMPONENT_SET' ? main.parent : null;
    const defs = (set || main).defs || {};
    const variantProps = {};
    if (set) for (const c of set.children) for (const part of c.name.split(',')) { const [k, v] = part.split('=').map(s => s.trim()); (variantProps[k] = variantProps[k] || new Set()).add(v); }
    for (const [k, v] of Object.entries(props)) {
      if (variantProps[k]) { if (!variantProps[k].has(v)) fail(`no variant ${k}=${v} in "${set.name}"`); continue; }
      const d = defs[k];
      if (!d) fail(`unknown property "${k}" on instance of "${(set || main).name}"`);
      if (d.type === 'TEXT' && typeof v !== 'string') fail('TEXT property needs a string');
      if (d.type === 'BOOLEAN' && typeof v !== 'boolean') fail('BOOLEAN property needs a boolean');
      if (d.type === 'INSTANCE_SWAP' && !(all.get(v) && all.get(v).type === 'COMPONENT')) fail('INSTANCE_SWAP needs a component id');
    }
    this.props = Object.assign(this.props || {}, props);
    // variant switch: rebuild from the matching variant
    if (set) {
      const cur = {}; for (const part of main.name.split(',')) { const [k, v] = part.split('=').map(x => x.trim()); cur[k] = v; }
      let changed = false; for (const k of Object.keys(variantProps)) if (props[k] && props[k] !== cur[k]) { cur[k] = props[k]; changed = true; }
      if (changed) {
        const target = set.children.find(c => c.name.split(',').every(part => { const [k, v] = part.split('=').map(x => x.trim()); return cur[k] === v; }));
        if (!target) fail('no matching variant');
        const fresh = cloneDeep(target, null, 'INSTANCE');
        for (const k of Object.keys(fresh)) if (!['id', 'type', 'parent', 'children', 'x', 'y', 'name', '_lsh', '_lsv', '_lg', '_lp', '_scale', 'width', 'height', 'props', 'reactions', 'removed', '_con'].includes(k)) this[k] = fresh[k];
        this.children = fresh.children; for (const c of this.children) c.parent = this;
        this.mainComponent = target;
      }
    }
    for (const [k, v] of Object.entries(this.props)) {
      const d = defs[k]; if (!d) continue;
      for (const n of this.findAll(x => x._refs)) {
        if (d.type === 'TEXT' && n._refs.characters === k) n._chars = v;
        if (d.type === 'BOOLEAN' && n._refs.visible === k) n.visible = v;
        if (d.type === 'INSTANCE_SWAP' && n._refs.mainComponent === k) {
          const comp = all.get(v); const fresh = cloneDeep(comp, null, 'INSTANCE');
          n.children = fresh.children; for (const c of n.children) c.parent = n; n.mainComponent = comp; n._svgPaint = null;
        }
      }
    }
  }
}
for (const k of SIDE) Object.defineProperty(Node.prototype, k, {
  get() { const v = this['_' + k]; return v === undefined ? (k.endsWith('Weight') ? (this._sw === undefined ? 1 : this._sw) : (this._cr || 0)) : v; },
  set(v) { if (typeof v !== 'number') fail(k + ' must be a number'); this['_' + k] = v; },
});
const all = new Map();
function track(n) { all.set(n.id, n); return n; }
function cloneDeep(src, parent, asType) {
  const n = track(new Node(asType || src.type));
  for (const k of Object.keys(src)) if (!['id', 'type', 'parent', 'children', 'removed', 'defs', 'reactions'].includes(k)) n[k] = src[k];
  n.reactions = [];
  if (src.children) { n.children = []; for (const k of src.children) { const c = cloneDeep(k, n); n.children.push(c); c.parent = n; } }
  return n;
}

const page1 = track(new Node('PAGE'));
page1.name = 'Page 1';
page1.loadAsync = async () => {};
Object.defineProperty(page1, 'flowStartingPoints', {
  set(v) { for (const f of v) { const n = all.get(f.nodeId); if (!n || n.parent !== page1 && n.parent && n.parent.type !== 'PAGE') fail('flow start must be a top-level frame'); } this._flows = v; },
  get() { return this._flows || []; },
});
const figma = {
  mixed: Symbol('mixed'),
  root: { children: [page1] },
  currentPage: page1,
  viewport: { scrollAndZoomIntoView() {} },
  async setCurrentPageAsync(p) { if (p.type !== 'PAGE') fail('not a page'); this.currentPage = p; },
  async loadFontAsync(f) { const k = fontKey(f); if (!AVAILABLE.includes(k)) throw new Error('font unavailable ' + k); loaded.add(k); },
  notify() {},
  showUI() { figma.ui._shown = true; setTimeout(() => figma.ui.onmessage && figma.ui.onmessage({ type: 'ready' }), 5); },
  createImage(bytes) { if (!(bytes instanceof Uint8Array)) fail('createImage needs bytes'); return { hash: 'img' + (nextId++) }; },
  ui: { _log: [], postMessage(m) { this._log.push(m); if (m.type === 'done') figma._closed = m.summary || 'done'; }, onmessage: null, resize() {} },
  closePlugin(msg) { figma._closed = msg; },
  async setFileThumbnailNodeAsync(n) { if (n.type !== 'FRAME') fail('thumbnail must be a frame'); },
  createPage() {
    // Starter plan files hold 3 pages; PAGE_LIMIT=0 lifts the limit
    const limit = process.env.PAGE_LIMIT === undefined ? 3 : +process.env.PAGE_LIMIT;
    if (limit && this.root.children.length >= limit) throw new Error('Starter plan only comes with ' + limit + ' pages');
    const p = track(new Node('PAGE'));
    p.loadAsync = async () => {};
    Object.defineProperty(p, 'flowStartingPoints', {
      set(v) { for (const f of v) { const n = all.get(f.nodeId); if (!n || !n.parent || n.parent !== p) fail('flow start must be a top-level frame on this page: ' + (n && n.name)); } this._flows = v; },
      get() { return this._flows || []; },
    });
    this.root.children.push(p); p.parent = null; return p;
  },
  createTextStyle() { const s = { id: 'S:' + (nextId++), set fontName(f) { if (!loaded.has(fontKey(f))) fail('style font not loaded'); this._f = f; }, get fontName() { return this._f; } }; styles.set(s.id, s); return s; },
  variables: {
    createVariableCollection(name) { return { id: 'VC:' + (nextId++), name, modes: [{ modeId: 'M:' + (nextId++), name: 'Mode 1' }], renameMode(id, n) { this.modes[0].name = n; } }; },
    createVariable(name, col, type) {
      if (!col || typeof col !== 'object' || !col.id) fail('createVariable needs a collection node');
      return { id: 'V:' + (nextId++), name, resolvedType: type, setValueForMode(m, v) { if (type === 'COLOR' && !(v.r >= 0 && v.a >= 0)) fail('COLOR value needs r,g,b,a'); if (type === 'FLOAT' && typeof v !== 'number') fail('FLOAT value'); }, scopes: [], description: '' };
    },
    setBoundVariableForPaint(p, field, v) { if (field !== 'color' || !v || v.resolvedType !== 'COLOR') fail('bad paint binding'); stats.boundVars++; return Object.assign({}, p, { boundVariables: { color: { type: 'VARIABLE_ALIAS', id: v.id } } }); },
  },
  combineAsVariants(nodes, parent) {
    if (!nodes.length) fail('no nodes to combine');
    for (const n of nodes) { if (n.type !== 'COMPONENT') fail('combineAsVariants needs components'); if (!/^[^=,]+=[^=,]+$/.test(n.name)) fail('variant name must be Prop=Value: ' + n.name); }
    const set = track(new Node('COMPONENT_SET'));
    parent.appendChild(set);
    for (const n of nodes) set.appendChild(n);
    stats.components += nodes.length;
    return set;
  },
  createNodeFromSvg(str) {
    if (!/^<svg[\s>]/.test(str.trim()) || str.indexOf('xmlns') < 0) fail('svg needs an <svg xmlns> root');
    const f = this.createFrame(); f._svg = str;
    const mw = str.match(/<svg[^>]*\swidth="([\d.]+)"/), mh = str.match(/<svg[^>]*\sheight="([\d.]+)"/); if (mw && mh) f.resize(+mw[1], +mh[1]);
    const colours = (str.match(/#[0-9A-Fa-f]{6}/g) || []).slice(0, 6);
    for (const c of colours) { const v = track(new Node('VECTOR')); v._orig = c.toUpperCase(); v.fills = [{ type: 'SOLID', color: { r: parseInt(c.slice(1, 3), 16) / 255, g: parseInt(c.slice(3, 5), 16) / 255, b: parseInt(c.slice(5, 7), 16) / 255 } }]; f.appendChild(v); }
    return f;
  },
};
for (const [fn, type] of [['createFrame', 'FRAME'], ['createComponent', 'COMPONENT'], ['createText', 'TEXT'], ['createRectangle', 'RECTANGLE'], ['createEllipse', 'ELLIPSE'], ['createVector', 'VECTOR'], ['createLine', 'LINE']]) {
  figma[fn] = function () { const n = track(new Node(type)); if (type === 'TEXT') stats.texts++; if (type === 'COMPONENT') stats.components++; figma.currentPage.appendChild(n); return n; };
}

// PRE_PAGES=n starts with n empty pages (like a file left by an earlier run); DIRTY=1 puts a layer on the first page
for (let i = 1; i < +(process.env.PRE_PAGES || 1); i++) figma.createPage().name = 'Leftover ' + i;
if (process.env.DIRTY) { const r = figma.createRectangle(); r.name = 'Existing work'; }
const code = readFileSync(process.argv[2], 'utf8');
const ctx = vm.createContext({ figma, console, setTimeout, Promise, Object, Math, String, Array, Map, Set, Symbol, Error, JSON, parseInt });
const t0 = Date.now();
vm.runInContext(code, ctx);
const wait = () => new Promise(r => setTimeout(r, 50));
for (let i = 0; i < 200 && !figma._closed; i++) await wait();
console.log('closePlugin:', figma._closed);
const errs = figma.ui._log.filter(m => m.type === 'log' && m.kind !== 'ok');
if (process.env.SHOW_LOG) for (const m of figma.ui._log) if (m.type === 'log') console.log('  ' + ({ ok: '✓', warn: '!', error: '✕', info: '·' }[m.kind]) + ' ' + m.msg);
if (figma.ui._log.length) console.log('panel log:', figma.ui._log.filter(m => m.type === 'log').length, 'lines,', errs.length, 'problems', errs.slice(0, 12).map(m => '\n  ' + m.kind + ': ' + m.msg).join(''));
console.log('stats:', JSON.stringify(stats), 'ms:', Date.now() - t0);
const pages = figma.root.children.map(p => `${p.name} (${p.children.length} top-level)`);
console.log('pages:', pages.join(' · '));
const proto = figma.root.children.find(p => p.name === 'Prototype');
if (proto) {
  console.log('flows:', proto.flowStartingPoints.map(f => f.name).join(' | '));
  const frames = proto.children.filter(c => c.type === 'FRAME');
  const wired = frames.filter(f => f.reactions.length || f.findAll(n => n.reactions && n.reactions.length).length);
  console.log('prototype frames:', frames.length, 'with interactions:', wired.length);
  const targets = new Set(); for (const f of proto.findAll(n => n.reactions && n.reactions.length)) for (const r of f.reactions) targets.add(all.get(r.actions[0].destinationId).name);
  for (const f of frames) if (!targets.has(f.name)) console.log('  not reachable by a click/timeout:', f.name);
  for (const f of frames) if (!f.reactions.length && !f.findAll(n => n.reactions && n.reactions.length).length) console.log('  dead end:', f.name);
}
const texts = [...all.values()].filter(n => n.type === 'TEXT' && !n.removed && pageOf(n) && !insideInstance(n));
const unstyled = texts.filter(n => !n.textStyleId);
console.log('text layers (outside instances):', texts.length, 'without a text style:', unstyled.length);
const sample = {}; for (const n of unstyled) { const k = pageOf(n).name; sample[k] = (sample[k] || 0) + 1; }
console.log('  by page:', JSON.stringify(sample), ' e.g.', unstyled.slice(0, 6).map(n => JSON.stringify(n.characters.slice(0, 24))).join(', '));

// ---------- render the document to HTML so the result can be looked at ----------
if (process.env.RENDER) {
  const { writeFileSync } = await import('node:fs');
  const hex2 = c => '#' + [c.r, c.g, c.b].map(x => Math.round(x * 255).toString(16).padStart(2, '0')).join('');
  const css = p => { if (!p || p.type !== 'SOLID') return null; const o = p.opacity == null ? 1 : p.opacity; const c = p.color; return `rgba(${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)},${o})`; };
  const W8 = { Regular: 400, Medium: 500, 'Semi Bold': 600, SemiBold: 600, Bold: 700, Italic: 400 };
  function svgFor(n) {
    let str = n._svg;
    for (const v of n.children || []) {
      if (!v._orig) continue;
      const p = (v.fills && v.fills[0]) || (v.strokes && v.strokes[0]);
      if (p && p.color) { const now = hex2(p.color).toUpperCase(); if (now !== v._orig) str = str.split(v._orig).join(now).split(v._orig.toLowerCase()).join(now); }
    }
    return 'data:image/svg+xml;base64,' + Buffer.from(str).toString('base64');
  }
  function el(n, parent) {
    if (n.removed) return '';
    const st = [];
    const auto = isAuto(n);
    const inAuto = parent && isAuto(parent) && n._lp !== 'ABSOLUTE';
    const sc = n._scale || 1;
    const w = n.width, h = n.height;
    if (!inAuto) {
      const con = n._con || {};
      if (parent && parent.type !== 'PAGE') {
        if (con.horizontal === 'CENTER') st.push('left:50%', `margin-left:${-w / 2}px`); else st.push(`left:${n.x}px`);
        if (con.vertical === 'CENTER') st.push('top:50%', `margin-top:${-h / 2}px`);
        else if (con.vertical === 'MAX') st.push(`bottom:${Math.max(0, parent.height - n.y - h)}px`);
        else st.push(`top:${n.y}px`);
        st.push('position:absolute');
      } else st.push('position:absolute', `left:${n.x}px`, `top:${n.y}px`);
    }
    if (n.visible === false) st.push('display:none');
    if (n.opacity != null && n.opacity !== 1) st.push('opacity:' + n.opacity);
    if (n.rotation) st.push(`transform:rotate(${-n.rotation}deg)`);
    // sizing
    const pa = parent && parent.layoutMode;
    const sizeAxis = (axis, mode) => {
      const prop = axis === 'h' ? 'width' : 'height', val = axis === 'h' ? w : h;
      const along = (pa === 'HORIZONTAL' && axis === 'h') || (pa === 'VERTICAL' && axis === 'v');
      if (inAuto && mode === 'FILL') { if (along) st.push('flex:1 1 0', axis === 'h' ? 'min-width:0' : 'min-height:0'); else st.push('align-self:stretch'); return; }
      if (mode === 'HUG' && (auto || n.type === 'TEXT')) { if (inAuto && along) st.push('flex:none'); return; }
      st.push(`${prop}:${val}px`); if (along || !inAuto) st.push('flex:none');
    };
    if (n.type === 'TEXT') {
      const tar = n._tar || 'WIDTH_AND_HEIGHT';
      if (inAuto && n._lsh === 'FILL') sizeAxis('h', 'FILL');
      else if (tar === 'HEIGHT' || tar === 'NONE') st.push(`width:${w}px`, 'flex:none');
      else st.push('white-space:pre', 'flex:none');
    } else if (sc !== 1 && !auto) {
      st.push(`width:${w}px`, `height:${h}px`, 'flex:none');
    } else {
      sizeAxis('h', n._lsh); sizeAxis('v', n._lsv);
    }
    if (auto) {
      st.push('display:flex', 'box-sizing:border-box', 'flex-direction:' + (n.layoutMode === 'HORIZONTAL' ? 'row' : 'column'));
      st.push(`gap:${n.itemSpacing || 0}px`, `padding:${n.paddingTop || 0}px ${n.paddingRight || 0}px ${n.paddingBottom || 0}px ${n.paddingLeft || 0}px`);
      const J = { MIN: 'flex-start', MAX: 'flex-end', CENTER: 'center', SPACE_BETWEEN: 'space-between' };
      const A = { MIN: 'flex-start', MAX: 'flex-end', CENTER: 'center', BASELINE: 'baseline' };
      if (n.layoutWrap === 'WRAP') st.push('flex-wrap:wrap', `row-gap:${n.counterAxisSpacing || 0}px`);
      st.push('justify-content:' + J[n._paa || 'MIN'], 'align-items:' + A[n._caa || 'MIN']);
      if (n._minH) st.push(`min-height:${n._minH}px`);
    }
    if (!auto && n.children && n.type !== 'PAGE') st.push('position:' + (inAuto ? 'relative' : st.includes('position:absolute') ? 'absolute' : 'relative'));
    if (inAuto) st.push('position:relative');
    // paint
    const fill = n.fills && n.fills.filter(f => f.visible !== false)[0];
    if (n.type === 'TEXT') {
      const f = n._font || { family: 'Inter', style: 'Regular' };
      st.push(`font-family:'${f.family}'`, `font-weight:${W8[f.style.replace(' Italic', '')] || 400}`, `font-style:${/Italic/.test(f.style) ? 'italic' : 'normal'}`);
      st.push(`font-size:${(n.fontSize || 12) * sc}px`);
      if (n.lineHeight && n.lineHeight.unit === 'PERCENT') st.push(`line-height:${n.lineHeight.value}%`);
      if (n.letterSpacing) st.push(`letter-spacing:${n.letterSpacing.value / 100}em`);
      if (n._tc === 'UPPER') st.push('text-transform:uppercase');
      if (n.textAlignHorizontal) st.push('text-align:' + n.textAlignHorizontal.toLowerCase());
      if (fill) st.push('color:' + css(fill));
      return `<div style="${st.join(';')}">${(n._chars || '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</div>`;
    }
    if (fill && n.type !== 'VECTOR') st.push('background:' + css(fill));
    if (n.type === 'ELLIPSE') st.push('border-radius:50%');
    else if (n.topLeftRadius != null || n.cornerRadius != null) {
      const r = k => (n[k] != null ? n[k] : n.cornerRadius || 0) * sc;
      st.push(`border-radius:${r('topLeftRadius')}px ${r('topRightRadius')}px ${r('bottomRightRadius')}px ${r('bottomLeftRadius')}px`);
    }
    const sk = n.strokes && n.strokes[0];
    if (sk && n.type !== 'VECTOR') {
      const c = css(sk), wgt = n.strokeWeight || 1;
      if (n.strokeTopWeight != null && (n.strokeTopWeight || n.strokeBottomWeight || n.strokeLeftWeight || n.strokeRightWeight) && !(n.strokeTopWeight && n.strokeBottomWeight && n.strokeLeftWeight && n.strokeRightWeight)) {
        st.push(`box-shadow:inset 0 ${n.strokeTopWeight || 0}px 0 0 ${c}`);
      } else if (n.strokeAlign === 'OUTSIDE') st.push(`box-shadow:0 0 0 ${wgt}px ${c}`);
      else st.push(`box-shadow:inset 0 0 0 ${wgt * sc}px ${c}`);
      if (n.dashPattern) st.push(`outline:1px dashed ${c}`, 'outline-offset:-1px', 'box-shadow:none');
    }
    if (n.clipsContent) st.push('overflow:hidden');
    for (const e of n.effects || []) {
      if (e.type === 'LAYER_BLUR') st.push(`filter:blur(${e.radius}px)`);
      if (e.type === 'BACKGROUND_BLUR') st.push(`backdrop-filter:blur(${e.radius}px)`);
    }
    if (n._svg) return `<div style="${st.join(';')}"><img src="${svgFor(n)}" style="width:100%;height:100%;display:block"></div>`;
    if (n.type === 'VECTOR' && n.vectorNetwork) {
      const v = n.vectorNetwork.vertices[1], c = css(n.strokes[0]);
      const minx = Math.min(0, v.x), miny = Math.min(0, v.y);
      const ang = Math.atan2(v.y, v.x), a1 = ang + 2.6, a2 = ang - 2.6, L = 10;
      return `<svg style="position:absolute;left:${n.x + minx}px;top:${n.y + miny}px;overflow:visible" width="${Math.abs(v.x) || 1}" height="${Math.abs(v.y) || 1}"><g transform="translate(${-minx} ${-miny})" stroke="${c}" stroke-width="2" fill="none" stroke-linecap="round"><line x1="0" y1="0" x2="${v.x}" y2="${v.y}"/><polyline points="${v.x + L * Math.cos(a1)},${v.y + L * Math.sin(a1)} ${v.x},${v.y} ${v.x + L * Math.cos(a2)},${v.y + L * Math.sin(a2)}"/></g></svg>`;
    }
    let inner = (n.children || []).map(c => el(c, n)).join('');
    if (sc !== 1 && !auto) inner = `<div style="position:absolute;left:0;top:0;width:${w / sc}px;height:${h / sc}px;transform:scale(${sc});transform-origin:0 0">${inner}</div>`;
    return `<div data-id="${n.id}" data-name="${(n.name || '').replace(/"/g, '')}" style="${st.join(';')}">${inner}</div>`;
  }
  const head = `<!doctype html><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet"><style>body{margin:0;background:#E5E5E5;-webkit-font-smoothing:antialiased}</style>`;
  for (const p of figma.root.children) {
    const html = head + `<div style="position:relative;width:20000px;height:20000px">${p.children.map(c => el(c, p)).join('')}</div>`;
    writeFileSync(`render-${p.name.replace(/\W+/g, '-')}.html`, html);
  }
  console.log('rendered', figma.root.children.length, 'pages');
}
