/* Plainly Medicine - one small working model per section.
   Each article carries <div class="figure-box" data-figure="slug"></div>
   and the matching builder below fills it in. */
(function () {
  'use strict';

  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function shell(host, title, note) {
    host.innerHTML = '';
    host.appendChild(el('span', 'fig-label', 'Model'));
    host.appendChild(el('h3', 'fig-title', title));
    var stage = el('div', 'fig-stage');
    var ctrl = el('div', 'fig-ctrl');
    var out = el('p', 'fig-out', note || '');
    host.appendChild(stage); host.appendChild(ctrl); host.appendChild(out);
    return { stage: stage, ctrl: ctrl, out: out };
  }
  function slider(ctrl, label, min, max, val, step, fn) {
    var wrap = el('div', 'fig-slider');
    var lab = el('label', null, label + ' <b></b>');
    var input = document.createElement('input');
    input.type = 'range'; input.min = min; input.max = max; input.value = val; input.step = step || 1;
    lab.setAttribute('for', 'f' + Math.random().toString(36).slice(2, 8));
    input.id = lab.getAttribute('for');
    wrap.appendChild(lab); wrap.appendChild(input);
    ctrl.appendChild(wrap);
    var b = lab.querySelector('b');
    input.addEventListener('input', function () { fn(+input.value, b); });
    return { input: input, b: b };
  }
  function choices(ctrl, opts, fn) {
    var g = el('div', 'fig-choices');
    opts.forEach(function (o, i) {
      var btn = el('button', null, o.label);
      btn.type = 'button';
      btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      btn.addEventListener('click', function () {
        g.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        fn(o.value, i);
      });
      g.appendChild(btn);
    });
    ctrl.appendChild(g);
    return g;
  }
  function svg(stage, vb, inner) {
    stage.innerHTML = '<svg viewBox="' + vb + '" role="img">' + inner + '</svg>';
    return stage.querySelector('svg');
  }

  var FIG = {};

  /* ---- cardiology: an artery closing over decades ---- */
  FIG.cardiology = function (host) {
    var s = shell(host, 'What decades at a given cholesterol level do to one artery');
    var g = svg(s.stage, '0 0 320 200',
      '<circle cx="100" cy="100" r="72" class="vessel"/>' +
      '<circle cx="100" cy="100" r="60" class="wall"/>' +
      '<circle id="lumen" cx="100" cy="100" r="58" class="lumen"/>' +
      '<text x="210" y="72" class="big" id="pct">0%</text>' +
      '<text x="210" y="94" class="cap">narrowed</text>' +
      '<text x="210" y="132" class="cap" id="flow">Blood flow unaffected</text>');
    var lumen = g.querySelector('#lumen'), pct = g.querySelector('#pct'), flow = g.querySelector('#flow');
    var level = 145, years = 0;
    function draw() {
      // rough illustration: narrowing scales with level above roughly 70 and with time
      var burden = Math.max(0, (level - 70)) * years / 100;
      var narrow = Math.min(92, burden * 1.25);
      lumen.setAttribute('r', (58 * (1 - narrow / 100)).toFixed(1));
      pct.textContent = Math.round(narrow) + '%';
      if (narrow < 40) { flow.textContent = 'Blood flow unaffected'; }
      else if (narrow < 70) { flow.textContent = 'Still no symptoms at rest'; }
      else if (narrow < 85) { flow.textContent = 'Chest pain likely on exertion'; }
      else { flow.textContent = 'Flow-limiting; rupture risk'; }
      s.out.textContent = 'A plaque can grow for decades without producing a single symptom. Narrowing usually has to pass about 70 percent before it limits blood flow, which is why the first sign is so often the heart attack itself.';
    }
    slider(s.ctrl, 'LDL held at', 70, 200, 145, 5, function (v, b) { level = v; b.textContent = v + ' mg/dL'; draw(); });
    slider(s.ctrl, 'For', 0, 50, 0, 1, function (v, b) { years = v; b.textContent = v + ' years'; draw(); });
    s.ctrl.querySelectorAll('b')[0].textContent = '145 mg/dL';
    s.ctrl.querySelectorAll('b')[1].textContent = '0 years';
    draw();
  };

  /* ---- neurology: what changes first in Alzheimer's ---- */
  FIG.neurology = function (host) {
    var s = shell(host, 'The order things change, long before a diagnosis');
    var rows = [
      { k: 'Amyloid builds up', start: 25, full: 12 },
      { k: 'Tau tangles spread', start: 15, full: 5 },
      { k: 'Brain tissue shrinks', start: 10, full: 3 },
      { k: 'Memory symptoms appear', start: 5, full: 0 }
    ];
    var inner = '';
    rows.forEach(function (r, i) {
      var y = 26 + i * 42;
      inner += '<text x="0" y="' + (y - 8) + '" class="cap">' + r.k + '</text>' +
               '<rect x="0" y="' + y + '" width="300" height="14" class="track"/>' +
               '<rect id="b' + i + '" x="0" y="' + y + '" width="0" height="14" class="fill"/>';
    });
    inner += '<line id="scrub" x1="0" y1="8" x2="0" y2="188" class="scrub"/>';
    var g = svg(s.stage, '0 0 320 200', inner);
    function draw(t) { // t = years before diagnosis, 30 down to 0
      rows.forEach(function (r, i) {
        var p = (r.start - t) / (r.start - r.full);
        p = Math.max(0, Math.min(1, p));
        g.querySelector('#b' + i).setAttribute('width', (300 * p).toFixed(1));
      });
      g.querySelector('#scrub').setAttribute('x1', 300 * (30 - t) / 30);
      g.querySelector('#scrub').setAttribute('x2', 300 * (30 - t) / 30);
      s.out.textContent = t > 18
        ? 'Twenty years before any symptom, amyloid is already accumulating. This is the window the new drugs are trying to reach.'
        : t > 8
          ? 'Tau follows amyloid, and tau tracks far more closely with the symptoms people actually notice.'
          : 'By the time memory problems are obvious, two decades of change have already happened. That is why treatment started here does much less.';
    }
    slider(s.ctrl, 'Years before diagnosis', 0, 30, 30, 1, function (v, b) { b.textContent = v; draw(v); });
    s.ctrl.querySelector('b').textContent = '30';
    draw(30);
  };

  /* ---- oncology: the off switch a tumour presses ---- */
  FIG.oncology = function (host) {
    var s = shell(host, 'The off switch a tumour presses, and what happens when it is blocked');
    var g = svg(s.stage, '0 0 320 200',
      '<circle cx="160" cy="100" r="44" class="tumour"/>' +
      '<text x="160" y="105" class="cap mid">tumour</text>' +
      '<g id="tcells"></g>' +
      '<text x="160" y="188" class="cap mid" id="state"></text>');
    var host2 = g.querySelector('#tcells');
    var pos = [[52, 46], [268, 46], [52, 154], [268, 154]];
    function draw(blocked) {
      host2.innerHTML = '';
      pos.forEach(function (p) {
        var cx = blocked ? p[0] + (160 - p[0]) * 0.46 : p[0];
        var cy = blocked ? p[1] + (100 - p[1]) * 0.46 : p[1];
        host2.innerHTML += '<circle cx="' + cx + '" cy="' + cy + '" r="15" class="tcell ' + (blocked ? 'live' : 'off') + '"/>';
      });
      g.querySelector('#state').textContent = blocked ? 'Checkpoint blocked: T cells engage' : 'Checkpoint pressed: T cells stand down';
      s.out.textContent = blocked
        ? 'A checkpoint inhibitor releases the brake. The immune cells were always there and already knew where the tumour was. They were being told to stand down.'
        : 'The tumour presses the immune system\u2019s own off switch. The T cells arrive, receive the stand-down signal, and do nothing.';
    }
    choices(s.ctrl, [{ label: 'Checkpoint pressed', value: false }, { label: 'Checkpoint blocked', value: true }],
      function (v) { draw(v); });
    draw(false);
  };

  /* ---- metabolic: each added target raises the ceiling ---- */
  FIG.metabolic = function (host) {
    var s = shell(host, 'What each added hormone target buys');
    var bars = [
      { k: 'Diet and exercise alone', v: 5, n: 'Typical average in trials of lifestyle change alone.' },
      { k: 'GLP-1 only', v: 15, n: 'Semaglutide, which targets the GLP-1 receptor by itself.' },
      { k: 'GLP-1 plus GIP', v: 21, n: 'Tirzepatide, which adds a second gut hormone receptor.' },
      { k: 'Three receptors', v: 24, n: 'Investigational triple agonists, still in late-stage trials.' }
    ];
    var inner = '';
    bars.forEach(function (b, i) {
      var y = 18 + i * 44;
      inner += '<text x="0" y="' + (y - 4) + '" class="cap">' + b.k + '</text>' +
               '<rect x="0" y="' + y + '" width="260" height="18" class="track"/>' +
               '<rect id="m' + i + '" x="0" y="' + y + '" width="0" height="18" class="fill"/>' +
               '<text id="mv' + i + '" x="268" y="' + (y + 14) + '" class="cap"></text>';
    });
    var g = svg(s.stage, '0 0 320 200', inner);
    function draw(sel) {
      bars.forEach(function (b, i) {
        g.querySelector('#m' + i).setAttribute('width', (260 * b.v / 26).toFixed(1));
        g.querySelector('#m' + i).setAttribute('opacity', sel === i ? 1 : 0.32);
        g.querySelector('#mv' + i).textContent = b.v + '%';
      });
      s.out.textContent = bars[sel].n + ' Average body weight reduction. Each step adds a receptor rather than refining the original mechanism, which is why the ceiling keeps moving.';
    }
    choices(s.ctrl, bars.map(function (b, i) { return { label: b.k.split(' ')[0], value: i }; }), draw);
    draw(0);
  };

  /* ---- infectious: two ways resistance travels ---- */
  FIG.infectious = function (host) {
    var s = shell(host, 'Two ways a resistance gene travels');
    var stage = s.stage;
    var grid = el('div', 'fig-grid');
    stage.appendChild(grid);
    var N = 48, cells = [], mode = 'vertical', step = 0;
    function build() {
      grid.innerHTML = ''; cells = []; step = 0;
      for (var i = 0; i < N; i++) {
        var d = el('i', 'gcell');
        if (i === 17) d.className = 'gcell r';
        grid.appendChild(d); cells.push(d);
      }
      note();
    }
    function note() {
      var r = cells.filter(function (c) { return c.classList.contains('r'); }).length;
      s.out.textContent = mode === 'vertical'
        ? 'Passing it down: the gene spreads only to descendants, so it stays inside one lineage. After ' + step + ' rounds, ' + r + ' of ' + N + ' carry it.'
        : 'Passing it sideways: the gene rides a loop of DNA that moves between unrelated bacteria, so it appears in cells that share no ancestry. After ' + step + ' rounds, ' + r + ' of ' + N + ' carry it.';
    }
    function advance() {
      step++;
      var idx = cells.map(function (c, i) { return c.classList.contains('r') ? i : -1; }).filter(function (i) { return i >= 0; });
      idx.forEach(function (i) {
        if (mode === 'vertical') {
          [i - 1, i + 1, i - 8, i + 8].forEach(function (j) {
            if (j >= 0 && j < N && Math.random() < 0.5) cells[j].classList.add('r');
          });
        } else {
          for (var k = 0; k < 2; k++) {
            var j = Math.floor(Math.random() * N);
            cells[j].classList.add('r');
          }
        }
      });
      note();
    }
    choices(s.ctrl, [{ label: 'Passed down', value: 'vertical' }, { label: 'Passed sideways', value: 'horizontal' }],
      function (v) { mode = v; build(); });
    var b = el('button', 'fig-step', 'One more round');
    b.type = 'button';
    b.addEventListener('click', advance);
    s.ctrl.appendChild(b);
    build();
  };

  /* ---- critical care: which machine stands in for which organ ---- */
  FIG.criticalcare = function (host) {
    var s = shell(host, 'Which machine stands in for which organ');
    var opts = [
      { label: 'Lungs', machine: 'Ventilator', txt: 'Moves air in and out when the lungs or the muscles driving them cannot. It does not heal the lung; it holds the job open.' },
      { label: 'Kidneys', machine: 'Dialysis', txt: 'Filters the blood in place of the kidneys, and can do so for years. The most complete long-term substitution medicine has.' },
      { label: 'Heart', machine: 'Ventricular assist device', txt: 'Pumps blood when the heart is too weak, sometimes as a bridge to transplant and sometimes indefinitely.' },
      { label: 'Heart and lungs', machine: 'ECMO', txt: 'Takes blood out, adds oxygen, removes carbon dioxide, returns it. The fullest substitution available, and the shortest bridge.' }
    ];
    var g = svg(s.stage, '0 0 320 200',
      '<rect x="16" y="26" width="288" height="148" class="track" rx="0"/>' +
      '<text x="160" y="74" class="big mid" id="mach"></text>' +
      '<text x="160" y="104" class="cap mid" id="org"></text>' +
      '<line x1="60" y1="122" x2="260" y2="122" class="scrub"/>' +
      '<text x="160" y="150" class="cap mid">substituting, not curing</text>');
    function draw(i) {
      g.querySelector('#mach').textContent = opts[i].machine;
      g.querySelector('#org').textContent = 'stands in for: ' + opts[i].label.toLowerCase();
      s.out.textContent = opts[i].txt;
    }
    choices(s.ctrl, opts.map(function (o, i) { return { label: o.label, value: i }; }), draw);
    draw(0);
  };

  /* ---- transplant: closing the supply gap ---- */
  FIG.transplant = function (host) {
    var s = shell(host, 'How each advance changes the supply gap');
    var g = svg(s.stage, '0 0 320 200',
      '<text x="0" y="26" class="cap">People waiting</text>' +
      '<rect x="0" y="34" width="300" height="26" class="track"/>' +
      '<rect x="0" y="34" width="300" height="26" class="fill" opacity="0.35"/>' +
      '<text x="0" y="96" class="cap">Organs available</text>' +
      '<rect x="0" y="104" width="300" height="26" class="track"/>' +
      '<rect id="sup" x="0" y="104" width="90" height="26" class="fill"/>' +
      '<text x="0" y="164" class="big" id="gap"></text>' +
      '<text x="0" y="186" class="cap">still unmet</text>');
    var base = 30, adds = { perfusion: 0, expanded: 0, pig: 0 };
    function draw() {
      var pctv = Math.min(100, base + adds.perfusion + adds.expanded + adds.pig);
      g.querySelector('#sup').setAttribute('width', (300 * pctv / 100).toFixed(1));
      g.querySelector('#gap').textContent = (100 - pctv) + '%';
      var on = Object.keys(adds).filter(function (k) { return adds[k] > 0; });
      s.out.textContent = on.length === 0
        ? 'Start with the shortage as it stands. Roughly a third of the need is met, and the rest of the bar is people who wait.'
        : 'No single advance closes the gap. Machine perfusion stops good organs being discarded, expanded donor criteria add more, and gene-edited animal organs are the only one that could add supply without a human donor at all.';
    }
    [['perfusion', 'Machine perfusion', 14], ['expanded', 'Expanded donor criteria', 12], ['pig', 'Gene-edited pig organs', 30]]
      .forEach(function (o) {
        var wrap = el('label', 'fig-check');
        var cb = document.createElement('input'); cb.type = 'checkbox';
        cb.addEventListener('change', function () { adds[o[0]] = cb.checked ? o[2] : 0; draw(); });
        wrap.appendChild(cb); wrap.appendChild(document.createTextNode(o[1]));
        s.ctrl.appendChild(wrap);
      });
    draw();
  };

  /* ---- longevity: two different things people mean ---- */
  FIG.longevity = function (host) {
    var s = shell(host, 'Two different things people mean by a longer life');
    var g = svg(s.stage, '0 0 320 200',
      '<line x1="34" y1="168" x2="310" y2="168" class="axis"/>' +
      '<line x1="34" y1="16" x2="34" y2="168" class="axis"/>' +
      '<path id="cur" class="curve"/><path id="ill" class="ill"/>' +
      '<text x="172" y="192" class="cap mid">age</text>' +
      '<text x="26" y="14" class="cap" text-anchor="end">alive</text>');
    function curve(mid, steep) {
      var d = '';
      for (var i = 0; i <= 60; i++) {
        var age = 40 + i;
        var v = 1 / (1 + Math.exp((age - mid) / steep));
        var x = 34 + (age - 40) / 60 * 276, y = 168 - v * 148;
        d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
      }
      return d;
    }
    function draw(mode) {
      if (mode === 'base') {
        g.querySelector('#cur').setAttribute('d', curve(80, 6));
        g.querySelector('#ill').setAttribute('d', curve(68, 7));
        s.out.textContent = 'Today: the lower line is when chronic illness starts, the upper line is death. The distance between them is roughly a decade spent unwell.';
      } else if (mode === 'longer') {
        g.querySelector('#cur').setAttribute('d', curve(90, 6));
        g.querySelector('#ill').setAttribute('d', curve(68, 7));
        s.out.textContent = 'More years: the end moves right but illness starts at the same age, so the unwell stretch gets longer. This is the version almost nobody actually wants.';
      } else {
        g.querySelector('#cur').setAttribute('d', curve(88, 4));
        g.querySelector('#ill').setAttribute('d', curve(82, 4));
        s.out.textContent = 'More healthy years: illness is pushed back to meet the end, so the unwell stretch shrinks. This is what healthspan research is aiming at, and it is a different target.';
      }
    }
    choices(s.ctrl, [{ label: 'Today', value: 'base' }, { label: 'More years', value: 'longer' }, { label: 'More healthy years', value: 'health' }], draw);
    draw('base');
  };

  document.querySelectorAll('.figure-box[data-figure]').forEach(function (host) {
    var fn = FIG[host.getAttribute('data-figure')];
    if (fn) { try { fn(host); } catch (e) { host.remove(); } }
    else host.remove();
  });
})();
