(async () => {
  const main = document.getElementById('main');

  try {
    const urls = [
      './welcome.html?v=59',
      './content-0.html?v=59',
      './community.html?v=59',
      './community-qa-content.html?v=59',
      './content-1.html?v=59',
      './content-2.html?v=59',
      './content-3.html?v=59',
      './content-4.html?v=59',
      './content-5.html?v=59',
      './content-6.html?v=59',
      './content-7.html?v=59',
      './content-8.html?v=59',
      './content-9.html?v=59',
    ];
    const responses = await Promise.all(urls.map(url => fetch(url, { cache: 'no-store' })));
    const failed = responses.find(response => !response.ok);
    if (failed) throw new Error(`HTTP ${failed.status}`);
    main.innerHTML = (await Promise.all(responses.map(response => response.text()))).join('');
  } catch (error) {
    main.innerHTML = `<section class="section"><h2>\u6b63\u6587\u6ca1\u52a0\u8f7d\u51fa\u6765</h2><p>${String(error)}</p><p>\u5148\u5237\u65b0\u4e00\u6b21；\u8fd8\u4e0d\u884c，\u5c31\u6253\u5f00\u56fa\u5b9a\u7248\u672c\u9884\u89c8。</p></section>`;
    return;
  }

  const root = document.documentElement;
  const body = document.body;
  const progress = document.getElementById('progress');
  const backtop = document.getElementById('backtop');
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const overlay = document.getElementById('overlay');
  const sidebar = document.querySelector('.sidebar');
  const tocProgress = document.getElementById('tocProgress');
  const chapterGroups = [...document.querySelectorAll('.nav-chapter')];
  const releaseEntries = [...document.querySelectorAll('.release-entry')];
  const savedTheme = localStorage.getItem('tw-guide-theme');
  const systemLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  root.dataset.theme = savedTheme || (systemLight ? 'light' : 'dark');

  function updateThemeMeta() {
    document.querySelector('meta[name="theme-color"]').setAttribute('content', root.dataset.theme === 'dark' ? '#0b0d12' : '#f4f3ef');
    themeToggle.textContent = root.dataset.theme === 'dark' ? '☼' : '◐';
  }

  updateThemeMeta();
  themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('tw-guide-theme', root.dataset.theme);
    updateThemeMeta();
  });

  let navScrollY = 0;
  let navScrollHeight = 0;

  function setNav(open) {
    const wasOpen = body.classList.contains('nav-open');
    if (open === wasOpen) return;
    const activeBeforeOpen = open ? document.querySelector('.nav-link.active') : null;

    if (open) {
      navScrollY = window.scrollY;
      navScrollHeight = document.documentElement.scrollHeight;
      body.classList.add('nav-open');
      body.style.position = 'fixed';
      body.style.top = `-${navScrollY}px`;
      body.style.width = '100%';
    } else {
      body.classList.remove('nav-open');
    }

    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '×' : '☰';

    if (!open) {
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      window.scrollTo({ top: navScrollY, left: 0, behavior: 'auto' });
    }

    window.requestAnimationFrame(() => {
      if (open) {
        const activeAtFrozenScroll = getActiveEntryAt(navScrollY, navScrollHeight)?.link || activeBeforeOpen;
        setActiveLink(activeAtFrozenScroll);
        keepActiveLinkVisible(activeAtFrozenScroll);
      }
      else updateActiveNav();
    });
  }

  menuToggle.addEventListener('click', () => setNav(!body.classList.contains('nav-open')));
  overlay.addEventListener('click', () => setNav(false));
  chapterGroups.forEach(group => {
    group.addEventListener('toggle', () => {
      if (!group.open) return;
      chapterGroups.forEach(other => {
        if (other !== group) other.open = false;
      });
      window.requestAnimationFrame(() => {
        sidebar.scrollTo({
          top: Math.max(0, group.offsetTop - 82),
          behavior: 'smooth',
        });
      });
    });
  });
  releaseEntries.forEach(entry => {
    entry.addEventListener('toggle', () => {
      if (!entry.open) return;
      releaseEntries.forEach(other => {
        if (other !== entry) other.open = false;
      });
      window.requestAnimationFrame(requestActiveNavUpdate);
    });
  });

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
    backtop.classList.toggle('show', window.scrollY > 620);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  backtop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const navLinks = [...document.querySelectorAll('.nav-link')];
  const navAnchors = navLinks.map(link => {
    const id = decodeURIComponent(link.getAttribute('href').slice(1));
    return { link, target: document.getElementById(id) };
  }).filter(entry => entry.target);
  const documentOrderedAnchors = [...navAnchors].sort((a, b) => {
    if (a.target === b.target) return 0;
    const relation = a.target.compareDocumentPosition(b.target);
    return relation & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
  const navTotal = navAnchors.length;
  const tocHead = sidebar.querySelector('.toc-head');
  let currentActiveLink = null;
  let activeNavFrame = 0;

  function keepActiveLinkVisible(activeLink) {
    if (!activeLink || (window.innerWidth <= 940 && !body.classList.contains('nav-open'))) return;
    const sidebarRect = sidebar.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();
    const visibleTop = Math.max(sidebarRect.top, tocHead?.getBoundingClientRect().bottom || sidebarRect.top) + 10;
    const visibleBottom = sidebarRect.bottom - 12;
    let delta = 0;

    if (linkRect.top < visibleTop) delta = linkRect.top - visibleTop;
    else if (linkRect.bottom > visibleBottom) delta = linkRect.bottom - visibleBottom;
    if (!delta) return;

    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sidebar.scrollTo({
      top: Math.max(0, sidebar.scrollTop + delta),
      behavior: reducedMotion ? 'auto' : 'smooth',
    });
  }

  function setActiveLink(activeLink) {
    if (!activeLink) return;
    if (activeLink === currentActiveLink) {
      keepActiveLinkVisible(activeLink);
      return;
    }
    currentActiveLink = activeLink;
    navLinks.forEach(link => link.classList.toggle('active', link === activeLink));
    const activeChapter = activeLink.closest('.nav-chapter');
    chapterGroups.forEach(group => group.classList.toggle('contains-active', group === activeChapter));
    if (activeChapter && !activeChapter.open) activeChapter.open = true;
    const sectionNumber = activeLink.querySelector('span')?.textContent || '—';
    tocProgress.textContent = `${sectionNumber} / ${navTotal}`;
    window.requestAnimationFrame(() => keepActiveLinkVisible(activeLink));
  }

  function getActiveEntryAt(scrollTop, pageScrollHeight = document.documentElement.scrollHeight) {
    const headerHeight = Number.parseFloat(getComputedStyle(root).getPropertyValue('--header-h')) || 64;
    const activationLine = headerHeight + Math.min(128, window.innerHeight * 0.22);
    let activeEntry = documentOrderedAnchors[0];

    documentOrderedAnchors.forEach(entry => {
      const targetDocumentTop = entry.target.getBoundingClientRect().top + scrollTop;
      if (targetDocumentTop <= scrollTop + activationLine) activeEntry = entry;
    });

    if (scrollTop + window.innerHeight >= pageScrollHeight - 2) {
      activeEntry = documentOrderedAnchors.at(-1);
    }

    return activeEntry;
  }

  function updateActiveNav() {
    if (body.classList.contains('nav-open')) return;
    const activeEntry = getActiveEntryAt(window.scrollY);

    setActiveLink(activeEntry?.link);
  }

  function requestActiveNavUpdate() {
    if (activeNavFrame) return;
    activeNavFrame = window.requestAnimationFrame(() => {
      activeNavFrame = 0;
      updateActiveNav();
    });
  }

  navLinks.forEach(link => link.addEventListener('click', event => {
    const href = link.getAttribute('href');
    const target = document.getElementById(decodeURIComponent(href.slice(1)));
    if (!target) return;

    event.preventDefault();
    const navigate = () => {
      const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const releaseEntry = target.querySelector('.release-entry');
      if (releaseEntry && !releaseEntry.open) releaseEntry.open = true;
      history.pushState(null, '', href);
      setActiveLink(link);
      target.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' });
      window.setTimeout(requestActiveNavUpdate, reducedMotion ? 0 : 360);
    };

    if (body.classList.contains('nav-open')) {
      setNav(false);
      window.requestAnimationFrame(navigate);
    } else {
      navigate();
    }
  }));
  window.addEventListener('scroll', requestActiveNavUpdate, { passive: true });
  window.addEventListener('resize', requestActiveNavUpdate);
  window.addEventListener('load', requestActiveNavUpdate, { once: true });
  document.fonts?.ready.then(requestActiveNavUpdate);
  updateActiveNav();

  async function copyText(text, button) {
    try {
      await navigator.clipboard.writeText(text.trim());
      const before = button.textContent;
      button.textContent = '\u5df2\u590d\u5236';
      setTimeout(() => { button.textContent = before; }, 1400);
    } catch {
      const area = document.createElement('textarea');
      area.value = text.trim();
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
      button.textContent = '\u5df2\u590d\u5236';
      setTimeout(() => { button.textContent = '\u590d\u5236'; }, 1400);
    }
  }

  document.querySelectorAll('.code-block').forEach(block => {
    const button = block.querySelector('.copy-btn');
    if (button) button.addEventListener('click', () => copyText(block.querySelector('code').innerText, button));
  });

  document.querySelectorAll('[data-copy-target]').forEach(button => button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.copyTarget);
    copyText(target.querySelector('code').innerText, button);
  }));

  document.querySelectorAll('.qa-section').forEach(section => {
    const items = [...section.querySelectorAll('.qa-item')];
    section.querySelector('[data-qa-expand]').addEventListener('click', () => {
      items.forEach(item => { item.open = true; });
      requestActiveNavUpdate();
    });
    section.querySelector('[data-qa-collapse]').addEventListener('click', () => {
      items.forEach(item => { item.open = false; });
      requestActiveNavUpdate();
    });
    items.forEach(item => item.addEventListener('toggle', requestActiveNavUpdate));
  });

  function revealQuestionFromHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (target?.classList.contains('qa-item')) target.open = true;
  }
  window.addEventListener('hashchange', revealQuestionFromHash);
  revealQuestionFromHash();

  const choices = new Set();
  const recommendation = document.getElementById('recommendation');
  const choiceButtons = [...document.querySelectorAll('.choice-btn')];
  const recommendations = {
    codex: '<strong>\u53ef\u4ee5\u4ece Codex \u684c\u9762\u7aef\u8bd5\u8d77</strong><br><span class="muted">\u4f60\u503e\u5411\u4e8e\u7528\u81ea\u7136\u8bed\u8a00\u63cf\u8ff0\u9700\u6c42，\u518d\u67e5\u770b\u6539\u52a8\u548c\u7ed3\u679c。\u5148\u7528 TW \u505a\u4e00\u4e2a\u5c0f\u4efb\u52a1，\u770b\u770b\u8fd9\u79cd\u9879\u76ee\u7ba1\u7406\u65b9\u5f0f\u662f\u5426\u987a\u624b。</span>',
    claude: '<strong>\u53ef\u4ee5\u8bd5\u8bd5 Claude Code Desktop</strong><br><span class="muted">\u4f60\u7ecf\u5e38\u9700\u8981\u8fd0\u884c\u548c\u9884\u89c8\u524d\u7aef，\u53ef\u4ee5\u5148\u8bd5\u5b83\u7684\u6d4f\u89c8\u5668\u9762\u677f\u4e0e\u68c0\u67e5\u6d41\u7a0b。\u53ef\u7528\u80fd\u529b\u4ecd\u8981\u4ee5\u4f60\u7684\u7cfb\u7edf、\u7248\u672c\u548c\u6743\u9650\u4e3a\u51c6。</span>',
    opencode: '<strong>\u53ef\u4ee5\u4e86\u89e3 OpenCode</strong><br><span class="muted">\u4f60\u613f\u610f\u67e5\u770b\u4ee3\u7801，\u4e5f\u60f3\u81ea\u5df1\u914d\u7f6e\u4f9b\u5e94\u5546\u548c\u6a21\u578b。\u5148\u63a5\u5165\u5f53\u524d\u73af\u5883\u53ef\u7528\u7684 API，\u518d\u7528\u4e00\u9879\u771f\u5b9e\u4efb\u52a1\u786e\u8ba4\u5de5\u5177\u8c03\u7528\u662f\u5426\u6b63\u5e38。</span>',
    cli: '<strong>\u53ef\u4ee5\u8003\u8651 Agent CLI（\u8fdb\u9636\u8def\u5f84）</strong><br><span class="muted">\u4f60\u9700\u8981\u811a\u672c、\u670d\u52a1\u5668\u6216\u81ea\u52a8\u5316\u5de5\u4f5c\u6d41，\u53ef\u4ee5\u9010\u6b65\u5b66\u4e60\u547d\u4ee4\u884c。\u5148\u719f\u6089\u76ee\u5f55、\u6743\u9650\u4e0e\u73af\u5883\u914d\u7f6e，\u518d\u63a5\u5165\u6b63\u5f0f\u4efb\u52a1。</span>',
  };

  function calculateRecommendation() {
    if (!choices.size) {
      recommendation.textContent = '\u9009\u62e9\u4f60\u7684\u5de5\u4f5c\u65b9\u5f0f\u540e，\u8fd9\u91cc\u4f1a\u7ed9\u51fa\u63a8\u8350。';
      return;
    }
    if (choices.has('automation')) recommendation.innerHTML = recommendations.cli;
    else if (choices.has('manual')) recommendation.innerHTML = recommendations.opencode;
    else if (choices.has('preview')) recommendation.innerHTML = recommendations.claude;
    else recommendation.innerHTML = recommendations.codex;
  }

  choiceButtons.forEach(button => button.addEventListener('click', () => {
    const key = button.dataset.choice;
    const pressed = button.getAttribute('aria-pressed') === 'true';
    button.setAttribute('aria-pressed', String(!pressed));
    pressed ? choices.delete(key) : choices.add(key);
    calculateRecommendation();
  }));

  if (location.hash) {
    window.requestAnimationFrame(() => {
      const hash = decodeURIComponent(location.hash.slice(1));
      const target = document.getElementById(hash);
      const targetLink = navLinks.find(link => link.getAttribute('href') === `#${hash}`);
      const targetChapter = targetLink?.closest('.nav-chapter');
      if (targetChapter) targetChapter.open = true;
      setActiveLink(targetLink);
      const previousScrollBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = 'auto';
      target?.scrollIntoView();
      window.requestAnimationFrame(() => {
        root.style.scrollBehavior = previousScrollBehavior;
      });
    });
  }
})();
