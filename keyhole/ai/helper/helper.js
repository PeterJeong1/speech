/* Sounds About Right - what every room of the story shares: a few sounds, small helpers, the Magpie logo, the people
   (standing in the scene, and as busts for the interviews) and a way to type an answer out on a screen.
   Loaded after engine.js. Nothing in here knows an answer. */
window.MG = (function () {
  'use strict';
  var X = {};
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so that the sound button switches them). No beeps, no chimes:
     in this story a beep would sound like a message arriving. ---------- */
  X.sfx = {
    keys: function (n) { for (var i = 0; i < (n || 5); i++) B({ dur: 0.025, f: 2600 + Math.random() * 900, q: 3, peak: 0.07, when: i * (0.06 + Math.random() * 0.05) }); },
    pencil: function () { B({ type: 'bandpass', f: 4200, f2: 3000, q: 2, dur: 0.16, peak: 0.05, a: 0.02 }); },
    stamp: function () { T({ f: 150, f2: 80, dur: 0.14, peak: 0.32 }); B({ type: 'lowpass', f: 900, dur: 0.05, peak: 0.2 }); },
    card: function () { B({ type: 'highpass', f: 2400, dur: 0.1, peak: 0.07, a: 0.01 }); },
    whirr: function () { B({ type: 'bandpass', f: 300, f2: 520, q: 1.5, dur: 0.6, peak: 0.08, a: 0.15 }); }
  };
  X.solved = function (quiet) {
    var sung = false;
    try { sung = !!(ER.music && ER.music() && ER.track && ER.track.sting('solved', null, !!quiet)); } catch (e) {}
    if (!sung && !quiet) ER.sfx.ok();
  };

  /* ---------- small helpers ---------- */
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
  X.mine = function (id, title, html, quiet) { return ER.addClue(id, title, '<h4>' + title + '</h4>' + html, 'mg-mine', 'Your notes', quiet); };
  X.terms = function (list) {
    var G = window.GLOSS || [];
    list.forEach(function (w) { for (var i = 0; i < G.length; i++) if (G[i][0] === w) { ER.addWord(G[i][0], G[i][1]); break; } });
  };
  X.minutesPlayed = function () {
    var st = ER.state();
    if (st.fin && st.fin.secs) return Math.max(1, Math.round(st.fin.secs / 60));
    return Math.max(1, Math.round((Date.now() - (st.t0 || Date.now())) / 60000));
  };
  X.esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };

  /* Type a run of paragraphs out into a node, a few words at a time (timers, not animation frames, so that it
     always finishes). done() is called at the end; the node gets the class "typed-out". */
  X.typeOut = function (node, paras, done, speed) {
    var words = [], i = 0, cur = null;
    node.innerHTML = ''; node.classList.remove('typed-out');
    paras.forEach(function (p, k) { p.split(' ').forEach(function (w, j) { words.push({ p: k, w: w, first: j === 0 }); }); });
    function step() {
      var n = 0;
      while (i < words.length && n < 3) {
        var o = words[i];
        if (o.first) { cur = document.createElement('p'); node.appendChild(cur); }
        cur.innerHTML = (cur.innerHTML ? cur.innerHTML + ' ' : '') + o.w;
        i++; n++;
      }
      if (i % 9 < 3) X.sfx.keys(2);
      if (i < words.length) setTimeout(step, speed || 55);
      else { node.classList.add('typed-out'); if (done) done(); }
    }
    step();
  };

  /* ---------- a chat, as Magpie shows it ---------- */
  X.chat = function (lines) {
    return '<div class="mg-chat">' + lines.map(function (l) {
      return '<div class="mg-msg ' + (l[0] === 'me' ? 'me' : 'bot') + '"><b>' + (l[2] || (l[0] === 'me' ? 'Leo' : 'Magpie')) + '</b><p>' + l[1] + '</p></div>';
    }).join('') + '</div>';
  };

  /* ---------- the Magpie logo: a black-and-white bird in a rounded square, about 100 x 100 ---------- */
  X.logo = function (x, y, s, bg) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + (s || 1) + ')">' +
      (bg === false ? '' : '<rect x="0" y="0" width="100" height="100" rx="24" fill="' + (bg || '#e9f6f4') + '"/>') +
      '<path d="M34 60L6 80l4 6 30 -18z" fill="#1d4f63"/><path d="M30 63L8 79" stroke="#2f8f9a" stroke-width="2"/>' +
      '<ellipse cx="48" cy="56" rx="22" ry="14" fill="#141b26"/><path d="M38 62q14 12 30 -2q-6 -8 -18 -7z" fill="#fff"/>' +
      '<path d="M34 51q11 -7 22 0q-9 6 -22 0z" fill="#fff"/><path d="M40 47q8 -3 14 0" stroke="#2f8f9a" stroke-width="2.5" fill="none"/>' +
      '<circle cx="70" cy="41" r="11" fill="#141b26"/><path d="M80 39l12 3 -12 4z" fill="#141b26"/><circle cx="73" cy="38.5" r="2.4" fill="#fff"/><circle cx="73.6" cy="38.5" r="1.1" fill="#141b26"/>' +
      '<path d="M46 69v10M54 69v10" stroke="#141b26" stroke-width="2.5"/></g>';
  };

  /* ---------- people, standing: feet at 0 0, about 300 high ----------
     o = {skin, hair, style, top, sleeve, bottom, legs: 'trousers' | 'skirt', shirt, tie, coat, lanyard, glasses, beard, smile, extra, face: false} */
  var HAIR = {
    short: 'M-24 -276q2 -30 24 -30t24 30q-10 -14 -24 -14t-24 14z',
    mop: 'M-27 -272q-2 -38 27 -38t27 38q-6 -6 -10 -16q-8 6 -17 4q-10 4 -18 -2q-4 8 -9 14z',
    curly: 'M-28 -278a9 9 0 1 1 9 -10a11 11 0 1 1 19 -6a11 11 0 1 1 19 6a9 9 0 1 1 9 10q-12 -12 -28 -12t-28 12z',
    bob: 'M-25 -276q2 -31 25 -31t25 31q-10 -14 -25 -14t-25 14zM-26 -280q-6 24 -1 40h10q-4 -20 -1 -34zM26 -280q6 24 1 40h-10q4 -20 1 -34z',
    bun: 'M-24 -276q2 -29 24 -29t24 29q-10 -13 -24 -13t-24 13zM-10 -310a10 10 0 1 1 20 0a10 10 0 1 1 -20 0z',
    crop: 'M-23 -280q3 -24 23 -24t23 24q-10 -8 -23 -8t-23 8z'
  };
  X.person = function (o) {
    var skin = o.skin || '#e8c4a2', hair = o.hair || '#3a2a1c', top = o.top || '#2e6b8f', bot = o.bottom || '#2c2c33', s = '';
    s += '<ellipse cx="0" cy="2" rx="46" ry="8" fill="#000" opacity="' + (o.shadow == null ? 0.22 : o.shadow) + '"/>';
    if (o.legs === 'skirt') s += '<path d="M-17 0v-74h13v74zM4 0v-74h13v74z" fill="' + (o.tights || skin) + '"/><path d="M-33 -66h66l-6 -66h-54z" fill="' + bot + '"/>';
    else s += '<path d="M-20 0v-100h17v100zM3 0v-100h17v100z" fill="' + bot + '"/>';
    s += '<path d="M-24 0h22v7h-26zM2 0h22v7h-22z" fill="' + (o.shoes || '#1d1f24') + '"/>';
    if (o.coat) s += '<path d="M-42 -40q-6 -150 42 -200t42 200z" fill="' + o.coat + '"/>';
    s += '<path d="M-38 -94q-7 -138 38 -146t38 146z" fill="' + top + '"/>';
    if (o.coat) s += '<path d="M-38 -60q-4 -130 22 -176l14 30v146zM38 -60q4 -130 -22 -176l-14 30v146z" fill="' + o.coat + '"/>';
    if (o.shirt) s += '<path d="M-10 -238l10 26 10 -26z" fill="' + o.shirt + '"/>';
    if (o.tie) s += '<path d="M-3 -234h6l3 34 -6 9 -6 -9z" fill="' + o.tie + '"/>';
    if (o.lanyard) s += '<path d="M-12 -236q12 70 12 70q0 0 12 -70" fill="none" stroke="' + o.lanyard + '" stroke-width="3"/><rect x="-9" y="-170" width="18" height="24" rx="2" fill="#fff" stroke="' + o.lanyard + '" stroke-width="2"/>';
    s += '<path d="M-34 -204q-15 40 -5 88M34 -204q15 40 5 88" stroke="' + (o.sleeve || o.coat || top) + '" stroke-width="15" fill="none" stroke-linecap="round"/>' +
      '<circle cx="-39" cy="-112" r="8" fill="' + skin + '"/><circle cx="39" cy="-112" r="8" fill="' + skin + '"/>';
    s += '<rect x="-7" y="-256" width="14" height="20" fill="' + skin + '"/><circle cx="0" cy="-274" r="24" fill="' + skin + '"/>';
    if (o.face === false) s += '<circle cx="0" cy="-277" r="24.5" fill="' + hair + '"/>';
    else {
      if (o.style && HAIR[o.style]) s += '<path d="' + HAIR[o.style] + '" fill="' + hair + '"/>';
      if (o.beard) s += '<path d="M-22 -270q2 30 22 32q20 -2 22 -32q-6 14 -22 14t-22 -14z" fill="' + o.beard + '"/>';
      s += '<path d="M-11 -273h7M4 -273h7" stroke="#2a2420" stroke-width="2.6" stroke-linecap="round"/><path d="M-6 -260q6 ' + (o.smile == null ? 4 : o.smile) + ' 12 0" stroke="#8c4a3c" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
      if (o.glasses) s += '<circle cx="-8" cy="-273" r="7" fill="none" stroke="' + o.glasses + '" stroke-width="2"/><circle cx="8" cy="-273" r="7" fill="none" stroke="' + o.glasses + '" stroke-width="2"/>';
    }
    if (o.extra) s += o.extra;
    return s;
  };
  X.PEOPLE = {
    leo: { skin: '#ecc9a4', hair: '#191414', style: 'mop', top: '#2f5d3a', sleeve: '#2f5d3a', bottom: '#2a2d33', shirt: '#fff', tie: '#d4a017' },
    ruskin: { skin: '#efcfb4', hair: '#7a5a3a', style: 'short', beard: '#7a5a3a', top: '#cfd8e6', coat: '#8a7f6a', bottom: '#4a4a52', glasses: '#2a2a2a', lanyard: '#2f6fd0', smile: 0 },
    moreno: { skin: '#c8936a', hair: '#20160f', style: 'curly', top: '#2b2f36', sleeve: '#2b2f36', bottom: '#3a4a5e', lanyard: '#2f6fd0', shoes: '#f2f0ea' },
    ibarra: { skin: '#e4b896', hair: '#b9b4ae', style: 'bob', top: '#f1e6d2', coat: '#9b3b4a', bottom: '#3a3340', legs: 'skirt', tights: '#3a3340', glasses: '#c0392b' },
    fairley: { skin: '#f0d2bc', hair: '#a0522d', style: 'bun', top: '#4a6a8a', coat: '#f4f6f8', bottom: '#2c2f36', glasses: '#2a2a2a' },
    achterberg: { skin: '#f2d6c4', hair: '#e8e6e0', style: 'crop', top: '#f6f2ea', coat: '#26324a', bottom: '#26324a', legs: 'skirt', tights: '#26324a' }
  };
  X.who = function (name, more) {
    var o = {}, k, base = X.PEOPLE[name];
    for (k in base) o[k] = base[k];
    for (k in (more || {})) o[k] = more[k];
    return X.person(o);
  };

  /* ---------- the same people as busts, for the interviews (240 x 300) ---------- */
  var BUST = {
    leo: { bg: '#2f5d3a', skin: '#ecc9a4', hair: '#191414', style: 'mop', top: '#2f5d3a', shirt: '#fff', tie: '#d4a017' },
    ruskin: { bg: '#3a5a7a', skin: '#efcfb4', hair: '#7a5a3a', style: 'short', top: '#8a7f6a', shirt: '#cfd8e6', beard: '#7a5a3a', glasses: '#2a2a2a', lanyard: '#2f6fd0', tired: 1 },
    moreno: { bg: '#1d2a26', skin: '#c8936a', hair: '#20160f', style: 'curly', top: '#2b2f36', headset: 1, lanyard: '#2f6fd0' },
    ibarra: { bg: '#5a2a36', skin: '#e4b896', hair: '#b9b4ae', style: 'bob', top: '#9b3b4a', shirt: '#f1e6d2', glasses: '#c0392b', chain: 1 },
    fairley: { bg: '#2a4a5a', skin: '#f0d2bc', hair: '#a0522d', style: 'bun', top: '#f4f6f8', shirt: '#4a6a8a', glasses: '#2a2a2a', pen: 1 },
    achterberg: { bg: '#26324a', skin: '#f2d6c4', hair: '#e8e6e0', style: 'crop', top: '#26324a', shirt: '#f6f2ea', beads: 1 }
  };
  var BHAIR = {
    mop: 'M60 122q-6 -78 60 -78t60 78q-8 -12 -14 -30q-14 12 -30 6q-18 10 -34 -2q-8 16 -16 30q-10 -2 -26 -4z',
    short: 'M64 116q0 -66 56 -68t56 68q-14 -30 -56 -32t-56 32z',
    curly: 'M56 120a16 16 0 1 1 14 -26a20 20 0 1 1 30 -22a20 20 0 1 1 40 0a20 20 0 1 1 30 22a16 16 0 1 1 14 26q-20 -34 -64 -34t-64 34z',
    bob: 'M62 120q0 -72 58 -74t58 74q-14 -34 -58 -36t-58 36zM58 112q-12 50 -2 86h22q-10 -40 -4 -78zM182 112q12 50 2 86h-22q10 -40 4 -78z',
    bun: 'M64 118q0 -68 56 -70t56 70q-14 -32 -56 -34t-56 34zM100 40a20 20 0 1 1 40 0a20 20 0 1 1 -40 0z',
    crop: 'M66 108q4 -58 54 -60t54 60q-16 -22 -54 -22t-54 22z'
  };
  X.face = function (name, mood) {
    var o = BUST[name], s = '', sm = mood === 'smile' ? 10 : mood === 'cross' ? -6 : 3;
    s += '<svg viewBox="0 0 240 300" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg"><rect x="-200" y="-200" width="640" height="500" fill="' + o.bg + '"/><circle cx="196" cy="54" r="80" fill="#fff" opacity=".08"/>';
    s += '<path d="M14 300q8 -96 106 -104q98 8 106 104z" fill="' + o.top + '"/>';
    if (o.shirt) s += '<path d="M96 200l24 40 24 -40z" fill="' + o.shirt + '"/>';
    if (o.tie) s += '<path d="M113 204h14l6 58 -13 18 -13 -18z" fill="' + o.tie + '"/><path d="M110 232l20 -8M108 254l24 -8" stroke="#2f5d3a" stroke-width="4"/>';
    if (o.lanyard) s += '<path d="M90 204q30 90 30 90q0 0 30 -90" fill="none" stroke="' + o.lanyard + '" stroke-width="6"/>';
    if (o.beads) s += '<path d="M92 210q28 34 56 0" fill="none" stroke="#e8e0d0" stroke-width="7" stroke-dasharray="1 9" stroke-linecap="round"/>';
    s += '<rect x="104" y="164" width="32" height="36" fill="' + o.skin + '"/>';
    s += '<ellipse cx="120" cy="120" rx="54" ry="62" fill="' + o.skin + '"/><ellipse cx="66" cy="126" rx="8" ry="13" fill="' + o.skin + '"/><ellipse cx="174" cy="126" rx="8" ry="13" fill="' + o.skin + '"/>';
    s += '<path d="' + BHAIR[o.style] + '" fill="' + o.hair + '"/>';
    if (o.beard) s += '<path d="M68 130q4 64 52 68q48 -4 52 -68q-12 30 -52 30t-52 -30z" fill="' + o.beard + '"/>';
    if (o.headset) s += '<path d="M62 120q0 -82 58 -82t58 82" fill="none" stroke="#3a3f47" stroke-width="7"/><rect x="54" y="112" width="16" height="30" rx="7" fill="#3a3f47"/><rect x="170" y="112" width="16" height="30" rx="7" fill="#3a3f47"/>';
    s += '<path d="M90 104q10 -6 20 0M130 104q10 -6 20 0" stroke="#3a2a20" stroke-width="3.5" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="100" cy="122" rx="5" ry="6.5" fill="#2a2420"/><ellipse cx="140" cy="122" rx="5" ry="6.5" fill="#2a2420"/><circle cx="102" cy="120" r="1.6" fill="#fff"/><circle cx="142" cy="120" r="1.6" fill="#fff"/>' +
      '<path d="M120 128q-5 14 2 18" stroke="#b07a5a" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
      '<path d="M104 156q16 ' + sm + ' 32 0" stroke="#8c3a32" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
    if (o.tired) s += '<path d="M90 134q10 5 20 0M130 134q10 5 20 0" stroke="#b08a74" stroke-width="2.5" fill="none" opacity=".8"/>';
    if (o.glasses) s += '<g fill="none" stroke="' + o.glasses + '" stroke-width="3"><rect x="84" y="108" width="32" height="26" rx="8"/><rect x="124" y="108" width="32" height="26" rx="8"/><path d="M116 120h8M84 118l-18 -4M156 118l18 -4"/></g>';
    if (o.chain) s += '<path d="M66 118q-10 60 30 84M174 118q10 60 -30 84" fill="none" stroke="#c9a24a" stroke-width="2" stroke-dasharray="3 3"/>';
    if (o.pen) s += '<path d="M168 82l26 -36" stroke="#c0392b" stroke-width="7" stroke-linecap="round"/>';
    return s + '</svg>';
  };
  return X;
})();
