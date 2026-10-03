import { Item } from '../data/types';

export const LOW_DAYS = 7;
const DAY = 864e5;

export function remaining(item: Item, today = new Date()): number {
  const total = item.sizeAmount * item.quantity;
  if (item.status === 'out') return 0;
  if (item.remainingOverride != null) return item.remainingOverride;
  if (!item.openedOn || !item.usesPerWeek) return total;
  const days = Math.max(0, (today.getTime() - new Date(item.openedOn).getTime()) / DAY);
  const used = days * (item.amountPerUse * item.usesPerWeek) / 7;
  return Math.max(0, total - used);
}

/** Infinity for items that don't deplete (cups, mats). */
export function daysLeft(item: Item, today = new Date()): number {
  const perDay = (item.amountPerUse * item.usesPerWeek) / 7;
  if (!perDay) return Infinity;
  return Math.floor(remaining(item, today) / perDay);
}

export function status(item: Item): Item['status'] {
  if (item.status === 'want') return 'want';
  const d = daysLeft(item);
  if (d <= 0) return 'out';
  if (d <= LOW_DAYS) return 'low';
  return 'have';
}

export function fraction(item: Item): number {
  const total = item.sizeAmount * item.quantity;
  return total ? Math.min(1, remaining(item) / total) : 1;
}

/** "I'm almost out": 10% remaining. "Still plenty": +25%. */
export function correct(item: Item, kind: 'almostOut' | 'plenty'): Item {
  const total = item.sizeAmount * item.quantity;
  const rem = kind === 'almostOut' ? total * 0.1 : Math.min(total, remaining(item) + total * 0.25);
  let usesPerWeek = item.usesPerWeek;
  if (kind === 'almostOut' && item.openedOn && item.amountPerUse) {
    const days = Math.max(1, (Date.now() - new Date(item.openedOn).getTime()) / DAY);
    usesPerWeek = Math.round((((total - rem) / item.amountPerUse) / days) * 7 * 10) / 10;
  }
  return { ...item, remainingOverride: rem, usesPerWeek, status: rem > 0 ? 'have' : 'out' };
}

export function expiresInDays(item: Item, today = new Date()): number | null {
  if (!item.openedOn || !item.periodAfterOpeningMonths) return null;
  const d = new Date(item.openedOn);
  d.setMonth(d.getMonth() + item.periodAfterOpeningMonths);
  return Math.ceil((d.getTime() - today.getTime()) / DAY);
}

export function usageLine(item: Item): string {
  const perDay = item.usesPerWeek / 7;
  if (!perDay) return 'Doesn’t run out with use';
  if (perDay >= 1) return `Based on ${Math.round(perDay)} use${Math.round(perDay) > 1 ? 's' : ''} a day`;
  return `Based on ${item.usesPerWeek} uses a week`;
}
