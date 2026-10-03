import { Bag, Item, Product, User } from '../data/types';

export interface Result { product: Product; score: number; why: string; }

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : 0;
};

const STOP = new Set(['a', 'an', 'the', 'for', 'something', 'new', 'like', 'some', 'my']);
const SYN: Record<string, string[]> = { snacks: ['snack'], treat: ['snack', 'joy'], lipstick: ['lips'], makeup: ['face', 'eyes', 'lips', 'cheeks'] };

export function search(
  q: string, all: Product[], owned: Item[], bags: Bag[], user: User,
  opts: { bagId?: string; inStockOnly?: boolean; maxPrice?: number; category?: string } = {},
): Result[] {
  const words = q.toLowerCase().split(/\s+/).filter((w) => w && !STOP.has(w)).flatMap((w) => [w, ...(SYN[w] ?? [])]);
  const ownedIds = new Set(owned.filter((i) => i.status !== 'want').map((i) => i.productId));
  const ownedProducts = all.filter((p) => ownedIds.has(p.id));
  const med = median(ownedProducts.map((p) => p.price));
  const results: Result[] = [];

  for (const p of all) {
    if (ownedIds.has(p.id)) continue;
    if (p.ingredients.some((ing) => user.avoidIngredients.includes(ing))) continue;
    if (opts.inStockOnly && !p.inStock) continue;
    if (opts.maxPrice && p.price > opts.maxPrice) continue;
    if (opts.category && p.category !== opts.category) continue;

    const hay = [p.name, p.category, p.brand, ...p.tags, ...p.values].join(' ').toLowerCase();
    const textHits = words.filter((w) => hay.includes(w)).length;
    if (words.length && !textHits) continue;

    // values the query asks for are hard requirements
    const askedValues = p.values.length ? [] : words.filter((w) => ['vegan', 'nut-free', 'cruelty-free'].includes(w));
    if (askedValues.length) continue;

    const valueMatches = p.values.filter((v) => user.values.includes(v));
    // complement: owned items sharing tags, grouped by bag
    let bestBag: { bag: Bag; shared: number; item: Item } | null = null;
    for (const it of owned) {
      const op = all.find((x) => x.id === it.productId);
      if (!op) continue;
      const shared = op.tags.filter((t) => p.tags.includes(t)).length + op.values.filter((v) => p.values.includes(v)).length * 0.5;
      const bag = bags.find((b) => b.id === it.bagId)!;
      if (opts.bagId && bag.id !== opts.bagId) continue;
      if (!bestBag || shared > bestBag.shared) bestBag = { bag, shared, item: it };
    }
    const inRange = med ? p.price >= med * 0.5 && p.price <= med * 1.5 : true;
    const score = textHits * 3 + valueMatches.length * 2 + (bestBag?.shared ?? 0) + (inRange ? 1 : 0) + (p.inStock ? 0.5 : -2);

    results.push({ product: p, score, why: whyLine(p, valueMatches, bestBag, inRange) });
  }
  return results.sort((a, b) => b.score - a.score);
}

function whyLine(p: Product, values: string[], best: { bag: Bag; shared: number; item: Item } | null, inRange: boolean): string {
  const vals = values.slice(0, 2).map((v, i) => (i ? v.toLowerCase() : v)).join(' and ');
  const bagName = best?.bag.name.toLowerCase();
  const thing = best?.item.label.toLowerCase();
  if (vals && best && best.shared >= 1) return `${vals}, like the ${thing} in your ${bagName} bag.`;
  if (best && best.shared >= 1) return `Pairs with the ${thing} in your ${bagName} bag.`;
  if (vals) return `${vals}, as you prefer.`;
  if (inRange) return 'Right around what you usually spend.';
  return 'A new find for your bag.';
}
