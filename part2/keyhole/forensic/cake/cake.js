/* Warm in the Middle - what every room of the story shares: a few sounds, tools that can be carried about a bench,
   the colours of two indicators, the people as small figures, the cake, and the marks that feet leave in flour.
   Loaded after engine.js. Nothing in here knows an answer. */
window.CAKE = (function () {
  'use strict';
  var X = {}, D = document, NS = 'http://www.w3.org/2000/svg', uid = 0;
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so that the sound button switches them) ---------- */
  X.sfx = {
    drop: function () { T({ f: 1250, f2: 640, dur: 0.07, peak: 0.11 }); },
    clink: function () { T({ f: 2500, dur: 0.16, peak: 0.07 }); T({ f: 3350, dur: 0.1, peak: 0.035, when: 0.01 }); },
    stamp: function () { T({ f: 110, f2: 52, dur: 0.17, peak: 0.5 }); B({ type: 'lowpass', f: 900, dur: 0.06, peak: 0.35 }); },
    pencil: function () { B({ type: 'highpass', f: 3400, dur: 0.14, peak: 0.06, a: 0.03 }); },
    slide: function () { B({ type: 'bandpass', f: 1500, f2: 2600, q: 0.7, dur: 0.2, peak: 0.05, a: 0.05 }); },
    dot: function () { T({ type: 'triangle', f: 660, dur: 0.07, peak: 0.12 }); },
    snip: function () { B({ dur: 0.03, f: 2600, q: 3, peak: 0.22 }); T({ f: 240, f2: 150, dur: 0.08, peak: 0.18, when: 0.02 }); },
    brush: function () { B({ type: 'highpass', f: 4200, dur: 0.12, peak: 0.035, a: 0.04 }); },
    key: function () { [3100, 4200, 3600].forEach(function (f, i) { T({ f: f, dur: 0.09, peak: 0.035, when: i * 0.07 }); }); T({ f: 150, f2: 80, dur: 0.18, peak: 0.32, when: 0.34 }); },
    lamp: function () { B({ dur: 0.02, f: 3200, q: 2, peak: 0.18 }); }
  };
  /* A door opens. The music answers in the room's own key, as it does after ER.exit; without music, three plain notes. */
  X.solved = function (quiet) {
    var sung = false;
    try { sung = !!(ER.music && ER.music() && ER.track && ER.track.sting('solved', null, !!quiet)); } catch (e) {}
    if (!sung && !quiet) ER.sfx.ok();
  };

  /* ---------- small helpers ---------- */
  X.thing = function (sel, word, line, busy) {          /* a thing in the scene that has a name and something to say */
    ER.$$(sel).forEach(function (n) {
      n.addEventListener('click', function (e) {
        if (busy && busy()) return;
        if (word) ER.wordAt(e.clientX, e.clientY, word);
        if (line) ER.say(typeof line === 'function' ? line() : line);
      });
    });
  };
  X.mine = function (id, title, html, quiet) { return ER.addClue(id, title, '<h4>' + title + '</h4>' + html, 'mine', 'Your notes', quiet); };
  X.terms = function (list) {                            /* the words of the subject go into the notebook when the page that teaches them has been read */
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
  /* carry a tool about inside a bench; h = {start() -> false to refuse, move(pos), end(pos)}; returns {pos, set, home} */
  X.tool = function (svg, node, home, h, lim) {
    var pos = { x: home.x, y: home.y }, off = { x: 0, y: 0 };
    h = h || {}; lim = lim || [0, 0, 1000, 600];
    function place() { node.setAttribute('transform', 'translate(' + pos.x.toFixed(1) + ' ' + pos.y.toFixed(1) + ')'); }
    ER.drag(node, {
      start: function (e) { if (h.start && h.start() === false) return false; var p = ER.pt(svg, e); off.x = pos.x - p.x; off.y = pos.y - p.y; },
      move: function (e) { var p = ER.pt(svg, e); pos.x = X.clamp(p.x + off.x, lim[0], lim[2]); pos.y = X.clamp(p.y + off.y, lim[1], lim[3]); place(); if (h.move) h.move(pos); },
      end: function (e, moved) { if (h.end) h.end({ x: pos.x, y: pos.y }, moved); }
    });
    place();
    return { pos: pos, set: function (x, y) { pos.x = x; pos.y = y; place(); }, home: function () { pos.x = home.x; pos.y = home.y; place(); }, at: function (p) { home.x = p.x; home.y = p.y; } };
  };

  /* ---------- two indicators: a colour for each step of the pH scale, 1 to 14 ---------- */
  X.UI = ['', '#b81d24', '#e23a2e', '#f07a26', '#f4a62a', '#f3cf2e', '#c9d83c', '#4caf50', '#27a08c', '#2b82c9', '#2b4fb8', '#5a3fb0', '#7a35a8', '#8e2a9a', '#6a1c72'];
  X.UIN = ['', 'dark red', 'red', 'orange', 'amber', 'yellow', 'yellow-green', 'green', 'teal', 'blue', 'dark blue', 'violet', 'purple', 'red-purple', 'the darkest purple'];
  X.RC = ['', '#cf1f3c', '#d9345a', '#de5a98', '#d67dbd', '#b78ad8', '#a688dc', '#927fd8', '#4a80dc', '#3a8fd0', '#2a9fb0', '#4fae4a', '#86bc3c', '#c8cf3a', '#e8da3c'];
  X.RCBAND = [['1', '2', 'red'], ['3', '4', 'pink'], ['5', '7', 'purple'], ['8', '8', 'blue'], ['9', '10', 'blue-green'], ['11', '12', 'green'], ['13', '14', 'yellow']];
  X.mix = function (a, b, k) {                          /* k of the way from colour a to colour b */
    var i, out = '#', va, vb;
    for (i = 1; i < 7; i += 2) { va = parseInt(a.substr(i, 2), 16); vb = parseInt(b.substr(i, 2), 16); out += ('0' + Math.round(va + (vb - va) * k).toString(16)).slice(-2); }
    return out;
  };
  X.icing = function (ph) { return X.mix(X.RC[ph], '#ffffff', ph === 6 ? 0.5 : 0.36); };       /* red-cabbage colour stirred into white icing */
  /* the two strips of the laboratory's card, 14 steps wide; x, y of the top left corner, w the width of a step */
  X.strips = function (x, y, w, small) {
    var s = '', i, h = small ? 20 : 26, f = small ? 11 : 13;
    s += '<text x="' + (x - 8) + '" y="' + (y + h - 7) + '" class="tB" font-size="' + f + '" fill="#17324d" text-anchor="end" letter-spacing="1">UNIVERSAL INDICATOR</text>' +
      '<text x="' + (x - 8) + '" y="' + (y + h * 2 + f + 9) + '" class="tB" font-size="' + f + '" fill="#6b3f8f" text-anchor="end" letter-spacing="1">RED-CABBAGE WATER</text>';
    for (i = 1; i <= 14; i++) {
      s += '<rect x="' + (x + (i - 1) * w) + '" y="' + y + '" width="' + (w - 2) + '" height="' + h + '" fill="' + X.UI[i] + '"/>' +
        '<text x="' + (x + (i - 0.5) * w - 1) + '" y="' + (y + h + f + 2) + '" class="tM" font-size="' + f + '" fill="#1b2430" text-anchor="middle">' + i + '</text>' +
        '<rect x="' + (x + (i - 1) * w) + '" y="' + (y + h + f + 8) + '" width="' + (w - 2) + '" height="' + h + '" fill="' + X.RC[i] + '"/>';
    }
    return s;
  };

  /* ---------- the people, as small figures: feet at 0,0 ---------- */
  var FIG = {
    novak: '<ellipse cx="0" cy="2" rx="52" ry="8" fill="#000" opacity=".32"/>' +
      '<path d="M-20 0v-100h16v100zM4 0v-100h16v100z" fill="#2c3540"/><path d="M-24 0h22v7h-26zM2 0h22v7h-22z" fill="#111"/>' +
      '<path d="M-46 -58q-6 -182 46 -192t46 192z" fill="#4a5560"/><path d="M-17 -62l4 -180h26l4 180z" fill="#27415e"/><path d="M-9 -250l9 32 9 -32z" fill="#eef1f0"/>' +
      '<path d="M-6 -240l5 80M6 -240l-5 80" stroke="#b3261c" stroke-width="2.800"/><rect x="-9" y="-164" width="18" height="22" fill="#f2f4ee"/>' +
      '<path d="M-17 -246l-12 44 12 34M17 -246l12 44 -12 34" stroke="#39434d" stroke-width="5" fill="none" stroke-linejoin="round"/>' +
      '<path d="M-40 -214q-14 52 -6 104" stroke="#4a5560" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="-46" cy="-106" r="8" fill="#e4c19c"/>' +
      '<path d="M40 -214q16 42 2 74l-24 -12" stroke="#4a5560" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="16" cy="-154" r="8" fill="#e4c19c"/>' +
      '<path d="M16 -156l-5 -46" stroke="#c9ced3" stroke-width="4" stroke-linecap="round"/><circle cx="11" cy="-204" r="6" fill="#f0b429"/>' +
      '<rect x="-8" y="-270" width="16" height="20" fill="#d6ae86"/><circle cx="0" cy="-290" r="28" fill="#e4c19c"/>' +
      '<path d="M-30 -285q-3 -38 30 -38t30 38q3 17 -6 23q5 -28 -6 -43q-18 -11 -36 0q-11 15 -6 43q-9 -6 -6 -23z" fill="#46464b"/>' +
      '<circle cx="-10" cy="-288" r="8.500" fill="none" stroke="#15171a" stroke-width="2.300"/><circle cx="10" cy="-288" r="8.500" fill="none" stroke="#15171a" stroke-width="2.300"/><path d="M-1.500 -288h3" stroke="#15171a" stroke-width="2.300"/>' +
      '<path d="M-7 -272q7 4 14 0" stroke="#8c4a3c" stroke-width="2.300" fill="none"/>',
    whitlow: '<ellipse cx="0" cy="2" rx="66" ry="9" fill="#000" opacity=".32"/>' +
      '<path d="M-28 0v-112h24v112zM4 0v-112h24v112z" fill="#59606a"/><path d="M-34 0h32v10h-36zM2 0h32v10h-32z" fill="#f1efe6"/>' +
      '<path d="M-62 -90q-12 -188 62 -198t62 198z" fill="#6b4a32"/><path d="M-17 -98l3 -180h28l3 180z" fill="#dfe8f2"/>' +
      '<path d="M-9 -276v176M0 -276v176M9 -276v176" stroke="#7f9cc4" stroke-width="2.600"/><path d="M-14 -280l14 24 14 -24l-6 -8h-16z" fill="#dfe8f2" stroke="#7f9cc4" stroke-width="2"/>' +
      '<path d="M-17 -278l-16 44 16 34M17 -278l16 44 -16 34" stroke="#4f3522" stroke-width="5" fill="none" stroke-linejoin="round"/>' +
      '<path d="M-54 -240q-20 62 -8 124" stroke="#6b4a32" stroke-width="24" fill="none" stroke-linecap="round"/><circle cx="-62" cy="-108" r="11" fill="#e8c4a2"/>' +
      '<path d="M54 -240q20 62 8 124" stroke="#6b4a32" stroke-width="24" fill="none" stroke-linecap="round"/><circle cx="62" cy="-108" r="11" fill="#e8c4a2"/>' +
      '<rect x="-12" y="-302" width="24" height="26" fill="#d9b08c"/><ellipse cx="0" cy="-330" rx="33" ry="35" fill="#e8c4a2"/>' +
      '<path d="M-33 -328q-7 -14 3 -28q3 18 1 36zM33 -328q7 -14 -3 -28q-3 18 -1 36z" fill="#eceae6"/>' +
      '<path d="M-19 -341h13M6 -341h13" stroke="#f8f6f1" stroke-width="4.500" stroke-linecap="round"/><circle cx="-12" cy="-331" r="2.700" fill="#2b2a28"/><circle cx="12" cy="-331" r="2.700" fill="#2b2a28"/>' +
      '<path d="M-17 -310q17 -11 34 0q-17 7 -34 0z" fill="#b9b4aa"/>',
    chika: '<ellipse cx="0" cy="2" rx="48" ry="8" fill="#000" opacity=".32"/>' +
      '<path d="M-17 0v-108h14v108zM3 0v-108h14v108z" fill="#1f2430"/><path d="M-23 0h22v8h-26zM1 0h22v8h-22z" fill="#f4f4f1"/><path d="M-22 4h20M2 4h20" stroke="#c94f6d" stroke-width="2"/>' +
      '<path d="M-40 -82q-6 -162 40 -170t40 170z" fill="#d9a441"/><path d="M0 -244v160" stroke="#b5832a" stroke-width="3"/><circle cx="7" cy="-200" r="3" fill="#8a611c"/><circle cx="7" cy="-120" r="3" fill="#8a611c"/>' +
      '<path d="M-16 -250q16 12 32 0l-3 16q-13 8 -26 0z" fill="#3f6e68"/>' +
      '<path d="M-36 -216q-14 38 -4 68l22 4" stroke="#d9a441" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M36 -216q14 38 4 68l-22 4" stroke="#d9a441" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<rect x="-23" y="-164" width="46" height="27" fill="#fdfdfb" stroke="#c9c2b4" stroke-width="1.500"/><path d="M-23 -151h46M0 -164v27" stroke="#b79ad6" stroke-width="3"/>' +
      '<circle cx="-21" cy="-144" r="7" fill="#7a4a2e"/><circle cx="21" cy="-144" r="7" fill="#7a4a2e"/>' +
      '<rect x="-7" y="-268" width="14" height="18" fill="#6e4228"/><circle cx="0" cy="-288" r="25" fill="#7a4a2e"/>' +
      '<circle cx="0" cy="-322" r="19" fill="#1c1410"/><path d="M-25 -292q0 -27 25 -27t25 27q-10 -14 -25 -14t-25 14z" fill="#1c1410"/>' +
      '<path d="M-12 -288h7M5 -288h7" stroke="#150f0b" stroke-width="2.600" stroke-linecap="round"/><path d="M-6 -275h12" stroke="#4a2418" stroke-width="2.200" stroke-linecap="round"/><circle cx="-25" cy="-282" r="2.500" fill="#f0c95a"/>',
    /* on the customers' chair, with the box on her knee */
    chikasit: '<ellipse cx="6" cy="2" rx="62" ry="9" fill="#000" opacity=".32"/>' +
      '<path d="M-34 -110q-6 -124 34 -128q40 4 34 128" fill="none" stroke="#2b1c14" stroke-width="7"/><path d="M-14 -112q-2 -84 14 -96q16 12 14 96" fill="none" stroke="#2b1c14" stroke-width="4"/>' +
      '<path d="M-30 -108L-37 0M30 -108L37 0M-17 -108l-2 104M17 -108l2 104" stroke="#2b1c14" stroke-width="6" stroke-linecap="round"/><ellipse cx="0" cy="-110" rx="41" ry="9" fill="#3a2619"/>' +
      '<path d="M-33 -108q-6 -122 33 -130t33 130z" fill="#d9a441"/><path d="M-26 -118h74v24h-74z" fill="#1f2430"/><path d="M-33 -124h52v14h-52z" fill="#c9952f"/>' +
      '<path d="M22 -98v98h14v-98zM40 -98v98h14v-98z" fill="#1f2430"/><path d="M18 0h22v8h-26zM38 0h22v8h-24z" fill="#f4f4f1"/><path d="M19 4h20M39 4h20" stroke="#c94f6d" stroke-width="2"/>' +
      '<path d="M-14 -238q14 12 28 0l-3 16q-11 8 -22 0z" fill="#3f6e68"/>' +
      '<rect x="0" y="-150" width="50" height="28" fill="#fdfdfb" stroke="#c9c2b4" stroke-width="1.500"/><path d="M0 -136h50M25 -150v28" stroke="#b79ad6" stroke-width="3"/>' +
      '<path d="M-29 -208q-12 40 2 64l26 6" stroke="#d9a441" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M29 -208q16 28 12 54" stroke="#d9a441" stroke-width="14" fill="none" stroke-linecap="round"/>' +
      '<circle cx="3" cy="-136" r="7" fill="#7a4a2e"/><circle cx="42" cy="-150" r="7" fill="#7a4a2e"/>' +
      '<rect x="-7" y="-256" width="14" height="18" fill="#6e4228"/><circle cx="0" cy="-276" r="25" fill="#7a4a2e"/>' +
      '<circle cx="0" cy="-310" r="19" fill="#1c1410"/><path d="M-25 -280q0 -27 25 -27t25 27q-10 -14 -25 -14t-25 14z" fill="#1c1410"/>' +
      '<path d="M-10 -276h7M7 -276h7" stroke="#150f0b" stroke-width="2.600" stroke-linecap="round"/><path d="M-3 -263h11" stroke="#4a2418" stroke-width="2.200" stroke-linecap="round"/><circle cx="-25" cy="-270" r="2.500" fill="#f0c95a"/>',
    arthur: '<ellipse cx="0" cy="2" rx="44" ry="7" fill="#000" opacity=".3"/>' +
      '<path d="M-15 0v-72h13v72zM2 0v-72h13v72z" fill="#dfe8f2"/><path d="M-10 -70v70M-6 -70v70M7 -70v70M11 -70v70" stroke="#7f9cc4" stroke-width="1.600"/>' +
      '<path d="M-21 0h21v8h-24zM0 0h21v8h-21z" fill="#f1efe6" stroke="#b9b4a6" stroke-width="1"/>' +
      '<path d="M-38 -58q-8 -152 38 -160t38 160z" fill="#9c2b2b"/>' +
      '<g stroke="#1f3a2a" stroke-width="3.200" opacity=".75" fill="none"><path d="M-36 -96h72M-38 -136h76M-34 -176h68M-18 -214v154M15 -214v154"/></g>' +
      '<g stroke="#e9c93a" stroke-width="1.200" opacity=".85" fill="none"><path d="M-37 -116h74M-36 -156h72M-2 -216v158"/></g>' +
      '<path d="M-11 -220l11 42 11 -42z" fill="#dfe8f2"/><path d="M-11 -220l-9 48 20 -6M11 -220l9 48 -20 -6" stroke="#7d1f1f" stroke-width="6" fill="none" stroke-linejoin="round"/>' +
      '<path d="M-37 -126q37 13 74 0" stroke="#e9c93a" stroke-width="4.500" fill="none"/><path d="M-6 -120v24M-2 -120v20" stroke="#e9c93a" stroke-width="3.500" stroke-linecap="round"/>' +
      '<path d="M-32 -198q-14 42 -4 88" stroke="#9c2b2b" stroke-width="15" fill="none" stroke-linecap="round"/><circle cx="-38" cy="-106" r="7.500" fill="#ecd0b6"/>' +
      '<path d="M32 -198q14 38 0 66l-16 -6" stroke="#9c2b2b" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="13" cy="-146" r="12" fill="#d9c9a0"/><path d="M4 -152q9 8 18 0M5 -144q8 6 16 0M13 -158v24" stroke="#a8935c" stroke-width="1.600" fill="none"/><circle cx="18" cy="-136" r="7" fill="#ecd0b6"/>' +
      '<rect x="-7" y="-238" width="14" height="18" fill="#dcc0a6"/><circle cx="0" cy="-258" r="25" fill="#ecd0b6"/>' +
      '<path d="M-25 -258q-5 -16 6 -27q-2 13 2 21zM25 -258q5 -16 -6 -27q2 13 -2 21z" fill="#f6f4f0"/><path d="M-9 -283q9 -8 18 0" stroke="#f6f4f0" stroke-width="4.500" fill="none" stroke-linecap="round"/>' +
      '<circle cx="-8" cy="-277" r="6" fill="#fff" fill-opacity=".3" stroke="#3a3530" stroke-width="1.800"/><circle cx="8" cy="-277" r="6" fill="#fff" fill-opacity=".3" stroke="#3a3530" stroke-width="1.800"/><path d="M-2 -277h4" stroke="#3a3530" stroke-width="1.800"/>' +
      '<path d="M-13 -256h7M6 -256h7" stroke="#3a3530" stroke-width="2.400" stroke-linecap="round"/><path d="M-6 -243q6 4 12 0" stroke="#9c5a4a" stroke-width="2" fill="none" stroke-linecap="round"/>',
    /* Crumb, asleep */
    cat: '<ellipse cx="2" cy="-13" rx="42" ry="17" fill="#c9a36a"/><path d="M38 -14q14 -2 12 10q-3 10 -40 8" fill="none" stroke="#c9a36a" stroke-width="9" stroke-linecap="round"/>' +
      '<circle cx="-30" cy="-19" r="14" fill="#c9a36a"/><path d="M-42 -27l2 -13 9 8zM-22 -32l7 -10 3 12z" fill="#c9a36a"/><path d="M-37 -19q4 3 8 0" stroke="#5a3f20" stroke-width="1.800" fill="none"/>' +
      '<path d="M-10 -28q4 8 0 16M4 -30q4 9 0 18M18 -28q4 8 0 16" stroke="#a8824a" stroke-width="3" fill="none" stroke-linecap="round"/><ellipse cx="-34" cy="-11" rx="6" ry="4" fill="#f1e6d0"/>',
    /* Crumb, awake and sitting */
    catsit: '<path d="M-16 0q-8 -44 16 -48t16 48z" fill="#c9a36a"/><path d="M14 -4q22 -2 20 -22" fill="none" stroke="#c9a36a" stroke-width="8" stroke-linecap="round"/>' +
      '<circle cx="0" cy="-56" r="15" fill="#c9a36a"/><path d="M-13 -64l1 -15 10 9zM13 -64l-1 -15 -10 9z" fill="#c9a36a"/><circle cx="-5" cy="-57" r="2" fill="#2a2a1a"/><circle cx="5" cy="-57" r="2" fill="#2a2a1a"/>' +
      '<path d="M-2 -51h4l-2 3z" fill="#8a5a4a"/><path d="M-9 -30q9 6 18 0" stroke="#f1e6d0" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-6 -44q3 6 0 12M5 -44q3 6 0 12" stroke="#a8824a" stroke-width="2.600" fill="none" stroke-linecap="round" opacity=".7"/>'
  };
  X.fig = function (who) { return FIG[who] || ''; };

  /* ---------- the cake: four tiers; 0,0 is the middle of the foot of the bottom tier ----------
     o = {stain: [colour for the bottom tier, colour for the second] or null, spray: true (the sugar wisteria), flowers: true (fresh ones on top)} */
  var TW = [300, 236, 174, 114], TH = [86, 80, 72, 64];
  X.cakeTop = function () { return -(TH[0] + TH[1] + TH[2] + TH[3]); };
  X.cake = function (o) {
    o = o || {};
    var s = '', i, k, n, w, h, ry, yb = 0, yt, t, body = '#cdbdea', top = '#e2d8f4', tops = [];
    for (i = 0; i < 4; i++) {
      w = TW[i]; h = TH[i]; ry = w * 0.1; yt = yb - h; tops.push(yt);
      s += '<path d="M' + (-w / 2) + ' ' + yt + 'V' + yb + 'A' + (w / 2) + ' ' + ry + ' 0 0 0 ' + (w / 2) + ' ' + yb + 'V' + yt + 'z" fill="' + body + '"/>' +
        '<path d="M' + (-w / 2) + ' ' + yt + 'V' + yb + 'A' + (w / 2) + ' ' + ry + ' 0 0 0 ' + (-w / 4) + ' ' + (yb + ry * 0.87) + 'V' + yt + 'z" fill="#5a3a8a" opacity=".16"/>' +
        '<path d="M' + (w / 5) + ' ' + yt + 'V' + (yb + ry * 0.9) + 'A' + (w / 2) + ' ' + ry + ' 0 0 0 ' + (w / 2.6) + ' ' + (yb + ry * 0.62) + 'V' + yt + 'z" fill="#fff" opacity=".2"/>';
      if (o.stain && i < 2) s += '<g fill="' + o.stain[i] + '" stroke="' + X.mix(o.stain[i], '#1e5a2a', 0.35) + '" stroke-width="1.200">' + (i === 0 ?
        '<path d="M-138 ' + (yt + 20) + 'q5 22 2 44q-1 12 5 12t5 -12q-3 -22 1 -44q-7 -8 -13 0z"/><path d="M-112 ' + (yt + 8) + 'q4 30 1 62q-1 14 6 14t6 -14q-4 -32 0 -62q-7 -7 -13 0z"/>' +
        '<path d="M-84 ' + (yt + 30) + 'q3 18 1 34q0 10 5 10t5 -10q-3 -16 0 -34q-6 -6 -11 0z"/><path d="M-58 ' + (yt + 14) + 'q4 24 1 50q-1 12 6 12t6 -12q-4 -26 0 -50q-7 -7 -13 0z"/>' +
        '<ellipse cx="-126" cy="' + (yb - 6) + '" rx="7" ry="5"/><ellipse cx="-96" cy="' + (yt + 16) + '" rx="5" ry="4"/><ellipse cx="-36" cy="' + (yt + 42) + '" rx="6" ry="5"/><ellipse cx="-70" cy="' + (yb + 2) + '" rx="5" ry="4"/><ellipse cx="-22" cy="' + (yt + 70) + '" rx="4" ry="3"/>' :
        '<path d="M-106 ' + (yt + 34) + 'q3 16 1 30q0 9 5 9t5 -9q-3 -14 0 -30q-6 -6 -11 0z"/><path d="M-82 ' + (yt + 44) + 'q3 12 1 22q0 8 4.500 8t4.500 -8q-2 -10 0 -22q-5 -5 -10 0z"/>' +
        '<ellipse cx="-94" cy="' + (yt + 22) + '" rx="5" ry="4"/><ellipse cx="-60" cy="' + (yt + 58) + '" rx="5" ry="4"/><ellipse cx="-44" cy="' + (yt + 40) + '" rx="3.500" ry="3"/>') + '</g>';
      s += '<ellipse cx="0" cy="' + yt + '" rx="' + (w / 2) + '" ry="' + ry + '" fill="' + top + '"/>';
      n = Math.round(w / 11);
      for (k = 0; k <= n; k++) { t = Math.PI * k / n; s += '<circle cx="' + (Math.cos(t) * (w / 2 - 1)).toFixed(1) + '" cy="' + (yb + Math.sin(t) * ry - 2).toFixed(1) + '" r="3.700" fill="#f7f3fc" stroke="#b9a6dc" stroke-width=".700"/>'; }
      yb = yt - 1;
    }
    if (o.spray) {
      s += '<path d="M-150 ' + (tops[0] + 2) + 'q40 26 96 30" fill="none" stroke="#6f8a4a" stroke-width="3"/>';
      [[-136, 12, 5], [-116, 22, 7], [-94, 28, 8], [-72, 32, 6], [-54, 33, 4]].forEach(function (c) {
        for (k = 0; k < c[2]; k++) s += '<ellipse cx="' + (c[0] + (k % 2 ? 4 : -3)) + '" cy="' + (tops[0] + c[1] + 6 + k * 7) + '" rx="' + (6 - k * 0.5) + '" ry="5" fill="' + (k % 2 ? '#b99ae0' : '#cdb4ee') + '" stroke="#8a6cc0" stroke-width=".700"/>';
      });
      s += '<path d="M-150 ' + (tops[0] + 2) + 'q-8 -10 2 -16q8 8 -2 16zM-100 ' + (tops[0] + 24) + 'q2 -12 12 -12q0 10 -12 12z" fill="#7d9a55"/>';
    }
    if (o.flowers) {
      s += '<path d="M-30 ' + (tops[3] - 2) + 'q30 -30 62 -4" fill="none" stroke="#6f8a4a" stroke-width="3"/>';
      for (k = 0; k < 9; k++) s += '<ellipse cx="' + (-34 + k * 4) + '" cy="' + (tops[3] + 2 + k * 6) + '" rx="' + (7 - k * 0.5) + '" ry="5" fill="' + (k % 2 ? '#a887d8' : '#c3a8ea') + '"/>';
      [[8, -18, '#f2c7d8'], [24, -22, '#fbfaf4'], [40, -14, '#e7b0cb'], [-8, -10, '#fbfaf4']].forEach(function (f) { s += '<circle cx="' + f[0] + '" cy="' + (tops[3] + f[1]) + '" r="8" fill="' + f[2] + '"/><circle cx="' + f[0] + '" cy="' + (tops[3] + f[1]) + '" r="2.500" fill="#e9c93a"/>'; });
    }
    return s;
  };
  /* the steel trolley it stands on; 0,0 is the middle of the top of the trolley (the foot of the cake is 14 above it) */
  X.trolley = function () {
    return '<ellipse cx="0" cy="186" rx="190" ry="14" fill="#000" opacity=".35"/>' +
      '<path d="M-176 0v168M176 0v168M-150 12v150M150 12v150" stroke="#8a949b" stroke-width="7"/><rect x="-180" y="92" width="360" height="9" fill="#9aa5ac"/>' +
      '<circle cx="-176" cy="176" r="11" fill="#22262a"/><circle cx="176" cy="176" r="11" fill="#22262a"/><circle cx="-150" cy="168" r="8" fill="#22262a"/><circle cx="150" cy="168" r="8" fill="#22262a"/>' +
      '<path d="M-190 -4h380l-10 22h-360z" fill="#c9d1d6"/><rect x="-190" y="-8" width="380" height="8" fill="#e6ecef"/>' +
      '<ellipse cx="0" cy="-10" rx="170" ry="17" fill="#d9dde0"/><ellipse cx="0" cy="-14" rx="170" ry="17" fill="#f1f3f4"/>';
  };

  /* ---------- marks in flour ----------
     One clog of the make that everybody at Whitlow's wears, as a print seen from above: the toe at 0,0, the heel 26 below it, in centimetres.
     o = {x, y, rot, s (pixels to the centimetre), ink (the tread), sole (the whole foot, pressed flat: or nothing), bg (what a worn or cut place shows),
          op, right: true (the other foot), marks: {heel, cut, gap, stone, toe, hcut}}                                                                  */
  var SOLE = 'M0 0C3.200 0 4.800 2.600 4.800 6.400C4.800 10 3.600 12.500 3.500 15.500C3.400 18.500 3.900 20.500 3.800 22.600C3.700 25 2.200 26 0 26C-2.400 26 -3.900 25 -4 22.400C-4.100 20 -3.900 18 -4.200 15C-4.600 11.500 -5.200 9.400 -5.200 6.200C-5.200 2.600 -3.400 0 0 0Z';
  var BOOT = 'M0 0C4 0 5.800 3 5.800 7.400C5.800 11.500 4.600 14 4.600 17.500C4.600 20.500 5 23 4.900 26.500C4.800 29.800 3 31 0 31C-3 31 -4.800 29.800 -4.900 26.500C-5 23 -4.800 20.500 -5 17.500C-5.200 14 -5.900 11.500 -5.900 7.400C-5.900 3 -4 0 0 0Z';
  function open(o) { return '<g transform="translate(' + o.x + ' ' + o.y + ') rotate(' + (o.rot || 0) + ') scale(' + (o.right ? -o.s : o.s) + ' ' + o.s + ')"' + (o.op != null ? ' opacity="' + o.op + '"' : '') + (o.cls ? ' class="' + o.cls + '"' : '') + '>'; }
  X.clog = function (o) {
    var id = 'cs' + (++uid), m = o.marks || {}, ink = o.ink, bg = o.bg || 'none', s = open(o), r, c, cx, cy;
    s += '<clipPath id="' + id + '"><path d="' + SOLE + '"/></clipPath>';
    if (o.sole) s += '<path d="' + SOLE + '" fill="' + o.sole + '"/>';
    s += '<g clip-path="url(#' + id + ')" fill="' + ink + '">';
    for (r = 0; r < 9; r++) for (c = -3; c <= 3; c++) {
      cx = c * 1.9 + (r % 2 ? 0.95 : 0); cy = 1.9 + r * 1.5;
      if (m.gap && r === 1 && c === 0) continue;
      s += '<path d="M' + cx.toFixed(2) + ' ' + (cy - 0.62).toFixed(2) + 'l.800 .620 -.800 .620 -.800 -.620z"/>';
    }
    for (r = 0; r < 5; r++) s += '<rect x="-5" y="' + (19.6 + r * 1.15).toFixed(2) + '" width="10" height=".620"/>';
    s += '<ellipse cx="-.300" cy="16.700" rx="2.700" ry="1.250" fill="none" stroke="' + ink + '" stroke-width=".260"/>';
    if (o.s >= 9 && !o.right) s += '<g transform="translate(-.300 16.600) scale(.100)"><text x="0" y="0" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="9" text-anchor="middle" letter-spacing=".600" fill="' + ink + '">BAKER’S FRIEND</text>' +
      '<text x="0" y="9.600" font-family="Barlow Condensed,sans-serif" font-weight="700" font-size="9" text-anchor="middle" fill="' + ink + '">6</text></g>';
    s += '</g><path d="' + SOLE + '" fill="none" stroke="' + ink + '" stroke-width=".300" opacity=".85"/>';
    if (m.heel) s += '<path d="M-4.300 20q2.900 -.700 3.500 1.500q.500 2.600 -1.100 4.300q-2.100 .500 -2.500 -1.900z" fill="' + bg + '"/><path d="M-4 20.400q2.400 -.500 2.900 1.300q.400 2.200 -.900 3.600q-1.700 .400 -2.100 -1.600z" fill="' + ink + '" opacity=".3"/>';
    if (m.cut) s += '<path d="M-2.500 7.300l2 2.500 2.200 -2.800" fill="none" stroke="' + bg + '" stroke-width=".480" stroke-linecap="round" stroke-linejoin="round"/>';
    if (m.stone) s += '<circle cx="-1.900" cy="12.400" r=".460" fill="' + ink + '"/>';
    if (m.toe) s += '<path d="M.400 .500q3.300 .300 3.900 4.100q-1.900 1.300 -3.900 .300q-1.400 -2.200 0 -4.400z" fill="' + bg + '"/><path d="M.700 1q2.600 .300 3.100 3.300q-1.500 .900 -3 .200q-1 -1.700 -.100 -3.500z" fill="' + ink + '" opacity=".3"/>';
    if (m.hcut) s += '<path d="M-3.400 21.100l6.600 2.700" fill="none" stroke="' + bg + '" stroke-width=".480" stroke-linecap="round"/>';
    return s + '</g>';
  };
  /* Mr Whitlow's boot: 31 long, with bars across it */
  X.boot = function (o) {
    var id = 'bs' + (++uid), ink = o.ink, s = open(o), r, y;
    s += '<clipPath id="' + id + '"><path d="' + BOOT + '"/></clipPath>';
    if (o.sole) s += '<path d="' + BOOT + '" fill="' + o.sole + '"/>';
    s += '<g clip-path="url(#' + id + ')" fill="' + ink + '">';
    for (r = 0; r < 8; r++) { y = 2.6 + r * 2.1; s += '<path d="M-6.500 ' + y.toFixed(2) + 'l6.500 -1.700 6.500 1.700v1.050l-6.500 -1.700 -6.500 1.700z"/>'; }
    for (r = 0; r < 3; r++) s += '<rect x="-6" y="' + (23.4 + r * 2.3).toFixed(2) + '" width="12" height="1.300"/>';
    return s + '</g><path d="' + BOOT + '" fill="none" stroke="' + ink + '" stroke-width=".340" opacity=".85"/></g>';
  };
  /* one paw of a cat: a pad and four toes; about 3.5 across */
  X.paw = function (o) {
    return open(o) + '<g fill="' + o.ink + '"><ellipse cx="0" cy=".600" rx="1.050" ry=".850"/><circle cx="-1.150" cy="-.550" r=".480"/><circle cx="-.400" cy="-1.100" r=".480"/><circle cx=".400" cy="-1.100" r=".480"/><circle cx="1.150" cy="-.550" r=".480"/></g></g>';
  };
  return X;
})();
