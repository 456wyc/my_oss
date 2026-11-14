/* 构建 Pages 产物：把源码复制到 dist/，并给所有本地静态资源加上
   基于文件内容的 ?v=<hash> 版本号（内容寻址）。
   内容一变 URL 就变，浏览器 / CDN 缓存自动失效，无需手动强刷。 */
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const NO_CACHE_META = '<meta http-equiv="Cache-Control" content="no-cache, must-revalidate, max-age=0" />';

const walk = async (dir, out = []) => {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) await walk(p, out);
    else out.push(p);
  }
  return out;
};
const keyOf = (abs) => relative(dist, abs).split(sep).join('/');
const shortHash = (buf) => createHash('sha256').update(buf).digest('hex').slice(0, 8);

// 每次都从干净源码重建，保证幂等（不会累积 ?v= 参数）
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

for (const dir of ['assets', 'data', 'demos']) {
  await cp(join(root, dir), join(dist, dir), { recursive: true });
}
for (const name of await readdir(root)) {
  if (name.endsWith('.html')) await cp(join(root, name), join(dist, name));
}
await writeFile(join(dist, '.nojekyll'), '');

const files = await walk(dist);

// 1) 计算所有 css / js / json 的内容 hash
const hashes = new Map();
for (const f of files) {
  if (['.css', '.js', '.json'].includes(extname(f).toLowerCase())) {
    hashes.set(keyOf(f), shortHash(await readFile(f)));
  }
}

// 2) 改写 HTML 里本地的 <script src> / <link href>，并注入 no-cache meta
const ASSET_RE = /(<(?:script|link)\b[^>]*?\b(?:src|href)\s*=\s*)(["'])([^"']+)\2/g;
const isLocal = (u) => !/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|mailto:)/i.test(u);

let rewritten = 0;
for (const f of files.filter((x) => x.toLowerCase().endsWith('.html'))) {
  let html = await readFile(f, 'utf8');

  html = html.replace(ASSET_RE, (all, pre, quote, url) => {
    if (!isLocal(url)) return all; // 外链 CDN / data: URI 原样保留
    const pathPart = url.split(/[?#]/)[0].replace(/^\/+/, '');
    let abs;
    try {
      abs = resolve(dirname(f), decodeURIComponent(pathPart));
    } catch {
      return all;
    }
    const v = hashes.get(keyOf(abs));
    if (!v) return all;
    rewritten++;
    return `${pre}${quote}${url}${url.includes('?') ? '&' : '?'}v=${v}${quote}`;
  });

  if (!/http-equiv=["']Cache-Control/i.test(html)) {
    html = html.replace(/<head([^>]*)>/i, `<head$1>\n${NO_CACHE_META}`);
  }
  await writeFile(f, html, 'utf8');
}

console.log(`✔ dist 已生成：${files.length} 个文件 / ${hashes.size} 个资源版本化 / ${rewritten} 处引用加了 ?v=`);
