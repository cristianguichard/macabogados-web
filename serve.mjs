#!/usr/bin/env node
/**
 * Servidor local del sitio (sin dependencias).
 *
 *   node serve.mjs          → http://localhost:8000
 *   node serve.mjs 8080     → otro puerto
 *
 * Reproduce el comportamiento de Cloudflare Pages:
 *   /                → index.html
 *   /karime          → karime.html   (URLs limpias, como en producción)
 *   /cae             → cae.html
 *   /cualquier-cosa  → 404.html con status 404
 */

import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname ?? new URL('.', import.meta.url).pathname);
const PORT = Number(process.argv[2] || process.env.PORT || 8000);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.pdf': 'application/pdf',
};

function resolvePath(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const rel = normalize(clean).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, rel);

  if (existsSync(file) && statSync(file).isDirectory()) {
    const withIndex = join(file, 'index.html');
    if (existsSync(withIndex)) return withIndex;
  }
  // Archivo tal cual
  if (existsSync(file) && statSync(file).isFile()) return file;
  // URL limpia: /karime → karime.html
  if (existsSync(file + '.html')) return file + '.html';
  // /karime/ → karime.html
  if (rel.endsWith('/')) {
    const trimmed = join(ROOT, rel.slice(0, -1));
    if (existsSync(trimmed + '.html')) return trimmed + '.html';
  }
  return null;
}

const server = createServer((req, res) => {
  const file = resolvePath(req.url || '/');
  const notFound = join(ROOT, '404.html');

  if (!file) {
    const target = existsSync(notFound) ? notFound : null;
    if (!target) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404');
      return;
    }
    res.writeHead(404, { 'Content-Type': MIME['.html'] });
    createReadStream(target).pipe(res);
    console.log(`404  ${req.url}`);
    return;
  }

  res.writeHead(200, {
    'Content-Type': MIME[extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  createReadStream(file).pipe(res);
  console.log(`200  ${req.url}  →  ${file.replace(ROOT, '')}`);
});

server.listen(PORT, () => {
  console.log(`\n  macabogados-web en http://localhost:${PORT}`);
  console.log(`  home          http://localhost:${PORT}/`);
  console.log(`  CAE           http://localhost:${PORT}/cae`);
  console.log(`  Karime        http://localhost:${PORT}/karime\n`);
});
