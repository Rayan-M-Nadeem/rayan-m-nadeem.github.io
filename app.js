// ---- theme toggle (persists choice, defaults to system) ----
(function () {
  var toggle = document.querySelector('.theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      toggle.setAttribute('aria-label', next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }
})();

// ---- mobile menu ----
(function () {
  var btn = document.querySelector('.menu-btn');
  var links = document.querySelector('.nav-links');
  if (btn && links) {
    btn.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); });
    });
  }
})();

// ---- scroll reveal ----
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  items.forEach(function (el) { obs.observe(el); });
})();

// ---- reading progress ----
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var bar = document.querySelector('.progress');
  if (!bar) return;
  function update() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.width = max > 0 ? ((h.scrollTop / max) * 100) + '%' : '0%';
  }
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// ---- index traces draw when scrolled into view ----
(function () {
  var rows = document.querySelectorAll('.card');
  if (!rows.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    rows.forEach(function (r) { r.classList.add('seen'); });
    return;
  }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e, i) {
      if (e.isIntersecting) {
        var row = e.target;
        setTimeout(function () { row.classList.add('seen'); }, i * 110);
        obs.unobserve(row);
      }
    });
  }, { threshold: 0.3 });
  rows.forEach(function (r) { obs.observe(r); });
})();

// ---- panels: activate on view, sync the rail ----
(function () {
  var panels = Array.prototype.slice.call(document.querySelectorAll('.panel'));
  var railLinks = Array.prototype.slice.call(document.querySelectorAll('.rail a'));
  var rail = document.querySelector('.rail');
  if (!panels.length) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    panels.forEach(function (p) { p.classList.add('on'); });
    return;
  }

  var ticking = false;
  function update() {
    var vh = window.innerHeight;
    var mid = vh / 2;
    var best = null, bestDist = Infinity;

    panels.forEach(function (p) {
      var r = p.getBoundingClientRect();
      // activate once any meaningful part has entered the viewport
      if (r.top < vh * 0.88) p.classList.add('on');
      // nearest panel to viewport centre drives the rail
      var c = r.top + r.height / 2;
      var d = Math.abs(c - mid);
      if (r.bottom > 0 && r.top < vh && d < bestDist) { bestDist = d; best = p; }
    });

    if (best && railLinks.length) {
      var id = '#' + best.id;
      railLinks.forEach(function (x) { x.classList.toggle('on', x.getAttribute('href') === id); });
      if (rail) {
        var hue = getComputedStyle(best).getPropertyValue('--hue').trim();
        if (hue) rail.style.setProperty('--rail-hue', hue);
      }
    }
    ticking = false;
  }

  function onScroll() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
