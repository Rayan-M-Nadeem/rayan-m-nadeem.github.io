/* Plainly Medicine - interface behaviour
   Reader settings, contents rail, reading progress, glossary, menus. */

(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- stored reader preferences ---------- */
  var DEFAULTS = {
    theme: 'system', size: 'm', width: 'default', leading: 'default',
    font: 'sans', contrast: 'off', motion: 'off', underline: 'off'
  };
  var ATTR = {
    size: 'data-size', width: 'data-width', leading: 'data-leading',
    font: 'data-font', contrast: 'data-contrast', motion: 'data-motion',
    underline: 'data-underline'
  };
  var TOGGLES = { contrast: 1, motion: 1, underline: 1 };

  var store = {
    get: function (k) { try { return localStorage.getItem('pm:' + k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem('pm:' + k, v); } catch (e) {} },
    clear: function () {
      try {
        Object.keys(DEFAULTS).forEach(function (k) { localStorage.removeItem('pm:' + k); });
      } catch (e) {}
    }
  };

  var state = {};
  Object.keys(DEFAULTS).forEach(function (k) { state[k] = store.get(k) || DEFAULTS[k]; });

  function applyTheme() {
    var dark = state.theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : state.theme === 'dark';
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  function applyOne(key) {
    var attr = ATTR[key];
    if (!attr) return;
    var v = state[key];
    if (TOGGLES[key]) {
      if (key === 'motion') {
        if (v === 'on') root.setAttribute('data-motion', 'off');
        else root.removeAttribute('data-motion');
      } else if (v === 'on') {
        root.setAttribute(attr, 'on');
      } else {
        root.removeAttribute(attr);
      }
      return;
    }
    var isDefault = (v === 'default') || (key === 'size' && v === 'm') || (key === 'font' && v === 'sans');
    if (v && !isDefault) root.setAttribute(attr, v); else root.removeAttribute(attr);
  }

  function applyAll() {
    applyTheme();
    Object.keys(ATTR).forEach(applyOne);
  }
  applyAll();

  var mq = window.matchMedia('(prefers-color-scheme: dark)');
  if (mq.addEventListener) {
    mq.addEventListener('change', function () { if (state.theme === 'system') applyTheme(); });
  }

  function syncControls() {
    document.querySelectorAll('.seg').forEach(function (seg) {
      var key = seg.getAttribute('data-set');
      seg.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-pressed', state[key] === b.getAttribute('data-val') ? 'true' : 'false');
      });
    });
    document.querySelectorAll('.switch').forEach(function (sw) {
      sw.setAttribute('aria-pressed', state[sw.getAttribute('data-set')] === 'on' ? 'true' : 'false');
    });
  }

  document.querySelectorAll('.seg').forEach(function (seg) {
    var key = seg.getAttribute('data-set');
    seg.querySelectorAll('button').forEach(function (b) {
      b.addEventListener('click', function () {
        state[key] = b.getAttribute('data-val');
        store.set(key, state[key]);
        if (key === 'theme') applyTheme(); else applyOne(key);
        syncControls();
      });
    });
  });

  document.querySelectorAll('.switch').forEach(function (sw) {
    var key = sw.getAttribute('data-set');
    sw.addEventListener('click', function () {
      state[key] = state[key] === 'on' ? 'off' : 'on';
      store.set(key, state[key]);
      applyOne(key);
      syncControls();
    });
  });

  var resetBtn = document.getElementById('set-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      store.clear();
      Object.keys(DEFAULTS).forEach(function (k) { state[k] = DEFAULTS[k]; });
      applyAll();
      syncControls();
      resetBtn.textContent = 'Settings reset';
      setTimeout(function () { resetBtn.textContent = 'Reset all settings'; }, 1600);
    });
  }
  syncControls();

  /* ---------- dropdown menus ---------- */
  var triggers = Array.prototype.slice.call(document.querySelectorAll('.menu-trigger'));

  function panelFor(t) { return document.getElementById('menu-' + t.getAttribute('data-menu')); }

  function closeMenu(t, focusBack) {
    var p = panelFor(t);
    if (!p) return;
    p.setAttribute('data-open', 'false');
    t.setAttribute('aria-expanded', 'false');
    if (focusBack) t.focus();
  }

  function closeAll(except) {
    triggers.forEach(function (t) { if (t !== except) closeMenu(t, false); });
  }

  function openMenu(t) {
    var p = panelFor(t);
    if (!p) return;
    closeAll(t);
    p.setAttribute('data-open', 'true');
    t.setAttribute('aria-expanded', 'true');
  }

  triggers.forEach(function (t) {
    var p = panelFor(t);
    if (!p) return;
    t.addEventListener('click', function (e) {
      e.stopPropagation();
      if (p.getAttribute('data-open') === 'true') closeMenu(t, false); else openMenu(t);
    });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        openMenu(t);
        // the panel is visibility:hidden until the frame after it opens,
        // and a hidden element cannot take focus
        requestAnimationFrame(function () {
          var first = p.querySelector('a, button');
          if (first) first.focus();
        });
      }
    });
    p.addEventListener('click', function (e) { e.stopPropagation(); });
    p.addEventListener('keydown', function (e) {
      var items = Array.prototype.slice.call(p.querySelectorAll('a, button'));
      var i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); (items[i + 1] || items[0]).focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); (items[i - 1] || items[items.length - 1]).focus(); }
      else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); items[items.length - 1].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); closeMenu(t, true); }
      else if (e.key === 'Tab' && !e.shiftKey && i === items.length - 1) closeMenu(t, false);
    });
  });

  document.addEventListener('click', function () { closeAll(null); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = triggers.filter(function (t) { return t.getAttribute('aria-expanded') === 'true'; });
    if (open.length) { e.preventDefault(); open.forEach(function (t) { closeMenu(t, true); }); }
  });

  /* ---------- mobile menu ---------- */
  (function () {
    var btn = document.querySelector('.menu-btn');
    var links = document.querySelector('.nav-links');
    if (!btn || !links) return;

    function setOpen(open) {
      links.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (!open) closeAll(null);
    }
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      setOpen(!links.classList.contains('open'));
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('.menu-trigger') || e.target.closest('.dropdown')) { e.stopPropagation(); return; }
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('click', function () { setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('open')) { setOpen(false); btn.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 760) setOpen(false); });
  })();

  /* ---------- reading progress ---------- */
  (function () {
    var bar = document.querySelector('.progress-rail span');
    var article = document.querySelector('.article');
    if (!bar || !article) return;
    function update() {
      var start = article.offsetTop;
      var end = start + article.offsetHeight - window.innerHeight;
      var pct = end > start ? (window.scrollY - start) / (end - start) : 0;
      bar.style.width = Math.max(0, Math.min(1, pct)) * 100 + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();

  /* ---------- contents rail, built from the headings ---------- */
  (function () {
    var host = document.querySelector('.toc');
    var prose = document.querySelector('.prose');
    if (!host || !prose) return;
    var heads = Array.prototype.slice.call(prose.querySelectorAll('h2'));
    if (heads.length < 2) { host.remove(); return; }

    var body = document.createElement('div');
    body.className = 'toc-body';
    var ol = document.createElement('ol');

    heads.forEach(function (h, i) {
      if (!h.id) {
        var base = h.textContent.trim().toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 40);
        h.id = 'sec-' + (base || ('section-' + i));
      }
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.trim();
      var li = document.createElement('li');
      li.appendChild(a);
      ol.appendChild(li);

      var anchor = document.createElement('a');
      anchor.className = 'anchor';
      anchor.href = '#' + h.id;
      anchor.setAttribute('aria-label', 'Link to this section');
      anchor.textContent = '#';
      h.appendChild(anchor);
    });

    body.appendChild(ol);

    var words = prose.textContent.trim().split(/\s+/).length;
    var mins = Math.max(1, Math.round(words / 220));
    var meta = document.createElement('p');
    meta.className = 'toc-read';
    meta.textContent = mins + ' min read \u00b7 ' + words.toLocaleString() + ' words';
    body.appendChild(meta);

    var h2 = document.createElement('h2');
    h2.textContent = 'On this page';

    var toggle = document.createElement('button');
    toggle.className = 'toc-toggle';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = 'On this page <svg class="chev" width="11" height="7" viewBox="0 0 10 7" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M1 1.5L5 5.5L9 1.5"/></svg>';
    toggle.addEventListener('click', function () {
      var open = host.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    host.appendChild(toggle);
    host.appendChild(h2);
    host.appendChild(body);

    var links = Array.prototype.slice.call(ol.querySelectorAll('a'));
    function spy() {
      var best = 0;
      heads.forEach(function (h, i) { if (h.getBoundingClientRect().top <= 140) best = i; });
      links.forEach(function (a, i) { a.setAttribute('aria-current', i === best ? 'true' : 'false'); });
    }
    window.addEventListener('scroll', spy, { passive: true });
    spy();
  })();

  /* ---------- glossary ---------- */
  (function () {
    var TERMS = window.PM_GLOSSARY || {};
    var prose = document.querySelector('.prose');
    if (!prose || !Object.keys(TERMS).length) return;

    var names = Object.keys(TERMS).sort(function (a, b) { return b.length - a.length; });

    names.forEach(function (term) {
      var esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var re;
      try { re = new RegExp('(^|[^\\w-])(' + esc + ')($|[^\\w-])', 'i'); }
      catch (e) { return; }

      var walker = document.createTreeWalker(prose, NodeFilter.SHOW_TEXT, {
        acceptNode: function (n) {
          if (!n.nodeValue || !re.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
          var p = n.parentElement;
          while (p && p !== prose) {
            var tag = p.tagName.toLowerCase();
            if (tag === 'a' || tag === 'h2' || tag === 'h3' || tag === 'button'
                || p.classList.contains('refs') || p.classList.contains('callout')
                || p.classList.contains('ev-key')) return NodeFilter.FILTER_REJECT;
            p = p.parentElement;
          }
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      var node = walker.nextNode();
      if (!node) return;
      var m = re.exec(node.nodeValue);
      if (!m) return;

      var start = m.index + m[1].length;
      var after = node.splitText(start);
      after.splitText(m[2].length);

      var btn = document.createElement('button');
      btn.className = 'gloss';
      btn.type = 'button';
      btn.setAttribute('aria-expanded', 'false');
      btn.appendChild(document.createTextNode(after.nodeValue));
      var def = document.createElement('span');
      def.className = 'def';
      var strong = document.createElement('strong');
      strong.textContent = term;
      def.appendChild(strong);
      def.appendChild(document.createTextNode(TERMS[term]));
      btn.appendChild(def);
      after.parentNode.replaceChild(btn, after);
    });

    function closeGloss(except) {
      prose.querySelectorAll('.gloss[aria-expanded="true"]').forEach(function (g) {
        if (g !== except) g.setAttribute('aria-expanded', 'false');
      });
    }
    prose.addEventListener('click', function (e) {
      var g = e.target.closest ? e.target.closest('.gloss') : null;
      if (!g) { closeGloss(null); return; }
      e.stopPropagation();
      var open = g.getAttribute('aria-expanded') === 'true';
      closeGloss(g);
      g.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    prose.addEventListener('mouseover', function (e) {
      var g = e.target.closest ? e.target.closest('.gloss') : null;
      if (g) { closeGloss(g); g.setAttribute('aria-expanded', 'true'); }
    });
    prose.addEventListener('mouseout', function (e) {
      var g = e.target.closest ? e.target.closest('.gloss') : null;
      if (g && document.activeElement !== g) g.setAttribute('aria-expanded', 'false');
    });
    prose.addEventListener('focusin', function (e) {
      var g = e.target.closest ? e.target.closest('.gloss') : null;
      if (g) { closeGloss(g); g.setAttribute('aria-expanded', 'true'); }
    });
    document.addEventListener('click', function () { closeGloss(null); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeGloss(null); });
  })();

  /* ---------- copy link ---------- */
  (function () {
    var btn = document.getElementById('copy-link');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var url = location.href.split('#')[0];
      var label = btn.querySelector('span');
      function done(msg) {
        var old = label.getAttribute('data-label') || label.textContent;
        label.setAttribute('data-label', old);
        label.textContent = msg;
        setTimeout(function () { label.textContent = old; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { done('Link copied'); },
                                                function () { done('Copy failed'); });
      } else { done('Copy failed'); }
    });
  })();

  /* ---------- back to top ---------- */
  (function () {
    var b = document.querySelector('.to-top');
    if (!b) return;
    function update() { b.classList.toggle('show', window.scrollY > window.innerHeight); }
    window.addEventListener('scroll', update, { passive: true });
    b.addEventListener('click', function () {
      var reduce = root.getAttribute('data-motion') === 'off';
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      var first = document.querySelector('.nav a, .nav button');
      if (first) first.focus({ preventScroll: true });
    });
    update();
  })();

  /* ---------- reveal on scroll ---------- */
  (function () {
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
              || root.getAttribute('data-motion') === 'off';
    var items = document.querySelectorAll('.reveal, .block');
    function on(el) { el.classList.add('in'); el.classList.add('on'); }
    if (reduce || !('IntersectionObserver' in window)) {
      items.forEach(on);
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { on(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    items.forEach(function (el) { obs.observe(el); });
    window.addEventListener('load', function () {
      items.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight * 0.92) on(el);
      });
    });
  })();
})();
