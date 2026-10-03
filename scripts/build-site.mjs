// After `expo export -p web`: keep the app at dist/app.html and put the marketing site at dist/index.html.
// Vercel serves real files first, so "/" is the website and every other path (/welcome, /home, …) is the app.
import { copyFileSync, existsSync, renameSync } from 'node:fs';

if (!existsSync('dist/index.html')) throw new Error('Run `npx expo export -p web` first');
renameSync('dist/index.html', 'dist/app.html');
copyFileSync('website/index.html', 'dist/index.html');
console.log('Website at dist/index.html, app at dist/app.html');
