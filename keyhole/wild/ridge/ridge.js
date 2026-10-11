/* The Cold Door - what every room of the story shares: a few sounds, the printed sheet and the pencil that marks it,
   rings to press and join, wheels to set a number on, and a compass that can be laid on the map or held in the hand.
   Loaded after engine.js and map.js. Nothing in here knows an answer: places are only where the map prints them. */
window.RIDGE = (function () {
  'use strict';
  var X = {}, D = document, NS = 'http://www.w3.org/2000/svg';
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so that the sound button switches them) ---------- */
  X.sfx = {
    gust: function () { B({ type: 'bandpass', f: 330, f2: 640, q: 0.6, dur: 2.2, peak: 0.1, a: 0.9 }); },
    step: function () { B({ type: 'lowpass', f: 620, dur: 0.1, peak: 0.22 }); B({ type: 'lowpass', f: 520, dur: 0.1, peak: 0.18, when: 0.34 }); },
    pencil: function () { B({ type: 'highpass', f: 3000, dur: 0.16, peak: 0.05, a: 0.03 }); },
    rub: function () { B({ type: 'bandpass', f: 1500, q: 0.8, dur: 0.22, peak: 0.05, a: 0.05 }); },
    notch: function () { B({ dur: 0.018, f: 3800, q: 5, peak: 0.09 }); },
    pin: function () { T({ f: 260, f2: 150, dur: 0.07, peak: 0.22 }); B({ dur: 0.03, f: 2400, q: 3, peak: 0.16 }); },
    lay: function () { B({ type: 'lowpass', f: 1100, dur: 0.06, peak: 0.2 }); T({ f: 190, f2: 120, dur: 0.07, peak: 0.12 }); },
    buzz: function () { T({ type: 'square', f: 148, dur: 0.22, peak: 0.05 }); T({ type: 'square', f: 148, dur: 0.22, peak: 0.05, when: 0.34 }); },
    sent: function () { T({ f: 880, dur: 0.12, peak: 0.07 }); T({ f: 1175, dur: 0.2, peak: 0.07, when: 0.11 }); },
    fail: function () { T({ type: 'triangle', f: 310, f2: 200, dur: 0.32, peak: 0.12 }); },
    /* a pea whistle: two high notes very close together, which beat against each other, and a little breath */
    whistle: function (far) {
      var v = far ? 0.22 : 1, d = far ? 0.55 : 0.7;
      T({ f: 2930, f2: 2960, dur: d, peak: 0.085 * v, a: 0.02 }); T({ f: 2972, f2: 3004, dur: d, peak: 0.07 * v, a: 0.02 });
      B({ type: 'bandpass', f: 3000, q: 2.5, dur: d, peak: 0.05 * v, a: 0.02 });
    },
    torch: function () { B({ dur: 0.02, f: 2300, q: 2, peak: 0.14 }); },
    water: function () { B({ type: 'bandpass', f: 900, f2: 1500, q: 0.7, dur: 0.5, peak: 0.06, a: 0.15 }); },
    latch: function () { T({ f: 130, f2: 70, dur: 0.16, peak: 0.4 }); B({ dur: 0.04, f: 2000, q: 1.2, peak: 0.2, when: 0.02 }); }
  };
  /* A door opens. The music answers in the room's own key, as it does after ER.exit; without music, three plain notes. */
  X.solved = function (quiet) {
    var sung = false;
    try { sung = !!(ER.music && ER.music() && ER.track && ER.track.sting('solved', null, !!quiet)); } catch (e) {}
    if (!sung && !quiet) ER.sfx.ok();
  };

  /* ---------- small helpers ---------- */
  /* a thing in the scene that has a name and something to say */
  X.thing = function (sel, word, line, busy) {
    ER.$$(sel).forEach(function (n) {
      n.addEventListener('click', function (e) {
        if (busy && busy()) return;
        if (word) ER.wordAt(e.clientX, e.clientY, word);
        if (line) ER.say(typeof line === 'function' ? line() : line);
      });
    });
  };
  /* a note of your own in the notebook */
  X.mine = function (id, title, html, quiet) { return ER.addClue(id, title, '<h4>' + title + '</h4>' + html, 'mine', 'Your notes', quiet); };
  /* the words of the subject go into the notebook when the page that teaches them has been read */
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
  X.pad3 = function (n) { return ('00' + n).slice(-3); };
  function f1(v) { return (Math.round(v * 10) / 10).toString(); }

  /* ---------- the sheet ---------- */
  /* grid kilometres -> the sheet's own units (1000 x 600, 200 to the kilometre, north at the top) */
  X.P = function (e, n) { var m = window.SKALLAN; return { x: (e - m.e0) * m.px, y: (m.n0 + m.h / m.px - n) * m.px }; };
  /* and back: the six figures of the hundred-metre square that a point of the sheet lies in */
  X.six = function (x, y) {
    var m = window.SKALLAN, e = Math.floor((m.e0 + x / m.px) * 10 + 1e-6), n = Math.floor((m.n0 + (m.h - y) / m.px) * 10 + 1e-6);
    return String(e) + String(n);
  };
  /* the whole sheet, or a part of it: view = [x, y, width, height] in its units; over = whatever lies on top */
  X.sheet = function (view, over) {
    return '<div class="fold"><svg class="sheet" viewBox="' + view.join(' ') + '" preserveAspectRatio="xMidYMid meet"><g class="sk">' + window.SKALLAN.svg + '</g>' + (over || '') + '</svg></div>';
  };
  X.WHOLE = [-26, -6, 1052, 626];
  /* pencil: a ring round a place, with a word beside it; a line through places, with a word half way */
  X.ring = function (p, word, dx, dy, r) {
    return '<circle class="pn" cx="' + f1(p.x) + '" cy="' + f1(p.y) + '" r="' + (r || 9) + '"/>' +
      (word ? '<text class="pnT" x="' + f1(p.x + (dx == null ? 12 : dx)) + '" y="' + f1(p.y + (dy == null ? -8 : dy)) + '">' + word + '</text>' : '');
  };
  X.pline = function (pts, word, dx, dy, cls) {
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + f1(p.x) + ' ' + f1(p.y); }).join(''), a = pts[0], b = pts[pts.length - 1];
    return '<path class="pn ' + (cls || '') + '" d="' + d + '"/>' +
      (word ? '<text class="pnT" x="' + f1((a.x + b.x) / 2 + (dx || 0)) + '" y="' + f1((a.y + b.y) / 2 + (dy || 0)) + '">' + word + '</text>' : '');
  };

  /* ---------- rings to press ----------
     pts = [{id, x, y}]; o = {r, hit, lock: fn -> bool, pick: fn(id), join: fn(idA, idB)}
     With `join`: press on one ring and let go on another, or click one and then the other. */
  X.rings = function (svg, layer, pts, o) {
    var armed = null, nodes = {}, band = X.el('path', { 'class': 'rb', d: '' }), hit = o.hit || 11;
    function near(q) {
      var best = null, bd = hit * hit * 2.2;
      pts.forEach(function (p) { var d = (p.x - q.x) * (p.x - q.x) + (p.y - q.y) * (p.y - q.y); if (d < bd) { bd = d; best = p; } });
      return best;
    }
    function arm(p) { if (armed) nodes[armed.id].classList.remove('on'); armed = p; if (p) nodes[p.id].classList.add('on'); }
    pts.forEach(function (p) {
      var g = X.el('g', { 'class': 'rg', 'data-id': p.id }, '<circle class="hit" cx="' + f1(p.x) + '" cy="' + f1(p.y) + '" r="' + hit + '"/><circle class="o" cx="' + f1(p.x) + '" cy="' + f1(p.y) + '" r="' + (o.r || 6) + '"/>');
      layer.appendChild(g); nodes[p.id] = g;
      ER.drag(g, {
        start: function () { if (o.lock && o.lock()) return false; },
        move: function (e, moved) { if (!moved || !o.join) return; var q = ER.pt(svg, e); band.setAttribute('d', 'M' + f1(p.x) + ' ' + f1(p.y) + 'L' + f1(q.x) + ' ' + f1(q.y)); },
        end: function (e, moved) {
          var t = near(ER.pt(svg, e));
          band.setAttribute('d', '');
          if (moved && o.join) { arm(null); if (t && t !== p) o.join(p.id, t.id); return; }
          if (o.join) {
            if (armed && armed !== p) { var a = armed; arm(null); o.join(a.id, p.id); }
            else arm(armed === p ? null : p);
          }
          if (o.pick) o.pick(p.id);
        }
      });
    });
    layer.appendChild(band);
    return { nodes: nodes, disarm: function () { arm(null); } };
  };

  /* ---------- wheels: a number written one figure at a time ----------
     o = {label, vals: [[...], ...] one list for each wheel, start: [index, ...], sep: {wheelIndex: 'text before it'}, cls, change: fn} */
  X.wheels = function (box, o) {
    var at = (o.start || o.vals.map(function () { return 0; })).slice(), s = o.label ? '<small>' + o.label + '</small>' : '', off = false;
    o.vals.forEach(function (v, i) {
      if (o.sep && o.sep[i]) s += '<i>' + o.sep[i] + '</i>';
      s += '<span class="wl"><button type="button" data-j="' + i + '" data-d="1" title="up">&#9650;</button><b></b><button type="button" data-j="' + i + '" data-d="-1" title="down">&#9660;</button></span>';
    });
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

  /* ---------- the compass ----------
     Drawn round the middle of its dial, with the direction-of-travel arrow pointing up the page. Sizes are in the
     sheet's units: the plate is 2.2 km wide at 1:25 000, as a real one is, so a grid line always shows through the dial. */
  X.compassSvg = function () {
    var s = '<g class="cp"><rect class="cp-plate" x="-110" y="-310" width="220" height="440" rx="18"/>', i, y, a, x, h;
    for (i = 0; i <= 40; i++) {                       /* the scale along the left edge: centimetres, which are 250 m here */
      y = 110 - i * 10;
      s += '<path class="cp-edge" d="M-110 ' + y + 'h' + (i % 5 ? 6 : 12) + '"/>';
      if (i && i % 5 === 0) s += '<text class="cp-mark" x="-95" y="' + (y + 3) + '">' + (i / 5) + '</text>';
    }
    s += '<text class="cp-mark" x="-95" y="124">cm</text><circle class="cp-edge" cx="0" cy="-226" r="27"/><path class="cp-arrow" d="M0 -118V-294M-10 -276L0 -297L10 -276"/>' +
      '<path class="cp-edge" d="M62 -300v34M62 -300h38"/><text class="cp-mark" x="66" y="-258">1:25 000</text>';
    s += '<g class="cp-dial"><circle class="cp-cap" r="76"/>';
    [-56, -40, -24, 24, 40, 56].forEach(function (xx) { h = Math.sqrt(72 * 72 - xx * xx); s += '<path class="cp-ol" d="M' + xx + ' ' + (-h).toFixed(1) + 'V' + h.toFixed(1) + '"/>'; });
    s += '<path class="cp-shed" d="M-9 56V-38H-17L0 -66L17 -38H9V56Z"/><circle class="cp-bezel" r="88" fill="none" stroke-width="24" pointer-events="stroke"/>';
    for (a = 0; a < 360; a += 2) {
      s += '<path class="cp-tick' + (a % 10 ? '' : ' big') + '" d="M0 -77V' + (a % 10 ? -81 : -84) + '" transform="rotate(' + a + ')"/>';
      if (a % 20 === 0) s += '<text class="cp-num' + (a ? '' : ' n') + '" y="' + (a ? -88 : -87) + '" transform="rotate(' + a + ')">' + (a === 0 ? 'N' : a === 180 ? 'S' : a) + '</text>';
    }
    s += '</g><g class="cp-needle"><path d="M0 -60L7 0H-7Z" fill="#d3301c"/><path d="M0 60L7 0H-7Z" fill="#f2f2ec" stroke="#3b444a" stroke-width="1"/><circle r="4.5" fill="#22292d"/><circle r="1.6" fill="#c9ced3"/></g>' +
      '<path class="cp-idx" d="M0 -101V-113"/><g class="cp-read" transform="translate(0 -132)"><rect x="-27" y="-11" width="54" height="22" rx="4"/><text y="5.5">000°</text></g></g>';
    return s;
  };
  /* c = RIDGE.compass(the <g class="cp">): place it, turn its dial, swing its needle. Azimuths are degrees clockwise from the top of the page. */
  X.compass = function (g) {
    var st = { x: 0, y: 0, az: 0, dial: 0, nd: 0, k: 1 }, dialG = g.querySelector('.cp-dial'), needleG = g.querySelector('.cp-needle'),
      readG = g.querySelector('.cp-read'), readT = readG.querySelector('text');
    function mod(v) { return ((v % 360) + 360) % 360; }
    function reading() { return mod(Math.round(st.az - st.dial)); }
    function draw() {
      g.setAttribute('transform', 'translate(' + f1(st.x) + ' ' + f1(st.y) + ') rotate(' + st.az.toFixed(2) + ') scale(' + st.k + ')');
      dialG.setAttribute('transform', 'rotate(' + (st.dial - st.az).toFixed(2) + ')');
      needleG.style.transform = 'rotate(' + (st.nd - st.az).toFixed(2) + 'deg)';
      readG.setAttribute('transform', 'translate(0 -132) rotate(' + (-st.az).toFixed(2) + ')');
      readT.textContent = X.pad3(reading()) + '°';
    }
    var c = {
      st: st, g: g, bezel: g.querySelector('.cp-bezel'), draw: draw, reading: reading, mod: mod,
      /* put it somewhere, pointing some way: the dial goes round with the plate, so the number at the index line stays */
      place: function (x, y, az, k) { var r = st.az - st.dial; st.x = x; st.y = y; if (az != null) { st.az = az; st.dial = az - r; } if (k) st.k = k; draw(); },
      setReading: function (r) { st.dial = st.az - r; draw(); },
      /* how far the dial's N is from pointing at the top of the sheet: -180 .. 180 */
      off: function () { var v = mod(st.dial); return v > 180 ? v - 360 : v; },
      needle: function (a) { var d = mod(a - st.nd); if (d > 180) d -= 360; st.nd += d; draw(); },
      /* how far the red end of the needle is from the red arrow on the dial: -180 .. 180 */
      shed: function () { var v = mod(st.nd - st.dial); return v > 180 ? v - 360 : v; }
    };
    draw();
    return c;
  };
  /* the dial is turned by taking hold of its rim. o = {lock: fn, change: fn, end: fn} */
  X.dialDrag = function (svg, c, o) {
    var last = 0;
    function ang(e) { var p = ER.pt(svg, e); return Math.atan2(p.x - c.st.x, -(p.y - c.st.y)) * 180 / Math.PI; }
    ER.drag(c.bezel, {
      start: function (e) { if (o.lock && o.lock()) return false; last = ang(e); },
      move: function (e) {
        var a = ang(e), d = a - last;
        if (d > 180) d -= 360; if (d < -180) d += 360;
        last = a; c.st.dial += d; c.draw();
        if (Math.abs(d) > 0.4) X.sfx.notch();
        if (o.change) o.change();
      },
      end: function () { if (o.end) o.end(); }
    });
  };
  return X;
})();
