#!/usr/bin/env node
/**
 * 从 GitHub 拉取仓库元数据，生成 data/projects.json 与 data/projects.js。
 * 优先使用 gh CLI（已登录即可）；否则回退到 GITHUB_TOKEN + REST API。
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const configPath = resolve(root, 'data/projects.config.json');
const config = JSON.parse(readFileSync(configPath, 'utf8'));
const owner = config.owner;

function viaGh(path) {
  const out = execFileSync('gh', ['api', path], {
    encoding: 'utf8',
    maxBuffer: 8 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  return JSON.parse(out);
}

async function viaFetch(path) {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) throw new Error('需要 gh CLI 登录或设置 GITHUB_TOKEN');
  const res = await fetch(`https://api.github.com/${path}`, {
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`${path} -> HTTP ${res.status}`);
  return res.json();
}

async function api(path, fallback = null) {
  try {
    return viaGh(path);
  } catch {
    try {
      return await viaFetch(path);
    } catch (err) {
      if (fallback !== null) return fallback;
      throw err;
    }
  }
}

const pct = (obj) => {
  const entries = Object.entries(obj || {});
  const total = entries.reduce((s, [, v]) => s + v, 0) || 1;
  return entries
    .map(([name, value]) => ({ name, value, percent: Math.round((value / total) * 1000) / 10 }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
};

/** 抓取 Pages 站点的 <title> 与 meta description，失败时静默降级 */
async function fetchDemoInfo(url) {
  if (!url) return {};
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    const res = await fetch(url, { signal: ctrl.signal, redirect: 'follow' });
    clearTimeout(timer);
    if (!res.ok) return {};
    const html = (await res.text()).slice(0, 200000);
    const decode = (s = '') =>
      s
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();
    const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
    const desc =
      html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i)?.[1] ||
      html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i)?.[1];
    return { demoTitle: title ? decode(title) : null, demoDescription: desc ? decode(desc) : null };
  } catch {
    return {};
  }
}

const profileRaw = await api(`users/${owner}`, {});
const profile = {
  login: profileRaw.login || owner,
  name: profileRaw.name || owner,
  bio: profileRaw.bio || '',
  avatarUrl: profileRaw.avatar_url || `https://github.com/${owner}.png`,
  htmlUrl: profileRaw.html_url || `https://github.com/${owner}`,
  publicRepos: profileRaw.public_repos ?? null,
  followers: profileRaw.followers ?? null,
};

const projects = [];
for (const item of config.repos) {
  const full = `${owner}/${item.repo}`;
  process.stdout.write(`· 拉取 ${full} ... `);
  const r = await api(`repos/${full}`);
  const langs = await api(`repos/${full}/languages`, {});
  const pages = await api(`repos/${full}/pages`, null);

  const demoUrl =
    (pages && pages.html_url) || r.homepage || `https://${owner}.github.io/${r.name}/`;
  const demoInfo = await fetchDemoInfo(demoUrl);

  projects.push({
    id: r.name.toLowerCase(),
    name: r.name,
    fullName: r.full_name,
    description: r.description || item.description || '',
    url: r.html_url,
    cloneUrl: r.clone_url,
    demoUrl: r.homepage || (pages && pages.html_url) || null,
    homepageHost: demoUrl ? new URL(demoUrl).host : null,
    demoTitle: demoInfo.demoTitle || null,
    demoDescription: demoInfo.demoDescription || null,
    language: r.language || item.language || (pct(langs)[0]?.name ?? null),
    languages: pct(langs),
    stars: r.stargazers_count ?? 0,
    forks: r.forks_count ?? 0,
    issues: r.open_issues_count ?? 0,
    watchers: r.subscribers_count ?? 0,
    license: r.license?.spdx_id || r.license?.name || null,
    topics: (r.topics || []).slice(),
    archived: !!r.archived,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    pushedAt: r.pushed_at,
    defaultBranch: r.default_branch || 'main',
    hasPages: !!pages,
    category: item.category || '其他',
    tags: item.tags || [],
    accent: item.accent || ['#6366f1', '#22d3ee'],
    highlights: item.highlights || [],
    featured: !!item.featured,
  });
  console.log(demoInfo.demoTitle ? `ok (站点：${demoInfo.demoTitle})` : 'ok');
}

const data = {
  generatedAt: new Date().toISOString(),
  owner: profile,
  projects,
};

writeFileSync(resolve(root, 'data/projects.json'), JSON.stringify(data, null, 2) + '\n', 'utf8');
writeFileSync(
  resolve(root, 'data/projects.js'),
  `/* 自动生成，请勿手改；执行 npm run sync 更新 */\nwindow.PROJECTS = ${JSON.stringify(data, null, 2)};\n`,
  'utf8'
);
console.log(`\n✔ 已生成 ${projects.length} 个项目 -> data/projects.json / data/projects.js`);
