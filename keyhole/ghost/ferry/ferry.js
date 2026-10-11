/* When the Tide Serves - what every room of the story shares: the ship's own sounds, small helpers, and people
   drawn as figures (standing, or sitting on the saloon bench). Loaded after engine.js. Nothing in here knows an answer. */
window.FY = (function () {
  'use strict';
  var X = {}, D = document;
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so that the sound button switches them) ---------- */
  X.sfx = {
    /* the whistle: one long blast. v = how loud (1 on deck, less behind a door), n = how many blasts */
    horn: function (v, n) {
      var i, k, t;
      v = v == null ? 1 : v;
      for (k = 0; k < (n || 1); k++) {
        t = k * 3.3;
        for (i = 0; i < 3; i++) {
          T({ type: 'sawtooth', f: 146.8, dur: 1.5, peak: 0.05 * v, a: 0.22, when: t + i * 0.72 });
          T({ type: 'sawtooth', f: 220.6, dur: 1.5, peak: 0.028 * v, a: 0.22, when: t + i * 0.72 });
          T({ type: 'sine', f: 73.4, dur: 1.5, peak: 0.07 * v, a: 0.22, when: t + i * 0.72 });
        }
      }
    },
    count: function () { B({ dur: 0.025, f: 2600, q: 4, peak: 0.24 }); T({ f: 240, f2: 150, dur: 0.05, peak: 0.14, when: 0.012 }); },
    label: function () { B({ type: 'highpass', f: 2200, dur: 0.1, peak: 0.07, a: 0.02 }); T({ f: 420, f2: 300, dur: 0.05, peak: 0.07, when: 0.03 }); },
    stick: function () { B({ type: 'lowpass', f: 1400, dur: 0.07, peak: 0.2 }); },
    pencil: function () { B({ type: 'bandpass', f: 3000, f2: 3600, q: 2.2, dur: 0.16, peak: 0.045, a: 0.02 }); },
    rub: function () { B({ type: 'bandpass', f: 1500, f2: 900, q: 1, dur: 0.22, peak: 0.05, a: 0.04 }); },
    wheel: function () { B({ dur: 0.02, f: 1900, q: 5, peak: 0.2 }); T({ f: 300, f2: 220, dur: 0.04, peak: 0.08 }); },
    ring: function () {                     /* the engine-room telegraph: two strokes on its gong */
      [0, 0.34].forEach(function (w) { [1, 2.4, 3.9].forEach(function (m, i) { T({ f: 880 * m, dur: 0.9 / (i + 1), peak: 0.1 / (i + 1), when: w }); }); B({ dur: 0.02, f: 3600, q: 1, peak: 0.12, when: w }); });
    },
    coins: function () { [0, 0.09, 0.2].forEach(function (w, i) { T({ f: 1900 + i * 240, dur: 0.16, peak: 0.05, when: w }); B({ dur: 0.02, f: 4200, q: 2, peak: 0.08, when: w }); }); },
    thump: function () { T({ f: 90, f2: 48, dur: 0.24, peak: 0.42 }); B({ type: 'lowpass', f: 600, dur: 0.08, peak: 0.25 }); },
    screw: function () { for (var i = 0; i < 5; i++) B({ type: 'bandpass', f: 1200 + i * 60, q: 6, dur: 0.05, peak: 0.06, when: i * 0.09 }); }
  };
  /* In fog a ship under way sounds one long blast every two minutes. first, every: milliseconds. Returns a function that stops it. */
  X.whistle = function (first, every, v) {
    var t1 = 0, t2 = 0;
    function blow() { if (!D.hidden) X.sfx.horn(v); }
    t1 = setTimeout(function () { blow(); t2 = setInterval(blow, every || 120000); }, first || 30000);
    return function () { clearTimeout(t1); clearInterval(t2); };
  };
  /* A door opens. The music answers in the room's own key, as it does after ER.exit; without music, three plain notes. */
  X.solved = function (quiet) {
    var sung = false;
    try { sung = !!(ER.music && ER.music() && ER.track && ER.track.sting('solved', null, !!quiet)); } catch (e) {}
    if (!sung && !quiet) ER.sfx.ok();
  };

  /* ---------- small helpers ---------- */
  /* a thing in the scene that has a name and something to say */
  X.thing = function (sel, word, line, busy, after) {
    ER.$$(sel).forEach(function (n) {
      n.addEventListener('click', function (e) {
        if (busy && busy()) return;
        if (word) ER.wordAt(e.clientX, e.clientY, word);
        if (line) ER.say(typeof line === 'function' ? line() : line);
        if (after) after();
      });
    });
  };
  /* a note of your own in the notebook */
  X.mine = function (id, title, html, quiet) { return ER.addClue(id, title, '<h4>' + title + '</h4>' + html, 'mine', 'Your notes', quiet); };
  /* words go into the notebook when the paper that uses them has been read */
  X.terms = function (list) {
    var G = window.GLOSS || [];
    list.forEach(function (w) { for (var i = 0; i < G.length; i++) if (G[i][0] === w) { ER.addWord(G[i][0], G[i][1]); break; } });
  };
  X.minutesPlayed = function () {
    var st = ER.state(), end = ER.flag('tEnd') || Date.now();
    if (st.fin && st.fin.secs) return Math.max(1, Math.round(st.fin.secs / 60));
    return Math.max(1, Math.round((end - (st.t0 || end)) / 60000));
  };
  X.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  X.flash = function (n, cls, ms) { n.classList.add(cls || 'bad'); setTimeout(function () { n.classList.remove(cls || 'bad'); }, ms || 900); };
  /* a clock face with its hands at the time of the story */
  X.clock = function (cx, cy, r, h, m, o) {
    o = o || {};
    var ha = ((h % 12) + m / 60) * 30 - 90, ma = m * 6 - 90, s = '', i;
    function p(ang, len) { var q = ang * Math.PI / 180; return (cx + Math.cos(q) * len).toFixed(1) + ' ' + (cy + Math.sin(q) * len).toFixed(1); }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 6) + '" fill="' + (o.rim || '#b8923a') + '"/><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + (o.face || '#f3ecd6') + '"/>';
    for (i = 0; i < 12; i++) s += '<path d="M' + p(i * 30, r * 0.8) + 'L' + p(i * 30, r * 0.93) + '" stroke="' + (o.ink || '#1c1d22') + '" stroke-width="' + (i % 3 ? 1.4 : 2.8) + '"/>';
    s += '<path d="M' + cx + ' ' + cy + 'L' + p(ha, r * 0.5) + '" stroke="' + (o.ink || '#1c1d22') + '" stroke-width="' + (r * 0.13).toFixed(1) + '" stroke-linecap="round"/>' +
      '<path d="M' + cx + ' ' + cy + 'L' + p(ma, r * 0.76) + '" stroke="' + (o.ink || '#1c1d22') + '" stroke-width="' + (r * 0.08).toFixed(1) + '" stroke-linecap="round"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.09).toFixed(1) + '" fill="' + (o.ink || '#1c1d22') + '"/>';
    return s;
  };

  /* ---------- people ---------- */
  function hatOf(o, y) {         /* y = the middle of the head */
    var c = o.hatCol || '#2a2f33', s = '';
    if (o.hat === 'flat') s += '<path d="M-27 ' + (y - 10) + 'q4 -22 29 -22q24 0 26 16q6 2 12 8q-18 -4 -40 -3z" fill="' + c + '"/>';
    else if (o.hat === 'peak') s += '<path d="M-25 ' + (y - 12) + 'q-2 -24 25 -25q27 1 25 25z" fill="' + c + '"/><path d="M-25 ' + (y - 13) + 'h50v6h-50z" fill="' + (o.band || '#15181a') + '"/>' +
      (o.back ? '' : '<path d="M-24 ' + (y - 7) + 'q24 9 48 0l5 6q-29 10 -58 0z" fill="#15181a"/><circle cx="0" cy="' + (y - 24) + '" r="4.5" fill="' + (o.badge || '#d8b150') + '"/>');
    else if (o.hat === 'bobble') s += '<path d="M-25 ' + (y - 6) + 'q-2 -30 25 -31q27 1 25 31q-25 -8 -50 0z" fill="' + c + '"/><circle cx="0" cy="' + (y - 40) + '" r="8" fill="' + (o.band || '#e9e3d2') + '"/><path d="M-25 ' + (y - 8) + 'q25 -8 50 0v7q-25 -8 -50 0z" fill="' + (o.band || '#e9e3d2') + '"/>';
    else if (o.hat === 'scarf') s += o.back ?
      '<path d="M-26 ' + (y + 6) + 'q-4 -36 26 -37q30 1 26 37q-4 14 -12 22h-28q-8 -8 -12 -22z" fill="' + c + '"/><path d="M-8 ' + (y + 26) + 'l8 16 8 -16z" fill="' + c + '"/>' :
      '<path d="M-26 ' + (y + 3) + 'q-3 -33 26 -33q29 0 26 33q-9 -17 -26 -17t-26 17z" fill="' + c + '"/><path d="M-23 ' + (y - 2) + 'q-2 27 23 31q25 -4 23 -31" stroke="' + c + '" stroke-width="7" fill="none"/>' +
      '<path d="M-7 ' + (y + 27) + 'h14l-3 7 6 11h-9l-1 -8 -1 8h-9l6 -11z" fill="' + c + '"/>';
    return s;
  }
  function headOf(o, y) {
    var skin = o.skin || '#e8c4a2', hair = o.hair || '#3a2a1c', s = '';
    s += '<rect x="-7" y="' + (y + 16) + '" width="14" height="22" fill="' + skin + '"/><circle cx="0" cy="' + y + '" r="23" fill="' + skin + '"/>';
    if (o.back) {
      if (o.hat !== 'scarf') s += '<circle cx="0" cy="' + (y - 2) + '" r="23.5" fill="' + hair + '"/>';
    } else {
      if (o.style === 'short') s += '<path d="M-23 ' + (y - 2) + 'q2 -27 23 -27t23 27q-10 -12 -23 -12t-23 12z" fill="' + hair + '"/>';
      else if (o.style === 'side') s += '<path d="M-23 ' + (y + 4) + 'q-4 -24 6 -30q-2 12 0 22zM23 ' + (y + 4) + 'q4 -24 -6 -30q2 12 0 22z" fill="' + hair + '"/>';
      else if (o.style === 'bob') s += '<path d="M-23 ' + (y - 2) + 'q2 -27 23 -27t23 27q-10 -12 -23 -12t-23 12zM-23 ' + (y - 6) + 'q-7 22 -2 38h9q-4 -18 -1 -30zM23 ' + (y - 6) + 'q7 22 2 38h-9q4 -18 1 -30z" fill="' + hair + '"/>';
      else if (o.style === 'bun') s += '<path d="M-23 ' + (y - 2) + 'q2 -27 23 -27t23 27q-10 -12 -23 -12t-23 12zM-9 ' + (y - 30) + 'a9 9 0 1 1 18 0a9 9 0 1 1 -18 0z" fill="' + hair + '"/>';
      else if (o.style === 'plaits') s += '<path d="M-23 ' + (y - 2) + 'q2 -27 23 -27t23 27q-10 -12 -23 -12t-23 12z" fill="' + hair + '"/><path d="M-22 ' + (y + 4) + 'q-8 20 -4 44M22 ' + (y + 4) + 'q8 20 4 44" stroke="' + hair + '" stroke-width="8" fill="none" stroke-linecap="round"/>';
      if (o.asleep) s += '<path d="M-12 ' + (y + 1) + 'q4 3 8 0M4 ' + (y + 1) + 'q4 3 8 0" stroke="#2a2420" stroke-width="2.2" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="' + (y + 13) + '" rx="4" ry="5" fill="#5a2a22"/>';
      else s += '<path d="M-11 ' + (y + 1) + 'h7M4 ' + (y + 1) + 'h7" stroke="#2a2420" stroke-width="2.6" stroke-linecap="round"/><path d="M-6 ' + (y + 13) + 'q6 ' + (o.smile == null ? 3 : o.smile) + ' 12 0" stroke="#8c4a3c" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
      if (o.beard) s += '<path d="M-21 ' + (y + 6) + 'q2 26 21 28q19 -2 21 -28q-8 12 -21 12t-21 -12z" fill="' + o.beard + '"/>';
      if (o.tash) s += '<path d="M-11 ' + (y + 9) + 'q11 -6 22 0q-11 3 -22 0z" fill="' + o.tash + '"/>';
      if (o.specs) s += '<circle cx="-8" cy="' + (y + 1) + '" r="7" fill="none" stroke="' + o.specs + '" stroke-width="2"/><circle cx="8" cy="' + (y + 1) + '" r="7" fill="none" stroke="' + o.specs + '" stroke-width="2"/>';
    }
    return s + hatOf(o, y);
  }
  /* Standing: feet at 0 0, about 300 high.
     o = {skin, hair, style, coat, hem (how far the coat ends above the ground: 60 = a long coat, 120 = a jacket), legs, shoes, belt (colour), collar,
          hat: 'flat' | 'peak' | 'bobble' | 'scarf', hatCol, band, badge, beard, tash, specs, back: true (seen from behind), hold: true (hands together in front),
          extra (drawn last), under (drawn first), shadow} */
  X.person = function (o) {
    var skin = o.skin || '#e8c4a2', coat = o.coat || '#2c3a40', hem = o.hem == null ? 110 : o.hem, legs = o.legs || '#23262b', s = '', w = hem < 90 ? 43 : 38, H = 252 - hem;
    s += '<ellipse cx="0" cy="2" rx="46" ry="8" fill="#000" opacity="' + (o.shadow == null ? 0.3 : o.shadow) + '"/>';
    if (o.under) s += o.under;
    s += '<path d="M-19 0v-' + (hem + 14) + 'h16v' + (hem + 14) + 'zM3 0v-' + (hem + 14) + 'h16v' + (hem + 14) + 'z" fill="' + legs + '"/>';
    s += '<path d="M-23 0h21v7h-25zM2 0h21q4 4 4 7h-25z" fill="' + (o.shoes || '#15161a') + '"/>';
    s += '<path d="M-' + w + ' -' + hem + 'q-6 -' + (H - 10) + ' ' + w + ' -' + H + 'q' + (w + 6) + ' 10 ' + w + ' ' + H + 'z" fill="' + coat + '"/>';
    if (!o.back) {
      s += '<path d="M-10 -242l10 26 10 -26z" fill="' + (o.collar || '#e9e3d2') + '"/>';
      if (hem < 90) s += '<path d="M0 -216V-' + hem + '" stroke="#000" stroke-opacity=".22" stroke-width="2"/>';
    }
    if (o.belt) s += '<path d="M-37 -166h74" stroke="' + o.belt + '" stroke-width="9"/>' + (o.back ? '' : '<rect x="-7" y="-172" width="14" height="12" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="2"/>');
    if (o.hold) s += '<path d="M-34 -206q-16 34 14 54M34 -206q16 34 -14 54" stroke="' + (o.sleeve || coat) + '" stroke-width="15" fill="none" stroke-linecap="round"/><circle cx="-16" cy="-150" r="8" fill="' + skin + '"/><circle cx="16" cy="-150" r="8" fill="' + skin + '"/>';
    else s += '<path d="M-34 -206q-14 40 -5 86M34 -206q14 40 5 86" stroke="' + (o.sleeve || coat) + '" stroke-width="15" fill="none" stroke-linecap="round"/><circle cx="-39" cy="-114" r="8" fill="' + skin + '"/><circle cx="39" cy="-114" r="8" fill="' + skin + '"/>';
    s += headOf(o, -272);
    if (o.extra) s += o.extra;
    return s;
  };
  /* Sitting on a bench: feet at 0 0, the seat 96 above them, about 262 high. The same options; lap = colour of what is worn below the waist. */
  X.sit = function (o) {
    var skin = o.skin || '#e8c4a2', coat = o.coat || '#2c3a40', legs = o.legs || '#23262b', s = '', hy = o.asleep ? -226 : -234;
    if (o.under) s += o.under;
    s += '<path d="M-24 0v-92h18v92zM6 0v-92h18v92z" fill="' + legs + '"/><path d="M-28 0h23v7h-27zM4 0h23q4 4 4 7h-27z" fill="' + (o.shoes || '#15161a') + '"/>';
    s += '<path d="M-36 -96q-8 -100 36 -106q44 6 36 106z" fill="' + coat + '"/>';
    s += '<path d="M-34 -112h68v26q-34 10 -68 0z" fill="' + (o.lap || legs) + '"/>';
    if (!o.back) s += '<path d="M-10 -204l10 24 10 -24z" fill="' + (o.collar || '#e9e3d2') + '"/>';
    if (o.belt) s += '<path d="M-35 -132h70" stroke="' + o.belt + '" stroke-width="8"/>';
    if (o.hold) s += '<path d="M-32 -172q-14 30 14 50M32 -172q14 30 -14 50" stroke="' + (o.sleeve || coat) + '" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="-16" cy="-120" r="8" fill="' + skin + '"/><circle cx="16" cy="-120" r="8" fill="' + skin + '"/>';
    else s += '<path d="M-32 -172q-12 30 -2 62M32 -172q12 30 2 62" stroke="' + (o.sleeve || coat) + '" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="-33" cy="-106" r="8" fill="' + skin + '"/><circle cx="33" cy="-106" r="8" fill="' + skin + '"/>';
    s += (o.asleep ? '<g transform="rotate(-16 0 -200)">' : '<g>') + headOf(o, hy) + '</g>';
    if (o.extra) s += o.extra;
    return s;
  };
  /* the people of the story, as they are dressed tonight */
  X.PEOPLE = {
    purser: { skin: '#c99670', hair: '#1c1512', style: 'bun', coat: '#1d2f4a', hem: 124, legs: '#1b2433', collar: '#f1ede2', hat: 'peak', hatCol: '#f1ede2', band: '#1d2f4a', badge: '#d8b150' },
    skipper: { skin: '#e3bf9c', hair: '#c9ccce', style: 'side', coat: '#1a2a35', hem: 130, legs: '#151b21', collar: '#39505c', hat: 'peak', hatCol: '#1a2a35', band: '#0e161b', badge: '#d8b150', beard: '#d7dadc' },
    dougie: { skin: '#eccdb2', hair: '#e2e2de', style: 'side', coat: '#3a3d34', hem: 76, legs: '#2a2b28', collar: '#7d2f2a', hat: 'flat', hatCol: '#5a5a4a', tash: '#ecece8' },
    lionel: { skin: '#f0cfae', hair: '#8a5a2e', style: 'side', coat: '#b8922e', hem: 66, legs: '#22262a', collar: '#f1ede2', hat: 'peak', hatCol: '#15223a', band: '#0d1524', badge: '#f2d674', specs: '#3a2a1c' },
    elsie: { skin: '#f1d5bd', hair: '#5a3a22', style: 'none', coat: '#b9a57a', hem: 62, legs: '#3a3026', shoes: '#3a2414', collar: '#efe6cf', belt: '#8f7c52', hat: 'scarf', hatCol: '#7d2f3a' },
    rob: { skin: '#e3bf9c', hair: '#3a2a1c', style: 'short', coat: '#3d5a6a', legs: '#2a2c33', collar: '#d9d2bd' },
    posy: { skin: '#f1d5bd', hair: '#b4682a', style: 'plaits', coat: '#c9453a', legs: '#27457a', collar: '#f1ede2', smile: 6 },
    marek: { skin: '#f0cfae', hair: '#c9a24a', style: 'short', coat: '#e2731c', legs: '#22262a', collar: '#22262a' },
    tess: { skin: '#8a5a3a', hair: '#15110f', style: 'bob', coat: '#5a2f52', legs: '#22262a', collar: '#e9c46a', specs: '#c9a23a' },
    julian: { skin: '#eccdb2', hair: '#8f8a80', style: 'side', coat: '#3f6a45', hem: 118, legs: '#5a5140', collar: '#d9d2bd', hat: 'bobble', hatCol: '#3f6a45', band: '#e9c46a' },
    man: { skin: '#e3bf9c', hair: '#3a2a1c', style: 'short', coat: '#34424a', hem: 120, legs: '#23262b', collar: '#7a8f9a', hat: 'bobble', hatCol: '#8c2f24', band: '#efe6cf' }
  };
  function mix(name, more) { var o = {}, k, b = X.PEOPLE[name]; for (k in b) o[k] = b[k]; for (k in (more || {})) o[k] = more[k]; return o; }
  X.who = function (name, more) { return X.person(mix(name, more)); };
  X.seated = function (name, more) { return X.sit(mix(name, more)); };
  return X;
})();
