const elements = document.querySelectorAll('.periodic-grid .element');
const symbol = document.getElementById('element-symbol');
const name = document.getElementById('element-name');
const context = document.getElementById('element-context');
elements.forEach((element) => element.addEventListener('click', () => {
  elements.forEach((item) => { item.classList.remove('is-selected'); item.setAttribute('aria-pressed', 'false'); });
  element.classList.add('is-selected');
  element.setAttribute('aria-pressed', 'true');
  symbol.textContent = element.dataset.symbol;
  name.textContent = `${element.dataset.name} · ${element.dataset.number}`;
  context.textContent = `Group ${element.dataset.group} · Period ${element.dataset.period}`;
}));
const catalyst = document.getElementById('catalyst-toggle');
const energy = document.querySelector('.energy-panel');
const catalystLabel = document.getElementById('catalyst-label');
catalyst.addEventListener('click', () => {
  const active = catalyst.getAttribute('aria-pressed') !== 'true';
  catalyst.setAttribute('aria-pressed', String(active));
  energy.classList.toggle('is-catalyzed', active);
  catalystLabel.textContent = active ? 'Catalyzed route highlighted' : 'Highlight catalyst path';
});
