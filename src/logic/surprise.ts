import { Item, Product, SurpriseCard, User } from '../data/types';
import { daysLeft, expiresInDays } from './depletion';

export function isoWeek(d = new Date()): string {
  const t = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  const w = Math.ceil(((t.getTime() - y.getTime()) / 864e5 + 1) / 7);
  return `${t.getUTCFullYear()}-W${String(w).padStart(2, '0')}`;
}

function seeded(seed: string) {
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => ((h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0) % 1000) / 1000;
}

export function buildSurprise(all: Product[], owned: Item[], user: User, dismissed: string[], week = isoWeek()): SurpriseCard[] {
  const rand = seeded(week);
  const ownedIds = new Set(owned.map((i) => i.productId));
  const ownedTags = new Set(owned.flatMap((i) => all.find((p) => p.id === i.productId)?.tags ?? []));
  const ok = (p: Product) =>
    !ownedIds.has(p.id) && !dismissed.includes(p.id) && p.inStock &&
    !p.ingredients.some((x) => user.avoidIngredients.includes(x)) &&
    (p.values.length === 0 || p.values.some((v) => user.values.includes(v)));
  const candidates = all.filter(ok);
  const score = (p: Product) => p.tags.filter((t) => ownedTags.has(t)).length + (p.tags.includes('travel') ? 1 : 0) + rand();

  const complement = [...candidates].filter((p) => !p.tags.includes('joy')).sort((a, b) => score(b) - score(a))[0];
  const joy = [...candidates].filter((p) => p.price < 25 && p.id !== complement?.id && (p.tags.includes('joy') || p.category === 'Accessories')).sort((a, b) => score(b) - score(a))[0];

  const cards: SurpriseCard[] = [];
  if (complement) cards.push({ kind: 'complement', productIds: [complement.id], title: complement.name, body: `${complement.brand}. Goes with what you already carry.` });
  cards.push({ kind: 'routine', productIds: ['p-concealer', 'p-blush', 'p-lipoil'].filter((id) => ownedIds.has(id)), title: 'The five-minute school run face', body: 'Concealer where you need it, blush stick on the cheeks and lips, then lip oil. All from your makeup bag.' });
  if (joy) cards.push({ kind: 'joy', productIds: [joy.id], title: joy.name, body: `A little joy for $${joy.price}.` });

  const expiring = owned.map((i) => ({ i, d: expiresInDays(i) })).filter((x) => x.d != null && x.d <= 21).sort((a, b) => a.d! - b.d!)[0];
  const low = owned.filter((i) => daysLeft(i) <= 7 && daysLeft(i) > 0)[0];
  if (expiring) cards.push({ kind: 'tip', productIds: [expiring.i.productId], title: `Your ${expiring.i.label} expires in ${Math.max(1, Math.round(expiring.d! / 7))} weeks`, body: 'Opened products lose strength. Finish it on weekends, or replace before the Lisbon trip.' });
  else if (low) cards.push({ kind: 'tip', productIds: [low.productId], title: `${low.label} is running low`, body: `About ${daysLeft(low)} days left at your usual pace.` });
  return cards.slice(0, 4);
}
