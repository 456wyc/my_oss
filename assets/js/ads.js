/* 「林间猎手 3D」结算页广告位：Adsterra 300×250 横幅（zone 6200725）。
   - 每关结束（过关 / 未达标）都展示；广告只作展示，不参与关卡解锁判断。
   - 原 Google AdSense 已全部停用：脚本、单元与 ads.txt 授权均已移除。
   - 广告代码放在同站独立页 assets/ads/banner.html，由 iframe 承载：
     Adsterra 的 format:'iframe' 脚本需要在 HTML 解析期执行（内部可能使用
     document.write），而结算面板是运行时用 innerHTML 动态生成的，直接插入
     会清空整个游戏页面。iframe 是真实同站 URL，referrer / 域名校验正常，
     且只在结算时按需请求广告。
   - 宽屏按原始 300×250 展示；窄屏按容器宽度等比缩小（完整可见、不裁切），
     横竖屏切换时重新计算。
   - 本地 / 局域网 / file:// 预览不请求广告，只显示占位文字；
     URL 加 ?adtest=1 可强制加载，便于本地验证广告能否填充。
   - 广告交互不进入 Clarity 录屏（data-clarity-mask）。 */
(function () {
  var WIDTH = 300, HEIGHT = 250;
  var host = location.hostname;
  var local = location.protocol === 'file:' || !host ||
    host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' ||
    host === '::1' || host === '[::1]' ||
    /^192\.168\./.test(host) || /^10\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    /^169\.254\./.test(host) || /^198\.18\./.test(host);
  if (/[?&]adtest=1(?:&|$)/.test(location.search)) local = false;

  var base = (document.currentScript && document.currentScript.src) || location.href;
  var FRAME_SRC = new URL('../ads/banner.html', base).href;
  var wrap = null, frame = null, slotNow = null;

  function placeholder(slot, text) {
    slot.textContent = text;
    slot.style.display = 'flex';
    slot.style.alignItems = 'center';
    slot.style.justifyContent = 'center';
    slot.style.color = 'rgba(255,248,230,.6)';
    slot.style.fontSize = '13px';
  }

  function fit() {
    if (!wrap || !slotNow) return;
    var avail = slotNow.clientWidth;
    var scale = avail > 0 ? Math.min(1, avail / WIDTH) : 1;
    wrap.style.width = (WIDTH * scale) + 'px';
    wrap.style.height = (HEIGHT * scale) + 'px';
    frame.style.transformOrigin = 'top left';
    frame.style.transform = 'scale(' + scale + ')';
  }

  window.showGameOverAd = function (slot) {
    if (!slot) return;
    slot.setAttribute('data-clarity-mask', '');
    if (local) { placeholder(slot, '广告位 · 本地预览不加载（URL 加 ?adtest=1 可强制加载）'); return; }
    slotNow = slot;
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.style.cssText = 'position:relative;margin:0 auto;overflow:hidden;flex:none';
      frame = document.createElement('iframe');
      frame.src = FRAME_SRC;
      frame.title = '广告';
      frame.width = String(WIDTH);
      frame.height = String(HEIGHT);
      frame.setAttribute('scrolling', 'no');
      frame.setAttribute('frameborder', '0');
      frame.style.cssText = 'display:block;width:' + WIDTH + 'px;height:' + HEIGHT + 'px;border:0;background:transparent';
      wrap.appendChild(frame);
    }
    slot.appendChild(wrap);
    fit();
  };

  window.addEventListener('resize', fit);
})();
