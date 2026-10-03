import { BagType } from './types';

/**
 * Real photographs from Unsplash (free under the Unsplash License), referenced by photo id.
 * By default they load straight from Unsplash. Run `npm run photos` to download them into
 * /public/photos and set EXPO_PUBLIC_PHOTO_BASE=/photos to serve them from the app instead.
 */
const LOCAL = process.env.EXPO_PUBLIC_PHOTO_BASE;

export function photoUrl(id: string, width = 800): string {
  if (LOCAL) return `${LOCAL}/${id}.jpg`;
  return `https://unsplash.com/photos/${id}/download?w=${width}`;
}

/** Lifestyle and editorial photos used outside product tiles. */
export const scenes = {
  welcome: 'tcVH_BwHtrc', // a single brown leather handbag on white
  handbagFlatlay: 'bEXzWNIwCyw',
  travel: 'CrnALaUMSA4', // travel essentials flat lay
  beachFlatlay: 'CL7vUhACCZ8',
  travelPacked: 'clK5ZFcovc8',
  passports: 'gMJ3tFOLvnA',
  passportCoffee: '1cB1ie1SoDo',
  makeup: 'K4vGUuX1jtQ', // assorted cosmetics
  makeupBrushes: 'Cr3y73c4j4Q',
  mom: 'fdPlZXc-ZwU', // onesie, socks and toys flat lay
  momFeeding: 'TCYj_UxoIUY',
  work: 'H29h6a8j8QM', // laptop, coffee, book, watch
  workDesk: 'Z5JJifMtbCo',
  workTote: 'jKoRZkv2o0U',
  study: 'BJ6w75UwMf8', // planner with highlighters
  studyBooks: 'BJlqwHQSguw',
  studyNotes: 'CGaQ5V1ynX0',
} as const;

export const bagCover: Record<BagType, string> = {
  travel: scenes.travel, makeup: scenes.makeup, mom: scenes.mom, work: scenes.work, study: scenes.study,
};

export const portraits = {
  ines: 'Ux_szkSExrs', priya: '8VghbLlZUdQ', camille: 'D_nNuNsqExM', hana: 'RnHhR_sip7M',
  zoe: '26GffjN9B0o', amara: 'zmzb1gU1DS4', lena: 'jkHvG-JYhGU',
} as const;

/** Every photo id the app uses, for the download script. */
export function allPhotoIds(productPhotos: string[]): string[] {
  return [...new Set([...productPhotos, ...Object.values(scenes), ...Object.values(portraits)])];
}
