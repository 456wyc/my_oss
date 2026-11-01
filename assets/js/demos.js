(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const t = (k, v) => (window.I18N ? window.I18N.t(k, v) : k);

  const tileHTML = (d) => {
    const banner = `linear-gradient(135deg, ${esc(d.accent[0])}, ${esc(d.accent[1])})`;
    const href = encodeURI(d.file);
    const tags = (d.tags || []).map((tg) => `<span class="lp-tag">${esc(tg)}</span>`).join('');
    return `<div class="lp-tile" data-text="${esc((d.title + ' ' + (d.category || '') + ' ' + (d.tags || []).join(' ')).toLowerCase())}">
      <a class="lp-main" href="${href}" target="_blank" rel="noreferrer">
        <span class="lp-icon" style="background:${banner}">${esc((d.title || '?')[0])}</span>
        <span class="lp-info">
          <span class="lp-title">${esc(d.title)}</span>
          <span class="lp-host">${esc(d.category || '')}</span>
          ${d.desc ? `<span class="lp-desc">${esc(d.desc)}</span>` : ''}
          ${tags ? `<span class="lp-tags">${tags}</span>` : ''}
        </span>
        <span class="lp-go">${esc(t('demos.play'))} <i aria-hidden="true">↗</i></span>
      </a>
    </div>`;
  };

  window.renderDemos = ({ grid, search, empty } = {}) => {
    const gridEl = $(grid);
    const searchEl = search ? $(search) : null;
    const emptyEl = empty ? $(empty) : null;
    const list = window.DEMOS || [];

    const render = (q = '') => {
      const kw = (q || '').trim().toLowerCase();
      const items = list.filter((d) =>
        !kw || ((d.title + ' ' + (d.category || '') + ' ' + (d.tags || []).join(' ')).toLowerCase().includes(kw))
      );
      gridEl.innerHTML = items.map(tileHTML).join('');
      if (emptyEl) emptyEl.hidden = items.length > 0;
    };

    if (searchEl) searchEl.addEventListener('input', (e) => render(e.target.value));
    render(searchEl ? searchEl.value : '');
  };
})();
