/* AdSense 展示广告单元，仅用于「林间猎手 3D」的游戏结算面板。
   - 只在正式域名加载：本地 / 局域网 / file:// 预览完全不初始化，避免自己点到自家广告。
   - 单元在页面生命周期只 push 一次；结算面板重写 #card 时移动同一个 <ins> 节点，不重复请求广告。
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

  window.showGameOverAd = function () {};
  if (local) return;

  var CLIENT = 'ca-pub-7931165825358173';
  var SLOT = '4743319427';
  var box = null, pushed = false;

  var s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + CLIENT;
  document.head.appendChild(s);

  window.showGameOverAd = function (card) {
    if (!card) return;
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
      box.style.marginTop = '16px';
    }
    card.appendChild(box);
    if (pushed) return;
    pushed = true;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
  };
})();
