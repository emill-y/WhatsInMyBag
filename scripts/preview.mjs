// Serves dist/ the same way Vercel does: files first, "/" is the website, everything else is the app.
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const root = 'dist';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.ico': 'image/x-icon' };
const port = Number(process.env.PORT || 3000);

createServer((req, res) => {
  const path = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = path === '/' ? 'index.html' : normalize(path).replace(/^([/\\])+/, '');
  let full = join(root, file);
  if (!full.startsWith(root) || !existsSync(full) || statSync(full).isDirectory()) full = join(root, 'app.html');
  res.writeHead(200, { 'Content-Type': types[extname(full)] || 'application/octet-stream' });
  res.end(readFileSync(full));
}).listen(port, () => console.log(`Website: http://localhost:${port}\nApp:     http://localhost:${port}/welcome`));
