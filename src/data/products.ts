import { Product } from './types';

const url = 'https://example.com/shop/';
type P = Omit<Product, 'retailerUrl' | 'inStock'> & { inStock?: boolean };
const p = (x: P): Product => ({ retailerUrl: url + x.id, inStock: true, ...x });

export const products: Product[] = [
  // Owned — makeup
  p({ id: 'p-lipoil', brand: 'Maison Lune', name: 'Lip oil', category: 'Lips', tags: ['lips', 'gloss', 'everyday'], values: ['Vegan', 'Cruelty-free'], ingredients: ['jojoba'], price: 24, sizeAmount: 6, unit: 'ml', image: 'wand', bagFit: 'mini' }),
  p({ id: 'p-mascara', brand: 'Atelier Noir', name: 'Lengthening mascara', category: 'Eyes', tags: ['eyes', 'lashes'], values: ['Cruelty-free'], ingredients: ['beeswax'], price: 28, sizeAmount: 8, unit: 'ml', image: 'wand', bagFit: 'mini' }),
  p({ id: 'p-concealer', brand: 'Rue Clair', name: 'Soft-focus concealer', category: 'Face', tags: ['face', 'base'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 26, sizeAmount: 5, unit: 'ml', image: 'tube', bagFit: 'mini', inStock: false }),
  p({ id: 'p-spf', brand: 'Soleil Blanc', name: 'SPF 50 compact', category: 'Face', tags: ['face', 'spf', 'travel'], values: ['Fragrance-free', 'Clean beauty'], ingredients: ['zinc oxide'], price: 34, sizeAmount: 10, unit: 'g', image: 'compact', bagFit: 'mini' }),
  p({ id: 'p-blush', brand: 'Maison Lune', name: 'Blush stick', category: 'Cheeks', tags: ['cheeks', 'cream'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 30, sizeAmount: 7, unit: 'g', image: 'stick', bagFit: 'mini' }),
  p({ id: 'p-brow', brand: 'Atelier Noir', name: 'Clear brow gel', category: 'Eyes', tags: ['brows'], values: ['Cruelty-free'], ingredients: [], price: 20, sizeAmount: 5, unit: 'ml', image: 'wand', bagFit: 'mini' }),
  p({ id: 'p-setting', brand: 'Rue Clair', name: 'Setting mist', category: 'Face', tags: ['face', 'mist', 'travel'], values: ['Vegan'], ingredients: ['rose water'], price: 22, sizeAmount: 30, unit: 'ml', image: 'spray', bagFit: 'mini' }),
  p({ id: 'p-perfume', brand: 'Orangerie', name: 'Mini perfume', category: 'Fragrance', tags: ['fragrance'], values: [], ingredients: ['parfum'], price: 38, sizeAmount: 10, unit: 'ml', image: 'bottle', bagFit: 'mini' }),
  // Owned — diaper
  p({ id: 'p-diapers', brand: 'Little Cloud', name: 'Diapers, size 4', category: 'Baby', tags: ['baby', 'diaper'], values: ['Fragrance-free'], ingredients: [], price: 18, sizeAmount: 30, unit: 'ct', image: 'pouch', bagFit: 'large' }),
  p({ id: 'p-wipes', brand: 'Little Cloud', name: 'Water wipes', category: 'Baby', tags: ['baby', 'wipes', 'travel'], values: ['Fragrance-free', 'Vegan'], ingredients: [], price: 6, sizeAmount: 60, unit: 'ct', image: 'pouch', bagFit: 'regular' }),
  p({ id: 'p-cream', brand: 'Petal & Oat', name: 'Diaper balm', category: 'Baby', tags: ['baby', 'balm'], values: ['Clean beauty', 'Fragrance-free'], ingredients: ['zinc oxide'], price: 12, sizeAmount: 75, unit: 'ml', image: 'tube', bagFit: 'mini' }),
  p({ id: 'p-bars', brand: 'Petal & Oat', name: 'Oat snack bars', category: 'Snacks', tags: ['snack', 'baby', 'kids'], values: ['Vegan', 'Nut-free'], ingredients: ['oats', 'date'], price: 7, sizeAmount: 6, unit: 'bars', image: 'bar', bagFit: 'regular' }),
  p({ id: 'p-sippy', brand: 'Bluebell', name: 'Sippy cup', category: 'Baby', tags: ['baby', 'drink'], values: [], ingredients: [], price: 14, sizeAmount: 1, unit: 'ct', image: 'cup', bagFit: 'regular' }),
  p({ id: 'p-outfit', brand: 'Bluebell', name: 'Spare outfit', category: 'Baby', tags: ['baby', 'clothes'], values: [], ingredients: [], price: 22, sizeAmount: 1, unit: 'ct', image: 'box', bagFit: 'regular' }),
  p({ id: 'p-sanitizer', brand: 'Clean Linen', name: 'Hand sanitizer', category: 'Care', tags: ['hands', 'travel'], values: ['Vegan'], ingredients: ['alcohol'], price: 5, sizeAmount: 50, unit: 'ml', image: 'bottle', bagFit: 'mini' }),
  p({ id: 'p-mat', brand: 'Bluebell', name: 'Changing mat', category: 'Baby', tags: ['baby', 'travel'], values: [], ingredients: [], price: 19, sizeAmount: 1, unit: 'ct', image: 'pouch', bagFit: 'regular' }),
  // Owned — travel / everyday
  p({ id: 'p-passport', brand: 'Atelier Noir', name: 'Passport wallet', category: 'Accessories', tags: ['travel'], values: [], ingredients: [], price: 45, sizeAmount: 1, unit: 'ct', image: 'box', bagFit: 'regular' }),
  p({ id: 'p-earbuds', brand: 'Quiet Hour', name: 'Earplugs', category: 'Travel', tags: ['travel', 'sleep'], values: [], ingredients: [], price: 9, sizeAmount: 10, unit: 'pairs', image: 'jar', bagFit: 'mini' }),
  p({ id: 'p-mask', brand: 'Quiet Hour', name: 'Silk eye mask', category: 'Travel', tags: ['travel', 'sleep'], values: [], ingredients: [], price: 26, sizeAmount: 1, unit: 'ct', image: 'pouch', bagFit: 'mini' }),
  p({ id: 'p-handcream', brand: 'Orangerie', name: 'Hand cream', category: 'Care', tags: ['hands', 'everyday'], values: ['Vegan'], ingredients: ['shea'], price: 16, sizeAmount: 30, unit: 'ml', image: 'tube', bagFit: 'mini' }),
  p({ id: 'p-mints', brand: 'Petal & Oat', name: 'Peppermint tin', category: 'Snacks', tags: ['snack', 'everyday'], values: ['Vegan', 'Nut-free'], ingredients: ['mint'], price: 4, sizeAmount: 40, unit: 'ct', image: 'compact', bagFit: 'mini' }),
  p({ id: 'p-balm', brand: 'Maison Lune', name: 'Tinted lip balm', category: 'Lips', tags: ['lips', 'everyday'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 14, sizeAmount: 4, unit: 'g', image: 'stick', bagFit: 'mini' }),
  // Shop — not owned
  p({ id: 'p-cheddar', brand: 'Petal & Oat', name: 'Chickpea crisps', category: 'Snacks', tags: ['snack', 'kids', 'baby'], values: ['Vegan', 'Nut-free'], ingredients: ['chickpea'], price: 5, sizeAmount: 6, unit: 'bags', image: 'pouch', bagFit: 'regular' }),
  p({ id: 'p-fruit', brand: 'Orchard Row', name: 'Fruit leather', category: 'Snacks', tags: ['snack', 'kids'], values: ['Vegan', 'Nut-free'], ingredients: ['apple'], price: 6, sizeAmount: 8, unit: 'ct', image: 'bar', bagFit: 'mini' }),
  p({ id: 'p-almond', brand: 'Orchard Row', name: 'Almond bites', category: 'Snacks', tags: ['snack'], values: ['Vegan'], ingredients: ['almond'], price: 8, sizeAmount: 10, unit: 'ct', image: 'pouch', bagFit: 'regular' }),
  p({ id: 'p-puffs', brand: 'Little Cloud', name: 'Veggie puffs', category: 'Snacks', tags: ['snack', 'baby'], values: ['Vegan', 'Nut-free'], ingredients: ['corn'], price: 4, sizeAmount: 1, unit: 'tub', image: 'cup', bagFit: 'regular' }),
  p({ id: 'p-honey', brand: 'Orchard Row', name: 'Honey oat clusters', category: 'Snacks', tags: ['snack'], values: ['Nut-free'], ingredients: ['honey', 'oats'], price: 7, sizeAmount: 8, unit: 'ct', image: 'bar', bagFit: 'regular' }),
  p({ id: 'p-liner', brand: 'Atelier Noir', name: 'Gel eyeliner pencil', category: 'Eyes', tags: ['eyes'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 18, sizeAmount: 1, unit: 'g', image: 'stick', bagFit: 'mini' }),
  p({ id: 'p-lipliner', brand: 'Maison Lune', name: 'Lip liner, Rosewood', category: 'Lips', tags: ['lips'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 16, sizeAmount: 1, unit: 'g', image: 'stick', bagFit: 'mini' }),
  p({ id: 'p-highlight', brand: 'Rue Clair', name: 'Cream highlighter', category: 'Cheeks', tags: ['cheeks', 'cream'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 27, sizeAmount: 6, unit: 'g', image: 'compact', bagFit: 'mini' }),
  p({ id: 'p-conc-dupe1', brand: 'Saint Ambre', name: 'Second-skin concealer', category: 'Face', tags: ['face', 'base'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 19, sizeAmount: 6, unit: 'ml', image: 'tube', bagFit: 'mini' }),
  p({ id: 'p-conc-dupe2', brand: 'Petit Mot', name: 'Brightening concealer', category: 'Face', tags: ['face', 'base'], values: ['Cruelty-free'], ingredients: [], price: 14, sizeAmount: 5, unit: 'ml', image: 'wand', bagFit: 'mini' }),
  p({ id: 'p-conc-dupe3', brand: 'Atelier Noir', name: 'Blurring concealer stick', category: 'Face', tags: ['face', 'base'], values: ['Vegan'], ingredients: [], price: 24, sizeAmount: 4, unit: 'g', image: 'stick', bagFit: 'mini' }),
  p({ id: 'p-scrunchie', brand: 'Quiet Hour', name: 'Silk scrunchie set', category: 'Accessories', tags: ['hair', 'joy'], values: [], ingredients: [], price: 18, sizeAmount: 3, unit: 'ct', image: 'pouch', bagFit: 'mini' }),
  p({ id: 'p-candle', brand: 'Orangerie', name: 'Fig travel candle', category: 'Home', tags: ['joy', 'travel'], values: ['Vegan'], ingredients: [], price: 22, sizeAmount: 1, unit: 'ct', image: 'jar', bagFit: 'regular', sponsored: true }),
  p({ id: 'p-notebook', brand: 'Petit Mot', name: 'Linen pocket notebook', category: 'Stationery', tags: ['joy', 'everyday'], values: [], ingredients: [], price: 12, sizeAmount: 1, unit: 'ct', image: 'box', bagFit: 'mini' }),
  p({ id: 'p-clip', brand: 'Quiet Hour', name: 'Tortoise hair clip', category: 'Accessories', tags: ['hair', 'joy'], values: [], ingredients: [], price: 15, sizeAmount: 1, unit: 'ct', image: 'compact', bagFit: 'mini' }),
  p({ id: 'p-sunstick', brand: 'Soleil Blanc', name: 'Baby SPF stick', category: 'Baby', tags: ['baby', 'spf', 'travel'], values: ['Fragrance-free', 'Clean beauty'], ingredients: ['zinc oxide'], price: 16, sizeAmount: 15, unit: 'g', image: 'stick', bagFit: 'mini' }),
  p({ id: 'p-tsa', brand: 'Clean Linen', name: 'Travel bottle trio', category: 'Travel', tags: ['travel'], values: [], ingredients: [], price: 21, sizeAmount: 3, unit: 'ct', image: 'bottle', bagFit: 'regular' }),
  p({ id: 'p-bibs', brand: 'Bluebell', name: 'Silicone bibs', category: 'Baby', tags: ['baby', 'travel'], values: [], ingredients: [], price: 13, sizeAmount: 2, unit: 'ct', image: 'pouch', bagFit: 'regular' }),
  p({ id: 'p-tea', brand: 'Orchard Row', name: 'Chamomile tea sachets', category: 'Snacks', tags: ['joy', 'travel'], values: ['Vegan', 'Nut-free'], ingredients: ['chamomile'], price: 9, sizeAmount: 12, unit: 'ct', image: 'box', bagFit: 'mini' }),
  p({ id: 'p-perf-roll', brand: 'Orangerie', name: 'Neroli rollerball', category: 'Fragrance', tags: ['fragrance', 'joy'], values: ['Vegan'], ingredients: ['parfum'], price: 24, sizeAmount: 8, unit: 'ml', image: 'bottle', bagFit: 'mini', sponsored: true }),
  p({ id: 'p-mist', brand: 'Rue Clair', name: 'Rose face mist, travel', category: 'Face', tags: ['face', 'mist', 'travel'], values: ['Vegan', 'Clean beauty'], ingredients: ['rose water'], price: 16, sizeAmount: 30, unit: 'ml', image: 'spray', bagFit: 'mini' }),
  p({ id: 'p-cuticle', brand: 'Maison Lune', name: 'Cuticle oil pen', category: 'Care', tags: ['hands', 'joy'], values: ['Vegan', 'Cruelty-free'], ingredients: ['jojoba'], price: 14, sizeAmount: 3, unit: 'ml', image: 'wand', bagFit: 'mini' }),
];

export const productById = (id: string) => products.find((x) => x.id === id)!;
