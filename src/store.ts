import { create } from 'zustand';
import { demos, starterProducts } from './data/demos';
import { posts as seedPosts } from './data/community';
import { productById } from './data/products';
import { Alert, Bag, BagType, DemoId, Item, Post, Trip, User } from './data/types';
import { correct } from './logic/depletion';

const BAG_NAMES: Record<BagType, string> = { travel: 'Carry-on', makeup: 'Makeup bag', mom: 'Diaper bag', work: 'Work tote', study: 'Study bag' };
const shortLabel = (name: string) => name.split(/,| and /)[0].replace(/^(Memory foam|Classic black|Over-ear travel|Insulated steel|Unscented|Nude satin|Rose sheer|Lengthening|Cream|Warm neutrals|Five-piece|Hydrating face|Silicone|Cotton|Oat|Black linen|Reusable|Structured leather|Pastel|Semester)\s+/i, '').replace(/^\w/, (c) => c.toUpperCase());

interface State {
  demo: DemoId;
  user: User; bags: Bag[]; items: Item[]; alerts: Alert[]; trip?: Trip;
  activeBagId: string; wishlist: string[]; saved: string[];
  posts: Post[]; helpful: string[];
  alertItemId: string | null; toast: string | null;
  loadDemo: (id: DemoId) => void;
  setupFromOnboarding: (o: { name: string; bagTypes: BagType[]; values: string[]; avoid: string[]; skinType?: string; kidAge?: number; destination?: string }) => void;
  setBag: (id: string) => void;
  setUser: (u: Partial<User>) => void;
  toggleWish: (productId: string) => void;
  addWant: (productId: string, bagId?: string) => void;
  importPost: (postId: string) => void;
  publish: (p: { bagId: string; title: string; caption: string; photos: string[] }) => string;
  toggleHelpful: (postId: string) => void;
  addNote: (postId: string, text: string) => void;
  correctItem: (id: string, kind: 'almostOut' | 'plenty') => void;
  restock: (id: string) => void;
  showAlert: (itemId: string | null) => void;
  flash: (msg: string) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;
const fromDemo = (id: DemoId) => {
  const d = demos[id];
  return { demo: id, user: d.user, bags: d.bags, items: d.items, alerts: d.alerts, trip: d.trip, activeBagId: d.bags[0].id };
};
const newItem = (pid: string, bagId: string, status: Item['status'] = 'have'): Item => ({
  id: `i-${pid}-${bagId}-${Math.random().toString(36).slice(2, 7)}`, bagId, productId: pid, quantity: 1,
  sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0, status, label: shortLabel(productById(pid).name),
});

export const useStore = create<State>((set, get) => ({
  ...fromDemo('travel'),
  wishlist: ['jy-clips'], saved: [], posts: seedPosts, helpful: [],
  alertItemId: null, toast: null,

  loadDemo: (id) => set(fromDemo(id)),
  setupFromOnboarding: ({ name, bagTypes, values, avoid, skinType, kidAge, destination }) => {
    const types = bagTypes.length ? bagTypes : ['travel' as BagType];
    const bags = types.map((t) => ({ id: `b-${t}`, userId: 'u-me', type: t, name: BAG_NAMES[t] }));
    const items = bags.flatMap((b) => starterProducts[b.type].map((pid) => newItem(pid, b.id)));
    const d = demos[(['travel', 'makeup', 'mom'] as DemoId[]).find((x) => types.includes(x)) ?? 'travel'];
    set({
      user: { ...d.user, id: 'u-me', name: name || 'You', values, avoidIngredients: avoid, skinType, kids: kidAge != null ? [{ age: kidAge }] : undefined, avatar: undefined },
      bags, items, activeBagId: bags[0].id, alerts: [],
      trip: types.includes('travel') && destination ? { id: 't-new', userId: 'u-me', destination, start: new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10), end: new Date(Date.now() + 21 * 864e5).toISOString().slice(0, 10), travelers: [{ kind: 'adult' }], bagId: 'b-travel' } : undefined,
    });
  },
  setBag: (id) => set({ activeBagId: id }),
  setUser: (u) => set({ user: { ...get().user, ...u } }),
  toggleWish: (pid) => {
    const on = get().wishlist.includes(pid);
    set({ wishlist: on ? get().wishlist.filter((x) => x !== pid) : [...get().wishlist, pid] });
    if (!on) get().flash('Saved to your wishlist');
  },
  addWant: (pid, bagId) => {
    const { bags, activeBagId, items } = get();
    const fit = bags.find((b) => productById(pid).bagTypes.includes(b.type));
    const b = bagId ?? fit?.id ?? activeBagId;
    if (items.some((i) => i.productId === pid && i.bagId === b)) return get().flash('Already in your bag');
    set({ items: [...items, newItem(pid, b, 'want')] });
    get().flash(`Added to ${bags.find((x) => x.id === b)?.name.toLowerCase() ?? 'your bag'}`);
  },
  importPost: (postId) => {
    const post = get().posts.find((p) => p.id === postId)!;
    let { bags, items } = get();
    let bag = bags.find((b) => b.type === post.bagType);
    if (!bag) {
      bag = { id: `b-${post.bagType}`, userId: get().user.id, type: post.bagType, name: BAG_NAMES[post.bagType] };
      bags = [...bags, bag];
    }
    const have = new Set(items.filter((i) => i.bagId === bag!.id).map((i) => i.productId));
    const added = post.productIds.filter((pid) => !have.has(pid)).map((pid) => newItem(pid, bag!.id, 'want'));
    set({ bags, items: [...items, ...added], activeBagId: bag.id });
    get().flash(added.length ? `${added.length} items added to your ${bag.name.toLowerCase()}` : 'You already have all of these');
  },
  publish: ({ bagId, title, caption, photos }) => {
    const { user, bags, items, posts } = get();
    const bag = bags.find((b) => b.id === bagId)!;
    const id = `c-mine-${Date.now()}`;
    const productIds = items.filter((i) => i.bagId === bagId && i.status !== 'want').map((i) => i.productId);
    set({
      posts: [{ id, bagType: bag.type, title: title || `My ${bag.name.toLowerCase()}`, caption, photos: photos.length ? photos : productIds.slice(0, 3).map((pid) => productById(pid).photo), productIds, helpful: 0, when: 'Just now', notes: [], mine: true, author: { name: user.name, role: user.lifeStage.join(' · '), avatar: user.avatar ?? '' } }, ...posts],
    });
    get().flash('Your bag is live. Thank you for sharing.');
    return id;
  },
  toggleHelpful: (postId) => {
    const on = get().helpful.includes(postId);
    set({
      helpful: on ? get().helpful.filter((x) => x !== postId) : [...get().helpful, postId],
      posts: get().posts.map((p) => (p.id === postId ? { ...p, helpful: p.helpful + (on ? -1 : 1) } : p)),
    });
  },
  addNote: (postId, text) => set({ posts: get().posts.map((p) => (p.id === postId ? { ...p, notes: [...p.notes, { name: get().user.name, text }] } : p)) }),
  correctItem: (id, kind) => set({ items: get().items.map((i) => (i.id === id ? correct(i, kind) : i)) }),
  restock: (id) => set({ items: get().items.map((i) => (i.id === id ? { ...i, status: 'have', openedOn: new Date().toISOString().slice(0, 10), remainingOverride: undefined } : i)) }),
  showAlert: (itemId) => set({ alertItemId: itemId }),
  flash: (msg) => { clearTimeout(toastTimer); set({ toast: msg }); toastTimer = setTimeout(() => set({ toast: null }), 2000); },
}));

// Remember the chosen demo and changes across reloads in the browser. Storage can be
// unavailable (private mode, native without a storage module); the app then starts fresh.
const KEY = 'wimb-state-v2';
const storage = (() => { try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch { return null; } })();
try {
  const saved = storage?.getItem(KEY);
  if (saved) useStore.setState(JSON.parse(saved));
} catch { /* ignore corrupt or blocked storage */ }
useStore.subscribe(({ toast, alertItemId, ...rest }) => {
  try {
    const data = Object.fromEntries(Object.entries(rest).filter(([, v]) => typeof v !== 'function'));
    storage?.setItem(KEY, JSON.stringify(data));
  } catch { /* storage full or blocked */ }
});

export { BAG_NAMES };
