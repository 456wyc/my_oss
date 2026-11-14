(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const t = (k, v) => (window.I18N ? window.I18N.t(k, v) : k);

  const tileHTML = (d) => {
    const banner = `linear-gradient(135deg, ${esc(d.accent[0])}, ${esc(d.accent[1])})`;
    const href = `demo.html?d=${encodeURIComponent(d.id)}`;
    const tags = (d.tags || []).map((tg) => `<span class="lp-tag">${esc(tg)}</span>`).join('');
    return `<div class="lp-tile" data-text="${esc((d.title + ' ' + (d.category || '') + ' ' + (d.tags || []).join(' ')).toLowerCase())}">
      <a class="lp-main" href="${href}">
        <span class="lp-icon" style="background:${banner}">${esc((d.title || '?')[0])}</span>
        <span class="lp-info">
          <span class="lp-title">${esc(d.title)}</span>
          <span class="lp-host">${esc(d.category || '')}</span>
          ${d.desc ? `<span class="lp-desc">${esc(d.desc)}</span>` : ''}
          ${tags ? `<span class="lp-tags">${tags}</span>` : ''}
        </span>
        <span class="lp-go">${esc(t('demos.open'))} <i aria-hidden="true">→</i></span>
      </a>
    </div>`;
  };

  window.renderDemos = ({ grid, search, empty, count } = {}) => {
    const gridEl = $(grid);
    if (!gridEl) return;
    const searchEl = search ? $(search) : null;
    const emptyEl = empty ? $(empty) : null;
    const countEl = count ? $(count) : null;
    const list = window.DEMOS || [];

    const render = (q = '') => {
      const kw = (q || '').trim().toLowerCase();
      const items = list.filter((d) =>
        !kw || ((d.title + ' ' + (d.category || '') + ' ' + (d.tags || []).join(' ')).toLowerCase().includes(kw))
      );
      gridEl.innerHTML = items.map(tileHTML).join('');
      if (emptyEl) emptyEl.hidden = items.length > 0;
      if (countEl) countEl.textContent = t('demos.count', { n: items.length });
    };

    if (searchEl) searchEl.addEventListener('input', (e) => render(e.target.value));
    render(searchEl ? searchEl.value : '');
  };

  /* 仅 demos.html / demo.html 使用：这两页不加载 app.js，主题按钮需自行初始化 */
  window.initThemeToggle = () => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    let theme = localStorage.getItem('oss-theme') || (prefersLight ? 'light' : 'dark');
    const apply = () => {
      document.documentElement.dataset.theme = theme;
      btn.textContent = theme === 'dark' ? '☾' : '☀';
      const meta = document.querySelector('meta[name="theme-color"]');
      if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b0f1a' : '#f6f7fb');
    };
    apply();
    btn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('oss-theme', theme);
      apply();
    });
  };

  /* ---------- demo.html 查看器：外壳 + iframe + 全屏 ---------- */
  window.initDemoViewer = () => {
    const id = new URLSearchParams(location.search).get('d');
    const d = (window.DEMOS || []).find((x) => x.id === id);
    const frame = $('#demoFrame');
    const stage = $('#demoStage');
    const exitBtn = $('#demoExit');
    const missing = $('#demoMissing');

    if (!d) {
      missing.hidden = false;
      frame.remove();
      return;
    }

    document.title = `${d.title} · 456wyc`;

    // 独立 demo 是纯 HTML，最容易被浏览器/CDN 缓存；
    // 每次加载换一个 URL，保证看到的始终是最新改动。
    const reloadDemo = () => {
      const src = `${encodeURI(d.file)}?v=${Date.now()}`;
      frame.src = src;
      $('#demoNewTab').href = src;
    };
    reloadDemo();

    const reloadBtn = $('#demoReload');
    if (reloadBtn) reloadBtn.addEventListener('click', reloadDemo);
    const syncReloadLabel = () => {
      if (!reloadBtn) return;
      const s = t('demo.reload');
      reloadBtn.title = s;
      reloadBtn.setAttribute('aria-label', s);
    };
    syncReloadLabel();
    document.addEventListener('localechange', syncReloadLabel);

    const enterZen = () => {
      document.body.classList.add('zen');
      exitBtn.hidden = false;
    };
    const exitZen = () => {
      document.body.classList.remove('zen');
      exitBtn.hidden = true;
    };

    $('#demoFull').addEventListener('click', () => {
      document.body.classList.contains('zen') ? exitZen() : enterZen();
    });
    exitBtn.addEventListener('click', exitZen);
    const syncExitLabel = () => {
      const s = t('demo.exitFull');
      exitBtn.title = s;
      exitBtn.setAttribute('aria-label', s);
    };
    syncExitLabel();
    document.addEventListener('localechange', syncExitLabel);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('zen')) exitZen();
    });

    // ?full=1 直接以沉浸模式进入（隐藏导航栏）
    if (new URLSearchParams(location.search).has('full')) enterZen();
  };
})();
