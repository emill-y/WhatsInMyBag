// Pulls Remy, the wand, effects and icons out of ../index.html as Figma-ready SVG (needs Playwright + Chromium).
// Run: node tools/extract-assets.mjs, then node make.mjs
import { chromium } from 'playwright';
import { readFileSync, writeFileSync } from 'node:fs';
const src = readFileSync(new URL('../../index.html', import.meta.url), 'utf8');
const grab = (start, end) => { const a = src.indexOf(start); const b = src.indexOf(end, a); return src.slice(a, b + end.length); };
const GECKO = grab('const GECKO = `', '</svg>`;').replace(/^const GECKO = `/, '').replace(/`;$/, '');
const WAND = grab('const WAND = `', '</svg>`;').replace(/^const WAND = `/, '').replace(/`;$/, '');
const ICONS = grab('const ICON_PATHS = {', '};').replace(/^const ICON_PATHS = /, '').replace(/;$/, '');
const DECOR = grab('function decor(kind) {', '</svg>`;\n}').replace(/  if \(!body\) return '';[\s\S]*$/, '  return body;\n}');
const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const pg = await b.newPage();
const out = await pg.evaluate(({ GECKO, WAND, ICONS, DECOR }) => {
  const NORMAL = { '--gk': '#C8EE2A', '--gk-dark': '#9DC40F', '--gk-belly': '#EAFBA4' };
  const WILT = { '--gk': '#A3AD80', '--gk-dark': '#7C8460', '--gk-belly': '#D3D6BF' };
  const clean = (svg, vars) => {
    for (const el of svg.querySelectorAll('*')) {
      el.removeAttribute('class'); el.removeAttribute('data-show'); el.removeAttribute('style');
      for (const at of ['fill', 'stroke']) { const v = el.getAttribute(at); if (v && v.startsWith('var(')) el.setAttribute(at, vars[v.slice(4, -1)]); }
    }
    svg.removeAttribute('class'); svg.removeAttribute('data-mood'); svg.removeAttribute('aria-hidden');
    return svg;
  };
  const remy = {};
  for (const m of ['happy', 'joy', 'meh', 'sad', 'cry']) {
    const doc = new DOMParser().parseFromString(GECKO.trim(), 'image/svg+xml');
    const svg = doc.documentElement;
    for (const el of [...svg.querySelectorAll('[data-show]')]) if (!el.getAttribute('data-show').split(' ').includes(m)) el.remove();
    clean(svg, m === 'sad' || m === 'cry' ? WILT : NORMAL);
    svg.setAttribute('width', '220'); svg.setAttribute('height', '220');
    remy[m] = new XMLSerializer().serializeToString(svg);
  }
  const wdoc = new DOMParser().parseFromString(WAND.trim(), 'image/svg+xml');
  const wand = clean(wdoc.documentElement, {}); wand.setAttribute('width', '190'); wand.setAttribute('height', '190');
  // decor() returns an <svg> string; rebuild it without CSS
  const decorFn = new Function(DECOR + "\n return decor;")();
  const fx = {};
  const box = { good: [-180, -150, 360, 300], bad: [-180, -150, 360, 300], cast: [0, 0, 200, 200] };
  for (const k of ['good', 'bad', 'cast']) {
    const [x, y, w, h] = box[k];
    fx[k] = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}">${decorFn(k)}</svg>`;
  }
  return { remy, wand: new XMLSerializer().serializeToString(wand), fx, icons: eval('(' + ICONS + ')') };
}, { GECKO, WAND, ICONS, DECOR });
await b.close();
writeFileSync(new URL('../assets.json', import.meta.url), JSON.stringify(out));
console.log(Object.keys(out.remy), Object.keys(out.icons).length, out.fx.good.length, out.wand.length);
