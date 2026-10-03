import { Post } from './types';
import { portraits, scenes } from './photos';

/** Community "What's in my bag" posts. Photos are real Unsplash photographs. */
export const posts: Post[] = [
  {
    id: 'c-lisbon', bagType: 'travel', title: 'Ten days in Lisbon, one carry-on',
    caption: 'I promised myself no checked bag this year. Everything here fit with room for pastéis on the way home. The neck pillow is non-negotiable.',
    author: { name: 'Inès', role: 'Flies twice a month for work', avatar: portraits.ines },
    photos: [scenes.travelFlatlay, scenes.travel, scenes.passports],
    productIds: ['tr-carryon', 'tr-passport', 'tr-pillow', 'tr-sunduo', 'tr-earbuds', 'tr-sunglasses', 'tr-lipbalm', 'jy-clips', 'mo-bars'],
    helpful: 412, when: '2 days ago',
    notes: [
      { name: 'Hana', text: 'Copied this whole list for Porto. Thank you, it took me five minutes.' },
      { name: 'Zoe', text: 'The SPF tip saved me. Mine was expired and I had no idea.' },
    ],
  },
  {
    id: 'c-office', bagType: 'work', title: 'My nine-to-six tote',
    caption: 'Laptop, a real notebook, and enough snacks to survive the 4pm slump. Coffee cup lives in the side pocket.',
    author: { name: 'Priya', role: 'Product lead, three office days a week', avatar: portraits.priya },
    photos: [scenes.work, scenes.workDesk, scenes.workTote],
    productIds: ['wk-tote', 'wk-notebook', 'wk-cup', 'tr-earbuds', 'wk-planner', 'mo-bars', 'tr-lipbalm', 'mk-handcream'],
    helpful: 288, when: '5 hours ago',
    notes: [{ name: 'Lena', text: 'The hand cream set is such a good desk-drawer treat.' }],
  },
  {
    id: 'c-face', bagType: 'makeup', title: 'The five-minute face, in one pouch',
    caption: 'Powder, one palette, mascara and a lipstick that works on cheeks too. Everything vegan, everything travels.',
    author: { name: 'Camille', role: 'Makeup artist, mum of one', avatar: portraits.camille },
    photos: [scenes.makeup, scenes.makeupBrushes],
    productIds: ['mk-pouch', 'mk-powder', 'mk-palette-brush', 'mk-mascara', 'mk-lipstick', 'mk-brushes', 'mk-serum'],
    helpful: 951, when: '1 day ago',
    notes: [
      { name: 'Amara', text: 'Lipstick as blush is a game changer, thank you!' },
      { name: 'Sofia', text: 'Saved. My pouch is a mess and this is the reset I needed.' },
    ],
  },
  {
    id: 'c-toddler', bagType: 'mom', title: 'Diaper bag for a busy toddler',
    caption: 'Fourteen months and on the move. I keep it light: one outfit, two snacks, and the pacifier on a clip. Restock Sunday nights.',
    author: { name: 'Amara', role: 'Mum of a 14-month-old', avatar: portraits.amara },
    photos: [scenes.mom, scenes.momFeeding],
    productIds: ['mo-diapers', 'mo-wipes', 'mo-bottle', 'mo-pacifier', 'mo-onesie', 'mo-bars', 'mo-bites', 'mo-balm', 'tr-sanitizer'],
    helpful: 1203, when: '3 days ago',
    notes: [
      { name: 'Maya', text: 'Imported this as my starting point. The snack list is so helpful for a nut-free nursery.' },
      { name: 'Inès', text: 'Sending this to my sister. She is due in May.' },
    ],
  },
  {
    id: 'c-library', bagType: 'study', title: 'Library day, packed the night before',
    caption: 'Finals season. Everything I need for a ten-hour day, and headphones that actually block out the coffee machine.',
    author: { name: 'Zoe', role: 'Second-year law student', avatar: portraits.zoe },
    photos: [scenes.study, scenes.studyNotes, scenes.studyBooks],
    productIds: ['st-books', 'st-highlighters', 'wk-planner', 'tr-headphones', 'tr-bottle', 'mo-bars', 'jy-clips'],
    helpful: 377, when: '6 days ago',
    notes: [{ name: 'Priya', text: 'Pastel highlighters forever. Good luck with finals!' }],
  },
  {
    id: 'c-beach', bagType: 'travel', title: 'Long weekend by the sea',
    caption: 'Three nights, one tote. Sun care is doing all the heavy lifting here.',
    author: { name: 'Hana', role: 'Weekend traveller', avatar: portraits.hana },
    photos: [scenes.beachFlatlay, scenes.travelPacked],
    productIds: ['tr-sunduo', 'tr-sunglasses', 'tr-bottle', 'tr-lipbalm', 'jy-clips', 'tr-earbuds'],
    helpful: 164, when: '1 week ago',
    notes: [{ name: 'Camille', text: 'Love how little you need. Inspiring!' }],
  },
  {
    id: 'c-handbag', bagType: 'work', title: 'Everyday handbag, edited',
    caption: 'I cleared out eleven receipts and three lip balms. This is what stayed.',
    author: { name: 'Lena', role: 'Architect, walks to work', avatar: portraits.lena },
    photos: [scenes.welcome, scenes.passportCoffee],
    productIds: ['tr-sunglasses', 'wk-notebook', 'tr-lipbalm', 'mk-handcream', 'tr-earbuds', 'jy-clips'],
    helpful: 233, when: '2 weeks ago',
    notes: [{ name: 'Zoe', text: 'Eleven receipts is so real.' }],
  },
  {
    id: 'c-nails', bagType: 'makeup', title: 'Sunday nail night kit',
    caption: 'A little pouch that turns Sunday evening into a ritual. Earthy shades for autumn.',
    author: { name: 'Hana', role: 'Loves a Sunday ritual', avatar: portraits.hana },
    photos: ['MXz_6BkMogs', 'FqpSyjCdccw'],
    productIds: ['mk-pouch', 'mk-nail-trio', 'mk-nail', 'mk-handcream', 'jy-candle'],
    helpful: 142, when: '4 days ago',
    notes: [],
  },
];
