import { Alert, Bag, Demo, DemoId, Dupe, Item, Trip } from './types';
import { scenes, portraits } from './photos';

const daysAgo = (n: number) => new Date(Date.now() - n * 864e5).toISOString().slice(0, 10);
type I = Omit<Item, 'quantity' | 'status'> & Partial<Pick<Item, 'quantity' | 'status'>>;
const i = (x: I): Item => ({ quantity: 1, status: 'have', ...x });
const notify = { push: true, email: true, sms: false, quietHours: ['21:00', '07:00'] as [string, string] };

// ——— Travel (lead demo) ———
const travelBags: Bag[] = [
  { id: 'b-travel', userId: 'u-ava', type: 'travel', name: 'Carry-on' },
  { id: 'b-work', userId: 'u-ava', type: 'work', name: 'Work tote' },
];
const trip: Trip = {
  id: 't-lisbon', userId: 'u-ava', destination: 'Lisbon', start: daysAgo(-12), end: daysAgo(-22),
  travelers: [{ kind: 'adult' }, { kind: 'adult' }], bagId: 'b-travel',
};
const travel: Demo = {
  id: 'travel', label: 'Travel', tagline: 'A carry-on that packs itself', cover: scenes.travel,
  user: { id: 'u-ava', name: 'Ava', lifeStage: ['Traveler', 'Working'], values: ['Cruelty-free'], avoidIngredients: [], notify, avatar: portraits.hana },
  bags: travelBags,
  trip,
  items: [
    i({ id: 'i-carryon', bagId: 'b-travel', productId: 'tr-carryon', label: 'Carry-on', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
    i({ id: 'i-passport', bagId: 'b-travel', productId: 'tr-passport', label: 'Passport', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
    i({ id: 'i-spf', bagId: 'b-travel', productId: 'tr-spf', label: 'SPF 50', sizeAmount: 50, amountPerUse: 1.5, usesPerWeek: 7, openedOn: daysAgo(28), periodAfterOpeningMonths: 2 }),
    i({ id: 'i-lipbalm', bagId: 'b-travel', productId: 'tr-lipbalm', label: 'Lip balm', sizeAmount: 15, amountPerUse: 0.1, usesPerWeek: 21, openedOn: daysAgo(44) }),
    i({ id: 'i-sanitizer', bagId: 'b-travel', productId: 'tr-sanitizer', label: 'Sanitizer', sizeAmount: 50, amountPerUse: 1, usesPerWeek: 14, openedOn: daysAgo(18) }),
    i({ id: 'i-pillow', bagId: 'b-travel', productId: 'tr-pillow', label: 'Neck pillow', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
    i({ id: 'i-headphones', bagId: 'b-travel', productId: 'tr-headphones', label: 'Headphones', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
    i({ id: 'i-sunglasses', bagId: 'b-travel', productId: 'tr-sunglasses', label: 'Sunglasses', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
    i({ id: 'i-bottle', bagId: 'b-travel', productId: 'tr-bottle', label: 'Water bottle', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
    i({ id: 'i-w-notebook', bagId: 'b-work', productId: 'wk-notebook', label: 'Notebook', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
    i({ id: 'i-w-cup', bagId: 'b-work', productId: 'wk-cup', label: 'Coffee cup', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
    i({ id: 'i-w-earbuds', bagId: 'b-work', productId: 'tr-earbuds', label: 'Earbuds', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
    i({ id: 'i-w-bars', bagId: 'b-work', productId: 'mo-bars', label: 'Snack bars', sizeAmount: 6, amountPerUse: 1, usesPerWeek: 4, openedOn: daysAgo(6) }),
    i({ id: 'i-w-planner', bagId: 'b-work', productId: 'wk-planner', label: 'Planner', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
  ],
  alerts: [
    { id: 'a1', itemId: 'i-spf', title: 'Your SPF 50 runs out in about 5 days, a week before Lisbon.', when: 'Today, 8:40' },
    { id: 'a2', itemId: 'i-lipbalm', title: 'Your lip balm is nearly done. Flights are drying.', when: 'Yesterday' },
    { id: 'a3', itemId: 'i-passport', title: 'Passport check: valid for 6 months after your return.', when: 'Mon' },
  ],
};

// ——— Makeup ———
const makeup: Demo = {
  id: 'makeup', label: 'Makeup', tagline: 'Never run out of the good stuff', cover: scenes.makeup,
  user: { id: 'u-sofia', name: 'Sofia', lifeStage: ['Working'], values: ['Vegan', 'Cruelty-free'], avoidIngredients: ['parfum'], skinType: 'Combination', notify, avatar: portraits.camille },
  bags: [{ id: 'b-makeup', userId: 'u-sofia', type: 'makeup', name: 'Makeup bag' }],
  items: [
    i({ id: 'i-lipstick', bagId: 'b-makeup', productId: 'mk-lipstick', label: 'Lipstick', sizeAmount: 3.5, amountPerUse: 0.02, usesPerWeek: 14, openedOn: daysAgo(81) }),
    i({ id: 'i-mascara', bagId: 'b-makeup', productId: 'mk-mascara', label: 'Mascara', sizeAmount: 8, amountPerUse: 0.04, usesPerWeek: 7, openedOn: daysAgo(76), periodAfterOpeningMonths: 3 }),
    i({ id: 'i-palette', bagId: 'b-makeup', productId: 'mk-palette', label: 'Eyeshadow', sizeAmount: 12, amountPerUse: 0.05, usesPerWeek: 5, openedOn: daysAgo(300), status: 'out' }),
    i({ id: 'i-powder', bagId: 'b-makeup', productId: 'mk-powder', label: 'Powder', sizeAmount: 10, amountPerUse: 0.05, usesPerWeek: 7, openedOn: daysAgo(40) }),
    i({ id: 'i-concealer', bagId: 'b-makeup', productId: 'mk-concealer', label: 'Concealer', sizeAmount: 6, amountPerUse: 0.03, usesPerWeek: 7, openedOn: daysAgo(30) }),
    i({ id: 'i-brushes', bagId: 'b-makeup', productId: 'mk-brushes', label: 'Brushes', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
    i({ id: 'i-serum', bagId: 'b-makeup', productId: 'mk-serum', label: 'Serum', sizeAmount: 30, amountPerUse: 0.5, usesPerWeek: 7, openedOn: daysAgo(48) }),
    i({ id: 'i-scrub', bagId: 'b-makeup', productId: 'mk-scrub', label: 'Lip scrub', sizeAmount: 15, amountPerUse: 0.3, usesPerWeek: 2, openedOn: daysAgo(20) }),
  ],
  alerts: [
    { id: 'a1', itemId: 'i-lipstick', title: 'Your nude lipstick runs out in about 6 days.', when: 'Today, 9:02' },
    { id: 'a2', itemId: 'i-palette', title: 'Your eyeshadow palette is out. Three close matches are in stock.', when: 'Yesterday' },
    { id: 'a3', itemId: 'i-mascara', title: 'Your mascara is 3 months open. Time for a fresh one soon.', when: 'Mon' },
  ],
};

// ——— Mom ———
const mom: Demo = {
  id: 'mom', label: 'Mom', tagline: 'The diaper bag, always ready', cover: scenes.mom,
  user: { id: 'u-maya', name: 'Maya', lifeStage: ['Mom', 'Working'], values: ['Vegan', 'Nut-free', 'Fragrance-free'], avoidIngredients: ['almond'], kids: [{ age: 1, diaperSize: '4' }], notify, avatar: portraits.amara },
  bags: [{ id: 'b-mom', userId: 'u-maya', type: 'mom', name: 'Diaper bag' }],
  items: [
    i({ id: 'i-diapers', bagId: 'b-mom', productId: 'mo-diapers', label: 'Diapers', sizeAmount: 12, amountPerUse: 1, usesPerWeek: 14, openedOn: daysAgo(4) }),
    i({ id: 'i-wipes', bagId: 'b-mom', productId: 'mo-wipes', label: 'Wipes', sizeAmount: 60, amountPerUse: 3, usesPerWeek: 14, openedOn: daysAgo(6) }),
    i({ id: 'i-bottle', bagId: 'b-mom', productId: 'mo-bottle', label: 'Bottle', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
    i({ id: 'i-pacifier', bagId: 'b-mom', productId: 'mo-pacifier', label: 'Pacifier', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
    i({ id: 'i-onesie', bagId: 'b-mom', productId: 'mo-onesie', label: 'Spare outfit', sizeAmount: 1, amountPerUse: 0, usesPerWeek: 0 }),
    i({ id: 'i-bars', bagId: 'b-mom', productId: 'mo-bars', label: 'Snack bars', sizeAmount: 6, amountPerUse: 1, usesPerWeek: 3, openedOn: daysAgo(3), quantity: 2 }),
    i({ id: 'i-balm', bagId: 'b-mom', productId: 'mo-balm', label: 'Diaper balm', sizeAmount: 75, amountPerUse: 1, usesPerWeek: 7, openedOn: daysAgo(20) }),
    i({ id: 'i-m-sanitizer', bagId: 'b-mom', productId: 'tr-sanitizer', label: 'Sanitizer', sizeAmount: 50, amountPerUse: 1, usesPerWeek: 10, openedOn: daysAgo(14) }),
  ],
  alerts: [
    { id: 'a1', itemId: 'i-wipes', title: 'Wipes run out in about 4 days. Reorder now and they land Thursday.', when: 'Today, 7:15' },
    { id: 'a2', itemId: 'i-diapers', title: 'Diapers are getting low. Time to check size 5?', when: 'Yesterday' },
  ],
};

export const demos: Record<DemoId, Demo> = { travel, makeup, mom };
export const demoOrder: DemoId[] = ['travel', 'makeup', 'mom'];

export const dupes: Dupe[] = [
  { productId: 'mk-palette', dupeId: 'mk-palette-brown', matchScore: 0.91, reason: 'The same warm browns with a deeper smoky shade, also vegan.' },
  { productId: 'mk-palette', dupeId: 'mk-palette-brush', matchScore: 0.86, reason: 'Six of your most-used shades, with a brush, for less.' },
  { productId: 'mk-palette', dupeId: 'mk-palette-green', matchScore: 0.78, reason: 'Same buttery formula in an olive story, if you fancy a change.' },
];

/** Items flagged "Buy before you go": hard to find at the destination (mock lookup). */
export const hardToFind: Record<string, string[]> = { Lisbon: ['tr-spf', 'mo-bars', 'tr-lipbalm'] };

/** Trip packing list, grouped by category. */
export const tripList: Record<string, string[]> = {
  Essentials: ['tr-passport', 'tr-carryon', 'tr-bottle'],
  'Sun and skin': ['tr-spf', 'tr-sunduo', 'tr-lipbalm', 'tr-sanitizer'],
  'On the plane': ['tr-pillow', 'tr-headphones', 'tr-earbuds'],
  Baby: ['mo-diapers', 'mo-wipes', 'mo-bottle', 'mo-bars'],
};

/** Starter items when a user adds a bag type through onboarding. */
export const starterProducts: Record<string, string[]> = {
  travel: ['tr-passport', 'tr-spf', 'tr-pillow', 'tr-headphones', 'tr-sunglasses', 'tr-bottle'],
  makeup: ['mk-lipstick', 'mk-mascara', 'mk-powder', 'mk-concealer', 'mk-brushes', 'mk-serum'],
  mom: ['mo-diapers', 'mo-wipes', 'mo-bottle', 'mo-pacifier', 'mo-onesie', 'mo-bars'],
  work: ['wk-notebook', 'wk-cup', 'tr-earbuds', 'wk-planner', 'mo-bars', 'tr-lipbalm'],
  study: ['st-books', 'st-highlighters', 'tr-bottle', 'tr-headphones', 'wk-planner', 'mo-bars'],
};

export type { Alert };
