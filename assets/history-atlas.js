(() => {
  const rail = document.querySelector('.timeline-scroll');
  const tabs = [...document.querySelectorAll('.era-tab')];
  if (!rail || !tabs.length) return;

  let selected = 0;

  function select(index, focus = false) {
    selected = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      const active = i === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !active;
    });

    const tab = tabs[selected];
    const center = tab.offsetLeft + tab.offsetWidth / 2 - rail.clientWidth / 2;
    rail.scrollTo({ left: Math.max(0, center), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    if (focus) tab.focus({ preventScroll: true });
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', event => {
      const moves = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 };
      if (!(event.key in moves)) return;
      event.preventDefault();
      select(moves[event.key], true);
    });
  });

  document.querySelectorAll('.era-prev').forEach(button => button.addEventListener('click', () => select(selected - 1)));
  document.querySelectorAll('.era-next').forEach(button => button.addEventListener('click', () => select(selected + 1)));
})();
