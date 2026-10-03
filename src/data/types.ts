export type BagType = 'travel' | 'makeup' | 'mom' | 'work' | 'study';
export type DemoId = 'travel' | 'makeup' | 'mom';

export interface User {
  id: string; name: string; lifeStage: string[]; values: string[];
  avoidIngredients: string[]; skinType?: string; kids?: { age: number; diaperSize?: string }[];
  notify: { push: boolean; email: boolean; sms: boolean; quietHours?: [string, string] };
  avatar?: string;
}

export interface Bag { id: string; userId: string; type: BagType; name: string; }

export interface Item {
  id: string; bagId: string; productId: string; quantity: number;
  sizeAmount: number; amountPerUse: number; usesPerWeek: number; openedOn?: string;
  periodAfterOpeningMonths?: number; status: 'have' | 'low' | 'out' | 'want';
  label: string; remainingOverride?: number;
}

export interface Product {
  id: string; brand: string; name: string; category: string; tags: string[];
  values: string[]; ingredients: string[]; price: number; sizeAmount: number; unit: string;
  /** Unsplash photo id of this exact kind of item */
  photo: string;
  bagTypes: BagType[];
  retailer: 'Amazon' | 'Sephora' | 'Target'; retailerUrl: string; inStock: boolean; sponsored?: boolean; bagFit?: 'mini' | 'regular' | 'large';
  blurb?: string;
}

export interface Dupe { productId: string; dupeId: string; matchScore: number; reason: string; }

export interface Trip {
  id: string; userId: string; destination: string; start: string; end: string;
  travelers: { kind: 'adult' | 'child' | 'baby'; age?: number }[]; bagId: string;
}

export interface Alert { id: string; itemId: string; title: string; when: string; }

export interface Reminder { id: string; title: string; when: string; bagId?: string; itemId?: string; on: boolean; }

export interface Post {
  id: string; bagType: BagType; title: string; caption: string;
  author: { name: string; role: string; avatar: string };
  photos: string[];
  /** Optional short clip (mp4 URL). Rendered on web with a native video element. */
  video?: string;
  productIds: string[];
  helpful: number; when: string;
  notes: { name: string; text: string }[];
  mine?: boolean;
}

export interface Demo {
  id: DemoId; label: string; tagline: string; cover: string;
  user: User; bags: Bag[]; items: Item[]; alerts: Alert[]; trip?: Trip;
}
