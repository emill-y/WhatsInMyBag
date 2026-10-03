export type BagType = 'makeup' | 'diaper' | 'travel' | 'everyday' | 'grocery' | 'home' | 'custom';

export interface User {
  id: string; name: string; lifeStage: string[]; values: string[];
  avoidIngredients: string[]; skinType?: string; kids?: { age: number; diaperSize?: string }[];
  notify: { push: boolean; email: boolean; sms: boolean; quietHours?: [string, string] };
}

export interface Bag { id: string; userId: string; type: BagType; name: string; }

export interface Item {
  id: string; bagId: string; productId: string; quantity: number;
  sizeAmount: number; amountPerUse: number; usesPerWeek: number; openedOn?: string;
  periodAfterOpeningMonths?: number; status: 'have' | 'low' | 'out' | 'want';
  label: string; remainingOverride?: number;
}

/** image is a placeholder silhouette key until real cut-outs arrive */
export type Shape = 'tube' | 'bottle' | 'jar' | 'compact' | 'stick' | 'box' | 'pouch' | 'cup' | 'bar' | 'spray' | 'wand';

export interface Product {
  id: string; brand: string; name: string; category: string; tags: string[];
  values: string[]; ingredients: string[]; price: number; sizeAmount: number; unit: string;
  image: Shape; retailerUrl: string; inStock: boolean; sponsored?: boolean; bagFit?: 'mini' | 'regular' | 'large';
}

export interface Dupe { productId: string; dupeId: string; matchScore: number; reason: string; }

export interface Trip {
  id: string; userId: string; destination: string; start: string; end: string;
  travelers: { kind: 'adult' | 'child' | 'baby'; age?: number }[]; bagId: string;
}

export interface SurpriseCard {
  kind: 'complement' | 'routine' | 'joy' | 'tip'; productIds: string[]; title: string; body: string;
}
export interface SurpriseSet { week: string; cards: SurpriseCard[]; dismissed: string[]; }

export interface Alert { id: string; itemId: string; title: string; when: string; }
