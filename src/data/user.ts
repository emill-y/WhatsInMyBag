import { Alert, Bag, Dupe, Item, Trip, User } from './types';

export const user: User = {
  id: 'u-sofia', name: 'Sofia', lifeStage: ['Working', 'Mom'],
  values: ['Vegan', 'Nut-free', 'Cruelty-free'], avoidIngredients: ['almond', 'parfum'],
  skinType: 'Combination', kids: [{ age: 1, diaperSize: '4' }],
  notify: { push: true, email: true, sms: false, quietHours: ['21:00', '07:00'] },
};

export const bags: Bag[] = [
  { id: 'b-makeup', userId: user.id, type: 'makeup', name: 'Makeup' },
  { id: 'b-diaper', userId: user.id, type: 'diaper', name: 'Diaper' },
  { id: 'b-travel', userId: user.id, type: 'travel', name: 'Travel' },
  { id: 'b-everyday', userId: user.id, type: 'everyday', name: 'Everyday' },
];

const daysAgo = (n: number) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);

type I = Omit<Item, 'quantity' | 'status'> & Partial<Pick<Item, 'quantity' | 'status'>>;
const i = (x: I): Item => ({ quantity: 1, status: 'have', ...x });

export const items: Item[] = [
  // Makeup — lip oil low, concealer out, SPF expiring
  i({ id: 'i-lipoil', bagId: 'b-makeup', productId: 'p-lipoil', label: 'Lip oil', sizeAmount: 6, amountPerUse: 0.05, usesPerWeek: 14, openedOn: daysAgo(55) }),
  i({ id: 'i-mascara', bagId: 'b-makeup', productId: 'p-mascara', label: 'Mascara', sizeAmount: 8, amountPerUse: 0.04, usesPerWeek: 7, openedOn: daysAgo(40), periodAfterOpeningMonths: 3 }),
  i({ id: 'i-concealer', bagId: 'b-makeup', productId: 'p-concealer', label: 'Concealer', sizeAmount: 5, amountPerUse: 0.05, usesPerWeek: 7, openedOn: daysAgo(100), status: 'out' }),
  i({ id: 'i-spf', bagId: 'b-makeup', productId: 'p-spf', label: 'SPF 50', sizeAmount: 10, amountPerUse: 0.05, usesPerWeek: 7, openedOn: daysAgo(165), periodAfterOpeningMonths: 6 }),
  i({ id: 'i-blush', bagId: 'b-makeup', productId: 'p-blush', label: 'Blush stick', sizeAmount: 7, amountPerUse: 0.03, usesPerWeek: 5, openedOn: daysAgo(30) }),
  i({ id: 'i-brow', bagId: 'b-makeup', productId: 'p-brow', label: 'Brow gel', sizeAmount: 5, amountPerUse: 0.03, usesPerWeek: 5, openedOn: daysAgo(20) }),
  i({ id: 'i-setting', bagId: 'b-makeup', productId: 'p-setting', label: 'Setting mist', sizeAmount: 30, amountPerUse: 0.3, usesPerWeek: 5, openedOn: daysAgo(15) }),
  i({ id: 'i-perfume', bagId: 'b-makeup', productId: 'p-perfume', label: 'Perfume', sizeAmount: 10, amountPerUse: 0.05, usesPerWeek: 7, openedOn: daysAgo(10) }),
  // Diaper — wipes low
  i({ id: 'i-diapers', bagId: 'b-diaper', productId: 'p-diapers', label: 'Diapers', sizeAmount: 30, amountPerUse: 1, usesPerWeek: 10, openedOn: daysAgo(6) }),
  i({ id: 'i-wipes', bagId: 'b-diaper', productId: 'p-wipes', label: 'Wipes', sizeAmount: 60, amountPerUse: 3, usesPerWeek: 14, openedOn: daysAgo(6) }),
  i({ id: 'i-cream', bagId: 'b-diaper', productId: 'p-cream', label: 'Diaper balm', sizeAmount: 75, amountPerUse: 1, usesPerWeek: 7, openedOn: daysAgo(20) }),
  i({ id: 'i-bars', bagId: 'b-diaper', productId: 'p-bars', label: 'Snack bars', sizeAmount: 6, amountPerUse: 1, usesPerWeek: 3, openedOn: daysAgo(3), quantity: 2 }),
  i({ id: 'i-sippy', bagId: 'b-diaper', productId: 'p-sippy', label: 'Sippy cup', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
  i({ id: 'i-outfit', bagId: 'b-diaper', productId: 'p-outfit', label: 'Spare outfit', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
  i({ id: 'i-sanitizer', bagId: 'b-diaper', productId: 'p-sanitizer', label: 'Sanitizer', sizeAmount: 50, amountPerUse: 1, usesPerWeek: 10, openedOn: daysAgo(14) }),
  i({ id: 'i-mat', bagId: 'b-diaper', productId: 'p-mat', label: 'Changing mat', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
  // Travel
  i({ id: 'i-passport', bagId: 'b-travel', productId: 'p-passport', label: 'Passport', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
  i({ id: 'i-earplugs', bagId: 'b-travel', productId: 'p-earbuds', label: 'Earplugs', sizeAmount: 10, amountPerUse: 1, usesPerWeek: 1, openedOn: daysAgo(30) }),
  i({ id: 'i-mask', bagId: 'b-travel', productId: 'p-mask', label: 'Eye mask', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
  i({ id: 'i-tmist', bagId: 'b-travel', productId: 'p-setting', label: 'Face mist', sizeAmount: 30, amountPerUse: 0.3, usesPerWeek: 2, openedOn: daysAgo(40) }),
  i({ id: 'i-tsanit', bagId: 'b-travel', productId: 'p-sanitizer', label: 'Sanitizer', sizeAmount: 50, amountPerUse: 1, usesPerWeek: 3, openedOn: daysAgo(20) }),
  i({ id: 'i-twipes', bagId: 'b-travel', productId: 'p-wipes', label: 'Wipes', sizeAmount: 60, amountPerUse: 2, usesPerWeek: 4, openedOn: daysAgo(8) }),
  // Everyday
  i({ id: 'i-handcream', bagId: 'b-everyday', productId: 'p-handcream', label: 'Hand cream', sizeAmount: 30, amountPerUse: 0.5, usesPerWeek: 10, openedOn: daysAgo(25) }),
  i({ id: 'i-mints', bagId: 'b-everyday', productId: 'p-mints', label: 'Mints', sizeAmount: 40, amountPerUse: 1, usesPerWeek: 10, openedOn: daysAgo(12) }),
  i({ id: 'i-balm', bagId: 'b-everyday', productId: 'p-balm', label: 'Lip balm', sizeAmount: 4, amountPerUse: 0.02, usesPerWeek: 14, openedOn: daysAgo(30) }),
  i({ id: 'i-ebars', bagId: 'b-everyday', productId: 'p-bars', label: 'Snack bar', sizeAmount: 6, amountPerUse: 1, usesPerWeek: 2, openedOn: daysAgo(5) }),
  i({ id: 'i-esanit', bagId: 'b-everyday', productId: 'p-sanitizer', label: 'Sanitizer', sizeAmount: 50, amountPerUse: 1, usesPerWeek: 7, openedOn: daysAgo(10) }),
  i({ id: 'i-eperf', bagId: 'b-everyday', productId: 'p-perfume', label: 'Perfume', sizeAmount: 10, amountPerUse: 0.05, usesPerWeek: 5, openedOn: daysAgo(20) }),
];

export const dupes: Dupe[] = [
  { productId: 'p-concealer', dupeId: 'p-conc-dupe1', matchScore: 0.92, reason: 'Same soft-focus finish and shade range, also vegan.' },
  { productId: 'p-concealer', dupeId: 'p-conc-dupe2', matchScore: 0.85, reason: 'Similar coverage in a doe-foot wand, for less.' },
  { productId: 'p-concealer', dupeId: 'p-conc-dupe3', matchScore: 0.8, reason: 'Blurs the same way, in a stick that travels well.' },
];

export const trip: Trip = {
  id: 't-lisbon', userId: user.id, destination: 'Lisbon', start: daysAgo(-12), end: daysAgo(-22),
  travelers: [{ kind: 'adult' }, { kind: 'baby', age: 1 }], bagId: 'b-travel',
};

/** Items flagged "Buy before you go" — hard to find at destination (mock lookup) */
export const hardToFind: Record<string, string[]> = { Lisbon: ['p-diapers', 'p-bars', 'p-sunstick'] };

export const alerts: Alert[] = [
  { id: 'a1', itemId: 'i-lipoil', title: 'Your lip oil runs out in about 5 days.', when: 'Today, 9:02' },
  { id: 'a2', itemId: 'i-concealer', title: 'Your concealer is out. Three close matches are in stock.', when: 'Yesterday' },
  { id: 'a3', itemId: 'i-spf', title: 'Your SPF 50 expires in about 2 weeks.', when: 'Mon' },
];
