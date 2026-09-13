(function () {
  'use strict';

  var search = document.getElementById('search');
  var count = document.getElementById('count');
  var empty = document.getElementById('empty');
  var browser = document.getElementById('explore');
  var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-filter]'));
  var domains = Array.prototype.slice.call(document.querySelectorAll('.domain'));
  var cards = Array.prototype.slice.call(document.querySelectorAll('.concept'));
  var active = 'mechanics';

  function normalize(value) {
    return value.toLowerCase().trim();
  }

  function filter() {
    var query = normalize(search.value);
    var shown = 0;

    browser.classList.toggle('searching', Boolean(query));

    domains.forEach(function (domain) {
      var domainName = domain.getAttribute('data-domain');
      var inDomain = query ? true : active === domainName;
      var visibleInDomain = 0;

      domain.querySelectorAll('.concept').forEach(function (card) {
        var text = normalize(card.textContent + ' ' + (card.getAttribute('data-search') || ''));
        var visible = inDomain && (!query || text.indexOf(query) !== -1);
        card.hidden = !visible;
        if (visible) {
          shown += 1;
          visibleInDomain += 1;
        }
      });

      domain.hidden = visibleInDomain === 0;
    });

    count.textContent = shown;
    empty.hidden = shown !== 0;
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      active = button.getAttribute('data-filter');
      search.value = '';
      buttons.forEach(function (item) {
        var selected = item === button;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-pressed', selected ? 'true' : 'false');
      });
      filter();
    });
  });

  search.addEventListener('input', filter);

  filter();

  cards.forEach(function (card) {
    card.querySelector('summary').addEventListener('click', function () {
      card.classList.toggle('opened');
    });
  });

  var topButton = document.getElementById('top');
  window.addEventListener('scroll', function () {
    topButton.classList.toggle('show', window.scrollY > 700);
  }, { passive: true });
  topButton.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}());
