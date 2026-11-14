/* AdSense 展示广告单元，仅在「林间猎手 3D」未达标结算时展示。
   广告只作展示，不参与关卡解锁判断（避免 AdSense 禁止的激励式流量）。
   - 只在正式域名加载；本地 / 局域网 / file:// 预览不加载广告脚本，
     但会在卡片里显示占位文字，便于本地预览结算卡片布局。
   - 单元在页面生命周期只 push 一次；结算面板重写时把同一个 <ins> 移到新的 #adslot，
     不重建单元、不重复请求广告。
   - 广告交互不进入 Clarity 录屏（data-clarity-mask）。
   - 发布商授权文件见仓库根目录 ads.txt。 */
(function () {
  var host = location.hostname;
  var local = location.protocol === 'file:' || !host ||
    host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0' ||
    host === '::1' || host === '[::1]' ||
    /^192\.168\./.test(host) || /^10\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    /^169\.254\./.test(host) || /^198\.18\./.test(host);

  if (local) {
    window.showGameOverAd = function (slot) {
      if (!slot) return;
      slot.textContent = '广告位 · 本地预览不加载';
      slot.style.display = 'flex';
      slot.style.alignItems = 'center';
      slot.style.justifyContent = 'center';
      slot.style.color = 'rgba(255,248,230,.6)';
      slot.style.fontSize = '13px';
    };
    return;
  }

  var CLIENT = 'ca-pub-7931165825358173';
  var SLOT = '4743319427';
  var box = null, pushed = false;

  var s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + CLIENT;
  document.head.appendChild(s);

  window.showGameOverAd = function (slot) {
    if (!slot) return;
    if (!box) {
      box = document.createElement('ins');
      box.className = 'adsbygoogle';
      box.setAttribute('data-ad-client', CLIENT);
      box.setAttribute('data-ad-slot', SLOT);
      box.setAttribute('data-ad-format', 'auto');
      box.setAttribute('data-full-width-responsive', 'true');
      box.setAttribute('data-clarity-mask', '');
      box.style.display = 'block';
      box.style.width = '100%';
    }
    slot.appendChild(box);
    if (pushed) return;
    pushed = true;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  };
})();
