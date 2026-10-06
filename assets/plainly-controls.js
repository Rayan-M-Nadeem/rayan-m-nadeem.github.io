/* Shared identity and reading controls for Physics, Chemistry, and History.
   Medicine keeps its richer native panel and uses the same preference keys. */
(() => {
  'use strict';
  const root = document.documentElement;
  const body = document.body;
  const site = body.classList.contains('history') ? 'History'
    : body.classList.contains('chem') || body.classList.contains('chem-home') ? 'Chemistry'
    : location.pathname.startsWith('/physics/') ? 'Physics' : null;
  if (!site || document.querySelector('.pl-controls')) return;

  const defaults = { size: 'm', width: 'default', leading: 'default', font: 'sans', contrast: 'off', motion: 'off', underline: 'off' };
  const key = name => `plainly:reader:${name}`;
  const read = name => { try { return localStorage.getItem(key(name)) || localStorage.getItem(`pm:${name}`) || defaults[name]; } catch { return defaults[name]; } };
  const state = Object.fromEntries(Object.keys(defaults).map(name => [name, read(name)]));
  function apply() {
    for (const [name, value] of Object.entries(state)) {
      const actual = name === 'motion' ? (value === 'on' ? 'off' : null) : value;
      const normal = defaults[name];
      if (value === normal) root.removeAttribute(`data-${name}`);
      else root.setAttribute(`data-${name}`, actual);
    }
  }
  apply();

  if (site === 'Physics') {
    const brand = document.querySelector('.topbar .brand');
    if (brand) {
      const name = brand.lastElementChild;
      if (name) name.textContent = 'Plainly Physics';
      brand.href = '/physics/';
      brand.setAttribute('aria-label', 'Plainly Physics home');
    }
    body.classList.add('pl-physics-header');
  } else if (site === 'History') {
    const brand = document.querySelector('.top .brand');
    if (brand) { brand.textContent = 'Plainly History'; brand.href = '/history/'; brand.setAttribute('aria-label', 'Plainly History home'); }
  } else {
    const brand = document.querySelector('.brand-lockup .brand');
    if (brand) { brand.href = '/chemistry/'; brand.setAttribute('aria-label', 'Plainly Chemistry home'); }
  }

  const host = site === 'Physics' ? document.querySelector('.topbar .nav nav')
    : document.querySelector('.top .top-inner nav') || document.querySelector('.top .top-inner');
  if (!host) return;
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '/assets/plainly-controls.css?v=20261006a';
  document.head.append(style);

  if (site === 'History') {
    const library = document.createElement('a');
    library.className = 'pl-library-link';
    library.href = '/';
    library.textContent = 'Library';
    host.append(library);
  }
  const controls = document.createElement('div');
  controls.className = 'pl-controls';
  controls.innerHTML = `<button class="pl-gear" type="button" aria-label="Reading settings" aria-controls="pl-settings" aria-expanded="false"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M10 2h4l.5 2.2 1.8.8 1.9-1.2 2.8 2.8-1.2 1.9.8 1.8L22 10v4l-2.2.5-.8 1.8 1.2 1.9-2.8 2.8-1.9-1.2-1.8.8L14 22h-4l-.5-2.2-1.8-.8-1.9 1.2-2.8-2.8 1.2-1.9-.8-1.8L2 14v-4l2.2-.5.8-1.8-1.2-1.9 2.8-2.8 1.9 1.2 1.8-.8z"/></svg></button>
    <div class="pl-panel" id="pl-settings" hidden><p class="pl-panel-title">Reading settings</p>
      <div class="pl-row"><span>Text size</span><div class="pl-options" data-setting="size"><button type="button" data-value="s">Small</button><button type="button" data-value="m">Default</button><button type="button" data-value="l">Large</button></div></div>
      <div class="pl-row"><span>Reading width</span><div class="pl-options" data-setting="width"><button type="button" data-value="narrow">Narrow</button><button type="button" data-value="default">Default</button><button type="button" data-value="wide">Wide</button></div></div>
      <div class="pl-row"><span>Line spacing</span><div class="pl-options" data-setting="leading"><button type="button" data-value="tight">Tight</button><button type="button" data-value="default">Default</button><button type="button" data-value="loose">Loose</button></div></div>
      <div class="pl-row"><span>Article typeface</span><div class="pl-options" data-setting="font"><button type="button" data-value="sans">Sans</button><button type="button" data-value="serif">Serif</button><button type="button" data-value="mono">Mono</button></div></div>
      <div class="pl-row pl-toggle"><span>Higher contrast</span><button type="button" data-setting="contrast" aria-pressed="false">Off</button></div>
      <div class="pl-row pl-toggle"><span>Reduce motion</span><button type="button" data-setting="motion" aria-pressed="false">Off</button></div>
      <div class="pl-row pl-toggle"><span>Underline links</span><button type="button" data-setting="underline" aria-pressed="false">Off</button></div>
      <button class="pl-reset" type="button">Reset reading settings</button>
    </div>`;
  host.append(controls);
  const trigger = controls.querySelector('.pl-gear');
  const panel = controls.querySelector('.pl-panel');
  const sync = () => {
    controls.querySelectorAll('.pl-options').forEach(group => group.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(state[group.dataset.setting] === button.dataset.value))));
    controls.querySelectorAll('.pl-toggle button').forEach(button => { const on = state[button.dataset.setting] === 'on'; button.setAttribute('aria-pressed', String(on)); button.textContent = on ? 'On' : 'Off'; });
  };
  const set = (name, value) => { state[name] = value; try { localStorage.setItem(key(name), value); } catch {} apply(); sync(); };
  const close = (focus = false) => { panel.hidden = true; trigger.setAttribute('aria-expanded', 'false'); if (focus) trigger.focus(); };
  trigger.addEventListener('click', () => { const open = panel.hidden; panel.hidden = !open; trigger.setAttribute('aria-expanded', String(open)); });
  controls.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button || button === trigger) return;
    if (button.classList.contains('pl-reset')) {
      Object.entries(defaults).forEach(([name, value]) => { try { localStorage.removeItem(`pm:${name}`); } catch {} set(name, value); });
      return;
    }
    const name = button.dataset.setting || button.parentElement.dataset.setting;
    if (name && name in defaults) set(name, button.dataset.value || (state[name] === 'on' ? 'off' : 'on'));
  });
  document.addEventListener('click', event => { if (!controls.contains(event.target)) close(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !panel.hidden) close(true); });
  sync();
})();
