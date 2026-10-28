(function () {
  'use strict';

  const DATA = window.PROJECTS || { owner: {}, projects: [] };
  const owner = DATA.owner || {};
  const projects = (DATA.projects || []).slice();

  const $ = (sel) => document.querySelector(sel);
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const LANG_COLORS = {
    TypeScript: '#3178c6', JavaScript: '#f1e05a', Python: '#3572a5', CSS: '#563d7c',
    HTML: '#e34c26', Shell: '#89e051', Batchfile: '#c1f12e', Vue: '#41b883', Go: '#00add8',
    Rust: '#dea584', Java: '#b07219', Kotlin: '#a97bff', Swift: '#f05138', 'C++': '#f34b7d',
    'C#': '#178600', C: '#555555', Dart: '#00b4ab', Ruby: '#701516', PHP: '#4f5d95',
    SCSS: '#c6538c', Lua: '#000080', Zig: '#ec915c', Other: '#8b949e',
  };
  const langColor = (n) => LANG_COLORS[n] || '#8b949e';

  const relTime = (iso) => {
    if (!iso) return '—';
    const diff = Date.now() - new Date(iso).getTime();
    const d = Math.floor(diff / 86400000);
    if (d < 1) return '今天';
    if (d < 30) return `${d} 天前`;
    if (d < 365) return `${Math.floor(d / 30)} 个月前`;
    return `${Math.floor(d / 365)} 年前`;
  };
  const fmtDate = (iso) => (iso ? new Date(iso).toLocaleDateString('zh-CN') : '—');
  const num = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n ?? 0));

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

  /* ---------------- Hero ---------------- */
  const mitCount = projects.filter((p) => p.license === 'MIT').length;
  const langSet = new Set(projects.map((p) => p.language).filter(Boolean));
  const liveCount = projects.filter((p) => p.hasPages || p.demoUrl).length;

  $('#heroStats').innerHTML = [
    [projects.length, '开源项目'],
    [liveCount, 'Pages 主页'],
    [langSet.size, '主力语言'],
    [mitCount, 'MIT 开源'],
  ].map(([v, l]) => `<div><div class="stat-value">${v}</div><div class="stat-label">${l}</div></div>`).join('');

  $('#heroPill').textContent = `${projects.length} 个开源项目 · 持续更新`;
  $('#cloneSample').textContent = `git clone ${(projects[0] || {}).cloneUrl || ''}`;

  // Hero 右侧「产品看板」模拟窗口
  $('#mockBody').innerHTML =
    '<div class="mock-title">项目主页</div>' +
    projects
      .slice(0, 5)
      .map(
        (p) => `<div class="mock-row">
        <i class="mini-dot" style="background:linear-gradient(135deg,${esc(p.accent[0])},${esc(p.accent[1])})"></i>
        <span class="mock-name">${esc(p.name)}</span>
        <span class="mock-meta">${esc(relTime(p.pushedAt))}</span>
      </div>`
      )
      .join('');

  // 页脚项目链接
  $('#footerProjects').innerHTML = projects
    .map((p) => `<li><a href="${esc(p.demoUrl || p.url)}" target="_blank" rel="noreferrer">${esc(p.name)}</a></li>`)
    .join('');

  /* ---------------- 产品切换 ---------------- */
  const scList = $('#scList');
  const scPanel = $('#scPanel');
  let activeId = projects[0] && projects[0].id;

  const renderShowcase = () => {
    scList.innerHTML = projects
      .map(
        (p) => `<button class="sc-item ${p.id === activeId ? 'active' : ''}" data-sc="${esc(p.id)}" type="button" role="tab">
        <i class="mini-dot" style="background:linear-gradient(135deg,${esc(p.accent[0])},${esc(p.accent[1])})"></i>
        <span class="sc-item-text">
          <span class="sc-item-name">${esc(p.name)}</span>
          <span class="sc-item-cat">${esc(p.category)}</span>
        </span>
      </button>`
      )
      .join('');

    const p = projects.find((x) => x.id === activeId) || projects[0];
    if (!p) return;
    const banner = `linear-gradient(135deg, ${esc(p.accent[0])}, ${esc(p.accent[1])})`;
    scPanel.innerHTML = `
      <div class="sc-visual" style="background:${banner}">
        <span class="sc-initial">${esc(p.name[0].toUpperCase())}</span>
        <span class="sc-host">${esc((p.demoUrl || '').replace(/^https?:\/\//, ''))}</span>
      </div>
      <div class="sc-info">
        <h3>${esc(p.demoTitle || p.name)}</h3>
        <p class="muted">${esc(p.description)}</p>
        <ul class="sc-points">
          ${(p.highlights || []).map((h) => `<li>${esc(h)}</li>`).join('')}
          ${p.language ? `<li>${esc(p.language)} · ${esc(p.license || '开源许可未声明')}</li>` : ''}
        </ul>
        <div class="sc-actions">
          ${p.demoUrl ? `<a class="btn primary" href="${esc(p.demoUrl)}" target="_blank" rel="noreferrer">打开项目主页 ↗</a>` : ''}
          <a class="btn ghost" href="${esc(p.url)}" target="_blank" rel="noreferrer">查看源码</a>
        </div>
      </div>`;
  };

  scList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-sc]');
    if (!btn) return;
    activeId = btn.dataset.sc;
    renderShowcase();
  });
  renderShowcase();

  $('#aboutAvatar').src = owner.avatarUrl || `https://github.com/${owner.login || '456wyc'}.png`;
  $('#aboutName').textContent = owner.name || owner.login || '关于我';
  $('#aboutBio').textContent =
    owner.bio || `${projects.length} 个开源项目的集中展示页，涵盖桌面应用、效率工具与 AI 实验。`;
  $('#aboutGithub').href = owner.htmlUrl || 'https://github.com/456wyc';
  $('#headerGithub').href = owner.htmlUrl || 'https://github.com/456wyc';
  $('#heroGithub').href = owner.htmlUrl || 'https://github.com/456wyc';
  $('#year').textContent = new Date().getFullYear();
  if (DATA.generatedAt) {
    $('#generatedAt').textContent = `数据更新于 ${new Date(DATA.generatedAt).toLocaleString('zh-CN')}`;
  }

  /* ---------------- 筛选状态 ---------------- */
  const state = { q: '', category: 'all', tag: 'all', sort: 'pushed' };

  const categories = ['all', ...new Set(projects.map((p) => p.category))];
  const tags = ['all', ...new Set(projects.flatMap((p) => p.tags || []))];

  const renderChips = (el, items, key, label) => {
    el.innerHTML = items
      .map((v) => {
        const text = v === 'all' ? label : v;
        return `<button class="chip ${state[key] === v ? 'active' : ''}" data-key="${key}" data-value="${esc(v)}" type="button">${esc(text)}</button>`;
      })
      .join('');
  };

  const bindChips = (el) => {
    el.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      state[chip.dataset.key] = chip.dataset.value;
      render();
    });
  };

  /* ---------------- 列表渲染 ---------------- */
  const grid = $('#grid');
  const empty = $('#empty');
  let observer = null;

  const visible = () => {
    const q = state.q.trim().toLowerCase();
    let list = projects.filter((p) => {
      if (state.category !== 'all' && p.category !== state.category) return false;
      if (state.tag !== 'all' && !(p.tags || []).includes(state.tag)) return false;
      if (!q) return true;
      return [p.name, p.description, p.category, (p.tags || []).join(' '), p.language]
        .join(' ')
        .toLowerCase()
        .includes(q);
    });
    const cmp = {
      pushed: (a, b) => new Date(b.pushedAt || 0) - new Date(a.pushedAt || 0),
      created: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      stars: (a, b) => (b.stars || 0) - (a.stars || 0),
      name: (a, b) => a.name.localeCompare(b.name),
    }[state.sort];
    return list.sort(cmp);
  };

  const cardHTML = (p) => {
    const banner = `linear-gradient(135deg, ${esc(p.accent[0])}, ${esc(p.accent[1])})`;
    const langs = (p.languages || []).slice(0, 4);
    return `<article class="card" data-id="${esc(p.id)}">
      <div class="card-banner" style="background:${banner}">
        <div class="card-initial" style="background:${banner}">${esc(p.name[0].toUpperCase())}</div>
        <div class="badges">
          ${p.featured ? '<span class="badge">精选</span>' : ''}
          ${p.archived ? '<span class="badge warn">已归档</span>' : ''}
        </div>
      </div>
      <div class="card-body">
        <div class="card-title-row">
          <h3 class="card-title"><a href="${esc(p.url)}" target="_blank" rel="noreferrer">${esc(p.name)}</a></h3>
          <span class="card-cat">${esc(p.category)}</span>
        </div>
        <p class="card-desc">${esc(p.description || '暂无描述')}</p>
        ${(p.highlights || []).length ? `<div class="highlights">${p.highlights.map((h) => `<span class="highlight">${esc(h)}</span>`).join('')}</div>` : ''}
        ${langs.length ? `<div class="langbar">${langs.map((l) => `<span style="width:${l.percent}%;background:${langColor(l.name)}" title="${esc(l.name)} ${l.percent}%"></span>`).join('')}</div>` : ''}
        <div class="card-tags">${(p.tags || []).slice(0, 4).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
        <div class="card-meta">
          ${p.language ? `<span><i class="mini-dot" style="background:${langColor(p.language)}"></i>${esc(p.language)}</span>` : ''}
          <span>★ ${num(p.stars)}</span>
          <span>⑂ ${num(p.forks)}</span>
          <span>🕒 ${esc(relTime(p.pushedAt))}</span>
        </div>
      </div>
      <div class="card-actions">
        ${p.demoUrl ? `<a class="btn primary" href="${esc(p.demoUrl)}" target="_blank" rel="noreferrer">项目主页 ↗</a>` : ''}
        <a class="btn ghost" href="${esc(p.url)}" target="_blank" rel="noreferrer">源码</a>
        <button class="btn ghost icon" type="button" data-detail="${esc(p.id)}" aria-label="详情">⋯</button>
      </div>
    </article>`;
  };

  const reveal = (nodes) => {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(
      (entries) => entries.forEach((en) => en.isIntersecting && (en.target.classList.add('in'), observer.unobserve(en.target))),
      { rootMargin: '0px 0px -40px 0px' }
    );
    nodes.forEach((n, i) => {
      n.style.transitionDelay = `${Math.min(i, 8) * 35}ms`;
      observer.observe(n);
    });
  };

  const render = () => {
    renderChips($('#categoryFilters'), categories, 'category', '全部分类');
    renderChips($('#tagFilters'), tags, 'tag', '全部标签');

    const list = visible();
    grid.innerHTML = list.map(cardHTML).join('');
    empty.hidden = list.length > 0;
    $('#resultCount').textContent = `共 ${list.length} 个项目`;
    reveal(Array.from(grid.children));
  };

  bindChips($('#categoryFilters'));
  bindChips($('#tagFilters'));
  $('#search').addEventListener('input', (e) => {
    state.q = e.target.value;
    render();
  });
  $('#sort').addEventListener('change', (e) => {
    state.sort = e.target.value;
    render();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== $('#search')) {
      e.preventDefault();
      $('#search').focus();
    }
    if (e.key === 'Escape') closeModal();
  });

  /* ---------------- 详情弹窗 ---------------- */
  const modal = $('#modal');
  const openModal = (p) => {
    $('#modalContent').innerHTML = `
      <div class="modal-head">
        <div class="modal-logo" style="background:linear-gradient(135deg,${esc(p.accent[0])},${esc(p.accent[1])})">${esc(p.name[0].toUpperCase())}</div>
        <div>
          <h3 id="modalTitle">${esc(p.name)}</h3>
          <div class="muted" style="font-size:13px">${esc(p.fullName)} · ${esc(p.category)}</div>
        </div>
      </div>
      <p class="modal-desc">${esc(p.description || '暂无描述')}</p>
      <div class="meta-grid">
        <div class="meta-cell"><div class="k">STARS</div><div class="v">${num(p.stars)}</div></div>
        <div class="meta-cell"><div class="k">FORKS</div><div class="v">${num(p.forks)}</div></div>
        <div class="meta-cell"><div class="k">ISSUES</div><div class="v">${num(p.issues)}</div></div>
        <div class="meta-cell"><div class="k">LICENSE</div><div class="v">${esc(p.license || '未声明')}</div></div>
        <div class="meta-cell"><div class="k">创建</div><div class="v">${fmtDate(p.createdAt)}</div></div>
        <div class="meta-cell"><div class="k">最近推送</div><div class="v">${esc(relTime(p.pushedAt))}</div></div>
      </div>
      ${(p.languages || []).length ? `<h4 style="margin:18px 0 10px">语言构成</h4>${p.languages.map((l) => `<div class="lang-row"><span class="lang-name">${esc(l.name)}</span><span class="lang-track"><span class="lang-fill" style="width:${l.percent}%;background:${langColor(l.name)}"></span></span><span class="lang-pct">${l.percent}%</span></div>`).join('')}` : ''}
      ${(p.tags || []).length ? `<div class="card-tags" style="margin-top:14px">${p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
      <div class="clone-box"><code>git clone ${esc(p.cloneUrl)}</code><button class="btn small ghost" type="button" data-copy="${esc(p.cloneUrl)}">复制</button></div>
      <div class="modal-actions">
        ${p.demoUrl ? `<a class="btn primary" href="${esc(p.demoUrl)}" target="_blank" rel="noreferrer">打开项目主页 ↗</a>` : ''}
        <a class="btn ghost" href="${esc(p.url)}" target="_blank" rel="noreferrer">GitHub 仓库</a>
        <a class="btn ghost" href="${esc(p.url)}/releases" target="_blank" rel="noreferrer">Releases</a>
      </div>`;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const closeModal = () => {
    modal.hidden = true;
    document.body.style.overflow = '';
  };
  modal.addEventListener('click', (e) => {
    if (e.target.closest('[data-close]')) closeModal();
  });
  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-detail]');
    if (!btn) return;
    const p = projects.find((x) => x.id === btn.dataset.detail);
    if (p) openModal(p);
  });

  /* ---------------- 复制 ---------------- */
  const toast = $('#toast');
  let toastTimer;
  const showToast = (msg) => {
    toast.textContent = msg;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (toast.hidden = true), 1800);
  };
  const copy = async (text, msg) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(msg || '已复制');
    } catch {
      showToast('复制失败，请手动选择');
    }
  };
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-copy]');
    if (btn) copy(btn.dataset.copy, '已复制 clone 命令');
  });
  $('#copyCloneAll').addEventListener('click', () =>
    copy(projects.map((p) => `${p.fullName}\t${p.url}`).join('\n'), `已复制 ${projects.length} 个仓库`)
  );

  render();
})();
