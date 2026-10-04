(() => {
  const article = document.querySelector('[data-detail]');
  if (!article) return;

  const progress = document.querySelector('.reading-progress');
  const links = [...document.querySelectorAll('.rail a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);

  function update() {
    const bottom = document.documentElement.scrollHeight - window.innerHeight;
    const value = bottom > 0 ? Math.min(100, Math.max(0, window.scrollY / bottom * 100)) : 100;
    progress?.style.setProperty('--progress', `${value}%`);

    const current = [...sections].reverse().find(section => section.getBoundingClientRect().top <= Math.min(220, window.innerHeight * .35)) || sections[0];
    for (const link of links) {
      const active = link.getAttribute('href') === `#${current?.id}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
