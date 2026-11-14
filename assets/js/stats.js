/* 站点访问统计（Microsoft Clarity）
   仅在正式域名加载：排除 localhost / 局域网 / file:// 等本地预览流量，避免污染线上数据。
   部署时整个仓库会作为 Pages 产物上传，见 .github/workflows/deploy.yml。
   自定义事件示例：clarity('event', 'open-demo', { name: 'hunter3d' }) */
(function () {
  var h = location.hostname;
  if (location.protocol === 'file:' || !h ||
      h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0' ||
      h === '::1' || h === '[::1]' ||
      /^192\.168\./.test(h) || /^10\./.test(h) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(h) ||
      /^169\.254\./.test(h) || /^198\.18\./.test(h)) return;

  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, 'clarity', 'script', 'zdmifnmnak');
})();
