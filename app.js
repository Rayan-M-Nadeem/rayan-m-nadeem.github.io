// ---- settings: theme, text size, motion, underline ----
(function () {
  var root = document.documentElement;
  var store = {get:function(k,d){try{return localStorage.getItem(k)||d}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}};
  function applyTheme(mode){var dark=mode==='system'?window.matchMedia('(prefers-color-scheme: dark)').matches:mode==='dark';root.setAttribute('data-theme',dark?'dark':'light')}
  var state={theme:store.get('theme','system'),size:store.get('size','m'),motion:store.get('motion','on'),underline:store.get('underline','off')};
  applyTheme(state.theme);root.setAttribute('data-size',state.size);if(state.motion==='off')root.setAttribute('data-motion','off');if(state.underline==='on')root.setAttribute('data-underline','on');
  var mq=window.matchMedia('(prefers-color-scheme: dark)');if(mq.addEventListener)mq.addEventListener('change',function(){if(state.theme==='system')applyTheme('system')});
  document.querySelectorAll('.seg').forEach(function(seg){var key=seg.getAttribute('data-set');seg.querySelectorAll('button').forEach(function(b){var val=b.getAttribute('data-val');b.setAttribute('aria-pressed',state[key]===val?'true':'false');b.addEventListener('click',function(){state[key]=val;store.set(key,val);seg.querySelectorAll('button').forEach(function(o){o.setAttribute('aria-pressed',o===b?'true':'false')});if(key==='theme')applyTheme(val);if(key==='size')root.setAttribute('data-size',val)})})});
  document.querySelectorAll('.switch').forEach(function(sw){var key=sw.getAttribute('data-set');var on=state[key]==='on'||(key==='motion'&&state.motion==='off');if(key==='motion')on=state.motion==='off';sw.setAttribute('aria-pressed',on?'true':'false');sw.addEventListener('click',function(){var next=sw.getAttribute('aria-pressed')!=='true';sw.setAttribute('aria-pressed',next?'true':'false');if(key==='motion'){state.motion=next?'off':'on';store.set('motion',state.motion);if(next)root.setAttribute('data-motion','off');else root.removeAttribute('data-motion')}else{state[key]=next?'on':'off';store.set(key,state[key]);if(next)root.setAttribute('data-'+key,'on');else root.removeAttribute('data-'+key)}})})
})();
// ---- dropdown menus ----
(function(){var triggers=Array.prototype.slice.call(document.querySelectorAll('.menu-trigger'));if(!triggers.length)return;function closeAll(except){triggers.forEach(function(t){var panel=document.getElementById('menu-'+t.getAttribute('data-menu'));if(panel&&panel!==except){panel.setAttribute('data-open','false');t.setAttribute('aria-expanded','false')}})}triggers.forEach(function(t){var panel=document.getElementById('menu-'+t.getAttribute('data-menu'));if(!panel)return;t.addEventListener('click',function(e){e.stopPropagation();var open=panel.getAttribute('data-open')==='true';closeAll(panel);panel.setAttribute('data-open',open?'false':'true');t.setAttribute('aria-expanded',open?'false':'true')});panel.addEventListener('click',function(e){e.stopPropagation()})});document.addEventListener('click',function(){closeAll()});document.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()})})();
// ---- mobile menu ----
(function(){var btn=document.querySelector('.menu-btn');var links=document.querySelector('.nav-links');if(!btn||!links)return;function close(){links.classList.remove('open');btn.setAttribute('aria-expanded','false')}btn.addEventListener('click',function(e){e.stopPropagation();var open=links.classList.toggle('open');btn.setAttribute('aria-expanded',open?'true':'false')});links.querySelectorAll('a').forEach(function(a){a.addEventListener('click',close)});document.addEventListener('click',function(e){if(links.classList.contains('open')&&!links.contains(e.target)&&!btn.contains(e.target))close()});document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});var desktop=window.matchMedia('(min-width: 761px)');if(desktop.addEventListener)desktop.addEventListener('change',function(e){if(e.matches)close()})})();
// ---- current page in section menu ----
(function(){var current=window.location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.dd-item[href]').forEach(function(link){var href=(link.getAttribute('href')||'').split('#')[0];if(href===current)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')})})();
// ---- reveal ----
(function(){var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.getAttribute('data-motion')==='off';var items=document.querySelectorAll('.reveal, .block');function activate(el){el.classList.add('in');el.classList.add('on')}if(reduce||!('IntersectionObserver'in window)){items.forEach(activate);return}var obs=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){activate(e.target);obs.unobserve(e.target)}})},{threshold:.15,rootMargin:'0px 0px -5% 0px'});items.forEach(function(el){obs.observe(el)});window.addEventListener('load',function(){items.forEach(function(el){if(el.getBoundingClientRect().top<window.innerHeight*.9)activate(el)})})})();

// ---- additional reader settings ----
(function () {
  var root = document.documentElement;
  var panel = document.getElementById('menu-settings');
  if (!panel) return;

  var defaults = {
    width: 'default',
    leading: 'default',
    articlefont: 'sans',
    contrast: 'off',
    progress: 'off',
    toc: 'off'
  };

  var storageKeys = {
    width: 'reader-width',
    leading: 'reader-leading',
    articlefont: 'reader-font',
    contrast: 'reader-contrast',
    progress: 'reader-progress',
    toc: 'reader-toc'
  };

  function get(key) {
    try {
      return localStorage.getItem(storageKeys[key]) || defaults[key];
    } catch (e) {
      return defaults[key];
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(storageKeys[key], value);
    } catch (e) {}
  }

  var state = {
    width: get('width'),
    leading: get('leading'),
    articlefont: get('articlefont'),
    contrast: get('contrast'),
    progress: get('progress'),
    toc: get('toc')
  };

  function apply(key, value) {
    root.setAttribute('data-reader-' + key, value);
    document.dispatchEvent(new CustomEvent('reader-setting-change', {
      detail: { key: key, value: value }
    }));
  }

  Object.keys(state).forEach(function (key) {
    apply(key, state[key]);
  });

  function makeSegmentedRow(label, key, options) {
    var row = document.createElement('div');
    row.className = 'set-row reader-setting-row';

    var title = document.createElement('span');
    title.className = 'lb';
    title.textContent = label;

    var group = document.createElement('div');
    group.className = 'seg reader-seg';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', label);

    options.forEach(function (option) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = option.label;
      button.setAttribute('aria-pressed', state[key] === option.value ? 'true' : 'false');

      button.addEventListener('click', function () {
        state[key] = option.value;
        set(key, option.value);
        apply(key, option.value);

        group.querySelectorAll('button').forEach(function (other) {
          other.setAttribute('aria-pressed', other === button ? 'true' : 'false');
        });
      });

      group.appendChild(button);
    });

    row.appendChild(title);
    row.appendChild(group);
    return row;
  }

  function makeToggleRow(label, key) {
    var row = document.createElement('div');
    row.className = 'set-row reader-setting-row';

    var line = document.createElement('div');
    line.className = 'set-toggle';

    var name = document.createElement('span');
    name.className = 'nm';
    name.textContent = label;

    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'switch reader-switch';
    button.setAttribute('aria-label', label);
    button.setAttribute('aria-pressed', state[key] === 'on' ? 'true' : 'false');

    button.addEventListener('click', function () {
      var enabled = button.getAttribute('aria-pressed') !== 'true';
      state[key] = enabled ? 'on' : 'off';
      set(key, state[key]);
      apply(key, state[key]);
      button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    });

    line.appendChild(name);
    line.appendChild(button);
    row.appendChild(line);
    return row;
  }

  panel.appendChild(makeSegmentedRow('Reading width', 'width', [
    { label: 'Narrow', value: 'narrow' },
    { label: 'Default', value: 'default' },
    { label: 'Wide', value: 'wide' }
  ]));

  panel.appendChild(makeSegmentedRow('Line spacing', 'leading', [
    { label: 'Compact', value: 'compact' },
    { label: 'Default', value: 'default' },
    { label: 'Relaxed', value: 'relaxed' }
  ]));

  panel.appendChild(makeSegmentedRow('Article font', 'articlefont', [
    { label: 'Sans', value: 'sans' },
    { label: 'Serif', value: 'serif' }
  ]));

  panel.appendChild(makeToggleRow('Higher contrast', 'contrast'));
  panel.appendChild(makeToggleRow('Reading progress', 'progress'));
  panel.appendChild(makeToggleRow('Sticky contents', 'toc'));

  // Reading progress bar on article pages.
  var article = document.querySelector('article.article');
  if (article) {
    var progress = document.createElement('div');
    progress.className = 'reader-progress';
    progress.setAttribute('aria-hidden', 'true');
    progress.innerHTML = '<span></span>';
    document.body.appendChild(progress);

    var fill = progress.firstElementChild;
    var ticking = false;

    function updateProgress() {
      ticking = false;
      var rect = article.getBoundingClientRect();
      var articleTop = window.scrollY + rect.top;
      var scrollable = Math.max(1, article.offsetHeight - window.innerHeight);
      var amount = Math.max(0, Math.min(1, (window.scrollY - articleTop) / scrollable));
      fill.style.transform = 'scaleX(' + amount + ')';
    }

    function requestProgressUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateProgress);
    }

    window.addEventListener('scroll', requestProgressUpdate, { passive: true });
    window.addEventListener('resize', requestProgressUpdate);
    document.addEventListener('reader-setting-change', requestProgressUpdate);
    updateProgress();
  }

  // Generated article contents.
  var prose = article && article.querySelector('.prose');
  if (!prose) return;

  var headings = Array.prototype.slice.call(prose.querySelectorAll('h2, h3'));
  if (!headings.length) return;

  function slugify(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'section';
  }

  var used = {};

  headings.forEach(function (heading) {
    if (!heading.id) {
      var base = slugify(heading.textContent);
      var candidate = base;
      var number = 2;

      while (used[candidate] || document.getElementById(candidate)) {
        candidate = base + '-' + number;
        number += 1;
      }

      heading.id = candidate;
    }

    used[heading.id] = true;
  });

  var toc = document.createElement('nav');
  toc.className = 'reader-toc';
  toc.setAttribute('aria-label', 'Article contents');

  var title = document.createElement('div');
  title.className = 'reader-toc-title';
  title.textContent = 'In this article';

  var list = document.createElement('ol');

  headings.forEach(function (heading) {
    var item = document.createElement('li');
    if (heading.tagName === 'H3') item.className = 'reader-toc-subsection';

    var link = document.createElement('a');
    link.href = '#' + heading.id;
    link.textContent = heading.textContent;
    link.setAttribute('data-target', heading.id);

    item.appendChild(link);
    list.appendChild(item);
  });

  toc.appendChild(title);
  toc.appendChild(list);
  article.parentNode.insertBefore(toc, article);

  if ('IntersectionObserver' in window) {
    var tocLinks = Array.prototype.slice.call(toc.querySelectorAll('a'));

    var headingObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        tocLinks.forEach(function (link) {
          if (link.getAttribute('data-target') === entry.target.id) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, {
      rootMargin: '-18% 0px -70% 0px',
      threshold: 0
    });

    headings.forEach(function (heading) {
      headingObserver.observe(heading);
    });
  }
})();


// ---- current page in the section menu ----
(function () {
  var current = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('#menu-sections .dd-item[href]').forEach(function (link) {
    var href = (link.getAttribute('href') || '').split('#')[0];

    if (href === current) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
})();
