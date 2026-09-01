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

  function fit(host) {
    var sv = host.querySelector('.fig-stage svg');
    if (!sv || !sv.getBBox) return;
    var b;
    try { b = sv.getBBox(); } catch (e) { return; }
    if (!b || !b.width) return;
    var v = sv.viewBox.baseVal, pad = 6;
    var x0 = Math.min(v.x, b.x - pad), y0 = Math.min(v.y, b.y - pad);
    var x1 = Math.max(v.x + v.width, b.x + b.width + pad);
    var y1 = Math.max(v.y + v.height, b.y + b.height + pad);
    sv.setAttribute('viewBox', x0.toFixed(1) + ' ' + y0.toFixed(1) + ' ' +
      (x1 - x0).toFixed(1) + ' ' + (y1 - y0).toFixed(1));
  }

  var FIG = {};

  /* ---- cardiology: an artery closing over decades ---- */
  FIG.cardiology = function (host) {
    var s = shell(host, 'What decades at a given cholesterol level do to one artery');
    var g = svg(s.stage, '0 0 340 212',
      '<circle cx="86" cy="106" r="74" class="vessel"/>' +
      '<circle cx="86" cy="106" r="62" class="wall"/>' +
      '<circle id="lumen" cx="86" cy="106" r="60" class="lumen"/>' +
      '<text x="196" y="76" class="big" id="pct">0%</text>' +
      '<text x="196" y="97" class="cap">of the channel closed</text>' +
      '<rect x="196" y="112" width="132" height="12" class="track"/>' +
      '<rect id="mtr" x="196" y="112" width="0" height="12" class="fill"/>' +
      '<text x="196" y="146" class="cap" id="flow">Flow unaffected</text>' +
      '<text x="196" y="164" class="cap" id="sym">no symptoms</text>');
    var lumen = g.querySelector('#lumen'), pct = g.querySelector('#pct'),
        mtr = g.querySelector('#mtr'), flow = g.querySelector('#flow'), sym = g.querySelector('#sym');
    var level = 145, years = 0;
    function draw() {
      var narrow = Math.min(92, Math.max(0, level - 70) * years / 100 * 1.25);
      lumen.setAttribute('r', (60 * (1 - narrow / 100)).toFixed(1));
      mtr.setAttribute('width', (132 * narrow / 92).toFixed(1));
      pct.textContent = Math.round(narrow) + '%';
      if (narrow < 40) { flow.textContent = 'Flow unaffected'; sym.textContent = 'nothing to feel'; }
      else if (narrow < 70) { flow.textContent = 'Still fine at rest'; sym.textContent = 'nothing to feel'; }
      else if (narrow < 85) { flow.textContent = 'Flow now limited'; sym.textContent = 'chest pain on exertion'; }
      else { flow.textContent = 'Severely limited'; sym.textContent = 'high rupture risk'; }
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
    var s = shell(host, 'Run the same tumour forward under four different treatments');
    var g = svg(s.stage, '0 0 340 212',
      '<line x1="34" y1="176" x2="330" y2="176" class="axis"/>' +
      '<line x1="34" y1="16" x2="34" y2="176" class="axis"/>' +
      '<text x="26" y="24" class="cap" text-anchor="end">size</text>' +
      '<text x="182" y="202" class="cap mid">months of treatment</text>' +
      '<path id="onc-line" class="curve"/>' +
      '<g id="onc-dots"></g>' +
      '<text x="330" y="30" class="cap" id="onc-state" text-anchor="end"></text>');
    var line = g.querySelector('#onc-line'), dots = g.querySelector('#onc-dots'),
        stateT = g.querySelector('#onc-state');
    var mode = 'none', hist = [100], responder = true, MONTHS = 36, stepBtn;
    function px(i) { return 34 + i / MONTHS * 296; }
    function py(v) { return 176 - Math.min(v, 130) / 130 * 156; }
    function draw() {
      line.setAttribute('d', hist.map(function (v, i) {
        return (i ? 'L' : 'M') + px(i * 3).toFixed(1) + ',' + py(v).toFixed(1); }).join(' '));
      dots.innerHTML = hist.map(function (v, i) {
        return '<circle cx="' + px(i * 3).toFixed(1) + '" cy="' + py(v).toFixed(1) + '" r="3.4" class="fill"/>'; }).join('');
      stateT.textContent = (hist.length - 1) * 3 + ' months';
    }
    function note(t) { s.out.textContent = t; }
    var INTRO = {
      none: 'No treatment. Advance the tumour three months at a time and watch what unchecked division actually looks like.',
      chemo: 'Chemotherapy kills dividing cells, so the response is fast. Keep advancing and watch what the surviving cells do.',
      checkpoint: 'A checkpoint inhibitor releases the immune brake. It does not work in everyone, so this run is one patient rather than an average. Keep advancing.',
      cart: 'CAR-T sends in the patient\u2019s own re-engineered immune cells. Advance and watch the shape of the response.'
    };
    function reset(m) { mode = m; hist = [100]; responder = Math.random() < 0.45; draw(); note(INTRO[m]); }
    function step() {
      var n = hist.length, v = hist[n - 1], t = n * 3;
      if (mode === 'none') v *= 1.20;
      else if (mode === 'chemo') v = t <= 9 ? v * 0.45 : v * (1.24 + n * 0.02);
      else if (mode === 'checkpoint') v = responder ? (t <= 12 ? v * 0.62 : v * 0.97) : v * 1.14;
      else v = t <= 6 ? v * 0.10 : v * (Math.random() < 0.18 ? 1.5 : 1.01);
      hist.push(Math.max(0.6, Math.min(v, 130)));
      draw();
      var months = (hist.length - 1) * 3;
      if (mode === 'chemo' && months >= 12 && hist[hist.length - 1] > hist[3])
        note('This is the pattern that makes chemotherapy hard: a real early response, then the cells that survived it repopulate. The tumour that comes back is the one the drug could not kill.');
      else if (mode === 'checkpoint' && !responder && months >= 9)
        note('This patient is not responding. Checkpoint inhibitors help a minority, which is why so much work goes into predicting who in advance. Reset to draw a different patient.');
      else if (mode === 'checkpoint' && responder && months >= 18)
        note('When a checkpoint inhibitor does work the response tends to hold, because what is doing the killing is an immune system that now recognises the tumour and keeps watching for it.');
      else if (mode === 'cart' && months >= 12)
        note('CAR-T can clear a tumour almost completely within weeks. The open question is durability, and relapse when the target protein disappears from the cancer.');
      else if (mode === 'none' && months >= 12)
        note('Nothing is holding it back. Exponential growth looks slow at first and then does not, which is the whole difficulty of catching cancer early.');
      if (months >= MONTHS) stepBtn.disabled = true;
    }
    choices(s.ctrl, [{ label: 'None', value: 'none' }, { label: 'Chemo', value: 'chemo' },
                     { label: 'Checkpoint', value: 'checkpoint' }, { label: 'CAR-T', value: 'cart' }],
      function (v) { reset(v); stepBtn.disabled = false; });
    stepBtn = el('button', 'fig-step', 'Advance 3 months');
    stepBtn.type = 'button';
    stepBtn.addEventListener('click', step);
    s.ctrl.appendChild(stepBtn);
    var rst = el('button', 'fig-step', 'Reset');
    rst.type = 'button';
    rst.addEventListener('click', function () { reset(mode); stepBtn.disabled = false; });
    s.ctrl.appendChild(rst);
    reset('none');
  };

  /* ---- metabolic: each added target raises the ceiling ---- */
  FIG.metabolic = function (host) {
    var s = shell(host, 'Drag the point where treatment stops and watch what the weight does');
    var g = svg(s.stage, '0 0 340 212',
      '<line x1="36" y1="176" x2="332" y2="176" class="axis"/>' +
      '<line x1="36" y1="14" x2="36" y2="176" class="axis"/>' +
      '<g id="met-grid"></g>' +
      '<path id="met-area" class="gapfill"/><path id="met-line" class="curve"/>' +
      '<line id="met-stop" class="scrub" y1="14" y2="176"/>' +
      '<text id="met-stopl" y="12" class="cap mid"></text>' +
      '<text x="184" y="202" class="cap mid">weeks</text>' +
      '<text x="28" y="20" class="cap" text-anchor="end">0%</text>' +
      '<text x="28" y="176" class="cap" text-anchor="end">-25%</text>');
    var grid = g.querySelector('#met-grid');
    [0,52,104,156].forEach(function (w) {
      grid.innerHTML += '<line class="gl" x1="' + (36 + w / 156 * 296) + '" y1="14" x2="' + (36 + w / 156 * 296) + '" y2="176"/>' +
        '<text x="' + (36 + w / 156 * 296) + '" y="190" class="cap mid">' + w + '</text>';
    });
    var REG = { life: { p: 5, n: 'lifestyle change alone' }, glp: { p: 15, n: 'a GLP-1 drug' }, dual: { p: 21, n: 'a GLP-1 plus GIP drug' } };
    var reg = 'glp', stop = 68;
    function x(w) { return 36 + w / 156 * 296; }
    function y(pc) { return 14 + pc / 25 * 162; }
    function draw() {
      var peak = REG[reg].p, pts = [], lowest = 0;
      for (var w = 0; w <= 156; w += 2) {
        var v;
        if (w <= stop) v = peak * (1 - Math.exp(-w / 26));
        else {
          var atStop = peak * (1 - Math.exp(-stop / 26));
          v = atStop - atStop * 0.68 * (1 - Math.exp(-(w - stop) / 34));
        }
        lowest = Math.max(lowest, v);
        pts.push([w, v]);
      }
      var d = pts.map(function (q, i) { return (i ? 'L' : 'M') + x(q[0]).toFixed(1) + ',' + y(q[1]).toFixed(1); }).join(' ');
      g.querySelector('#met-line').setAttribute('d', d);
      g.querySelector('#met-area').setAttribute('d', d + ' L' + x(156) + ',' + y(0) + ' L' + x(0) + ',' + y(0) + ' Z');
      g.querySelector('#met-stop').setAttribute('x1', x(stop)); g.querySelector('#met-stop').setAttribute('x2', x(stop));
      var lbl = g.querySelector('#met-stopl');
      lbl.setAttribute('x', Math.min(Math.max(x(stop), 52), 300)); lbl.textContent = 'stops';
      var end = pts[pts.length - 1][1];
      s.out.textContent = stop >= 156
        ? 'Kept on ' + REG[reg].n + ' for the full three years, weight settles about ' + lowest.toFixed(1) +
          ' percent down and stays there. These behave like treatments for a chronic condition, not a course with an end.'
        : 'On ' + REG[reg].n + ' the low point is about ' + lowest.toFixed(1) + ' percent down. Stopping at week ' + stop +
          ' gives most of it back: by three years the loss is about ' + end.toFixed(1) +
          ' percent. The drug was not doing something permanent to the body, it was holding a signal in place.';
    }
    choices(s.ctrl, [{ label: 'Lifestyle', value: 'life' }, { label: 'GLP-1', value: 'glp' }, { label: 'GLP-1 + GIP', value: 'dual' }],
      function (v) { reg = v; draw(); });
    s.ctrl.querySelector('.fig-choices').querySelectorAll('button')[0].setAttribute('aria-pressed', 'false');
    s.ctrl.querySelector('.fig-choices').querySelectorAll('button')[1].setAttribute('aria-pressed', 'true');
    slider(s.ctrl, 'Treatment stops at week', 8, 156, 68, 4, function (v, b) { stop = v; b.textContent = v >= 156 ? 'never' : v; draw(); });
    s.ctrl.querySelector('.fig-slider b').textContent = '68';
    draw();
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
    var s = shell(host, 'Keep a patient alive long enough for the cause to be treated');
    var board = el('div', 'fig-organs');
    s.stage.appendChild(board);
    var meter = el('div', 'fig-meter', '<span></span>');
    s.stage.appendChild(meter);
    var clock = el('p', 'fig-clock');
    s.stage.appendChild(clock);

    var ORGANS = [
      { k: 'lungs', name: 'Lungs', machine: 'Ventilator', failsAt: 0 },
      { k: 'kidneys', name: 'Kidneys', machine: 'Dialysis', failsAt: 12 },
      { k: 'heart', name: 'Heart', machine: 'ECMO', failsAt: 24 }
    ];
    var hours = 0, stability = 100, treated = false, dead = false, sup = {};

    function render() {
      board.innerHTML = '';
      ORGANS.forEach(function (o) {
        var failing = hours >= o.failsAt;
        var b = el('button', 'organ' + (failing ? ' failing' : '') + (sup[o.k] ? ' supported' : ''));
        b.type = 'button';
        b.innerHTML = '<span class="on">' + o.name + '</span>' +
          '<span class="st">' + (!failing ? 'holding' : sup[o.k] ? 'on ' + o.machine.toLowerCase() : 'failing') + '</span>' +
          '<span class="act">' + (sup[o.k] ? 'switch off' : 'start ' + o.machine) + '</span>';
        b.disabled = dead;
        b.addEventListener('click', function () { sup[o.k] = !sup[o.k]; render(); });
        board.appendChild(b);
      });
      meter.querySelector('span').style.width = Math.max(0, stability) + '%';
      meter.classList.toggle('low', stability < 40);
      clock.textContent = 'Hour ' + hours + '  \u00b7  stability ' + Math.max(0, Math.round(stability)) + '%';
    }
    function advance() {
      if (dead) return;
      hours += 6;
      var unsupported = 0;
      ORGANS.forEach(function (o) { if (hours >= o.failsAt && !sup[o.k]) unsupported++; });
      if (treated) stability += 9 - unsupported * 16;
      else stability += -3 - unsupported * 17;
      stability = Math.min(100, stability);
      if (stability <= 0) { stability = 0; dead = true; }
      render();
      if (dead) s.out.textContent = 'The patient did not survive. An organ was left unsupported for too long. Support is not optional once an organ has stopped doing its job, and it does not wait for you.';
      else if (treated && stability > 88 && hours >= 30) s.out.textContent = 'Stable and recovering. The machines did not fix anything. They held the failing organs open while the underlying cause was treated, and that is the whole idea of the bridge.';
      else if (!treated && hours >= 36) s.out.textContent = 'Everything is supported and the patient is still sliding. This is the hard case: life support with nothing reversible underneath extends a dying process rather than a life.';
      else if (unsupported) s.out.textContent = 'An organ has failed and nothing is standing in for it. Stability is dropping fast. Start the matching machine.';
      else s.out.textContent = 'Holding. Each machine substitutes for one organ and buys time, but time is only useful if the thing that caused the failure gets treated.';
    }
    var step = el('button', 'fig-step', 'Advance 6 hours');
    step.type = 'button'; step.addEventListener('click', advance);
    s.ctrl.appendChild(step);
    var cure = el('label', 'fig-check');
    var cb = document.createElement('input'); cb.type = 'checkbox';
    cb.addEventListener('change', function () { treated = cb.checked; });
    cure.appendChild(cb); cure.appendChild(document.createTextNode('Treat the underlying cause'));
    s.ctrl.appendChild(cure);
    var rst = el('button', 'fig-step', 'Reset');
    rst.type = 'button';
    rst.addEventListener('click', function () {
      hours = 0; stability = 100; dead = false; sup = {}; treated = cb.checked; render();
      s.out.textContent = 'Hour zero. The lungs have just failed. Start the machine that stands in for them, then keep advancing.';
    });
    s.ctrl.appendChild(rst);
    render();
    s.out.textContent = 'Hour zero. The lungs have just failed. Start the machine that stands in for them, then keep advancing.';
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
    var s = shell(host, 'Set when illness starts and when life ends, and see which one actually matters');
    var g = svg(s.stage, '0 0 340 212',
      '<line x1="36" y1="150" x2="332" y2="150" class="axis"/>' +
      '<line x1="36" y1="12" x2="36" y2="150" class="axis"/>' +
      '<path id="lg-band" class="gapfill"/>' +
      '<path id="lg-ill" class="ill"/><path id="lg-die" class="curve"/>' +
      '<text x="28" y="20" class="cap" text-anchor="end">alive</text>' +
      '<g id="lg-ax"></g>' +
      '<rect x="36" y="168" width="296" height="18" class="track"/>' +
      '<rect id="lg-well" x="36" y="168" width="0" height="18" class="fill"/>' +
      '<rect id="lg-sick" x="36" y="168" width="0" height="18" class="sick"/>' +
      '<text x="36" y="202" class="cap" id="lg-lab"></text>');
    var ax = g.querySelector('#lg-ax');
    [40, 60, 80, 100].forEach(function (a) {
      ax.innerHTML += '<text x="' + (36 + (a - 40) / 65 * 296) + '" y="164" class="cap mid">' + a + '</text>';
    });
    var ill = 68, die = 80;
    function X(a) { return 36 + (a - 40) / 65 * 296; }
    function curve(mid) {
      var d = '';
      for (var i = 0; i <= 65; i++) {
        var a = 40 + i, v = 1 / (1 + Math.exp((a - mid) / 4.5));
        d += (i ? 'L' : 'M') + X(a).toFixed(1) + ',' + (150 - v * 134).toFixed(1);
      }
      return d;
    }
    function draw() {
      if (die <= ill + 1) die = ill + 1;
      g.querySelector('#lg-ill').setAttribute('d', curve(ill));
      g.querySelector('#lg-die').setAttribute('d', curve(die));
      g.querySelector('#lg-band').setAttribute('d', curve(die) + ' L' + X(105) + ',150 L' + X(40) + ',150 Z');
      var well = ill - 40, sick = die - ill, total = die - 40;
      g.querySelector('#lg-well').setAttribute('width', (296 * well / 65).toFixed(1));
      g.querySelector('#lg-sick').setAttribute('x', (36 + 296 * well / 65).toFixed(1));
      g.querySelector('#lg-sick').setAttribute('width', (296 * sick / 65).toFixed(1));
      g.querySelector('#lg-lab').textContent = well + ' healthy years, then ' + sick + ' unwell';
      var baseSick = 12;
      s.out.textContent = sick > baseSick + 1
        ? 'You have added years to the end without moving when illness starts, so the unwell stretch has grown to ' + sick +
          ' years. This is the version of a longer life almost nobody actually wants, and it is what naive lifespan extension produces.'
        : sick < baseSick - 1
          ? 'The unwell stretch is down to ' + sick + ' years from about twelve today. Illness has been pushed back toward the end rather than the end pushed away from illness. This is what healthspan research is aiming at.'
          : 'Roughly today\u2019s picture: about ' + sick + ' years of chronic illness before the end. Now try moving each slider on its own and watch which one changes the shaded band.';
    }
    slider(s.ctrl, 'Chronic illness begins at', 50, 95, 68, 1, function (v, b) { ill = v; b.textContent = v; draw(); refresh(); });
    slider(s.ctrl, 'Life ends at', 60, 105, 80, 1, function (v, b) { die = v; b.textContent = v; draw(); refresh(); });
    var bs = s.ctrl.querySelectorAll('.fig-slider b');
    function refresh() { bs[0].textContent = ill; bs[1].textContent = die; }
    refresh(); draw();
  };

  document.querySelectorAll('.figure-box[data-figure]').forEach(function (host) {
    var fn = FIG[host.getAttribute('data-figure')];
    if (!fn) { host.remove(); return; }
    try { fn(host); } catch (e) { host.remove(); return; }
    fit(host);
    // the drawing changes as you use it, so re-check after every interaction
    ['input', 'click'].forEach(function (ev) {
      host.addEventListener(ev, function () { requestAnimationFrame(function () { fit(host); }); }, true);
    });
  });
})();
