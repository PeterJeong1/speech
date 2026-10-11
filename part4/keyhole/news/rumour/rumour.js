/* Says Who? - what every room of the story shares: a few sounds, small helpers, people as standing figures,
   and two drawings that turn up again and again: the old front page, and a message on the school's own system.
   Loaded after engine.js. Nothing in here knows an answer. */
window.RUM = (function () {
  'use strict';
  var X = {}, D = document, NS = 'http://www.w3.org/2000/svg';
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so that the sound button switches them) ---------- */
  X.sfx = {
    pin: function () { B({ dur: 0.03, f: 2400, q: 3, peak: 0.2 }); T({ f: 520, f2: 300, dur: 0.07, peak: 0.16, when: 0.01 }); },
    wool: function () { B({ type: 'highpass', f: 3000, dur: 0.12, peak: 0.04, a: 0.04 }); },
    stamp: function () { T({ f: 110, f2: 52, dur: 0.17, peak: 0.5 }); B({ type: 'lowpass', f: 900, dur: 0.06, peak: 0.35 }); },
    clack: function () { B({ dur: 0.03, f: 2000, q: 3, peak: 0.26 }); T({ f: 300, f2: 170, dur: 0.07, peak: 0.2, when: 0.01 }); },
    key: function () { B({ dur: 0.025, f: 3200, q: 2, peak: 0.22 }); T({ f: 190, f2: 120, dur: 0.06, peak: 0.16 }); },
    buzz: function (n) { for (var i = 0; i < (n || 1); i++) T({ type: 'sawtooth', f: 148 + (i % 3) * 9, dur: 0.2, peak: 0.035, a: 0.02, when: i * 0.17 }); },
    fold: function () { B({ type: 'highpass', f: 1800, f2: 3600, dur: 0.3, peak: 0.09, a: 0.08 }); },
    marker: function () { B({ type: 'bandpass', f: 2600, f2: 3400, q: 2, dur: 0.22, peak: 0.05, a: 0.03 }); }
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
  /* a wall clock with its hands at the time of the story */
  X.clock = function (cx, cy, r, h, m, o) {
    o = o || {};
    var ha = ((h % 12) + m / 60) * 30 - 90, ma = m * 6 - 90, s = '', i, a;
    function p(ang, len) { var q = ang * Math.PI / 180; return (cx + Math.cos(q) * len).toFixed(1) + ' ' + (cy + Math.sin(q) * len).toFixed(1); }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r + 6) + '" fill="' + (o.rim || '#22262b') + '"/><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + (o.face || '#f6f4ec') + '"/>';
    for (i = 0; i < 12; i++) { a = i * 30; s += '<path d="M' + p(a, r * 0.8) + 'L' + p(a, r * 0.92) + '" stroke="#1c1d22" stroke-width="' + (i % 3 ? 1.6 : 3) + '"/>'; }
    s += '<path d="M' + cx + ' ' + cy + 'L' + p(ha, r * 0.5) + '" stroke="#1c1d22" stroke-width="' + (r * 0.13).toFixed(1) + '" stroke-linecap="round"/>' +
      '<path d="M' + cx + ' ' + cy + 'L' + p(ma, r * 0.76) + '" stroke="#1c1d22" stroke-width="' + (r * 0.08).toFixed(1) + '" stroke-linecap="round"/>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.09).toFixed(1) + '" fill="' + (o.pin || '#d8432a') + '"/>';
    return s;
  };

  /* ---------- people, standing: feet at 0 0, about 300 high ----------
     o = {skin, hair, style, top, bottom, legs: 'trousers' | 'skirt', shirt, tie, extra (drawn last), under (drawn first), face: false (seen from behind)} */
  var HAIR = {
    short: 'M-24 -276q2 -29 24 -29t24 29q-10 -13 -24 -13t-24 13z',
    long: 'M-24 -276q2 -29 24 -29t24 29q-10 -13 -24 -13t-24 13zM-24 -282q-9 36 -3 66h11q-6 -32 -2 -54zM24 -282q9 36 3 66h-11q6 -32 2 -54z',
    bob: 'M-24 -276q2 -29 24 -29t24 29q-10 -13 -24 -13t-24 13zM-24 -282q-7 24 -2 40h9q-4 -20 -1 -32zM24 -282q7 24 2 40h-9q4 -20 1 -32z',
    bun: 'M-24 -276q2 -29 24 -29t24 29q-10 -13 -24 -13t-24 13zM-10 -306a10 10 0 1 1 20 0a10 10 0 1 1 -20 0z',
    pony: 'M-24 -276q2 -29 24 -29t24 29q-10 -13 -24 -13t-24 13zM20 -294q24 2 22 44q-9 -6 -11 -24q-6 -8 -13 -10z',
    spiky: 'M-24 -276q2 -29 24 -29t24 29q-10 -13 -24 -13t-24 13zM-18 -298l-4 -12 9 7 2 -13 8 11 6 -12 4 13 9 -8 -3 13z',
    curly: 'M-27 -280a9 9 0 1 1 9 -9a11 11 0 1 1 18 -7a11 11 0 1 1 18 7a9 9 0 1 1 9 9q-12 -12 -27 -12t-27 12z',
    thin: 'M-24 -268q-3 -18 7 -28q-3 12 -1 24zM24 -268q3 -18 -7 -28q3 12 1 24zM-14 -296q14 -8 28 0q-14 -3 -28 0z'
  };
  X.person = function (o) {
    var skin = o.skin || '#e8c4a2', hair = o.hair || '#3a2a1c', top = o.top || '#1f4a3a', bot = o.bottom || '#2c2c33', s = '';
    s += '<ellipse cx="0" cy="2" rx="46" ry="8" fill="#000" opacity="' + (o.shadow == null ? 0.25 : o.shadow) + '"/>';
    if (o.under) s += o.under;
    if (o.legs === 'skirt') s += '<path d="M-17 0v-74h13v74zM4 0v-74h13v74z" fill="' + (o.tights || '#2a2c33') + '"/><path d="M-33 -66h66l-6 -66h-54z" fill="' + bot + '"/>';
    else s += '<path d="M-20 0v-100h17v100zM3 0v-100h17v100z" fill="' + bot + '"/>';
    s += '<path d="M-24 0h22v7h-26zM2 0h22v7h-22z" fill="' + (o.shoes || '#15161a') + '"/>';
    if (o.style === 'afro') s += '<circle cx="0" cy="-282" r="32" fill="' + hair + '"/>';
    s += '<path d="M-38 -94q-7 -138 38 -146t38 146z" fill="' + top + '"/>';
    if (o.face !== false) {
      s += '<path d="M-9 -238l9 30 9 -30z" fill="' + (o.shirt || '#f3f1e8') + '"/>';
      if (o.tie) s += '<path d="M-3 -234h6l3 30 -6 9 -6 -9z" fill="' + o.tie + '"/>';
    }
    s += '<path d="M-34 -204q-15 40 -5 88M34 -204q15 40 5 88" stroke="' + (o.sleeve || top) + '" stroke-width="15" fill="none" stroke-linecap="round"/>' +
      '<circle cx="-39" cy="-112" r="8" fill="' + skin + '"/><circle cx="39" cy="-112" r="8" fill="' + skin + '"/>';
    s += '<rect x="-7" y="-256" width="14" height="20" fill="' + skin + '"/><circle cx="0" cy="-274" r="24" fill="' + skin + '"/>';
    if (o.face === false) s += '<circle cx="0" cy="-277" r="24.5" fill="' + hair + '"/>';
    else {
      if (o.style && o.style !== 'afro' && o.style !== 'none') s += '<path d="' + HAIR[o.style] + '" fill="' + hair + '"/>';
      s += '<path d="M-11 -273h7M4 -273h7" stroke="#2a2420" stroke-width="2.6" stroke-linecap="round"/><path d="M-6 -260q6 ' + (o.smile == null ? 4 : o.smile) + ' 12 0" stroke="#8c4a3c" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    }
    if (o.extra) s += o.extra;
    return s;
  };
  X.PEOPLE = {
    priya: { skin: '#c68e5f', hair: '#15110f', style: 'long', top: '#1f4a3a', bottom: '#2a2c33', legs: 'skirt', tie: '#d9a93a' },
    theo: { skin: '#f0cfae', hair: '#b4551f', style: 'spiky', top: '#1f4a3a', bottom: '#2a2c33', tie: '#d9a93a' },
    jago: { skin: '#e3bf9c', hair: '#2a1f18', style: 'short', top: '#f3f1e8', sleeve: '#f3f1e8', bottom: '#2a2c33', shirt: '#f3f1e8' },
    nell: { skin: '#f3d9c4', hair: '#6b4a2a', style: 'bob', top: '#1f4a3a', bottom: '#2a2c33', legs: 'skirt', tie: '#d9a93a' },
    mina: { skin: '#e8c8a8', hair: '#111', style: 'pony', top: '#1f4a3a', bottom: '#2a2c33', legs: 'skirt', tie: '#d9a93a' },
    adeleke: { skin: '#8a5a3a', hair: '#15110f', style: 'afro', top: '#7a2f52', bottom: '#2a2233', legs: 'skirt', tights: '#3a2a22', shirt: '#f1dfc8' },
    corrigan: { skin: '#eccdb2', hair: '#b9bcc0', style: 'thin', top: '#f2d21f', sleeve: '#3a4a5c', bottom: '#3a3f47', shirt: '#dfe6ee', tie: '#7d2a2a' }
  };
  /* one of the cast, with something added: X.who('priya', {extra: ...}) */
  X.who = function (name, more) {
    var o = {}, k, base = X.PEOPLE[name];
    for (k in base) o[k] = base[k];
    for (k in (more || {})) o[k] = more[k];
    if (name === 'corrigan' && o.vest !== false) o.extra = '<path d="M-36 -150h72M-37 -122h74" stroke="#c9ced3" stroke-width="9"/><path d="M-22 -234l-6 138M22 -234l6 138" stroke="#c9ced3" stroke-width="7"/>' + (o.extra || '');
    return X.person(o);
  };

  /* ---------- the front page of The Wick, No. 1 ----------
     Drawn in a page of 420 x 660 (foolscap). The strip above y = 66 is the part that a sheet of A4 leaves out.
     o = {ink, paper, strip: true | false, ring: true (somebody's blue ring), red: true (somebody's red letters)} */
  X.page = function (o) {
    o = o || {};
    var ink = o.ink || '#2a2a2c', s = '', c, i, y, w, L = [1, 0.94, 0.98, 0.9, 1, 0.96, 0.6, 0, 1, 0.92, 0.97, 0.88, 0.99, 0.7, 0, 0.95, 1, 0.9, 0.97, 0.93, 1, 0.5, 0, 0.98, 0.9, 1, 0.94, 0.8, 0.98, 0.91, 1, 0.66, 0, 0.97, 0.93, 0.6];
    s += '<rect x="0" y="0" width="420" height="660" fill="' + (o.paper || '#fbfaf6') + '"/>';
    s += '<path d="M10 ' + (o.strip === false ? 66 : 10) + 'V650H410V' + (o.strip === false ? 66 : 10) + (o.strip === false ? '' : 'Z') + '" fill="none" stroke="' + ink + '" stroke-width="2.2"/>';
    if (o.strip !== false) {
      s += '<g fill="' + ink + '" class="cT"><text x="24" y="33" font-size="15">No. 1</text><text x="210" y="33" font-size="15" text-anchor="middle">FRIDAY 12 MARCH 1976</text><text x="396" y="33" font-size="15" text-anchor="end">PRICE 5p</text>' +
        '<text x="210" y="54" font-size="13" text-anchor="middle">Editor: D. CORRIGAN, 4B</text></g><path d="M10 62H410" stroke="' + ink + '" stroke-width="1.4"/>';
    }
    /* the masthead: stencil letters, and a candle for the I */
    s += '<text x="210" y="150" class="cS" font-size="86" font-weight="700" text-anchor="middle" textLength="356" lengthAdjust="spacingAndGlyphs" fill="' + ink + '">THE WICK</text>' +
      '<path d="M24 166H396M24 172H396" stroke="' + ink + '" stroke-width="1.6"/>' +
      '<text x="210" y="190" class="cT" font-size="10.5" text-anchor="middle" textLength="344" lengthAdjust="spacingAndGlyphs" fill="' + ink + '">THE PAPER OF PETHERWICK SCHOOL : WRITTEN BY ITS PUPILS</text>' +
      '<path d="M24 198H396" stroke="' + ink + '" stroke-width="1"/>';
    /* the headline, in two lines */
    s += '<text x="210" y="246" class="cS" font-size="27" font-weight="700" text-anchor="middle" textLength="372" lengthAdjust="spacingAndGlyphs" fill="' + ink + '">SCHOOL TO CLOSE IN JULY,</text>' +
      '<text x="210" y="290" class="cS" font-size="27" font-weight="700" text-anchor="middle" textLength="188" lengthAdjust="spacingAndGlyphs" fill="' + ink + '">SAYS COUNCIL</text>' +
      '<path d="M24 308H396" stroke="' + ink + '" stroke-width="1.6"/>';
    /* three columns of typing */
    s += '<g stroke="' + ink + '" stroke-width="2.6" opacity=".62">';
    for (c = 0; c < 3; c++) {
      for (i = 0; i < 36; i++) {
        y = 322 + i * 9; w = L[(i + c * 7) % L.length] * 118;
        if (c === 2 && ((y > 318 && y < 420) || (y > 500 && y < 548))) continue;      /* the drawing, and a second small headline */
        if (w) s += '<path d="M' + (24 + c * 127) + ' ' + y + 'h' + w.toFixed(0) + '"/>';
      }
    }
    s += '</g><path d="M146 318V644M273 318V644" stroke="' + ink + '" stroke-width=".8" opacity=".6"/>';
    s += '<rect x="278" y="320" width="118" height="84" fill="none" stroke="' + ink + '" stroke-width="1.4"/>' +
      '<g fill="none" stroke="' + ink + '" stroke-width="2"><path d="M300 398V348M374 398V348M296 348h8M370 348h8M300 356q37 -30 74 0M312 398V366M324 398V366M337 398V362M350 398V366M362 398V366M286 398H388"/></g>' +
      '<text x="337" y="414" class="cT" font-size="7.5" text-anchor="middle" fill="' + ink + '">The school gates this week</text>' +
      '<text x="337" y="522" class="cS" font-size="13" font-weight="700" text-anchor="middle" fill="' + ink + '">CHESS CLUB</text><text x="337" y="538" class="cS" font-size="13" font-weight="700" text-anchor="middle" fill="' + ink + '">BEATS STAFF</text>';
    if (o.ring) s += '<path d="M40 238q150 -34 330 -6q34 8 28 38q-8 32 -190 36q-170 4 -186 -30q-10 -28 34 -42" fill="none" stroke="#2456c9" stroke-width="5" stroke-linecap="round" opacity=".9"/>' +
      '<path d="M356 276q2 -9 10 -9t8 8q0 6 -8 9v5M366 297v1" fill="none" stroke="#2456c9" stroke-width="4" stroke-linecap="round" opacity=".9"/>';
    if (o.red) s += '<text x="210" y="252" class="cK" font-size="33" font-weight="700" text-anchor="middle" fill="#d91f1f" stroke="#fff" stroke-width="5" paint-order="stroke" transform="rotate(-3 210 244)" textLength="250" lengthAdjust="spacingAndGlyphs">IT’S OFFICIAL</text>';
    return s;
  };
  /* the crops that went round: [x, y, width, height] in the page */
  X.CROP = { sheet: [0, 66, 420, 594], top: [0, 66, 420, 300], two: [14, 214, 392, 92], one: [14, 214, 392, 46] };

  /* ---------- a message on Common Room, the school's own system, as Theo printed it ----------
     o = {tab, col, who, when, glare (the time cannot be read), re (the line the system adds to an answer), pic: {crop, ring, red, caught}, lines: [...], out: true (not Common Room at all)}
     Returns {svg, h}: drawn 340 wide. */
  X.post = function (o) {
    var s = '', y, ph, v, i;
    s += '<rect x="0" y="0" width="340" height="28" fill="' + o.col + '"/><text x="12" y="19" class="cF" font-size="12.5" font-weight="800" letter-spacing="1.6" fill="#fff">' + o.tab + '</text>' +
      '<text x="328" y="18.5" class="cM" font-size="9" text-anchor="end" fill="#fff" opacity=".85">' + (o.out ? 'NOT COMMON ROOM' : 'COMMON ROOM') + '</text>';
    s += '<text x="12" y="49" class="cF" font-size="15" font-weight="800" fill="#16202c">' + o.who + '</text><text x="328" y="49" class="cM" font-size="12.5" text-anchor="end" fill="#4a5560">' + o.when + '</text>';
    if (o.glare) s += '<path d="M236 30l96 2l4 26l-112 6z" fill="#fff"/><path d="M228 60l34 -32h22l-34 34z" fill="#eef4fb" opacity=".9"/>';
    y = 60;
    if (o.re) { s += '<text x="12" y="' + (y + 10) + '" class="cF" font-size="11.5" font-style="italic" fill="#6b7480">' + o.re + '</text>'; y += 18; }
    if (o.pic) {
      v = X.CROP[o.pic.crop]; ph = 316 * v[3] / v[2];
      s += '<svg x="12" y="' + y + '" width="316" height="' + ph.toFixed(1) + '" viewBox="' + v.join(' ') + '" preserveAspectRatio="none">' + X.page({ strip: false, ring: o.pic.ring, red: o.pic.red, paper: '#f1f0ec' }) + '</svg>';
      if (o.pic.caught) {       /* the snip was a little too tall: it caught the top of the words underneath */
        s += '<svg x="12" y="' + (y + ph).toFixed(1) + '" width="316" height="9.5" viewBox="0 0 316 9.5"><rect width="316" height="9.5" fill="#fff"/><text x="0" y="14.5" class="cF" font-size="14.5" fill="#16202c">' + o.pic.caught + '</text></svg>';
        ph += 9.5;
      }
      s += '<rect x="12" y="' + y + '" width="316" height="' + ph.toFixed(1) + '" fill="none" stroke="#9aa3ad" stroke-width="1"/>';
      y += ph + 6;
    }
    for (i = 0; i < o.lines.length; i++) { y += 19; s += '<text x="12" y="' + y + '" class="cF" font-size="14.5" fill="#16202c">' + o.lines[i] + '</text>'; }
    y += 14;
    return { svg: '<rect x="0" y="0" width="340" height="' + y.toFixed(1) + '" fill="#fff"/>' + s + '<rect x="0" y="0" width="340" height="' + y.toFixed(1) + '" fill="none" stroke="#c3c9d0" stroke-width="1"/>', h: y };
  };
  return X;
})();
