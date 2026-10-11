/* A Smell of Vinegar - what every room of the story shares: a few sounds, a lens that can be dragged,
   fingerprints as drawings, and small helpers. Loaded after engine.js and ridges.js. Nothing in here knows an answer. */
window.FAIR = (function () {
  'use strict';
  var X = {}, D = document, NS = 'http://www.w3.org/2000/svg', lensNo = 0;
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so that the sound button switches them) ---------- */
  X.sfx = {
    brush: function () { B({ type: 'highpass', f: 4200, dur: 0.11, peak: 0.035, a: 0.04 }); },
    tape: function () { B({ type: 'highpass', f: 1800, f2: 5200, dur: 0.22, peak: 0.12, a: 0.02 }); },
    stamp: function () { T({ f: 110, f2: 52, dur: 0.17, peak: 0.5 }); B({ type: 'lowpass', f: 900, dur: 0.06, peak: 0.35 }); },
    drop: function () { T({ f: 1300, f2: 600, dur: 0.07, peak: 0.12 }); },
    /* 1 = a few small bubbles, 2 = a proper fizz */
    fizz: function (level) {
      var i, n = level > 1 ? 16 : 6;
      B({ type: 'highpass', f: level > 1 ? 3600 : 5200, dur: level > 1 ? 2.4 : 1.3, peak: level > 1 ? 0.1 : 0.032, a: 0.15 });
      for (i = 0; i < n; i++) T({ f: 1900 + Math.random() * 1500, f2: 1300, dur: 0.03, peak: level > 1 ? 0.05 : 0.025, when: 0.1 + Math.random() * (level > 1 ? 2 : 1.1) });
    },
    pour: function () { B({ type: 'bandpass', f: 800, f2: 1500, q: 0.8, dur: 0.22, peak: 0.07, a: 0.05 }); },
    scratch: function () { B({ type: 'highpass', f: 3600, dur: 0.16, peak: 0.07, a: 0.03 }); },
    sizzle: function () { B({ type: 'bandpass', f: 2600, q: 0.7, dur: 1.5, peak: 0.05, a: 0.3 }); },
    keys: function () { [3100, 4200, 3600, 4800].forEach(function (f, i) { T({ f: f, dur: 0.09, peak: 0.035, when: i * 0.07 }); }); T({ f: 150, f2: 80, dur: 0.18, peak: 0.35, when: 0.42 }); },
    clip: function () { B({ dur: 0.03, f: 2600, q: 3, peak: 0.25 }); T({ f: 240, f2: 150, dur: 0.08, peak: 0.2, when: 0.02 }); },
    whoosh: function () { B({ type: 'bandpass', f: 500, f2: 2600, q: 0.6, dur: 1.6, peak: 0.16, a: 0.5 }); }
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

  /* ---------- fingerprints as drawings ---------- */
  /* the path of one print, to be put into <defs>; it takes its colour from whatever uses it */
  X.printPath = function (card, finger, id) {
    return '<path id="' + id + '" d="' + RIDGES.d(RIDGES.get(card, finger)) + '" fill="none" stroke-width="3.1" stroke-linecap="round" stroke-linejoin="round"/>';
  };

  /* ---------- a lens to drag over a drawing ----------
     o = {x, y, r, zoom, href: '#id of the group to look at', bg, lim: [x0, y0, x1, y1], move: fn(pos)} */
  X.lens = function (svg, o) {
    var id = 'fl' + (++lensNo), r = o.r, z = o.zoom || 2.5, pos = { x: o.x, y: o.y }, off = { x: 0, y: 0 }, lim = o.lim || [0, 0, 1000, 600];
    var g = X.el('g', { 'class': 'tool lens' },
      '<clipPath id="' + id + '"><circle r="' + (r - 3) + '"/></clipPath>' +
      '<path d="M' + (r * 0.72) + ' ' + (r * 0.72) + 'l' + (r * 0.8) + ' ' + (r * 0.8) + '" stroke="#241a10" stroke-width="16" stroke-linecap="round"/>' +
      '<path d="M' + (r * 0.8) + ' ' + (r * 0.72) + 'l' + (r * 0.66) + ' ' + (r * 0.66) + '" stroke="#6b4a2a" stroke-width="5" stroke-linecap="round"/>' +
      '<circle r="' + r + '" fill="' + (o.bg || '#f4f1e6') + '"/>' +
      '<g clip-path="url(#' + id + ')"><use href="' + o.href + '"/></g>' +
      '<circle r="' + r + '" fill="none" stroke="#1d1a16" stroke-width="9"/><circle r="' + (r - 5.5) + '" fill="none" stroke="#c9a23a" stroke-width="2.5"/>' +
      '<path d="M' + (-r * 0.62) + ' ' + (-r * 0.3) + 'A' + (r * 0.7) + ' ' + (r * 0.7) + ' 0 0 1 ' + (-r * 0.2) + ' ' + (-r * 0.66) + '" stroke="#fff" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round"/>');
    svg.appendChild(g);
    var use = g.querySelector('use');
    function place() {
      g.setAttribute('transform', 'translate(' + pos.x.toFixed(1) + ' ' + pos.y.toFixed(1) + ')');
      use.setAttribute('transform', 'scale(' + z + ') translate(' + (-pos.x).toFixed(1) + ' ' + (-pos.y).toFixed(1) + ')');
      if (o.move) o.move(pos);
    }
    ER.drag(g, {
      start: function (e) { var p = ER.pt(svg, e); off.x = pos.x - p.x; off.y = pos.y - p.y; },
      move: function (e) { var p = ER.pt(svg, e); pos.x = X.clamp(p.x + off.x, lim[0], lim[2]); pos.y = X.clamp(p.y + off.y, lim[1], lim[3]); place(); }
    });
    place();
    return { g: g, pos: pos, set: function (x, y) { pos.x = x; pos.y = y; place(); } };
  };
  /* drag any tool about inside a bench; h = {start, move(pos), end(pos)}; returns {set, home} */
  X.tool = function (svg, node, home, h, lim) {
    var pos = { x: home.x, y: home.y }, off = { x: 0, y: 0 };
    lim = lim || [0, 0, 1000, 600];
    function place() { node.setAttribute('transform', 'translate(' + pos.x.toFixed(1) + ' ' + pos.y.toFixed(1) + ')'); }
    ER.drag(node, {
      start: function (e) { if (h.start && h.start() === false) return false; var p = ER.pt(svg, e); off.x = pos.x - p.x; off.y = pos.y - p.y; },
      move: function (e) { var p = ER.pt(svg, e); pos.x = X.clamp(p.x + off.x, lim[0], lim[2]); pos.y = X.clamp(p.y + off.y, lim[1], lim[3]); place(); if (h.move) h.move(pos); },
      end: function () { if (h.end) h.end({ x: pos.x, y: pos.y }); }      /* a copy: the tool may be sent home before the place is looked at */
    });
    place();
    return { pos: pos, set: function (x, y) { pos.x = x; pos.y = y; place(); }, home: function () { pos.x = home.x; pos.y = home.y; place(); } };
  };
  return X;
})();
