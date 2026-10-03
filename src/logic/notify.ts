import { Alert, Bag, Item } from '../data/types';
import { daysLeft, expiresInDays, status } from './depletion';

export interface Note { id: string; itemId?: string; title: string; when: string; kind: 'restock' | 'expiry' | 'out' | 'info'; }

/** The notification inbox: saved alerts plus anything the bags say needs attention right now. */
export function buildNotifications(items: Item[], bags: Bag[], alerts: Alert[]): Note[] {
  const notes: Note[] = alerts.map((a) => ({ id: a.id, itemId: a.itemId, title: a.title, when: a.when, kind: 'info' }));
  const seen = new Set(alerts.map((a) => a.itemId));
  for (const it of items) {
    if (it.status === 'want' || seen.has(it.id)) continue;
    const bag = bags.find((b) => b.id === it.bagId)?.name.toLowerCase() ?? 'bag';
    const st = status(it), d = daysLeft(it), exp = expiresInDays(it);
    if (st === 'out') notes.push({ id: `n-${it.id}`, itemId: it.id, title: `Your ${it.label.toLowerCase()} is out. Close matches are in stock.`, when: 'Today', kind: 'out' });
    else if (st === 'low') notes.push({ id: `n-${it.id}`, itemId: it.id, title: `Your ${it.label.toLowerCase()} runs out in about ${d} days. Reorder for your ${bag}.`, when: 'Today', kind: 'restock' });
    else if (exp != null && exp <= 30) notes.push({ id: `n-x-${it.id}`, itemId: it.id, title: `Your ${it.label.toLowerCase()} expires in ${exp} days.`, when: 'This week', kind: 'expiry' });
  }
  if (!notes.length) notes.push({ id: 'n-welcome', title: 'You’re all stocked. We’ll tell you before anything runs out.', when: 'Now', kind: 'info' });
  return notes;
}
