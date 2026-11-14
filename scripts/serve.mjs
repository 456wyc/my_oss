import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// 默认服务源码；设 SERVE_ROOT=dist 可预览构建产物
const root = process.env.SERVE_ROOT
  ? resolve(process.env.SERVE_ROOT)
  : resolve(dirname(fileURLToPath(import.meta.url)), '..');
const port = Number(process.env.PORT || 4321);
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

// 开发/预览服务一律不缓存：改完文件刷新即生效（含 iframe 里的 demo）
const NO_CACHE = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'Pragma': 'no-cache',
  'Expires': '0',
};

createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let path = decodeURIComponent(url.pathname);
    if (path.endsWith('/')) path += 'index.html';
    const file = join(root, normalize(path).replace(/^(\.\.[/\\])+/, ''));
    const info = await stat(file).catch(() => null);
    if (!info || info.isDirectory()) throw new Error('404');
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream', ...NO_CACHE });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8', ...NO_CACHE });
    res.end('404 Not Found');
  }
}).listen(port, () => console.log(`➜  http://localhost:${port}  (root: ${root}, no-store)`));
