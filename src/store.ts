import { create } from 'zustand';
import { items as seedItems, user as seedUser, alerts as seedAlerts } from './data/user';
import { Item, User, Alert } from './data/types';
import { correct } from './logic/depletion';

interface State {
  user: User; items: Item[]; alerts: Alert[];
  activeBagId: string; wishlist: string[]; dismissed: string[]; saved: string[];
  alertItemId: string | null; toast: string | null;
  setBag: (id: string) => void;
  setUser: (u: Partial<User>) => void;
  toggleWish: (productId: string) => void;
  dismiss: (productId: string) => void;
  save: (productId: string) => void;
  addWant: (productId: string, bagId?: string, label?: string) => void;
  correctItem: (id: string, kind: 'almostOut' | 'plenty') => void;
  snooze: (id: string) => void;
  restock: (id: string) => void;
  showAlert: (itemId: string | null) => void;
  flash: (msg: string) => void;
}

let toastTimer: ReturnType<typeof setTimeout> | undefined;

export const useStore = create<State>((set, get) => ({
  user: seedUser, items: seedItems, alerts: seedAlerts,
  activeBagId: 'b-makeup', wishlist: ['p-scrunchie'], dismissed: [], saved: [],
  alertItemId: null, toast: null,
  setBag: (id) => set({ activeBagId: id }),
  setUser: (u) => set({ user: { ...get().user, ...u } }),
  toggleWish: (pid) => set({ wishlist: get().wishlist.includes(pid) ? get().wishlist.filter((x) => x !== pid) : [...get().wishlist, pid] }),
  dismiss: (pid) => set({ dismissed: [...get().dismissed, pid] }),
  save: (pid) => { set({ saved: [...new Set([...get().saved, pid])] }); get().flash('Saved'); },
  addWant: (pid, bagId, label) => {
    const b = bagId ?? get().activeBagId;
    if (get().items.some((i) => i.productId === pid && i.bagId === b)) return get().flash('Already in your bag');
    set({ items: [...get().items, { id: `w-${pid}-${Date.now()}`, bagId: b, productId: pid, quantity: 1, sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0, status: 'want', label: label ?? 'Want' }] });
    get().flash('Added to bag as a want');
  },
  correctItem: (id, kind) => set({ items: get().items.map((i) => (i.id === id ? correct(i, kind) : i)) }),
  snooze: (id) => { set({ alertItemId: null }); get().flash('Snoozed for 3 days'); },
  restock: (id) => set({ items: get().items.map((i) => (i.id === id ? { ...i, status: 'have', openedOn: new Date().toISOString().slice(0, 10), remainingOverride: undefined } : i)) }),
  showAlert: (itemId) => set({ alertItemId: itemId }),
  flash: (msg) => { clearTimeout(toastTimer); set({ toast: msg }); toastTimer = setTimeout(() => set({ toast: null }), 1800); },
}));
