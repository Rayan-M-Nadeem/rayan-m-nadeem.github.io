(function () {
  'use strict';

  var data = window.PLAINLY_PHYSICS || {};
  var topics = data.topics || {};
  var chapters = data.chapters || {};
  var slug = document.body.getAttribute('data-topic');
  var entries = Object.keys(topics).map(function (title) {
    return { title: title, detail: topics[title] };
  });
  var currentIndex = entries.findIndex(function (entry) { return entry.detail.slug === slug; });

  if (currentIndex < 0) {
    document.getElementById('topic').innerHTML = '<div class="topic-loading"><p>This physics topic could not be found. <a href="../../">Return to the physics shelf.</a></p></div>';
    return;
  }

  var current = entries[currentIndex];
  var title = current.title;
  var detail = current.detail;
  var chapter = chapters[detail.domain];
  var summary = (data.explanations || {})[title] || '';
  var applicationText = (data.applications || {})[title] || '';
  var colors = {
    mechanics: ['#7ea9ff', '126,169,255'], matter: ['#72d6c8', '114,214,200'],
    waves: ['#ad8dff', '173,141,255'], fields: ['#f7c96f', '247,201,111'],
    light: ['#ff86cf', '255,134,207'], modern: ['#79dfff', '121,223,255']
  };

  document.documentElement.style.setProperty('--article-accent', colors[detail.domain][0]);
  document.documentElement.style.setProperty('--article-rgb', colors[detail.domain][1]);
  document.querySelectorAll('[data-chapter]').forEach(function (link) {
    link.classList.toggle('active', link.getAttribute('data-chapter') === detail.domain);
  });

  function setText(id, value) {
    var node = document.getElementById(id);
    if (node) node.textContent = value;
  }

  function topicHref(entry) {
    return '../' + entry.detail.slug + '/';
  }

  function applications(value) {
    return value.replace(/\.$/, '').split(/,\s*|\s+and\s+/).filter(Boolean);
  }

  setText('chapter-label', chapter.label);
  setText('chapter-title', chapter.title);
  setText('topic-tag', detail.tag);
  setText('topic-title', title);
  setText('topic-summary', summary);
  setText('topic-why', detail.why);
  setText('topic-model', detail.model);
  setText('topic-limits', detail.limits);
  setText('topic-practice', detail.practice);
  document.getElementById('topic-formula').innerHTML = detail.formula;
  document.getElementById('topic-formula-copy').innerHTML = detail.formula;
  setText('formula-note', detail.formulaNote);

  var uses = applications(applicationText);
  var useList = document.getElementById('use-list');
  var useGrid = document.getElementById('application-grid');
  uses.forEach(function (use) {
    var item = document.createElement('li');
    item.textContent = use;
    useList.appendChild(item);
    var card = document.createElement('span');
    card.textContent = use;
    useGrid.appendChild(card);
  });

  var misconceptionList = document.getElementById('misconception-list');
  detail.misconceptions.forEach(function (text) {
    var item = document.createElement('li');
    item.textContent = text;
    misconceptionList.appendChild(item);
  });

  var chapterEntries = entries.filter(function (entry) { return entry.detail.domain === detail.domain; });
  var chapterIndex = chapterEntries.findIndex(function (entry) { return entry.detail.slug === slug; });
  var chapterList = document.getElementById('chapter-list');
  chapterEntries.forEach(function (entry, index) {
    var link = document.createElement('a');
    link.href = topicHref(entry);
    link.className = entry.detail.slug === slug ? 'active' : '';
    if (entry.detail.slug === slug) link.setAttribute('aria-current', 'page');
    link.innerHTML = '<span>' + String(index + 1).padStart(2, '0') + '</span><b></b>';
    link.querySelector('b').textContent = entry.title;
    chapterList.appendChild(link);
  });

  var previous = chapterEntries[(chapterIndex - 1 + chapterEntries.length) % chapterEntries.length];
  var next = chapterEntries[(chapterIndex + 1) % chapterEntries.length];
  var previousLink = document.getElementById('previous-topic');
  var nextLink = document.getElementById('next-topic');
  previousLink.href = topicHref(previous);
  previousLink.querySelector('strong').textContent = previous.title;
  nextLink.href = topicHref(next);
  nextLink.querySelector('strong').textContent = next.title;

  var count = String(chapterIndex + 1).padStart(2, '0') + ' / ' + String(chapterEntries.length).padStart(2, '0');
  setText('topic-position', count + ' in ' + chapter.label);
  document.querySelectorAll('[data-chapter-return]').forEach(function (link) {
    link.href = '../../?chapter=' + detail.domain + '#explore';
  });

  var wordCount = [summary, detail.why, detail.model, detail.limits, detail.practice].join(' ').trim().split(/\s+/).length;
  setText('reading-time', Math.max(3, Math.ceil(wordCount / 190)) + ' min read');

  var progress = document.querySelector('.reading-progress span');
  function updateProgress() {
    var total = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0) + '%';
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}());
