// ---- theme toggle (persists choice, defaults to system) ----
(function () {
  var toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    toggle.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  });
})();

// ---- mobile menu ----
(function () {
  var btn = document.querySelector('.menu-btn');
  var links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', function () {
    var open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ---- reveal + diagram drawing ----
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal, .block');

  function activate(el) {
    el.classList.add('in');
    el.classList.add('on');
  }
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(activate);
    return;
  }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { activate(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });
  items.forEach(function (el) { obs.observe(el); });

  // anything already past on load (deep link, reload mid-page)
  window.addEventListener('load', function () {
    items.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) activate(el);
    });
  });
})();
