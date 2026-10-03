import { Product } from './types';

/**
 * Catalogue. Brands are fictional. Each `photo` is an Unsplash photo id of that
 * specific kind of item (see src/data/photos.ts for how it is loaded).
 */
/**
 * Every product links to a live search on a real retailer for that exact kind of item
 * (beauty at Sephora, baby at Target, everything else at Amazon). Brands in the app are
 * fictional, so a search for the item is the honest real-world link.
 */
type P = Omit<Product, 'retailerUrl' | 'retailer' | 'inStock'> & { inStock?: boolean; shop?: string };
const retailerFor = (x: P): Product['retailer'] =>
  x.bagTypes[0] === 'makeup' ? 'Sephora' : x.bagTypes[0] === 'mom' ? 'Target' : 'Amazon';
const searchUrl = (r: Product['retailer'], q: string) => {
  const k = encodeURIComponent(q);
  return r === 'Sephora' ? `https://www.sephora.com/search?keyword=${k}`
    : r === 'Target' ? `https://www.target.com/s?searchTerm=${k}`
      : `https://www.amazon.com/s?k=${k}`;
};
const p = ({ shop, ...x }: P): Product => {
  const retailer = retailerFor(x);
  return { inStock: true, ...x, retailer, retailerUrl: searchUrl(retailer, shop ?? x.name.replace(/,.*$/, '')) };
};

export const CATEGORY_ORDER = ['Bags and luggage', 'Bottles and cups', 'Sun care', 'Lips', 'Eyes', 'Face', 'Skin and hand care', 'Fragrance', 'Nails',
  'Baby care', 'Snacks', 'Tech', 'Travel accessories', 'Accessories', 'Books and stationery', 'Home'];

export const products: Product[] = [
  // Travel
  p({ id: 'tr-carryon', brand: 'Voyage Lune', name: 'Carry-on spinner, 22 in.', category: 'Bags and luggage', tags: ['travel', 'luggage'], values: [], ingredients: [], price: 295, sizeAmount: 1, unit: 'ct', photo: 'KLp9S-K6BrY', bagTypes: ['travel'], bagFit: 'large', blurb: 'Hard shell, quiet wheels, fits every overhead bin we tried.' }),
  p({ id: 'tr-passport', brand: 'Atelier Noir', name: 'Passport and boarding pass wallet', category: 'Travel accessories', tags: ['travel', 'documents'], values: [], ingredients: [], price: 45, sizeAmount: 1, unit: 'ct', photo: 'addEU6TScGI', bagTypes: ['travel'], bagFit: 'regular' }),
  p({ id: 'tr-pillow', brand: 'Quiet Hour', name: 'Memory foam neck pillow', category: 'Travel accessories', tags: ['travel', 'sleep', 'flight'], values: [], ingredients: [], price: 34, sizeAmount: 1, unit: 'ct', photo: 'H_2rnIbtXrQ', bagTypes: ['travel'], bagFit: 'regular' }),
  p({ id: 'tr-sunglasses', brand: 'Maison Lune', name: 'Classic black sunglasses', shop: 'womens classic black sunglasses', category: 'Accessories', tags: ['travel', 'sun', 'joy'], values: [], ingredients: [], price: 120, sizeAmount: 1, unit: 'ct', photo: 'w1ELNajqfwk', bagTypes: ['travel', 'work'], bagFit: 'mini' }),
  p({ id: 'tr-headphones', brand: 'Quiet Hour', name: 'Over-ear travel headphones', category: 'Tech', tags: ['travel', 'flight', 'audio'], values: [], ingredients: [], price: 180, sizeAmount: 1, unit: 'ct', photo: 'PDX_a_82obo', bagTypes: ['travel', 'study'], bagFit: 'regular' }),
  p({ id: 'tr-earbuds', brand: 'Quiet Hour', name: 'Wireless earbuds', category: 'Tech', tags: ['audio', 'commute', 'travel'], values: [], ingredients: [], price: 129, sizeAmount: 1, unit: 'ct', photo: '-d-MoiV98pc', bagTypes: ['work', 'study', 'travel'], bagFit: 'mini' }),
  p({ id: 'tr-spf', brand: 'Soleil Blanc', name: 'SPF 50 face fluid', category: 'Sun care', tags: ['spf', 'travel', 'face'], values: ['Fragrance-free', 'Clean beauty', 'Cruelty-free'], ingredients: ['zinc oxide'], price: 32, sizeAmount: 50, unit: 'ml', photo: 'UvxGbB04PKk', bagTypes: ['travel', 'makeup'], bagFit: 'mini' }),
  p({ id: 'tr-sunduo', brand: 'Soleil Blanc', name: 'Body and face sun duo', category: 'Sun care', tags: ['spf', 'travel', 'beach'], values: ['Cruelty-free'], ingredients: ['zinc oxide'], price: 44, sizeAmount: 2, unit: 'ct', photo: '9200Wu7rCnk', bagTypes: ['travel'], bagFit: 'regular' }),
  p({ id: 'tr-bottle', brand: 'Clean Linen', name: 'Insulated steel water bottle', category: 'Bottles and cups', tags: ['travel', 'drink', 'commute'], values: [], ingredients: [], price: 38, sizeAmount: 1, unit: 'ct', photo: 'axMEtSm42iQ', bagTypes: ['travel', 'study', 'work'], bagFit: 'regular' }),
  p({ id: 'tr-sanitizer', brand: 'Clean Linen', name: 'Hand sanitizer, travel size', shop: 'travel size hand sanitizer', category: 'Skin and hand care', tags: ['hands', 'travel'], values: ['Vegan'], ingredients: ['alcohol'], price: 6, sizeAmount: 50, unit: 'ml', photo: '3S0-pzVIT-w', bagTypes: ['travel', 'mom', 'work'], bagFit: 'mini' }),
  p({ id: 'tr-lipbalm', brand: 'Petal & Oat', name: 'Unscented lip balm tin', category: 'Lips', tags: ['lips', 'travel', 'flight'], values: ['Vegan', 'Fragrance-free'], ingredients: ['shea'], price: 9, sizeAmount: 15, unit: 'g', photo: '59qh0Sdjn-Y', bagTypes: ['travel', 'work', 'study'], bagFit: 'mini' }),
  // Makeup
  p({ id: 'mk-lipstick', brand: 'Maison Lune', name: 'Nude satin lipstick', category: 'Lips', tags: ['lips', 'everyday'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 28, sizeAmount: 3.5, unit: 'g', photo: 'NnsqpLjiA94', bagTypes: ['makeup'], bagFit: 'mini' }),
  p({ id: 'mk-rose', brand: 'Maison Lune', name: 'Rose sheer lipstick', category: 'Lips', tags: ['lips', 'joy'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 28, sizeAmount: 3.5, unit: 'g', photo: 'QM77NRAFVOg', bagTypes: ['makeup'], bagFit: 'mini' }),
  p({ id: 'mk-scrub', brand: 'Petal & Oat', name: 'Sugar lip scrub', category: 'Lips', tags: ['lips', 'care', 'joy'], values: ['Vegan', 'Clean beauty'], ingredients: ['sugar', 'jojoba'], price: 16, sizeAmount: 15, unit: 'g', photo: 'WQal9Knx_aY', bagTypes: ['makeup'], bagFit: 'mini' }),
  p({ id: 'mk-mascara', brand: 'Atelier Noir', name: 'Lengthening mascara', category: 'Eyes', tags: ['eyes', 'lashes'], values: ['Cruelty-free'], ingredients: ['beeswax'], price: 26, sizeAmount: 8, unit: 'ml', photo: 'hfIqGRZMdkA', bagTypes: ['makeup'], bagFit: 'mini' }),
  p({ id: 'mk-powder', brand: 'Rue Clair', name: 'Pressed powder and brush set', category: 'Face', tags: ['face', 'base'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 38, sizeAmount: 10, unit: 'g', photo: 'DEuob2v77wI', bagTypes: ['makeup'], bagFit: 'mini' }),
  p({ id: 'mk-concealer', brand: 'Rue Clair', name: 'Cream concealer palette', category: 'Face', tags: ['face', 'base'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 34, sizeAmount: 6, unit: 'g', photo: '77rQJa2AKh0', bagTypes: ['makeup'], bagFit: 'mini' }),
  p({ id: 'mk-palette', brand: 'Atelier Noir', name: 'Warm neutrals eyeshadow palette', category: 'Eyes', tags: ['eyes', 'palette'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 42, sizeAmount: 12, unit: 'g', photo: 'dctOwRdfbg8', bagTypes: ['makeup'], bagFit: 'regular', inStock: false }),
  p({ id: 'mk-palette-brown', brand: 'Saint Ambre', name: 'Brown smoke eyeshadow palette', category: 'Eyes', tags: ['eyes', 'palette'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 29, sizeAmount: 10, unit: 'g', photo: '47x_lN_VAFw', bagTypes: ['makeup'], bagFit: 'regular' }),
  p({ id: 'mk-palette-brush', brand: 'Petit Mot', name: 'Everyday palette with brush', category: 'Eyes', tags: ['eyes', 'palette'], values: ['Cruelty-free'], ingredients: [], price: 24, sizeAmount: 9, unit: 'g', photo: '5EO7xhOlph4', bagTypes: ['makeup'], bagFit: 'regular' }),
  p({ id: 'mk-palette-green', brand: 'Saint Ambre', name: 'Moss nine-pan palette', category: 'Eyes', tags: ['eyes', 'palette'], values: ['Vegan'], ingredients: [], price: 32, sizeAmount: 9, unit: 'g', photo: 'N1hqWDzGDsg', bagTypes: ['makeup'], bagFit: 'regular' }),
  p({ id: 'mk-brushes', brand: 'Rue Clair', name: 'Five-piece brush set', category: 'Face', tags: ['tools', 'brushes'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 48, sizeAmount: 5, unit: 'ct', photo: 'wsCwj455vh0', bagTypes: ['makeup'], bagFit: 'regular' }),
  p({ id: 'mk-perfume', brand: 'Orangerie', name: 'Eau de parfum, 30 ml', category: 'Fragrance', tags: ['fragrance'], values: [], ingredients: ['parfum'], price: 78, sizeAmount: 30, unit: 'ml', photo: 'AdfA5C0c12M', bagTypes: ['makeup'], bagFit: 'mini' }),
  p({ id: 'mk-neroli', brand: 'Orangerie', name: 'Neroli eau de toilette', category: 'Fragrance', tags: ['fragrance', 'joy'], values: ['Vegan'], ingredients: ['parfum'], price: 64, sizeAmount: 50, unit: 'ml', photo: 'eTMMCz6JI6s', bagTypes: ['makeup'], bagFit: 'regular', sponsored: true }),
  p({ id: 'mk-nail', brand: 'Petit Mot', name: 'Nail colour, Marble', category: 'Nails', tags: ['nails', 'joy'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 14, sizeAmount: 10, unit: 'ml', photo: 'q5XPvKABmSw', bagTypes: ['makeup'], bagFit: 'mini' }),
  p({ id: 'mk-nail-trio', brand: 'Petit Mot', name: 'Nail colour trio, Earth', category: 'Nails', tags: ['nails', 'joy'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 32, sizeAmount: 3, unit: 'ct', photo: 'FqpSyjCdccw', bagTypes: ['makeup'], bagFit: 'regular' }),
  p({ id: 'mk-serum', brand: 'Rue Clair', name: 'Hydrating face serum', category: 'Skin and hand care', tags: ['skin', 'face'], values: ['Vegan', 'Clean beauty', 'Fragrance-free'], ingredients: ['hyaluronic acid'], price: 36, sizeAmount: 30, unit: 'ml', photo: 'j24HPh0Q84g', bagTypes: ['makeup'], bagFit: 'mini' }),
  p({ id: 'mk-serums', brand: 'Saint Ambre', name: 'Morning and night serum duo', category: 'Skin and hand care', tags: ['skin', 'face', 'joy'], values: ['Vegan', 'Cruelty-free'], ingredients: [], price: 54, sizeAmount: 2, unit: 'ct', photo: '9PnU-U7V6YE', bagTypes: ['makeup'], bagFit: 'regular' }),
  p({ id: 'mk-pouch', brand: 'Atelier Noir', name: 'Leather zip pouch, blush', category: 'Bags and luggage', tags: ['joy', 'organise'], values: [], ingredients: [], price: 58, sizeAmount: 1, unit: 'ct', photo: 'MXz_6BkMogs', bagTypes: ['makeup', 'work'], bagFit: 'regular' }),
  p({ id: 'mk-handcream', brand: 'Orangerie', name: 'Hand cream gift set', category: 'Skin and hand care', tags: ['hands', 'joy'], values: ['Vegan'], ingredients: ['shea'], price: 24, sizeAmount: 3, unit: 'ct', photo: 'UYJTgxZtUmk', bagTypes: ['makeup', 'work'], bagFit: 'mini' }),
  // Mom
  p({ id: 'mo-diapers', brand: 'Little Cloud', name: 'Cloth diapers, size 4', shop: 'diapers size 4', category: 'Baby care', tags: ['baby', 'diaper'], values: ['Fragrance-free'], ingredients: [], price: 42, sizeAmount: 12, unit: 'ct', photo: 'TgVsbTe_-Bk', bagTypes: ['mom'], bagFit: 'large' }),
  p({ id: 'mo-wipes', brand: 'Little Cloud', name: 'Water wipes, 60 count', category: 'Baby care', tags: ['baby', 'wipes', 'travel'], values: ['Fragrance-free', 'Vegan'], ingredients: [], price: 6, sizeAmount: 60, unit: 'ct', photo: 'zWzhJBBiaiI', bagTypes: ['mom'], bagFit: 'regular' }),
  p({ id: 'mo-bottle', brand: 'Bluebell', name: 'Anti-colic baby bottle', category: 'Bottles and cups', tags: ['baby', 'feeding'], values: [], ingredients: [], price: 16, sizeAmount: 1, unit: 'ct', photo: 'jtMPlFkhPO4', bagTypes: ['mom'], bagFit: 'regular' }),
  p({ id: 'mo-pacifier', brand: 'Bluebell', name: 'Silicone pacifier, rose', category: 'Baby care', tags: ['baby', 'soothing'], values: [], ingredients: [], price: 9, sizeAmount: 2, unit: 'ct', photo: '6qwDA_8ZDNg', bagTypes: ['mom'], bagFit: 'mini' }),
  p({ id: 'mo-onesie', brand: 'Bluebell', name: 'Cotton onesie and socks', category: 'Baby care', tags: ['baby', 'clothes'], values: [], ingredients: [], price: 22, sizeAmount: 1, unit: 'set', photo: 'fdPlZXc-ZwU', bagTypes: ['mom'], bagFit: 'regular' }),
  p({ id: 'mo-bars', brand: 'Petal & Oat', name: 'Oat and date snack bars', category: 'Snacks', tags: ['snack', 'kids', 'baby'], values: ['Vegan', 'Nut-free'], ingredients: ['oats', 'date'], price: 7, sizeAmount: 6, unit: 'bars', photo: 'Y-VDI9vQS3M', bagTypes: ['mom', 'study', 'work'], bagFit: 'regular' }),
  p({ id: 'mo-bites', brand: 'Orchard Row', name: 'Fruit and grain bites', category: 'Snacks', tags: ['snack', 'kids'], values: ['Vegan', 'Nut-free'], ingredients: ['apple', 'oats'], price: 5, sizeAmount: 8, unit: 'ct', photo: 'o-Mih3lEPi0', bagTypes: ['mom'], bagFit: 'mini' }),
  p({ id: 'mo-balm', brand: 'Petal & Oat', name: 'Baby lotion and balm duo', category: 'Baby care', tags: ['baby', 'balm', 'skin'], values: ['Clean beauty', 'Fragrance-free'], ingredients: ['zinc oxide', 'shea'], price: 18, sizeAmount: 2, unit: 'ct', photo: 'r0w0IqYINNI', bagTypes: ['mom'], bagFit: 'regular' }),
  // Work and study
  p({ id: 'wk-notebook', brand: 'Petit Mot', name: 'Black linen notebook and pen', category: 'Books and stationery', tags: ['work', 'writing'], values: [], ingredients: [], price: 26, sizeAmount: 1, unit: 'set', photo: '3MPxrUH6ZIM', bagTypes: ['work', 'study'], bagFit: 'regular' }),
  p({ id: 'wk-cup', brand: 'Clean Linen', name: 'Reusable coffee cup', category: 'Bottles and cups', tags: ['coffee', 'commute', 'work'], values: [], ingredients: [], price: 22, sizeAmount: 1, unit: 'ct', photo: 'aNZkCKhv_wE', bagTypes: ['work', 'study'], bagFit: 'regular' }),
  p({ id: 'wk-tote', brand: 'Atelier Noir', name: 'Structured leather tote', category: 'Bags and luggage', tags: ['work', 'bag', 'joy'], values: [], ingredients: [], price: 340, sizeAmount: 1, unit: 'ct', photo: '2_tjJJqsZms', bagTypes: ['work'], bagFit: 'large', sponsored: true }),
  p({ id: 'wk-planner', brand: 'Petit Mot', name: 'Weekly planner', category: 'Books and stationery', tags: ['work', 'study', 'writing'], values: [], ingredients: [], price: 28, sizeAmount: 1, unit: 'ct', photo: 'uRf4Yals3ew', bagTypes: ['work', 'study'], bagFit: 'regular' }),
  p({ id: 'st-highlighters', brand: 'Petit Mot', name: 'Pastel highlighters, set of 6', category: 'Books and stationery', tags: ['study', 'writing', 'joy'], values: [], ingredients: [], price: 12, sizeAmount: 6, unit: 'ct', photo: 'BJ6w75UwMf8', bagTypes: ['study'], bagFit: 'mini' }),
  p({ id: 'st-books', brand: 'Linen Press', name: 'Semester reading stack', category: 'Books and stationery', tags: ['study', 'books'], values: [], ingredients: [], price: 64, sizeAmount: 3, unit: 'ct', photo: '16HDTsj-t7w', bagTypes: ['study'], bagFit: 'large' }),
  // Little joys
  p({ id: 'jy-candle', brand: 'Orangerie', name: 'Fig and cedar candle', category: 'Home', tags: ['joy', 'home'], values: ['Vegan'], ingredients: [], price: 24, sizeAmount: 1, unit: 'ct', photo: 'uuQ-SLanlJg', bagTypes: [], bagFit: 'regular', sponsored: true }),
  p({ id: 'jy-clips', brand: 'Quiet Hour', name: 'Claw clips and scrunchie set', category: 'Accessories', tags: ['joy', 'hair'], values: [], ingredients: [], price: 18, sizeAmount: 3, unit: 'ct', photo: 'c1BuGGMVEkM', bagTypes: ['work', 'study', 'travel'], bagFit: 'mini' }),
];

export const productById = (id: string) => products.find((x) => x.id === id)!;
