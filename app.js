// ---- settings: theme, text size, motion, underline ----
(function () {
  var root = document.documentElement;
  var store = {
    get: function (k, d) { try { return localStorage.getItem(k) || d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  function applyTheme(mode) {
    var dark = mode === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : mode === 'dark';
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  var state = {
    theme: store.get('theme', 'system'),
    size: store.get('size', 'm'),
    motion: store.get('motion', 'on'),
    underline: store.get('underline', 'off')
  };

  applyTheme(state.theme);
  root.setAttribute('data-size', state.size);
  if (state.motion === 'off') root.setAttribute('data-motion', 'off');
  if (state.underline === 'on') root.setAttribute('data-underline', 'on');

  // follow the system if that's the choice
  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  if (mq.addEventListener) {
    mq.addEventListener('change', function () { if (state.theme === 'system') applyTheme('system'); });
  }

  // segmented controls
  document.querySelectorAll('.seg').forEach(function (seg) {
    var key = seg.getAttribute('data-set');
    seg.querySelectorAll('button').forEach(function (b) {
      var val = b.getAttribute('data-val');
      b.setAttribute('aria-pressed', state[key] === val ? 'true' : 'false');
      b.addEventListener('click', function () {
        state[key] = val; store.set(key, val);
        seg.querySelectorAll('button').forEach(function (o) {
          o.setAttribute('aria-pressed', o === b ? 'true' : 'false');
        });
        if (key === 'theme') applyTheme(val);
        if (key === 'size') root.setAttribute('data-size', val);
      });
    });
  });

  // switches
  document.querySelectorAll('.switch').forEach(function (sw) {
    var key = sw.getAttribute('data-set');
    var on = state[key] === 'on' || (key === 'motion' && state.motion === 'off');
    if (key === 'motion') on = state.motion === 'off';
    sw.setAttribute('aria-pressed', on ? 'true' : 'false');
    sw.addEventListener('click', function () {
      var next = sw.getAttribute('aria-pressed') !== 'true';
      sw.setAttribute('aria-pressed', next ? 'true' : 'false');
      if (key === 'motion') {
        state.motion = next ? 'off' : 'on'; store.set('motion', state.motion);
        if (next) root.setAttribute('data-motion', 'off'); else root.removeAttribute('data-motion');
      } else {
        state[key] = next ? 'on' : 'off'; store.set(key, state[key]);
        if (next) root.setAttribute('data-' + key, 'on'); else root.removeAttribute('data-' + key);
      }
    });
  });
})();

// ---- dropdown menus ----
(function () {
  var triggers = Array.prototype.slice.call(document.querySelectorAll('.menu-trigger'));
  if (!triggers.length) return;

  function closeAll(except) {
    triggers.forEach(function (t) {
      var panel = document.getElementById('menu-' + t.getAttribute('data-menu'));
      if (panel && panel !== except) {
        panel.setAttribute('data-open', 'false');
        t.setAttribute('aria-expanded', 'false');
      }
    });
  }

  triggers.forEach(function (t) {
    var panel = document.getElementById('menu-' + t.getAttribute('data-menu'));
    if (!panel) return;
    t.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = panel.getAttribute('data-open') === 'true';
      closeAll(panel);
      panel.setAttribute('data-open', open ? 'false' : 'true');
      t.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    panel.addEventListener('click', function (e) { e.stopPropagation(); });
  });

  document.addEventListener('click', function () { closeAll(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
})();

// ---- mobile menu ----
(function () {
  var btn = document.querySelector('.menu-btn');
  var links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', function (e) {
    e.stopPropagation();
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
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
            || document.documentElement.getAttribute('data-motion') === 'off';
  var items = document.querySelectorAll('.reveal, .block');

  function activate(el) { el.classList.add('in'); el.classList.add('on'); }

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

  window.addEventListener('load', function () {
    items.forEach(function (el) {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) activate(el);
    });
  });
})();
