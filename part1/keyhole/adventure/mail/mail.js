/* Seven Sacks for Tolver - what every room of the story shares: a few sounds, small helpers, the weather office's
   wind sheet (it is wanted again at the very end) and the five things that lie under the Windgate.
   Loaded after engine.js. Nothing in here knows an answer. */
window.MAIL = (function () {
  'use strict';
  var X = {}, NS = 'http://www.w3.org/2000/svg';
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so that the sound button switches them) ---------- */
  X.sfx = {
    chalk: function () { B({ type: 'bandpass', f: 2600, q: 1.2, dur: 0.12, peak: 0.07, a: 0.02 }); },
    crayon: function () { B({ type: 'bandpass', f: 1500, q: 0.9, dur: 0.2, peak: 0.06, a: 0.04 }); },
    notch: function () { B({ dur: 0.018, f: 3600, q: 5, peak: 0.09 }); },
    pin: function () { T({ f: 260, f2: 150, dur: 0.07, peak: 0.2 }); B({ dur: 0.03, f: 2400, q: 3, peak: 0.14 }); },
    /* a speaking tube: somebody blows at the far end, and the plug in this end gives one breathy note */
    tube: function () { T({ f: 760, f2: 800, dur: 0.5, peak: 0.07, a: 0.05 }); B({ type: 'bandpass', f: 800, q: 3, dur: 0.5, peak: 0.07, a: 0.05 }); },
    sand: function () { B({ type: 'highpass', f: 1800, dur: 0.7, peak: 0.12, a: 0.03 }); T({ f: 110, f2: 70, dur: 0.12, peak: 0.25 }); },
    hiss: function () { B({ type: 'highpass', f: 3200, dur: 0.55, peak: 0.07, a: 0.06 }); },
    thud: function () { T({ f: 100, f2: 55, dur: 0.22, peak: 0.45 }); B({ type: 'lowpass', f: 700, dur: 0.08, peak: 0.2 }); },
    flap: function () { B({ type: 'bandpass', f: 500, f2: 900, q: 0.8, dur: 0.3, peak: 0.12, a: 0.05 }); },
    lever: function () { T({ f: 150, f2: 90, dur: 0.14, peak: 0.35 }); B({ dur: 0.04, f: 1900, q: 1.5, peak: 0.2, when: 0.03 }); },
    gust: function () { B({ type: 'bandpass', f: 330, f2: 700, q: 0.6, dur: 2, peak: 0.1, a: 0.8 }); },
    stamp: function () { T({ f: 90, f2: 50, dur: 0.16, peak: 0.5 }); B({ type: 'lowpass', f: 900, dur: 0.05, peak: 0.3 }); }
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
  X.mine = function (id, title, html, quiet) { return ER.addClue(id, title, '<h4>' + title + '</h4>' + html, 'mine', 'Your slate', quiet); };
  /* words that a paper or a person has just taught go into the notebook */
  X.words = function (list) {
    var G = window.GLOSS || [];
    list.forEach(function (w) { for (var i = 0; i < G.length; i++) if (G[i][0] === w) { ER.addWord(G[i][0], G[i][1]); break; } });
  };
  X.mins = function () {
    var st = ER.state(), end = ER.flag('tEnd') || Date.now();
    if (st.fin && st.fin.secs) return Math.max(1, Math.round(st.fin.secs / 60));
    return Math.max(1, Math.round((end - (st.t0 || end)) / 60000));
  };
  X.el = function (tag, attrs, html) {
    var n = document.createElementNS(NS, tag), k;
    for (k in attrs) n.setAttribute(k, attrs[k]);
    if (html != null) n.innerHTML = html;
    return n;
  };
  X.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };

  /* wheels: a number set one figure at a time.  o = {label, n: how many wheels, start: [..], cls, change: fn} */
  X.wheels = function (box, o) {
    var at = (o.start || []).slice(), s = o.label ? '<small>' + o.label + '</small>' : '', off = false, i;
    for (i = 0; i < o.n; i++) {
      if (at[i] == null) at[i] = 0;
      s += '<span class="wl"><button type="button" data-j="' + i + '" data-d="1" title="up">&#9650;</button><b></b><button type="button" data-j="' + i + '" data-d="-1" title="down">&#9660;</button></span>';
    }
    if (o.unit) s += '<i>' + o.unit + '</i>';
    var n = ER.el('span', 'wls ' + (o.cls || ''), s), cells = ER.$$('b', n);
    function draw() { cells.forEach(function (c, j) { c.textContent = at[j]; }); }
    n.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null, j;
      if (!b || off) return;
      j = +b.getAttribute('data-j');
      at[j] = (at[j] + (+b.getAttribute('data-d')) + 10) % 10;
      X.sfx.notch(); draw(); if (o.change) o.change();
    });
    box.appendChild(n); draw();
    return { node: n, get: function () { return String(+at.join('')); }, at: function () { return at.slice(); }, lock: function (on) { off = !!on; n.classList.toggle('off', off); } };
  };

  /* ---------- the wind sheet ---------- */
  /* [height, west of the range: from, km/h, note; east of the range: from, km/h, note]  ('' = calm, null = no air there at all) */
  X.WIND = [
    [3000, 'W', 85, '', 'W', 85, ''], [2500, 'W', 60, '', 'W', 60, ''], [2000, 'W', 40, 'in cloud', 'W', 30, ''],
    [1500, 'W', 20, '', 'E', 25, ''], [1000, 'E', 15, '', 'E', 30, ''], [500, '', 0, 'mist', null, 0, 'under the ground: Tolver is at 800 m']
  ];
  X.wind = function (h, east) {
    for (var i = 0; i < X.WIND.length; i++) if (X.WIND[i][0] === +h) return { from: X.WIND[i][east ? 4 : 1], kmh: X.WIND[i][east ? 5 : 2] };
    return null;
  };
  X.metres = function (h) { h = String(h); return h.length > 3 ? h.slice(0, -3) + ',' + h.slice(-3) : h; };
  X.met = function () {
    function cell(f, v, note) { return '<td>' + (f === null ? '' : f ? f + ' ' + v : 'calm') + (note ? ' <small>' + note + '</small>' : '') + '</td>'; }
    return '<h4>Lowmere Weather Office</h4><p class="sub">UPPER WINDS &middot; Thursday &middot; balloons sent up at 05.00 &middot; for the masters of DUNNOCK and GOSHAWK</p>' +
      '<table><tr><th>Height</th><th>West of the range<br>(Lowmere balloon)</th><th>East of the range<br>(Tolver, by telegraph)</th></tr>' +
      X.WIND.map(function (r) { return '<tr><td>' + X.metres(r[0]) + ' m</td>' + cell(r[1], r[2], r[3]) + cell(r[4], r[5], r[6]) + '</tr>'; }).join('') + '</table>' +
      '<p>Speeds in kilometres an hour. A wind is named for the direction it comes FROM: a west wind (W) blows from the west towards the east.</p>' +
      '<p>CLOUD. West of the range, one layer: its base at 1,800 m and its top at 2,300 m. It lies on the range itself. East of the range: none.</p>' +
      '<p class="sig">R. Ketteridge. I am sorry about the cloud.</p>';
  };

  /* ---------- what lies under the Windgate, seen straight down from 400 metres (600 x 380, east on the right) ---------- */
  function rocks(list) { return list.map(function (r) { return '<path d="' + r + '" fill="#5d6470"/>'; }).join(''); }
  function prints(d) { return '<path d="' + d + '" fill="none" stroke="#9fb2c9" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round"/>'; }
  var SNOW = '<rect width="600" height="380" fill="#eef3f8"/><path d="M0 250q120 -40 240 -10t360 -50v190H0z" fill="#dde7f1"/><path d="M0 60q160 30 300 0t300 20V0H0z" fill="#e4ecf5"/>';
  X.VIGS = ['tarn', 'cross', 'roof', 'snow', 'lip'];
  X.VIGNAME = { tarn: 'the tarn', cross: 'the cross', roof: 'the roof', snow: 'the snowfield', lip: 'the Lip' };
  X.vig = function (kind) {
    if (kind === 'tarn') return SNOW + rocks(['M40 40l70 -20 60 30 -30 50 -80 10z', 'M430 290l80 -30 70 40 -40 50h-90z', 'M470 50l60 -10 40 40 -50 30z', 'M70 300l50 -24 44 30 -30 40h-50z']) +
      '<ellipse cx="300" cy="196" rx="152" ry="98" fill="#8f9aa6"/><ellipse cx="300" cy="192" rx="140" ry="88" fill="#b7cddb"/><ellipse cx="290" cy="184" rx="112" ry="62" fill="#c9dbe6"/>' +
      '<path d="M200 170l70 26 20 -34M290 196l60 44M350 240l52 -12M270 196l-30 46" stroke="#f4f8fb" stroke-width="2.4" fill="none"/>' + prints('M0 330q150 -20 250 14t350 -30');
    if (kind === 'cross') return SNOW + rocks(['M420 60l70 -24 60 34 -40 44 -70 6z', 'M40 280l60 -20 50 30 -30 40H50z']) +
      '<ellipse cx="300" cy="200" rx="150" ry="104" fill="#d5e0ec"/><ellipse cx="292" cy="192" rx="118" ry="78" fill="#f7fafc"/>' +
      '<path d="M300 186L150 120l-8 18 150 62z" fill="#8296b0" opacity=".55"/><path d="M286 150h28v30h30v28h-30v44h-28v-44h-30v-28h30z" fill="#7b7f86" stroke="#4c5058" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M292 156h16v30h30" stroke="#a9adb3" stroke-width="3" fill="none"/>' + prints('M0 318q120 10 180 -40t120 -30 110 60 190 -10');
    if (kind === 'roof') return SNOW + rocks(['M30 50l60 -20 50 30 -40 40z']) +
      '<path d="M176 250h250v84H176z" fill="none" stroke="#6a6f78" stroke-width="7"/><path d="M196 110l230 30 -10 110 -230 -30z" fill="#8296b0" opacity=".4"/>' +
      '<path d="M170 104h256v130H170z" fill="#b5402c"/><path d="M170 104h256v65H170z" fill="#cf5238"/><path d="M170 169h256" stroke="#7d2a1c" stroke-width="4"/>' +
      '<g stroke="#9c3523" stroke-width="2"><path d="M202 104v130M234 104v130M266 104v130M298 104v130M330 104v130M362 104v130M394 104v130"/></g>' +
      '<rect x="340" y="150" width="26" height="26" fill="#4c5058"/><rect x="346" y="156" width="14" height="14" fill="#1e2126"/>' +
      '<path d="M360 163q70 -16 130 -6t110 -10" stroke="#c9ced6" stroke-width="20" fill="none" stroke-linecap="round" opacity=".8"/><path d="M366 163q60 -10 120 -2t114 -8" stroke="#eef1f5" stroke-width="8" fill="none" stroke-linecap="round" opacity=".9"/>' +
      '<path d="M210 250v84" stroke="#6a6f78" stroke-width="3"/><circle cx="392" cy="304" r="5" fill="#4c5058"/>' + prints('M300 236v60q40 30 120 20t180 10');
    if (kind === 'snow') {
      var s = SNOW + rocks(['M500 40l60 -16 40 30v30l-70 4z']) + '<path d="M150 200L470 96q40 100 -10 214z" fill="#c8402c" opacity=".34"/><path d="M190 200L440 130q26 70 -6 150z" fill="#c8402c" opacity=".46"/>', i, a, r;
      for (i = 0; i < 150; i++) { a = -0.32 + ((i * 37) % 100) / 100 * 0.66; r = 40 + ((i * 53) % 97) / 97 * 280; s += '<circle cx="' + (150 + Math.cos(a) * r).toFixed(0) + '" cy="' + (200 + Math.sin(a) * r).toFixed(0) + '" r="' + (1.6 + (i % 4) * 0.7) + '" fill="#b3321f"/>'; }
      return s + prints('M0 196q90 0 150 4') + '<g fill="none" stroke="#56698a" stroke-width="4.200" stroke-dasharray="2 7" stroke-linecap="round"><ellipse cx="318" cy="204" rx="118" ry="62"/><ellipse cx="322" cy="202" rx="84" ry="42"/><ellipse cx="312" cy="206" rx="50" ry="24"/><path d="M200 204q-30 60 40 96t190 -20"/></g>';
    }
    return '<rect width="600" height="380" fill="#39424f"/><path d="M250 0q40 110 0 190t30 190h320V0z" fill="#2b323d"/><g stroke="#55606e" stroke-width="3" fill="none"><path d="M300 0q40 120 4 200t30 180M370 0q30 130 0 210t26 170M450 0q24 140 0 220t20 160"/></g>' +
      '<path d="M0 0h236q50 100 6 190t20 190H0z" fill="#eef3f8"/><path d="M190 0h46q50 100 6 190t20 190h-50q-40 -100 0 -190t-22 -190z" fill="#d5e0ec"/>' +
      '<g fill="#fff" opacity=".9"><path d="M180 60q120 -30 250 -6t170 -20v60q-80 20 -180 4t-240 20z"/><path d="M200 200q110 -26 220 0t180 -14v70q-90 16 -190 0t-210 14z"/><path d="M210 320q90 -20 200 -4t190 -16v80H210z"/></g>' + prints('M0 196q120 0 220 4');
  };
  return X;
})();
