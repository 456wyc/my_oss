(function () {
  'use strict';

  const DATA = window.PROJECTS || { owner: {}, projects: [] };
  const projects = (DATA.projects || []).filter((p) => p.demoUrl);

  const $ = (sel) => document.querySelector(sel);
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------------- 主题 ---------------- */
  const themeBtn = $('#themeToggle');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  let theme = localStorage.getItem('oss-theme') || (prefersLight ? 'light' : 'dark');
  const applyTheme = () => {
    document.documentElement.dataset.theme = theme;
    themeBtn.textContent = theme === 'dark' ? '☾' : '☀';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0b0f1a' : '#f6f7fb');
  };
  applyTheme();
  themeBtn.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('oss-theme', theme);
    applyTheme();
  });

  $('#year').textContent = new Date().getFullYear();
  if (DATA.generatedAt) {
    $('#generatedAt').textContent = `数据更新于 ${new Date(DATA.generatedAt).toLocaleString('zh-CN')}`;
  }

  /* ---------------- 渲染 ---------------- */
  const grid = $('#lpGrid');
  const empty = $('#lpEmpty');

  const tileHTML = (p) => {
    const banner = `linear-gradient(135deg, ${esc(p.accent[0])}, ${esc(p.accent[1])})`;
    const title = p.demoTitle || p.name;
    const desc = p.demoDescription || p.description || '';
    return `<div class="lp-tile" data-name="${esc((title + ' ' + p.name + ' ' + desc + ' ' + (p.tags || []).join(' ')).toLowerCase())}">
      <a class="lp-main" href="${esc(p.demoUrl)}" target="_blank" rel="noreferrer">
        <span class="lp-icon" style="background:${banner}">${esc(p.name[0].toUpperCase())}</span>
        <span class="lp-info">
          <span class="lp-title">${esc(title)}</span>
          <span class="lp-host">
            <span class="lp-status"></span>${esc((p.demoUrl || '').replace(/^https?:\/\//, ''))}
          </span>
          ${desc ? `<span class="lp-desc">${esc(desc)}</span>` : ''}
        </span>
        <span class="lp-go">进入 <i aria-hidden="true">↗</i></span>
      </a>
      <a class="lp-gh" href="${esc(p.url)}" target="_blank" rel="noreferrer" aria-label="${esc(p.name)} 源码" title="查看源码">
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.4-3.88-1.4-.53-1.34-1.3-1.7-1.3-1.7-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.4-1.27.73-1.56-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12A11.5 11.5 0 0 0 12 .5Z"/></svg>
      </a>
    </div>`;
  };

  const render = (q = '') => {
    const kw = q.trim().toLowerCase();
    const list = projects.filter((p) => !kw || (p.name + ' ' + (p.demoTitle || '') + ' ' + (p.description || '') + ' ' + (p.tags || []).join(' ')).toLowerCase().includes(kw));
    grid.innerHTML = list.map(tileHTML).join('');
    empty.hidden = list.length > 0;
  };

  $('#lpSearch').addEventListener('input', (e) => render(e.target.value));
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== $('#lpSearch')) {
      e.preventDefault();
      $('#lpSearch').focus();
    }
  });

  $('#lpCount').textContent = projects.length;
  render();
})();
