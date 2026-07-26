// ============================================================
// Plainly Medicine — shared settings and navigation
// ============================================================

// ---- settings ----
(function () {
  var root = document.documentElement;

  var store = {
    get: function (key, fallback) {
      try { return localStorage.getItem(key) || fallback; }
      catch (error) { return fallback; }
    },
    set: function (key, value) {
      try { localStorage.setItem(key, value); }
      catch (error) {}
    }
  };

  var state = {
    theme: store.get('theme', 'system'),
    size: store.get('size', 'm'),
    width: store.get('width', 'default'),
    leading: store.get('leading', 'default'),
    articlefont: store.get('articlefont', 'sans'),
    contrast: store.get('contrast', 'off'),
    motion: store.get('motion', 'on'),
    underline: store.get('underline', 'off'),
    progress: store.get('progress', 'off'),
    toc: store.get('toc', 'off')
  };

  function applyTheme(mode) {
    var dark = mode === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : mode === 'dark';
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  function applySetting(key, value) {
    if (key === 'theme') {
      applyTheme(value);
    } else if (key === 'motion') {
      if (value === 'off') root.setAttribute('data-motion', 'off');
      else root.removeAttribute('data-motion');
    } else if (key === 'underline') {
      root.setAttribute('data-underline', value);
    } else {
      root.setAttribute('data-' + key, value);
    }

    document.dispatchEvent(new CustomEvent('pm:settingchange', {
      detail: { key: key, value: value }
    }));
  }

  Object.keys(state).forEach(function (key) {
    applySetting(key, state[key]);
  });

  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  if (systemTheme.addEventListener) {
    systemTheme.addEventListener('change', function () {
      if (state.theme === 'system') applyTheme('system');
    });
  }

  document.querySelectorAll('.seg').forEach(function (segment) {
    var key = segment.getAttribute('data-set');

    segment.querySelectorAll('button').forEach(function (button) {
      var value = button.getAttribute('data-val');
      button.setAttribute('aria-pressed', state[key] === value ? 'true' : 'false');

      button.addEventListener('click', function () {
        state[key] = value;
        store.set(key, value);

        segment.querySelectorAll('button').forEach(function (other) {
          other.setAttribute('aria-pressed', other === button ? 'true' : 'false');
        });

        applySetting(key, value);
      });
    });
  });

  document.querySelectorAll('.switch').forEach(function (toggle) {
    var key = toggle.getAttribute('data-set');
    var enabled = key === 'motion'
      ? state.motion === 'off'
      : state[key] === 'on';

    toggle.setAttribute('aria-pressed', enabled ? 'true' : 'false');

    toggle.addEventListener('click', function () {
      var next = toggle.getAttribute('aria-pressed') !== 'true';
      toggle.setAttribute('aria-pressed', next ? 'true' : 'false');

      if (key === 'motion') {
        state.motion = next ? 'off' : 'on';
        store.set('motion', state.motion);
        applySetting('motion', state.motion);
      } else {
        state[key] = next ? 'on' : 'off';
        store.set(key, state[key]);
        applySetting(key, state[key]);
      }
    });
  });
})();

// ---- dropdown menus ----
(function () {
  var triggers = Array.prototype.slice.call(document.querySelectorAll('.menu-trigger'));
  if (!triggers.length) return;

  function closeAll(except) {
    triggers.forEach(function (trigger) {
      var panel = document.getElementById('menu-' + trigger.getAttribute('data-menu'));
      if (panel && panel !== except) {
        panel.setAttribute('data-open', 'false');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  triggers.forEach(function (trigger) {
    var panel = document.getElementById('menu-' + trigger.getAttribute('data-menu'));
    if (!panel) return;

    trigger.addEventListener('click', function (event) {
      event.stopPropagation();
      var open = panel.getAttribute('data-open') === 'true';
      closeAll(panel);
      panel.setAttribute('data-open', open ? 'false' : 'true');
      trigger.setAttribute('aria-expanded', open ? 'false' : 'true');
    });

    panel.addEventListener('click', function (event) {
      event.stopPropagation();
    });
  });

  document.addEventListener('click', function () { closeAll(); });
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeAll();
  });
})();

// ---- mobile menu ----
(function () {
  var button = document.querySelector('.menu-btn');
  var links = document.querySelector('.nav-links');
  if (!button || !links) return;

  function close() {
    links.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
  }

  button.addEventListener('click', function (event) {
    event.stopPropagation();
    var open = links.classList.toggle('open');
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  links.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', close);
  });

  document.addEventListener('click', function (event) {
    if (
      links.classList.contains('open') &&
      !links.contains(event.target) &&
      !button.contains(event.target)
    ) close();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') close();
  });

  var desktop = window.matchMedia('(min-width: 761px)');
  if (desktop.addEventListener) {
    desktop.addEventListener('change', function (event) {
      if (event.matches) close();
    });
  }
})();

// ---- current page in the section menu ----
(function () {
  var current = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.dd-item[href]').forEach(function (link) {
    var href = (link.getAttribute('href') || '').split('#')[0];
    if (href === current) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
})();

// ---- reveal animation ----
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.getAttribute('data-motion') === 'off';
  var items = document.querySelectorAll('.reveal, .block');

  function activate(element) {
    element.classList.add('in');
    element.classList.add('on');
  }

  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(activate);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        activate(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -5% 0px' });

  items.forEach(function (element) { observer.observe(element); });

  window.addEventListener('load', function () {
    items.forEach(function (element) {
      if (element.getBoundingClientRect().top < window.innerHeight * 0.9) {
        activate(element);
      }
    });
  });
})();

// ---- optional reading progress ----
(function () {
  var article = document.querySelector('article.article');
  if (!article) return;

  var bar = document.createElement('div');
  bar.className = 'reading-progress';
  bar.setAttribute('aria-hidden', 'true');
  bar.innerHTML = '<span></span>';
  document.body.appendChild(bar);

  var fill = bar.firstElementChild;
  var scheduled = false;

  function update() {
    scheduled = false;

    var rect = article.getBoundingClientRect();
    var articleTop = window.scrollY + rect.top;
    var readable = Math.max(1, article.offsetHeight - window.innerHeight);
    var amount = Math.min(1, Math.max(0, (window.scrollY - articleTop) / readable));

    fill.style.transform = 'scaleX(' + amount + ')';
  }

  function requestUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  document.addEventListener('pm:settingchange', requestUpdate);
  update();
})();

// ---- optional generated article contents ----
(function () {
  var article = document.querySelector('article.article');
  var prose = article && article.querySelector('.prose');
  if (!article || !prose) return;

  var headings = Array.prototype.slice.call(prose.querySelectorAll('h2, h3'));
  if (!headings.length) return;

  function slugify(text) {
    return text.toLowerCase()
      .replace(/&[^;]+;/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section';
  }

  var used = {};
  headings.forEach(function (heading) {
    if (!heading.id) {
      var base = slugify(heading.textContent);
      var candidate = base;
      var count = 2;
      while (used[candidate] || document.getElementById(candidate)) {
        candidate = base + '-' + count++;
      }
      heading.id = candidate;
    }
    used[heading.id] = true;
  });

  var toc = document.createElement('nav');
  toc.className = 'article-toc';
  toc.setAttribute('aria-label', 'Article contents');

  var title = document.createElement('div');
  title.className = 'article-toc-title';
  title.textContent = 'In this article';
  toc.appendChild(title);

  var list = document.createElement('ol');

  headings.forEach(function (heading) {
    var item = document.createElement('li');
    if (heading.tagName === 'H3') item.className = 'subsection';

    var link = document.createElement('a');
    link.href = '#' + heading.id;
    link.textContent = heading.textContent;
    link.setAttribute('data-target', heading.id);

    item.appendChild(link);
    list.appendChild(item);
  });

  toc.appendChild(list);
  article.parentNode.insertBefore(toc, article);

  if ('IntersectionObserver' in window) {
    var links = Array.prototype.slice.call(toc.querySelectorAll('a'));
    var headingObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        links.forEach(function (link) {
          if (link.getAttribute('data-target') === entry.target.id) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-18% 0px -70% 0px', threshold: 0 });

    headings.forEach(function (heading) { headingObserver.observe(heading); });
  }
})();
