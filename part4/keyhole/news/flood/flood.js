/* Two Aunts - what every room of the story shares: a few sounds, small helpers, people as standing figures,
   and the two drawings that turn up in more than one room: the map of the valley and the photograph of the Old Bridge.
   Loaded after engine.js. Nothing in here knows an answer, and the words on the drawings are handed in by the pages. */
window.FL = (function () {
  'use strict';
  var X = {}, D = document;
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so that the sound button switches them) ---------- */
  X.sfx = {
    slip: function () { B({ type: 'highpass', f: 2600, dur: 0.11, peak: 0.08, a: 0.02 }); },
    clip: function () { B({ dur: 0.025, f: 2600, q: 3, peak: 0.24 }); T({ f: 420, f2: 240, dur: 0.06, peak: 0.14, when: 0.012 }); },
    spike: function () { B({ type: 'highpass', f: 1800, f2: 3800, dur: 0.16, peak: 0.1, a: 0.01 }); T({ f: 180, f2: 90, dur: 0.09, peak: 0.2, when: 0.05 }); },
    key: function () { B({ dur: 0.02, f: 3400, q: 2, peak: 0.16 }); T({ f: 210, f2: 140, dur: 0.05, peak: 0.1 }); },
    pin: function () { B({ dur: 0.03, f: 2400, q: 3, peak: 0.2 }); T({ f: 520, f2: 300, dur: 0.07, peak: 0.16, when: 0.01 }); },
    lamp: function () { B({ dur: 0.02, f: 1600, q: 2, peak: 0.22 }); T({ f: 240, f2: 150, dur: 0.05, peak: 0.12 }); },
    pen: function () { B({ type: 'bandpass', f: 2600, f2: 3400, q: 2, dur: 0.2, peak: 0.05, a: 0.03 }); },
    snip: function () { B({ dur: 0.03, f: 5200, q: 4, peak: 0.16 }); B({ dur: 0.03, f: 4200, q: 4, peak: 0.14, when: 0.09 }); },
    crackle: function () { B({ type: 'bandpass', f: 2200, q: 0.8, dur: 0.22, peak: 0.07, a: 0.01 }); B({ type: 'bandpass', f: 3100, q: 1.5, dur: 0.08, peak: 0.06, when: 0.2 }); },
    printer: function () { for (var i = 0; i < 6; i++) B({ dur: 0.03, f: 1500 + (i % 2) * 500, q: 5, peak: 0.07, when: i * 0.06 }); },
    drawer: function () { B({ type: 'lowpass', f: 500, f2: 240, dur: 0.3, peak: 0.2, a: 0.04 }); T({ f: 96, f2: 70, dur: 0.12, peak: 0.2, when: 0.26 }); },
    /* the station's ident: four slow notes that come down. It is played once in the whole story, when the red light goes on
       (the music has been faded out first), and it is shown as well as heard. */
    ident: function () {
      [[659.25, 0], [523.25, 0.34], [587.33, 0.68], [392.0, 1.02]].forEach(function (n, i) {
        T({ type: 'triangle', f: n[0], dur: i === 3 ? 1.6 : 0.5, peak: 0.16, when: n[1] }); T({ f: n[0] / 2, dur: i === 3 ? 1.6 : 0.5, peak: 0.07, when: n[1] });
      });
    }
  };
  /* A step inside a room is done: the music answers in the room's own key, as it does after ER.exit; without music, three plain notes. */
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
  X.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  /* one message as a slip of paper. m = {no, type: 'text' | 'phone' | 'agency' | 'talk' | 'police', label, time, from, note, text} */
  X.slip = function (m) {
    return '<div class="sl t-' + m.type + '"><h5><span>' + (m.no ? m.no + ' &#183; ' : '') + m.label + '</span><span>' + m.time + '</span></h5>' +
      '<h6>' + m.from + (m.note ? ' <small>' + m.note + '</small>' : '') + '</h6><p>' + m.text + '</p></div>';
  };

  /* Pick and place for a piece of work made of HTML, where a place may hold several things: a thing is dragged to a place,
     or it is clicked and then the place is clicked. o = {item: '.sel', zone: '.sel', lock: fn -> bool, pick: fn(item or null),
     drop: fn(item, zone) -> false to refuse}. The thing in the hand has the class "held"; while it is dragged, "fly". */
  X.place = function (root, o) {
    var held = null;
    function hold(n) { if (held) held.classList.remove('held'); held = n; if (n) n.classList.add('held'); if (o.pick) o.pick(n); }
    function zoneAt(x, y) { var t = D.elementFromPoint(x, y); return t && t.closest ? t.closest(o.zone) : null; }
    root.addEventListener('pointerdown', function (e) {
      var item = e.target.closest ? e.target.closest(o.item) : null;
      if (!item || e.button || (o.lock && o.lock())) return;
      e.preventDefault();
      var r = item.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top, sx = e.clientX, sy = e.clientY, moved = false;
      function mv(ev) {
        if (!moved) {
          if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 6) return;
          moved = true; hold(item); item.style.width = r.width + 'px'; item.classList.add('fly');
        }
        item.style.left = (ev.clientX - dx) + 'px'; item.style.top = (ev.clientY - dy) + 'px';
      }
      function up(ev) {
        D.removeEventListener('pointermove', mv); D.removeEventListener('pointerup', up); D.removeEventListener('pointercancel', up);
        if (moved) {
          item.classList.remove('fly'); item.style.left = item.style.top = item.style.width = '';
          var z = zoneAt(ev.clientX, ev.clientY);
          if (z && o.drop(item, z) !== false) hold(null);
        } else hold(held === item ? null : item);
      }
      D.addEventListener('pointermove', mv); D.addEventListener('pointerup', up); D.addEventListener('pointercancel', up);
    });
    root.addEventListener('click', function (e) {
      if (!held || (o.lock && o.lock())) return;
      if (e.target.closest && e.target.closest(o.item)) return;
      var z = e.target.closest ? e.target.closest(o.zone) : null;
      if (z && o.drop(held, z) !== false) hold(null);
    });
    return { hold: hold, held: function () { return held; } };
  };

  /* rain on a window: n streaks that fall through the box x, y, w, h (clip the group to the glass) */
  X.rain = function (x, y, w, h, n, seed) {
    var s = '', i, r = seed || 7, px, len;
    function rnd() { r = (r * 16807) % 2147483647; return r / 2147483647; }
    for (i = 0; i < n; i++) {
      px = x + rnd() * (w + 40); len = 14 + rnd() * 26;
      s += '<path class="rn" style="animation-delay:-' + (rnd() * 1.4).toFixed(2) + 's;animation-duration:' + (0.55 + rnd() * 0.55).toFixed(2) + 's" d="M' + px.toFixed(0) + ' ' + (y - 30 + rnd() * h * 0.3).toFixed(0) +
        'l-' + (len * 0.11).toFixed(1) + ' ' + len.toFixed(1) + '"/>';
    }
    return s;
  };

  /* ---------- people, standing: feet at 0 0, about 300 high ----------
     o = {skin, hair, style: 'short' | 'bob' | 'quiff' | 'perm' | 'back' | 'tufts' | 'none', top, sleeve, bottom, shirt,
          kind: 'jumper' | 'jacket' | 'mac' | 'cardi' | 'hivis', legs: 'trousers' | 'skirt' | 'waders', cap, hat (a woollen one),
          glasses, phones (headphones round the neck), headset, smile, asleep, lit (the colour of a light at one side), extra, under} */
  var HAIR = {
    short: 'M-23 -276Q-25 -303 0 -304Q25 -303 23 -276Q14 -291 0 -291Q-14 -291 -23 -276Z',
    bob: 'M-23 -276Q-25 -303 0 -304Q25 -303 23 -276Q14 -291 0 -291Q-14 -291 -23 -276ZM-23 -284Q-31 -262 -25 -246L-17 -248Q-21 -264 -19 -282ZM23 -284Q31 -262 25 -246L17 -248Q21 -264 19 -282Z',
    quiff: 'M-23 -276Q-25 -300 -6 -304Q10 -312 22 -300Q27 -290 23 -276Q16 -293 2 -292Q-14 -291 -23 -276Z',
    back: 'M-23 -277Q-24 -302 0 -303Q24 -302 23 -277Q12 -294 0 -294Q-12 -294 -23 -277Z',
    tufts: 'M-23 -270Q-27 -284 -19 -292Q-21 -280 -19 -268ZM23 -270Q27 -284 19 -292Q21 -280 19 -268Z'
  };
  X.person = function (o) {
    var skin = o.skin || '#e8c4a2', hair = o.hair || '#3a2a1c', top = o.top || '#3d4f63', bot = o.bottom || '#2b3038', sleeve = o.sleeve || top, s = '', i;
    var coat = o.kind === 'mac' || o.kind === 'jacket', hem = o.kind === 'mac' ? -58 : coat ? -88 : -98;
    s += '<ellipse cx="0" cy="3" rx="50" ry="9" fill="#000" opacity="' + (o.shadow == null ? 0.3 : o.shadow) + '"/>';
    if (o.under) s += o.under;
    if (o.legs === 'skirt') s += '<path d="M-16 0v-70h12v70zM4 0v-70h12v70z" fill="' + (o.tights || '#3a3540') + '"/><path d="M-35 -60h70l-8 -70h-54z" fill="' + bot + '"/>';
    else if (o.legs === 'waders') s += '<path d="M-24 0v-176h21v176zM3 0v-176h21v176z" fill="' + bot + '"/><path d="M-24 -44h21M3 -44h21" stroke="#000" stroke-opacity=".22" stroke-width="3"/>';
    else s += '<path d="M-21 0v-110h18v110zM3 0v-110h18v110z" fill="' + bot + '"/>';
    s += '<path d="M-27 0h25v8h-29zM2 0h25l4 8h-29z" fill="' + (o.shoes || '#14161a') + '"/>';
    s += '<path d="M-36 ' + hem + 'C-41 -150 -45 -212 -28 -232Q0 -246 28 -232C45 -212 41 -150 36 ' + hem + 'Z" fill="' + top + '"/>';
    if (o.legs === 'waders') s += '<path d="M-30 -176h60v64h-60z" fill="' + bot + '"/><path d="M-22 -176l4 -52M22 -176l-4 -52" stroke="' + bot + '" stroke-width="7"/>';
    s += '<path d="M-10 -239l10 27 10 -27z" fill="' + (o.shirt || '#e9e4d6') + '"/>';
    if (coat) s += '<path d="M0 -212V' + hem + '" stroke="#000" stroke-opacity=".28" stroke-width="2"/><path d="M-10 -239L-19 -208L0 -192L19 -208L10 -239" fill="none" stroke="#000" stroke-opacity=".28" stroke-width="2.6" stroke-linejoin="round"/>';
    if (o.kind === 'mac') s += '<path d="M-37 -150h74" stroke="#000" stroke-opacity=".22" stroke-width="7"/><rect x="-6" y="-156" width="12" height="12" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="2"/>';
    if (o.kind === 'cardi') { s += '<path d="M-10 -239L0 -196L10 -239" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2.6"/><path d="M0 -196V' + hem + '" stroke="#000" stroke-opacity=".22" stroke-width="2"/>'; for (i = 0; i < 4; i++) s += '<circle cx="5" cy="' + (-184 + i * 22) + '" r="2.6" fill="#fff" opacity=".75"/>'; }
    if (o.kind === 'hivis') s += '<path d="M-35 -100C-40 -150 -43 -208 -27 -230L-10 -239L0 -212L10 -239L27 -230C43 -208 40 -150 35 -100Z" fill="#e6e21f"/><path d="M-39 -152h78M-37 -122h74" stroke="#d3d8dc" stroke-width="9"/><path d="M-20 -232l-5 132M20 -232l5 132" stroke="#d3d8dc" stroke-width="7"/>';
    if (o.lit) s += '<path d="M28 -232C45 -212 41 -150 36 ' + hem + '" fill="none" stroke="' + o.lit + '" stroke-width="3.5" opacity=".55"/>';
    s += '<path d="M-31 -222Q-49 -170 -42 -122M31 -222Q49 -170 42 -122" stroke="' + sleeve + '" stroke-width="15" fill="none" stroke-linecap="round"/>' +
      '<circle cx="-42" cy="-113" r="7.5" fill="' + skin + '"/><circle cx="42" cy="-113" r="7.5" fill="' + skin + '"/>';
    if (o.phones) s += '<path d="M-17 -240Q0 -222 17 -240" fill="none" stroke="#17191c" stroke-width="6" stroke-linecap="round"/><rect x="-24" y="-246" width="10" height="16" rx="4" fill="#17191c"/><rect x="14" y="-246" width="10" height="16" rx="4" fill="#17191c"/>';
    s += '<rect x="-7" y="-256" width="14" height="20" fill="' + skin + '"/><ellipse cx="0" cy="-275" rx="22.5" ry="25" fill="' + skin + '"/>';
    if (o.style === 'perm') { for (i = 0; i < 7; i++) s += '<circle cx="' + (-21 + i * 7) + '" cy="' + (-291 - (i === 0 || i === 6 ? -6 : i === 1 || i === 5 ? 3 : 7)) + '" r="8.5" fill="' + hair + '"/>'; s += '<circle cx="-24" cy="-276" r="6.5" fill="' + hair + '"/><circle cx="24" cy="-276" r="6.5" fill="' + hair + '"/>'; }
    else if (o.style && o.style !== 'none' && HAIR[o.style]) s += '<path d="' + HAIR[o.style] + '" fill="' + hair + '"/>';
    if (o.hat) s += '<path d="M-24 -279Q-25 -306 0 -307Q25 -306 24 -279Q0 -289 -24 -279Z" fill="' + o.hat + '"/><path d="M-24 -281Q0 -291 24 -281" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="5"/>';
    if (o.cap) s += '<path d="M-25 -286Q-22 -306 2 -306Q24 -305 25 -288Q8 -295 -10 -292Q-24 -290 -36 -281Q-34 -288 -25 -286Z" fill="' + o.cap + '"/>';
    s += (o.asleep ? '<path d="M-11 -275q3 3 6 0M5 -275q3 3 6 0" stroke="#221b17" stroke-width="2" fill="none" stroke-linecap="round"/>' :
      '<ellipse cx="-8" cy="-275" rx="2.3" ry="2.8" fill="#221b17"/><ellipse cx="8" cy="-275" rx="2.3" ry="2.8" fill="#221b17"/>') +
      '<path d="M1 -273q-3 7 1 9" stroke="#000" stroke-opacity=".28" stroke-width="1.8" fill="none" stroke-linecap="round"/>' +
      '<path d="M-6 -259q6 ' + (o.smile == null ? 3 : o.smile) + ' 12 0" stroke="#7d3f34" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
    if (o.glasses) s += '<g fill="none" stroke="' + o.glasses + '" stroke-width="1.8"><rect x="-15" y="-281" width="12" height="10" rx="3"/><rect x="3" y="-281" width="12" height="10" rx="3"/><path d="M-3 -277h6"/></g>';
    if (o.headset) s += '<path d="M-23 -280Q-24 -306 0 -307Q24 -306 23 -280" fill="none" stroke="#17191c" stroke-width="4"/><rect x="-28" y="-284" width="8" height="15" rx="3" fill="#17191c"/><path d="M-24 -270Q-22 -256 -9 -256" fill="none" stroke="#17191c" stroke-width="2.4"/><circle cx="-8" cy="-256" r="3" fill="#17191c"/>';
    if (o.extra) s += o.extra;
    return s;
  };
  X.PEOPLE = {
    brannigan: { skin: '#eccdb0', hair: '#9a9ea4', style: 'bob', top: '#3b4c60', kind: 'jacket', bottom: '#252a31', shirt: '#d9dee3', glasses: '#7a2f2f' },
    sato: { skin: '#e3c098', hair: '#17171b', style: 'quiff', top: '#8a4433', kind: 'jumper', bottom: '#2a2f38', shirt: '#e9e4d6', phones: 1 },
    haddad: { skin: '#c68e62', hair: '#22160f', style: 'back', top: '#22344d', kind: 'hivis', bottom: '#3d5540', legs: 'waders', hat: '#22344d', shoes: '#26382a' },
    lindley: { skin: '#efd2ba', hair: '#f1f1ee', style: 'tufts', top: '#b9a888', kind: 'mac', bottom: '#4a443c', shirt: '#7a2f2f', cap: '#6b5a44', glasses: '#3a3a3a' },
    dilys: { skin: '#f1d5bd', hair: '#d9d6d2', style: 'perm', top: '#8f7bb5', kind: 'cardi', bottom: '#4a4458', legs: 'skirt', shirt: '#f3efe6', headset: 1 }
  };
  /* one of the cast, with something added: X.who('sato', {extra: ...}) */
  X.who = function (name, more) {
    var o = {}, k, base = X.PEOPLE[name];
    for (k in base) o[k] = base[k];
    for (k in (more || {})) o[k] = more[k];
    return X.person(o);
  };

  /* ---------- OUR PATCH: the valley of the Wend, drawn 720 x 500 ----------
     Squares are 80 across (A to I) and 100 down (1 to 5). o = {grid: true, labels: [[x, y, text, kind, anchor, turn], ...]}
     kinds of lettering: town, vil, st (a street), br (a bridge), wat (water), sm (anything small), ht (a height in metres) */
  var RIV = 'M64 262C96 250 112 258 134 270S192 300 226 286S292 278 330 292S404 322 462 322S556 330 598 368S664 422 730 426';
  var BRK = 'M378 -10C366 50 392 100 376 150S362 250 353 300';
  function road(d, w, col) { return '<path d="' + d + '" fill="none" stroke="#7d7058" stroke-width="' + (w + 2) + '" stroke-linecap="round" stroke-linejoin="round"/><path d="' + d + '" fill="none" stroke="' + (col || '#fffdf6') + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>'; }
  X.map = function (o) {
    o = o || {};
    var s = '', i, LET = { town: ['fL', 17, 900, '#1d2228', 4], vil: ['fL', 12.5, 800, '#1d2228', 1.6], st: ['fL', 9.6, 600, '#2a2f38', 0], br: ['fL', 9.6, 800, '#7a2f2f', 0], wat: ['fN', 12, 600, '#2c5f86', 0.6], sm: ['fL', 8.6, 500, '#4a4438', 0], ht: ['fM', 8.6, 500, '#8a5a1e', 0] };
    s += '<rect x="0" y="0" width="720" height="500" fill="#f1ead4"/>';
    /* the high ground: a brown tint and rings */
    s += '<g fill="#c9a36a" opacity=".22"><ellipse cx="112" cy="62" rx="170" ry="120"/><ellipse cx="258" cy="130" rx="150" ry="96"/><ellipse cx="610" cy="130" rx="190" ry="130"/><ellipse cx="320" cy="470" rx="300" ry="80"/></g>';
    s += '<g fill="none" stroke="#b08a52" stroke-width="1" opacity=".6"><ellipse cx="112" cy="62" rx="126" ry="84"/><ellipse cx="114" cy="60" rx="86" ry="54"/><ellipse cx="116" cy="58" rx="46" ry="27"/><ellipse cx="258" cy="132" rx="104" ry="64"/><ellipse cx="262" cy="128" rx="62" ry="36"/><ellipse cx="616" cy="124" rx="130" ry="88"/><ellipse cx="620" cy="118" rx="80" ry="50"/><ellipse cx="330" cy="476" rx="200" ry="44"/></g>';
    /* the low ground beside the water */
    s += '<g fill="none" stroke="#cfe2c2" stroke-linecap="round" opacity=".95"><path d="' + RIV + '" stroke-width="64"/><path d="M462 322S556 330 598 368S664 422 730 426" stroke-width="120"/><path d="M376 150S362 250 353 300" stroke-width="50"/></g>';
    /* where the houses are */
    s += '<g fill="#e0d2b4"><path d="M168 150L262 100L330 104L420 140L428 250L392 296L334 284L290 270L236 272L190 264L150 254L156 190Z"/><path d="M198 306L338 304L424 336L420 394L332 400L204 368Z"/><path d="M606 322L700 318L712 372L690 404L640 398L604 360Z"/><path d="M84 40L140 38L148 80L96 84Z"/></g>';
    /* the reservoir and its dam */
    s += '<path d="M-10 214Q34 204 54 232L62 262L52 290Q22 304 -10 296Z" fill="#a9d0ea" stroke="#5c8fb5" stroke-width="1.6"/><path d="M56 236L62 262L54 288" fill="none" stroke="#3a3a3a" stroke-width="5" stroke-linecap="round"/>';
    /* the river and the brook */
    s += '<path d="' + RIV + '" fill="none" stroke="#5c8fb5" stroke-width="11" stroke-linecap="round"/><path d="' + RIV + '" fill="none" stroke="#a9d0ea" stroke-width="8" stroke-linecap="round"/>';
    s += '<path d="' + BRK + '" fill="none" stroke="#5c8fb5" stroke-width="4"/><path d="' + BRK + '" fill="none" stroke="#a9d0ea" stroke-width="2.2"/>';
    s += '<path d="M130 262l8 16" stroke="#fff" stroke-width="2.4" stroke-dasharray="2 2"/>';
    /* the railway */
    s += '<path d="M-10 392C110 388 180 352 224 346S400 400 500 440S660 486 730 492" fill="none" stroke="#2a2a2a" stroke-width="2.4"/><path d="M-10 392C110 388 180 352 224 346S400 400 500 440S660 486 730 492" fill="none" stroke="#2a2a2a" stroke-width="7" stroke-dasharray="1.6 11"/>';
    /* roads: the bypass in red, the rest white */
    s += road('M268 128C230 110 170 84 112 60', 2.4) + road('M470 300C520 296 560 314 598 338C618 346 636 336 660 331L730 322', 2.4) +
      road('M250 202L248 240L236 272', 2.6) + road('M248 240L210 256L150 262', 2.6) + road('M224 300L224 332M224 331L333 334', 2.6) + road('M336 344C362 350 388 362 410 380L428 404', 2.6) +
      road('M404 150L400 200L394 250L384 286', 2.6) + road('M310 206L360 196L404 150L412 90L420 -10', 2.6) + road('M600 340L590 364', 2.4) + road('M678 346L676 380L672 408', 2.6) + road('M622 378L648 392L676 404', 2.4) +
      road('M310 206L250 202L222 184L194 170', 2.8) + road('M310 206L286 168L268 128', 2.8) + road('M310 208L322 250L330 292L333 334L336 372L330 430L326 510', 3.6) +
      road('M520 -10C512 100 488 220 462 322S420 440 412 510', 5, '#e2714a');
    /* bridges */
    s += '<path d="M228 275L224 298" stroke="#2a2a2a" stroke-width="3" stroke-dasharray="3 2"/>' +
      '<path d="M328 281L332 303" stroke="#3a3a3a" stroke-width="8.5" stroke-linecap="square"/><path d="M328 281L332 303" stroke="#fffdf6" stroke-width="3.8"/>' +
      '<path d="M467 306L457 338" stroke="#3a3a3a" stroke-width="10" stroke-linecap="square"/><path d="M467 306L457 338" stroke="#e2714a" stroke-width="5.2"/>';
    /* a few buildings: the mill, two churches, the station, the school, the cottages, the Corn Exchange, the radio station */
    s += '<rect x="134" y="256" width="9" height="8" fill="#3a3a3a"/>' +
      '<g fill="#3a3a3a"><rect x="184" y="161" width="10" height="8"/><path d="M189 150v10M185 154h8" stroke="#3a3a3a" stroke-width="2" fill="none"/><rect x="678" y="335" width="10" height="8"/><path d="M683 324v10M679 328h8" stroke="#3a3a3a" stroke-width="2" fill="none"/></g>' +
      '<rect x="214" y="334" width="20" height="9" fill="#c9302a"/>' +
      '<rect x="367" y="197" width="26" height="24" fill="#7a6a52"/><g fill="#7a6a52"><rect x="368" y="244" width="5" height="12"/><rect x="375" y="244" width="5" height="12"/><rect x="382" y="244" width="5" height="12"/><rect x="389" y="244" width="5" height="12"/></g>' +
      '<rect x="301" y="194" width="16" height="11" fill="#7a6a52"/>' +
      '<g transform="translate(268 124)"><path d="M0 0V-20" stroke="#c9302a" stroke-width="2.4"/><circle r="4" fill="#c9302a"/><path d="M-9 -22q9 -9 18 0M-14 -27q14 -13 28 0" fill="none" stroke="#c9302a" stroke-width="1.6"/></g>';
    /* the squares */
    if (o.grid) {
      s += '<g stroke="#4a6a86" stroke-width=".8" opacity=".38">';
      for (i = 1; i < 9; i++) s += '<path d="M' + (i * 80) + ' 0V500"/>';
      for (i = 1; i < 5; i++) s += '<path d="M0 ' + (i * 100) + 'H720"/>';
      s += '</g>';
    }
    (o.labels || []).forEach(function (l) {
      var k = LET[l[3] || 'st'];
      s += '<text x="' + l[0] + '" y="' + l[1] + '" class="' + k[0] + '" font-size="' + k[1] + '" font-weight="' + k[2] + '" fill="' + k[3] + '"' + (k[4] ? ' letter-spacing="' + k[4] + '"' : '') +
        (l[3] === 'wat' ? ' font-style="italic"' : '') + ' text-anchor="' + (l[4] || 'middle') + '"' + (l[5] ? ' transform="rotate(' + l[5] + ' ' + l[0] + ' ' + l[1] + ')"' : '') +
        ' stroke="#f1ead4" stroke-width="' + (l[3] === 'town' ? 4 : 2.6) + '" paint-order="stroke" stroke-linejoin="round">' + l[2] + '</text>';
    });
    return s;
  };
  /* the letters and numbers round the edge of the map (drawn outside the 720 x 500) */
  X.mapEdge = function () {
    var s = '', i;
    for (i = 0; i < 9; i++) s += '<text x="' + (i * 80 + 40) + '" y="-7" class="fL" font-size="13" font-weight="900" text-anchor="middle" fill="#7a2f2f">' + 'ABCDEFGHI'.charAt(i) + '</text>';
    for (i = 0; i < 5; i++) s += '<text x="-12" y="' + (i * 100 + 55) + '" class="fL" font-size="13" font-weight="900" text-anchor="middle" fill="#7a2f2f">' + (i + 1) + '</text>';
    return s + '<rect x="0" y="0" width="720" height="500" fill="none" stroke="#1d2228" stroke-width="2"/>';
  };

  /* ---------- the photograph of the Old Bridge, drawn 600 x 400 ----------
     o = {id: a short word (the page may hold the picture twice), sign: [line one, line two], words: the line somebody wrote
     across the bottom ('' = none)}. What can be found in it, and where: see X.photoAt. */
  X.photo = function (o) {
    o = o || {};
    var id = o.id || 'ph', s = '', i, x, sign = o.sign || ['', ''], r = 11;
    function rnd() { r = (r * 16807) % 2147483647; return r / 2147483647; }
    s += '<defs><linearGradient id="' + id + 'sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfd9df"/><stop offset="1" stop-color="#f2f0e4"/></linearGradient>' +
      '<linearGradient id="' + id + 'wat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#94734a"/><stop offset="1" stop-color="#6a4e2d"/></linearGradient>' +
      '<clipPath id="' + id + 'clip"><rect x="0" y="0" width="600" height="400"/></clipPath></defs><g clip-path="url(#' + id + 'clip)">';
    s += '<rect x="0" y="0" width="600" height="244" fill="url(#' + id + 'sky)"/><ellipse cx="440" cy="34" rx="150" ry="34" fill="#fff" opacity=".55"/>';
    /* the far bank: a hill, roofs, a church tower, and the big trees in full leaf */
    s += '<path d="M120 150Q260 104 420 124T600 112V200H120Z" fill="#a9b8a2"/>' +
      '<g fill="#8a6f5e"><path d="M222 156l14 -14 14 14v22h-28z"/><path d="M256 160l12 -12 12 12v18h-24z"/><path d="M330 158l13 -13 13 13v20h-26z"/></g><g fill="#5c5f66"><path d="M218 157l18 -17 18 17zM253 161l15 -15 15 15zM326 159l17 -16 17 16z"/></g>' +
      '<rect x="288" y="108" width="16" height="70" fill="#8f8a7e"/><path d="M286 108l10 -20 10 20z" fill="#6b6a66"/><rect x="293" y="120" width="6" height="10" fill="#4a4a48"/>';
    [[402, 138, 34], [448, 122, 40], [500, 132, 44], [556, 120, 46], [596, 142, 38], [426, 158, 26], [476, 160, 28], [530, 162, 30], [176, 148, 26], [152, 160, 20], [202, 160, 20]].forEach(function (t, k) {
      s += '<circle cx="' + t[0] + '" cy="' + t[1] + '" r="' + t[2] + '" fill="' + ['#3f7a3a', '#4b8a42', '#356f33'][k % 3] + '"/>';
    });
    for (i = 0; i < 70; i++) { x = 372 + rnd() * 228; s += '<ellipse cx="' + x.toFixed(0) + '" cy="' + (96 + rnd() * 78).toFixed(0) + '" rx="5" ry="3" fill="' + (i % 2 ? '#2c5f2c' : '#6aa85c') + '" opacity=".7"/>'; }
    for (i = 0; i < 16; i++) { x = 138 + rnd() * 80; s += '<ellipse cx="' + x.toFixed(0) + '" cy="' + (132 + rnd() * 40).toFixed(0) + '" rx="4.5" ry="2.8" fill="' + (i % 2 ? '#2c5f2c' : '#6aa85c') + '" opacity=".7"/>'; }
    s += '<path d="M470 176v-36M520 176v-30" stroke="#4a3a28" stroke-width="5"/>';
    /* the bridge: the deck, five arches with their tops just clear of the water, the points of the piers */
    s += '<rect x="120" y="176" width="480" height="68" fill="#a59c8a"/><rect x="120" y="172" width="480" height="8" fill="#bcb3a0"/><path d="M120 190H600M120 204H600" stroke="#8a826f" stroke-width="1"/>';
    for (i = 0; i < 26; i++) s += '<path d="M' + (128 + i * 18 + (i % 2) * 7) + ' ' + (i % 2 ? 190 : 180) + 'v' + (i % 2 ? 14 : 10) + '" stroke="#8a826f" stroke-width="1"/>';
    for (i = 0; i < 5; i++) { x = 148 + i * 86; s += '<path d="M' + x + ' 244Q' + (x + 32) + ' 186 ' + (x + 64) + ' 244Z" fill="#26221e"/><path d="M' + (x - 2) + ' 244Q' + (x + 32) + ' 180 ' + (x + 66) + ' 244" fill="none" stroke="#c9c0ad" stroke-width="3"/>'; }
    for (i = 0; i < 4; i++) { x = 212 + i * 86; s += '<path d="M' + x + ' 244L' + (x + 11) + ' 224L' + (x + 22) + ' 244Z" fill="#b8af9b"/><path d="M' + (x + 11) + ' 224V244" stroke="#8a826f" stroke-width="1.2"/>'; }
    /* a lamp that is not lit, and three people under umbrellas */
    s += '<path d="M309 172V134" stroke="#2a2c30" stroke-width="3"/><rect x="303" y="122" width="12" height="14" rx="1.5" fill="#3a4046" stroke="#2a2c30" stroke-width="1.5"/><path d="M301 122h16l-8 -7z" fill="#2a2c30"/>';
    [[250, '#c23b2c'], [420, '#27457a'], [470, '#e0b21c']].forEach(function (p) {
      s += '<rect x="' + (p[0] - 4) + '" y="158" width="8" height="16" rx="2" fill="#2a2f38"/><circle cx="' + p[0] + '" cy="154" r="4" fill="#e3c098"/><path d="M' + p[0] + ' 158V144" stroke="#2a2c30" stroke-width="1.2"/><path d="M' + (p[0] - 14) + ' 148Q' + p[0] + ' 130 ' + (p[0] + 14) + ' 148Z" fill="' + p[1] + '"/>';
    });
    /* the water */
    s += '<rect x="0" y="244" width="600" height="156" fill="url(#' + id + 'wat)"/>';
    for (i = 0; i < 5; i++) { x = 148 + i * 86; s += '<path d="M' + (x + 4) + ' 244h56l-6 12h-44z" fill="#3a2c1c" opacity=".55"/>'; }
    for (i = 0; i < 34; i++) { x = rnd() * 560; s += '<path d="M' + x.toFixed(0) + ' ' + (254 + rnd() * 120).toFixed(0) + 'q' + (18 + rnd() * 30).toFixed(0) + ' -5 ' + (40 + rnd() * 50).toFixed(0) + ' 0" fill="none" stroke="' + (i % 3 ? '#b89468' : '#5a4024') + '" stroke-width="' + (1 + rnd() * 1.6).toFixed(1) + '" opacity=".6"/>'; }
    s += '<path d="M352 306l56 -10 8 4 -30 8 22 6 -4 4 -30 -6z" fill="#3a2a18"/><path d="M212 246q11 6 22 0M298 246q11 6 22 0M384 246q11 6 22 0M470 246q11 6 22 0" fill="none" stroke="#e9dcc4" stroke-width="2.2" opacity=".8"/>';
    /* the shop on the corner at the town end, with its name over the window, and sandbags at the door */
    s += '<rect x="0" y="62" width="128" height="184" fill="#96563f"/><path d="M-4 66L64 34L132 66Z" fill="#4a4d55"/>';
    for (i = 0; i < 12; i++) s += '<path d="M0 ' + (74 + i * 14) + 'H128" stroke="#7d4532" stroke-width="1"/>';
    s += '<g fill="#dfe6ea" stroke="#f1ede2" stroke-width="3"><rect x="16" y="78" width="30" height="34"/><rect x="80" y="78" width="30" height="34"/></g><path d="M31 78v34M95 78v34M16 95h30M80 95h30" stroke="#f1ede2" stroke-width="2"/>' +
      '<rect x="4" y="118" width="120" height="30" fill="#1f3d33"/><rect x="6.5" y="120.500" width="115" height="25" fill="none" stroke="#d9b45a" stroke-width="1"/>' +
      '<text x="64" y="134" class="fZ" font-size="10.400" font-weight="700" text-anchor="middle" fill="#e9c66a" textLength="104" lengthAdjust="spacingAndGlyphs">' + sign[0] + '</text>' +
      '<text x="64" y="143" class="fL" font-size="5" font-weight="700" text-anchor="middle" fill="#e9c66a" letter-spacing="1.200">' + sign[1] + '</text>' +
      '<rect x="8" y="154" width="74" height="76" fill="#2a3a3c"/><rect x="8" y="154" width="74" height="76" fill="none" stroke="#1f3d33" stroke-width="4"/>' +
      '<g fill="#b9bcc0"><path d="M18 206h14l-2 18h-10z"/><path d="M40 196h4v28h-4zM36 196h12v5h-12z"/><path d="M58 210h16v14h-16z"/><path d="M60 204q6 -8 12 0" fill="none" stroke="#b9bcc0" stroke-width="2"/></g>' +
      '<rect x="90" y="156" width="30" height="80" fill="#1f3d33"/><rect x="95" y="162" width="20" height="30" fill="#2a3a3c"/><circle cx="94" cy="200" r="1.800" fill="#d9b45a"/>' +
      '<g fill="#c9b78f" stroke="#9a8a66" stroke-width="1"><ellipse cx="96" cy="238" rx="11" ry="5"/><ellipse cx="116" cy="238" rx="11" ry="5"/><ellipse cx="106" cy="230" rx="11" ry="5"/></g>' +
      '<path d="M0 244H128" stroke="#e9dcc4" stroke-width="2" opacity=".7"/>';
    /* the gauge board on the end of the bridge: a number at every metre, a mark every 20 centimetres */
    s += '<rect x="131" y="190" width="18" height="60" fill="#f6f4ea" stroke="#2a2c30" stroke-width="1.2"/>';
    for (i = 0; i < 5; i++) s += '<path d="M131 ' + (196 + i * 11) + 'h' + (i === 1 ? 9 : 6) + '" stroke="#16181b" stroke-width="' + (i === 1 ? 2.2 : 1.6) + '"/>';
    s += '<text x="144.500" y="210.500" class="fL" font-size="9" font-weight="900" text-anchor="middle" fill="#16181b">5</text><rect x="0" y="240" width="600" height="6" fill="#94734a"/><rect x="128" y="240" width="24" height="14" fill="#93724a"/><path d="M128 241h24" stroke="#e9dcc4" stroke-width="1.6" opacity=".9"/>';
    /* rain */
    s += '<g stroke="#fff" stroke-width="1" opacity=".3">';
    for (i = 0; i < 90; i++) { x = rnd() * 640; s += '<path d="M' + x.toFixed(0) + ' ' + (rnd() * 380).toFixed(0) + 'l-5 22"/>'; }
    s += '</g>';
    if (o.words) s += '<text x="300" y="386" class="fL" font-size="19" font-weight="900" text-anchor="middle" fill="#fff" stroke="#111" stroke-width="4" paint-order="stroke" stroke-linejoin="round" textLength="540" lengthAdjust="spacingAndGlyphs">' + o.words + '</text>';
    return s + '</g>';
  };
  /* what is at a point of the photograph (600 x 400): the name of a kind of thing, never a verdict */
  X.photoAt = function (x, y) {
    function inr(a, b, c, d) { return x >= a && x <= b && y >= c && y <= d; }
    if (x < 0 || y < 0 || x > 600 || y > 400) return null;
    if (inr(125, 155, 186, 252)) return 'gauge';
    if (inr(4, 124, 116, 150)) return 'sign';
    if (inr(296, 322, 112, 174)) return 'lamp';
    if (inr(234, 266, 132, 176) || inr(404, 436, 132, 176) || inr(454, 486, 132, 176)) return 'brolly';
    if (inr(0, 130, 34, 250)) return 'shop';
    if (inr(140, 566, 196, 246)) return 'arch';
    if (inr(120, 600, 172, 196)) return 'deck';
    if (inr(366, 600, 84, 176) || inr(132, 222, 122, 176)) return 'tree';
    if (inr(284, 308, 86, 178)) return 'tower';
    if (y > 246) return 'water';
    if (y < 110) return 'sky';
    return 'far';
  };
  return X;
})();
