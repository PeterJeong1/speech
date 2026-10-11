/* The Box at Pole Seven - what every room of the story shares: a few sounds (a fog horn among them), the tides of Tarrow
   for a fortnight in June, the printed tide card, the chart of the sands, and brass wheels to set a number on.
   Loaded after engine.js. Nothing in here knows an answer: the card and the chart only say what is printed on them. */
window.TIDE = (function () {
  'use strict';
  var X = {}, D = document, NS = 'http://www.w3.org/2000/svg';
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so that the sound button switches them) ---------- */
  X.sfx = {
    step: function () { B({ type: 'lowpass', f: 700, dur: 0.11, peak: 0.2 }); B({ type: 'lowpass', f: 560, dur: 0.11, peak: 0.16, when: 0.36 }); },
    chalk: function () { B({ type: 'bandpass', f: 2600, q: 1.4, dur: 0.2, peak: 0.06, a: 0.04 }); },
    notch: function () { B({ dur: 0.018, f: 3400, q: 5, peak: 0.09 }); T({ f: 900, f2: 700, dur: 0.03, peak: 0.03 }); },
    slide: function () { B({ type: 'bandpass', f: 900, f2: 1300, q: 1, dur: 0.14, peak: 0.07, a: 0.03 }); },
    shell: function () { T({ f: 1900, f2: 1500, dur: 0.05, peak: 0.07 }); B({ dur: 0.02, f: 3000, q: 2, peak: 0.08 }); },
    pin: function () { T({ f: 260, f2: 150, dur: 0.07, peak: 0.2 }); B({ dur: 0.03, f: 2400, q: 3, peak: 0.14 }); },
    pencil: function () { B({ type: 'highpass', f: 3000, dur: 0.16, peak: 0.05, a: 0.03 }); },
    splash: function () { B({ type: 'bandpass', f: 1100, f2: 500, q: 0.6, dur: 0.6, peak: 0.16, a: 0.03 }); B({ type: 'highpass', f: 3000, dur: 0.3, peak: 0.05, a: 0.02, when: 0.05 }); },
    water: function () { B({ type: 'bandpass', f: 800, f2: 1400, q: 0.7, dur: 0.7, peak: 0.07, a: 0.2 }); },
    rope: function () { T({ type: 'sawtooth', f: 180, f2: 120, dur: 0.4, peak: 0.04, a: 0.1 }); B({ type: 'bandpass', f: 700, q: 2, dur: 0.3, peak: 0.05, a: 0.08 }); },
    radio: function () { B({ type: 'bandpass', f: 2200, q: 0.9, dur: 0.45, peak: 0.07, a: 0.02 }); T({ type: 'square', f: 1250, dur: 0.05, peak: 0.03, when: 0.42 }); },
    no: function () { T({ type: 'triangle', f: 150, f2: 92, dur: 0.26, peak: 0.24 }); },
    /* a pea whistle: two high notes very close together, and a little breath */
    whistle: function (far) {
      var v = far ? 0.25 : 1, d = far ? 0.5 : 0.6;
      T({ f: 2760, f2: 2790, dur: d, peak: 0.075 * v, a: 0.02 }); T({ f: 2802, f2: 2830, dur: d, peak: 0.06 * v, a: 0.02 });
      B({ type: 'bandpass', f: 2800, q: 2.5, dur: d, peak: 0.045 * v, a: 0.02 });
    }
  };
  /* A fog horn: a low reed note that is held and then stops short. o = {dur, f, vol, pan (-1 left .. 1 right), when, lp} */
  X.horn = function (o) {
    try {
      var c = ER.audio && ER.audio(), out = ER.out && ER.out(); if (!c || !out || !ER.sound()) return;
      var t = c.currentTime + (o.when || 0), d = o.dur || 0.7, v = o.vol || 0.1, f0 = o.f || 155, g = c.createGain(), f = c.createBiquadFilter(), p;
      f.type = 'lowpass'; f.frequency.value = o.lp || 520; f.Q.value = 0.7;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.07);
      g.gain.setValueAtTime(v, t + Math.max(0.08, d - 0.12)); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
      [[f0, 'sawtooth', 1], [f0 * 1.5, 'sawtooth', 0.45], [f0 * 1.006, 'square', 0.3]].forEach(function (w) {
        var s = c.createOscillator(), a = c.createGain(); s.type = w[1]; s.frequency.value = w[0]; a.gain.value = w[2];
        s.connect(a); a.connect(f); s.start(t); s.stop(t + d + 0.05);
      });
      f.connect(g);
      if (c.createStereoPanner && o.pan) { p = c.createStereoPanner(); p.pan.value = o.pan; g.connect(p); p.connect(out); } else g.connect(out);
    } catch (e) {}
  };
  /* A bell: near and brassy (the Box), or thin and far (a buoy). o = {f, vol, when} */
  X.bell = function (o) {
    var f = (o && o.f) || 520, v = (o && o.vol) || 0.16, w = (o && o.when) || 0;
    [1, 2.01, 2.76, 3.9, 5.2].forEach(function (m, i) { T({ f: f * m, dur: 1.5 / Math.pow(i + 1, 0.45), peak: v / (i + 1), when: w }); });
    B({ dur: 0.02, f: 3600, q: 1, peak: v * 0.8, when: w });
  };
  /* A door opens. The music answers in the room's own key, as it does after ER.exit; without music, three plain notes. */
  X.solved = function (quiet) {
    var sung = false;
    try { sung = !!(ER.music && ER.music() && ER.track && ER.track.sting('solved', null, !!quiet)); } catch (e) {}
    if (!sung && !quiet) ER.sfx.ok();
  };

  /* ---------- small helpers ---------- */
  X.thing = function (sel, word, line, busy) {
    ER.$$(sel).forEach(function (n) {
      n.addEventListener('click', function (e) {
        if (busy && busy()) return;
        if (word) ER.wordAt(e.clientX, e.clientY, word);
        if (line) ER.say(typeof line === 'function' ? line() : line);
      });
    });
  };
  X.mine = function (id, title, html, quiet) { return ER.addClue(id, title, '<h4>' + title + '</h4>' + html, 'mine', 'Your notes', quiet); };
  X.terms = function (list) {
    var G = window.GLOSS || [];
    list.forEach(function (w) { for (var i = 0; i < G.length; i++) if (G[i][0] === w) { ER.addWord(G[i][0], G[i][1]); break; } });
  };
  X.minutesPlayed = function () {
    var st = ER.state(), end = ER.flag('tEnd') || Date.now();
    if (st.fin && st.fin.secs) return Math.max(1, Math.round(st.fin.secs / 60));
    return Math.max(1, Math.round((end - (st.t0 || end)) / 60000));
  };
  X.el = function (tag, attrs, html) {
    var n = D.createElementNS(NS, tag), k;
    for (k in attrs) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  };
  X.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  function f1(v) { return (Math.round(v * 10) / 10).toString(); }
  X.f1 = f1;
  X.m1 = function (v) { return (Math.round(v * 10) / 10).toFixed(1); };
  function two(n) { return (n < 10 ? '0' : '') + n; }
  /* minutes after midnight -> "14.10" */
  X.clock = function (m) { m = ((Math.round(m) % 1440) + 1440) % 1440; return two(Math.floor(m / 60)) + '.' + two(m % 60); };

  /* ---------- the tides of Tarrow ----------
     Two waves added together, as in the real sea: the Moon's (every 12 h 25 min) and the Sun's (every 12 h). Where they
     keep step the tides are big (springs); where they fall out of step, small (neaps). t = hours from 00.00 on Monday 2 June. */
  var Z0 = 2.8, AM = 1.75, AS = 0.65, TM = 12.4206012, TS = 12, T0 = 258.3166667;
  X.h = function (t) { return Z0 + AM * Math.cos(2 * Math.PI * (t - T0) / TM) + AS * Math.cos(2 * Math.PI * (t - T0) / TS); };
  X.THU = 240;                                             /* 00.00 on Thursday 12 June */
  /* what the card prints: [date, day, moon, [[H or L, time, height], ...]] */
  X.CARD = [
    [2, 'Mon', '', [['L', '02.56', '1.0'], ['H', '09.08', '4.5'], ['L', '15.20', '1.2'], ['H', '21.33', '4.3']]],
    [3, 'Tue', 'q', [['L', '03.47', '1.3'], ['H', '10.01', '4.2'], ['L', '16.17', '1.5'], ['H', '22.33', '4.1']]],
    [4, 'Wed', '', [['L', '04.50', '1.6'], ['H', '11.09', '4.0'], ['L', '17.28', '1.7'], ['H', '23.48', '3.9']]],
    [5, 'Thu', '', [['L', '06.09', '1.7'], ['H', '12.30', '3.9'], ['L', '18.51', '1.7']]],
    [6, 'Fri', '', [['H', '01.11', '3.9'], ['L', '07.30', '1.6'], ['H', '13.49', '4.0'], ['L', '20.06', '1.5']]],
    [7, 'Sat', '', [['H', '02.22', '4.1'], ['L', '08.38', '1.4'], ['H', '14.52', '4.3'], ['L', '21.06', '1.3']]],
    [8, 'Sun', '', [['H', '03.19', '4.4'], ['L', '09.31', '1.1'], ['H', '15.43', '4.6'], ['L', '21.54', '1.0']]],
    [9, 'Mon', '', [['H', '04.05', '4.7'], ['L', '10.16', '0.8'], ['H', '16.26', '4.8'], ['L', '22.36', '0.7']]],
    [10, 'Tue', 'n', [['H', '04.46', '4.9'], ['L', '10.56', '0.6'], ['H', '17.06', '5.0'], ['L', '23.15', '0.5']]],
    [11, 'Wed', '', [['H', '05.24', '5.1'], ['L', '11.34', '0.5'], ['H', '17.43', '5.2'], ['L', '23.52', '0.4']]],
    [12, 'Thu', '', [['H', '06.01', '5.2'], ['L', '12.10', '0.4'], ['H', '18.19', '5.2']]],
    [13, 'Fri', '', [['L', '00.28', '0.4'], ['H', '06.37', '5.2'], ['L', '12.46', '0.4'], ['H', '18.55', '5.2']]],
    [14, 'Sat', '', [['L', '01.04', '0.5'], ['H', '07.14', '5.1'], ['L', '13.23', '0.5'], ['H', '19.32', '5.0']]],
    [15, 'Sun', '', [['L', '01.42', '0.6'], ['H', '07.52', '4.9'], ['L', '14.02', '0.7'], ['H', '20.12', '4.8']]]
  ];
  var MOON = { q: '<svg viewBox="0 0 16 16" width="13" height="13" style="display:inline;vertical-align:-2px"><circle cx="8" cy="8" r="6.5" fill="#fff" stroke="#1c2630"/><path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="#1c2630"/></svg>',
    n: '<svg viewBox="0 0 16 16" width="13" height="13" style="display:inline;vertical-align:-2px"><circle cx="8" cy="8" r="6.5" fill="#1c2630" stroke="#1c2630"/></svg>' };
  X.moonSign = function (k) { return MOON[k] || ''; };
  /* the printed table. pick = true: every row can be clicked (it carries data-d, the day of the month) */
  X.cardTable = function (pick) {
    var s = '<table class="tt' + (pick ? ' pick' : '') + '"><thead><tr><th>June</th><th colspan="4">High water (HW) and low water (LW): time, and height in metres</th><th>Moon</th></tr></thead><tbody>';
    X.CARD.forEach(function (r) {
      s += '<tr data-d="' + r[0] + '"' + (r[0] === 8 ? ' class="wk"' : '') + '><td class="d">' + r[1] + ' ' + r[0] + '</td>';
      for (var i = 0; i < 4; i++) s += '<td>' + (r[3][i] ? '<i>' + (r[3][i][0] === 'H' ? 'HW' : 'LW') + '</i>' + r[3][i][1] + '<b>' + r[3][i][2] + '</b>' : '') + '</td>';
      s += '<td class="m">' + (r[2] ? MOON[r[2]] + (r[2] === 'q' ? ' half' : ' new') : '') + '</td></tr>';
    });
    return s + '</tbody></table>';
  };

  /* ---------- the chart ----------
     1000 x 560 for about 3.9 km x 2.2 km: north at the top, the mainland on the left, Tarrow on the right. The Pole Road
     runs along y = 330: pole n stands at x = 120 + 38 n, and the poles are 150 m apart. */
  X.PX = function (n) { return 120 + 38 * n; };
  X.PLACES = {
    runnel: { x: 253, y: 330, dry: 1.2 }, box: { x: 386, y: 330, dry: 3.2 }, soft: { x: 443, y: 330, dry: 2.6 }, p10: { x: 500, y: 330, dry: 2.4 },
    p12: { x: 576, y: 330, dry: 2.0 }, ford: { x: 600, y: 330, dry: 1.6 }, ibank: { x: 640, y: 330, dry: 2.2 }, swash: { x: 470, y: 372, dry: 2.0 },
    scar: { x: 556, y: 112, dry: 2.6 }, rigg: { x: 400, y: 212, dry: 4.4 }, pool: { x: 640, y: 150, depth: 0.3 },
    n1: { x: 468, y: 284, dry: 2.8 }, n2: { x: 412, y: 288, dry: 3.0 }, light: { x: 897, y: 330 }, pier: { x: 108, y: 330 }, buoy: { x: 716, y: 44 }
  };
  function dh(id, x, y, txt, hit) {
    return (hit ? '<g class="dh" data-id="' + id + '"><circle cx="' + x + '" cy="' + (y - 4.5) + '" r="15"/>' : '<g>') + '<text class="ch-dh" x="' + x + '" y="' + y + '">' + txt + '</text><path d="M' + (x - 10) + ' ' + (y + 2.5) + 'h20" stroke="#1d1c1a" stroke-width="1.200"/></g>';
  }
  /* o = {view: [x, y, w, h], over: svg to lay on top, hit: true = the figures on the road can be clicked, cls} */
  X.chart = function (o) {
    o = o || {};
    var v = o.view || [0, 0, 1000, 560], hit = !!o.hit, s, n, x, i, a, r;
    s = '<svg class="chart ' + (o.cls || '') + '" viewBox="' + v.join(' ') + '" preserveAspectRatio="xMidYMid meet">' +
      '<rect x="-200" y="-200" width="1400" height="960" fill="#cfe3ee"/>' +
      '<path class="ch-sand" d="M104 94Q200 66 330 82T560 64Q640 56 700 78T896 124L886 470Q760 502 640 488T400 502Q250 514 108 482Z"/>' +
      '<path class="ch-chan" d="M236 84Q246 160 240 240T250 330Q256 400 244 496L270 494Q280 410 272 330T264 240Q272 160 262 82Z"/>' +
      '<path class="ch-chan" d="M640 60Q622 130 606 200T590 300Q586 335 590 370T604 498L640 494Q622 420 614 370T614 300Q626 220 652 140T690 66Z"/>' +
      '<path class="ch-deep" d="M654 64Q638 120 624 176T606 236Q614 246 622 236Q634 180 654 128T684 68Z"/>' +
      '<path class="ch-chan" d="M420 344Q452 362 484 360T546 386Q572 404 598 414L600 430Q566 420 540 402T480 378Q446 380 414 358Z"/>' +
      '<path class="ch-rigg" d="M340 222Q352 186 404 184T462 208Q456 240 402 244T340 222Z"/>' +
      '<path class="ch-rigg" d="M522 114Q530 98 558 98T590 112Q584 126 556 126T522 114Z"/>' +
      '<path class="ch-land" d="M-200 -200H88Q120 60 104 130T118 260Q128 330 112 400T100 760H-200Z"/>' +
      '<path class="ch-land" d="M1200 -200V760H930Q900 500 884 430T874 330Q868 260 892 190T940 60Q960 30 990 -200Z"/>';
    /* soft sand: a patch of small dots where two poles stood */
    for (i = 0, a = ''; i < 46; i++) { r = (i * 53) % 29; a += '<circle cx="' + (414 + (i * 37) % 58) + '" cy="' + (318 + (i * 17 + r) % 25) + '" r="1.050"/>'; }
    s += '<g class="ch-soft">' + a + '</g><path class="ch-line" d="M120 330H880"/>';
    for (n = 1; n <= 19; n++) {
      x = X.PX(n);
      if (n === 8 || n === 9) s += '<path d="M' + (x - 3) + ' 327l6 6M' + (x + 3) + ' 327l-6 6" stroke="#1d1c1a" stroke-width="1.100"/>';
      else s += '<circle class="ch-pole" cx="' + x + '" cy="330" r="2.500"/>';
      s += '<text class="ch-pn" x="' + x + '" y="346">' + n + '</text>';
    }
    s += '<g transform="translate(386 330)"><path d="M-6 -3V7M6 -3V7" stroke="#1d1c1a" stroke-width="1.300"/><rect class="ch-box" x="-7" y="-10" width="14" height="9"/></g>' +
      '<text class="ch-nl" x="386" y="364" text-anchor="middle">The Box</text><text class="ch-fog" x="386" y="376" text-anchor="middle">Refuge · Bell (by hand)</text>' +
      '<text class="ch-nl" x="443" y="302" text-anchor="middle" font-style="italic">soft</text>' +
      /* the light, the pier and the buoy: magenta, as on a real chart */
      '<path class="ch-flare" d="M897 330l-34 -28q-8 14 6 26z"/><path d="M897 322l2.400 5.400 5.800 .500 -4.400 3.900 1.400 5.700 -5.200 -3.100 -5.200 3.100 1.400 -5.700 -4.400 -3.900 5.800 -.500z" fill="#1d1c1a"/>' +
      '<text class="ch-nl" x="912" y="318">Tarrow Lt</text><text class="ch-fog" x="912" y="332">Fl(2) 15s</text><text class="ch-fog" x="912" y="345">Horn(2) 30s</text>' +
      '<path d="M96 330H122" stroke="#1d1c1a" stroke-width="3.400"/><text class="ch-nl" x="8" y="318">Longstrand</text><text class="ch-nl" x="8" y="331">Pier</text><text class="ch-fog" x="8" y="345">Horn 15s</text>' +
      '<g transform="translate(716 44)"><path d="M-6 6h12M-4 6l3 -12h2l3 12z" fill="#1d1c1a" stroke="#1d1c1a" stroke-width="1"/><path class="ch-flare" d="M2 -4l22 -10q4 9 -4 14z"/></g>' +
      '<text class="ch-nl" x="742" y="42">Bar buoy</text><text class="ch-fog" x="742" y="55">Bell</text>' +
      '<text class="ch-big" x="300" y="456">TARROW SANDS</text>' +
      '<text class="ch-nm" x="668" y="262" transform="rotate(74 668 262)">The Gutter</text><text class="ch-nm" x="282" y="196" transform="rotate(84 282 196)">The Runnel</text>' +
      '<text class="ch-nm" x="500" y="398" transform="rotate(14 500 398)">The Swash</text>' +
      '<text class="ch-nl" x="400" y="204" text-anchor="middle">The Rigg</text><text class="ch-nl" x="500" y="94" text-anchor="middle">Selkie Scar</text>' +
      '<text class="ch-nk" x="56" y="250" transform="rotate(-90 56 250)" text-anchor="middle">LONGSTRAND</text><text class="ch-nk" x="962" y="180" transform="rotate(90 962 180)" text-anchor="middle">TARROW</text>' +
      '<text class="ch-nm" x="790" y="34">open sea</text><text class="ch-nm" x="597" y="360" font-size="11" text-anchor="middle">the ford</text>';
    s += dh('runnel', 253, 316, '1.2', hit) + dh('p5', 310, 316, '2.6') + dh('p6', 348, 316, '3.0') + dh('box', 378, 304, '3.2', hit) + dh('soft', 443, 316, '2.6', hit) +
      dh('p10', 500, 316, '2.4', hit) + dh('p12', 572, 316, '2.0', hit) + dh('ford', 601, 316, '1.6', hit) + dh('ibank', 642, 316, '2.2', hit) + dh('e1', 728, 316, '2.8') +
      dh('e2', 804, 316, '3.8') + dh('w1', 172, 316, '3.2') + dh('swash', 470, 376, '2.0', hit) + dh('scar', 556, 117, '2.6', hit) + dh('rigg', 400, 224, '4.4', hit) +
      dh('n1', 468, 280, '2.8') + dh('n2', 410, 284, '3.0') + dh('s3', 330, 420, '2.4') + dh('s4', 760, 420, '2.6') + dh('n5', 180, 200, '2.6') + dh('n6', 790, 200, '3.0');
    s += (hit ? '<g class="dh" data-id="pool"><circle cx="640" cy="146" r="15"/>' : '<g>') + '<text class="ch-dp" x="640" y="150">0.3</text></g>' +
      '<g transform="translate(44 60)"><path d="M0 26V-22M-6 -10L0 -24L6 -10" fill="none" stroke="#1d1c1a" stroke-width="1.600"/><text class="ch-ttl" x="0" y="-28" text-anchor="middle">N</text></g>' +
      '<g transform="translate(140 528)"><path d="M0 0H253.300M0 -5V5M126.650 -4V4M253.300 -5V5" stroke="#1d1c1a" stroke-width="1.400" fill="none"/><text class="ch-sm" x="0" y="17" text-anchor="middle">0</text>' +
      '<text class="ch-sm" x="126.650" y="17" text-anchor="middle">500 m</text><text class="ch-sm" x="253.300" y="17" text-anchor="middle">1 km</text></g>' +
      '<text class="ch-ttl" x="430" y="524">TARROW SANDS · heights in metres above chart datum</text>' +
      '<text class="ch-sm" x="430" y="540">2.4 underlined: dries 2.4 m · 0.3 with no line: 0.3 m deep at the lowest tide · poles 150 m apart</text>' +
      (o.over || '') + '<rect class="ch-frame" x="' + (v[0] + 1) + '" y="' + (v[1] + 1) + '" width="' + (v[2] - 2) + '" height="' + (v[3] - 2) + '"/></svg>';
    return s;
  };

  /* ---------- wheels: a number set one figure at a time ----------
     o = {label, vals: [[...], ...] one list for each wheel, start: [index, ...], sep: {wheelIndex: 'text before it'}, tail: 'text after', cls, change: fn} */
  X.wheels = function (box, o) {
    var at = (o.start || o.vals.map(function () { return 0; })).slice(), s = o.label ? '<small>' + o.label + '</small>' : '', off = false;
    o.vals.forEach(function (v, i) {
      if (o.sep && o.sep[i]) s += '<i>' + o.sep[i] + '</i>';
      s += '<span class="wl"><button type="button" data-j="' + i + '" data-d="1" title="up">&#9650;</button><b></b><button type="button" data-j="' + i + '" data-d="-1" title="down">&#9660;</button></span>';
    });
    if (o.tail) s += '<i>' + o.tail + '</i>';
    var n = ER.el('span', 'wls ' + (o.cls || ''), s), cells = ER.$$('b', n);
    function draw() { cells.forEach(function (c, i) { c.textContent = o.vals[i][at[i]]; }); }
    n.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null, j, len;
      if (!b || off) return;
      j = +b.getAttribute('data-j'); len = o.vals[j].length;
      at[j] = (at[j] + (+b.getAttribute('data-d')) + len) % len;
      X.sfx.notch(); draw(); if (o.change) o.change();
    });
    box.appendChild(n); draw();
    return {
      node: n,
      get: function () { return at.map(function (k, i) { return o.vals[i][k]; }).join(''); },
      at: function () { return at.slice(); },
      set: function (list) { at = list.slice(); draw(); },
      lock: function (on) { off = !!on; n.classList.toggle('off', off); }
    };
  };
  X.DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  X.HOURS = (function () { var a = [], i; for (i = 0; i < 24; i++) a.push(two(i)); return a; })();
  X.TENS = ['0', '1', '2', '3', '4', '5'];
  return X;
})();
