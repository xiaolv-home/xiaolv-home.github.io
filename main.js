(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.getElementById('motion-toggle');
  let motionOff = reduced.matches;
  const applyMotion = () => {
    root.classList.toggle('motion-off', motionOff);
    toggle.setAttribute('aria-pressed', String(motionOff));
    toggle.textContent = `动效：${motionOff ? '关闭' : '开启'}`;
  };
  applyMotion();
  toggle.addEventListener('click', () => { motionOff = !motionOff; applyMotion(); });
  reduced.addEventListener('change', event => { motionOff = event.matches; applyMotion(); });

  if ('IntersectionObserver' in window) {
    root.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.07, rootMargin: '0px 0px 10px 0px' });
    document.querySelectorAll('.reveal').forEach(section => observer.observe(section));
  }
  const progress = document.querySelector('.reading-progress');
  let frame = 0;
  const updateProgress = () => {
    const range = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${range > 0 ? Math.min(1, scrollY / range) : 0})`;
    frame = 0;
  };
  addEventListener('scroll', () => { if (!frame) frame = requestAnimationFrame(updateProgress); }, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();

  const reports = {
    levels: {name:'三级报表'},
    performance: {name:'战区经理绩效'},
    monthly: {name:'总经理月会'}
  };
  const tabs = Array.from(document.querySelectorAll('[data-report]'));
  const panel = document.getElementById('report-panel');
  const frames = Array.from(document.querySelectorAll('[data-view]'));
  function selectReport(tab) {
    const key = tab.dataset.report;
    const report = reports[key];
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    document.getElementById('demo-title').textContent = report.name;
    panel.setAttribute('aria-labelledby', tab.id);
    frames.forEach(frame => {
      frame.hidden = frame.dataset.view !== key;
      if (!frame.hidden && !frame.getAttribute('src')) frame.src = `demo/index.html?view=${key}&v=interactive-1`;
    });
  }
  const expandReport = document.getElementById('report-expand');
  function setExpanded(expanded) {
    panel.classList.toggle('is-expanded', expanded);
    expandReport.setAttribute('aria-expanded', String(expanded));
    expandReport.textContent = expanded ? '收起 ×' : '展开 ↗';
    document.body.classList.toggle('report-expanded', expanded);
    if (!expanded) expandReport.focus({preventScroll:true});
  }
  expandReport.addEventListener('click', () => setExpanded(!panel.classList.contains('is-expanded')));
  addEventListener('keydown', event => { if (event.key === 'Escape' && panel.classList.contains('is-expanded')) setExpanded(false); });
  addEventListener('message', event => {
    if (event.origin === location.origin && frames.some(frame => frame.contentWindow === event.source) && event.data === 'demo:escape') setExpanded(false);
  });
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectReport(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault(); tabs[next].focus(); selectReport(tabs[next]);
    });
  });
  const dialog = document.getElementById('image-dialog');
  document.querySelectorAll('[data-lightbox]').forEach(button => {
    button.addEventListener('click', () => {
      const image = document.getElementById('dialog-image');
      image.src = button.dataset.lightbox;
      image.alt = button.dataset.caption;
      document.getElementById('dialog-caption').textContent = button.dataset.caption;
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    });
  });
  document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = ''; });
  selectReport(tabs[0], false);
})();
