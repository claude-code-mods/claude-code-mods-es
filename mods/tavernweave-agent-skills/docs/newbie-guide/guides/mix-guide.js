(async () => {
  const diagrams = [...document.querySelectorAll('.mermaid')];
  const sources = new Map(diagrams.map(element => [element, element.textContent]));

  function fallback(element) {
    element.replaceChildren();
    element.classList.add('diagram-fallback');
    const message = document.createElement('p');
    message.textContent = '\u6d41\u7a0b\u56fe\u6682\u65f6\u6ca1\u6709\u52a0\u8f7d\u51fa\u6765。\u53ef\u5148\u770b\u672c\u8282\u7d27\u968f\u5176\u540e\u7684\u6b65\u9aa4\u8868；\u4e0b\u9762\u4fdd\u7559\u6d41\u7a0b\u56fe\u6587\u5b57，\u8054\u7f51\u540e\u5237\u65b0\u53ef\u91cd\u8bd5。';
    const source = document.createElement('pre');
    source.textContent = sources.get(element);
    element.append(message, source);
  }

  function load(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      const timeout = setTimeout(() => { script.remove(); reject(new Error('Diagram library timeout')); }, 8000);
      script.onload = () => { clearTimeout(timeout); resolve(); };
      script.onerror = () => { clearTimeout(timeout); script.remove(); reject(new Error('Diagram library unavailable')); };
      document.head.append(script);
    });
  }

  for (const url of [
    'https://testingcf.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js',
    'https://fastly.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js',
  ]) {
    try { await load(url); if (window.mermaid) break; } catch { /* Try the alternate CDN. */ }
  }
  if (!window.mermaid) { diagrams.forEach(fallback); return; }
  window.mermaid.initialize({
    startOnLoad: false, securityLevel: 'strict', theme: 'base',
    themeVariables: { fontSize: '13.5px', primaryColor: '#eef5ff', primaryBorderColor: '#0969da', lineColor: '#57606a', fontFamily: '"Segoe UI","Microsoft YaHei",sans-serif' },
    flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis', nodeSpacing: 34, rankSpacing: 40 },
  });
  for (const element of diagrams) {
    element.tabIndex = 0;
    element.setAttribute('role', 'region');
    element.setAttribute('aria-label', '\u6d41\u7a0b\u56fe，\u7a84\u5c4f\u53ef\u5de6\u53f3\u6ed1\u52a8');
    try {
      await window.mermaid.run({ nodes: [element] });
      const svg = element.querySelector('svg');
      if (svg) svg.style.setProperty('--diagram-width', `${svg.viewBox.baseVal.width}px`);
    }
    catch { fallback(element); }
  }
})();
