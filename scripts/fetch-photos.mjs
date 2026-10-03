// Downloads every photo the app references into public/photos/<id>.jpg.
// Usage: npm run photos   then build with EXPO_PUBLIC_PHOTO_BASE=/photos
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';

const ids = new Set();
for (const f of ['src/data/products.ts', 'src/data/photos.ts', 'src/data/community.ts']) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/(?:photo|photos?|cover|avatar|[a-zA-Z]+):\s*'([A-Za-z0-9_-]{11})'/g)) ids.add(m[1]);
}
mkdirSync('public/photos', { recursive: true });
let ok = 0;
for (const id of ids) {
  const out = `public/photos/${id}.jpg`;
  if (existsSync(out)) { ok++; continue; }
  try {
    const res = await fetch(`https://unsplash.com/photos/${id}/download?w=1200`, { redirect: 'follow' });
    if (!res.ok) throw new Error(String(res.status));
    writeFileSync(out, Buffer.from(await res.arrayBuffer()));
    ok++; console.log('saved', id);
  } catch (e) { console.warn('failed', id, e.message); }
}
console.log(`${ok}/${ids.size} photos in public/photos`);
