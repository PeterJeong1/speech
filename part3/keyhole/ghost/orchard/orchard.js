/* Your Place Is Laid - what every room of the story shares: the small sounds of an old house, a few helpers, and the
   three living people drawn as standing figures. Loaded after engine.js. Nothing in here knows an answer. */
window.OY = (function () {
  'use strict';
  var X = {}, D = document;
  function T(o) { try { ER.tone(o); } catch (e) {} }
  function B(o) { try { ER.burst(o); } catch (e) {} }

  /* ---------- sounds (through the engine, so that the sound button switches them) ---------- */
  X.sfx = {
    latch: function () { B({ dur: 0.03, f: 2400, q: 3, peak: 0.22 }); T({ f: 210, f2: 140, dur: 0.09, peak: 0.2, when: 0.05 }); B({ dur: 0.04, f: 900, q: 2, peak: 0.16, when: 0.17 }); },
    tag: function () { T({ f: 1650, dur: 0.12, peak: 0.05 }); T({ f: 2480, dur: 0.07, peak: 0.025 }); B({ dur: 0.015, f: 3800, q: 3, peak: 0.1 }); },
    card: function () { B({ type: 'lowpass', f: 1500, dur: 0.06, peak: 0.18 }); },
    plate: function () { T({ f: 520, f2: 500, dur: 0.16, peak: 0.07 }); B({ type: 'lowpass', f: 700, dur: 0.07, peak: 0.22 }); },
    stone: function () { B({ type: 'lowpass', f: 320, f2: 180, dur: 0.5, peak: 0.3, a: 0.05 }); T({ f: 70, f2: 50, dur: 0.3, peak: 0.25, when: 0.42 }); },
    grass: function () { B({ type: 'bandpass', f: 2600, f2: 1800, q: 0.8, dur: 0.22, peak: 0.05, a: 0.05 }); },
    wheel: function () { B({ dur: 0.02, f: 1900, q: 5, peak: 0.16 }); T({ f: 320, f2: 240, dur: 0.04, peak: 0.07 }); },
    strip: function () { B({ type: 'highpass', f: 3000, f2: 1800, dur: 0.7, peak: 0.07, a: 0.2 }); },
    tin: function () { T({ f: 880, f2: 820, dur: 0.2, peak: 0.06 }); B({ dur: 0.03, f: 3000, q: 2, peak: 0.14 }); }
  };
  /* A lock opens. The music answers in the room's own key, as it does after ER.exit; without music, three plain notes. */
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
  /* Click-then-click on to a place that is already taken: the engine's pick-and-place sees only the item lying there, and
     picks that up instead. This hands the click to the place underneath, so that the held item goes in and the other one
     goes back where the loose ones are kept. (Dragging on to a taken place has always worked.) */
  X.swapClick = function (root, itemSel, slotSel) {
    root.addEventListener('pointerdown', function (e) {
      var t = e.target, held = root.querySelector(itemSel + '.held'), b = t.closest ? t.closest(itemSel) : null, s = b ? b.closest(slotSel) : null;
      if (!held || !b || b === held || !s || e.button || (t.closest && t.closest('button'))) return;
      e.stopPropagation(); e.preventDefault();
      s.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }, true);
  };
  X.flash = function (n, cls, ms) { n.classList.add(cls || 'bad'); setTimeout(function () { n.classList.remove(cls || 'bad'); }, ms || 1000); };
  X.num = function (v) { return (Math.round(v * 10) / 10).toString(); };

  /* ---------- the living ---------- */
  /* A standing figure: feet at 0 0, about 300 high.
     o = {skin, hair, style: 'bob' | 'bun' | 'crop', coat, hem (how far above the ground the coat ends), legs, shoes, collar, apron (colour), specs (colour),
          pack (colour), back: true (seen from behind), hold: true (hands together in front), extra (drawn last), under (drawn first), shadow} */
  X.person = function (o) {
    var skin = o.skin || '#e6c3a3', coat = o.coat || '#3a4650', hair = o.hair || '#4a3a2c', hem = o.hem == null ? 100 : o.hem, top = 246, hy = -271, s = '';
    s += '<ellipse cx="0" cy="3" rx="48" ry="8" fill="#000" opacity="' + (o.shadow == null ? 0.28 : o.shadow) + '"/>';
    if (o.under) s += o.under;
    if (o.pack && o.back) s += '<rect x="-30" y="-232" width="60" height="84" rx="14" fill="' + o.pack + '"/><rect x="-22" y="-196" width="44" height="34" rx="6" fill="#000" opacity=".16"/>';
    s += '<rect x="-20" y="-' + (hem + 12) + '" width="17" height="' + (hem + 12) + '" fill="' + (o.legs || '#2a2c30') + '"/><rect x="3" y="-' + (hem + 12) + '" width="17" height="' + (hem + 12) + '" fill="' + (o.legs || '#2a2c30') + '"/>';
    s += '<path d="M-26 0q0 -10 9 -10h15v10zM2 0v-10h15q9 0 9 10z" fill="' + (o.shoes || '#17181b') + '"/>';
    s += '<path d="M-41 -' + hem + 'L-35 -' + (top - 24) + 'Q-31 -' + top + ' 0 -' + top + 'Q31 -' + top + ' 35 -' + (top - 24) + 'L41 -' + hem + 'Z" fill="' + coat + '"/>';
    if (!o.back) {
      s += '<path d="M-11 -' + top + 'L0 -' + (top - 28) + 'L11 -' + top + 'Z" fill="' + (o.collar || '#ece6d6') + '"/>';
      if (o.apron) s += '<path d="M-24 -' + (top - 46) + 'h48l8 ' + (top - 46 - hem + 6) + 'h-64z" fill="' + o.apron + '"/><path d="M-24 -' + (top - 46) + 'L-10 -' + (top - 8) + 'M24 -' + (top - 46) + 'L10 -' + (top - 8) + '" stroke="' + o.apron + '" stroke-width="5" fill="none"/>';
      else s += '<path d="M0 -' + (top - 28) + 'V-' + hem + '" stroke="#000" stroke-opacity=".2" stroke-width="2"/>';
      if (o.pack) s += '<path d="M-22 -' + (top - 4) + 'q-8 40 -4 78M22 -' + (top - 4) + 'q8 40 4 78" stroke="' + o.pack + '" stroke-width="8" fill="none" stroke-linecap="round"/>';
    }
    if (o.hold) s += '<path d="M-35 -214q-17 36 16 58M35 -214q17 36 -16 58" stroke="' + (o.sleeve || coat) + '" stroke-width="15" fill="none" stroke-linecap="round"/><circle cx="-15" cy="-154" r="8" fill="' + skin + '"/><circle cx="15" cy="-154" r="8" fill="' + skin + '"/>';
    else s += '<path d="M-35 -214q-15 42 -5 92M35 -214q15 42 5 92" stroke="' + (o.sleeve || coat) + '" stroke-width="15" fill="none" stroke-linecap="round"/><circle cx="-40" cy="-116" r="8" fill="' + skin + '"/><circle cx="40" cy="-116" r="8" fill="' + skin + '"/>';
    s += '<rect x="-7" y="' + (hy + 16) + '" width="14" height="20" fill="' + skin + '"/><circle cx="0" cy="' + hy + '" r="23" fill="' + skin + '"/>';
    if (o.back) {
      s += '<circle cx="0" cy="' + (hy - 2) + '" r="24" fill="' + hair + '"/>';
      if (o.style === 'bob') s += '<path d="M-24 ' + (hy - 2) + 'v26q24 10 48 0v-26z" fill="' + hair + '"/>';
      if (o.style === 'bun') s += '<circle cx="0" cy="' + (hy - 24) + '" r="11" fill="' + hair + '"/>';
    } else {
      s += '<path d="M-23 ' + (hy - 1) + 'q2 -28 23 -28t23 28q-9 -13 -23 -13t-23 13z" fill="' + hair + '"/>';
      if (o.style === 'bob') s += '<path d="M-23 ' + (hy - 6) + 'q-6 20 -1 34h9q-5 -18 -2 -28zM23 ' + (hy - 6) + 'q6 20 1 34h-9q5 -18 2 -28z" fill="' + hair + '"/>';
      if (o.style === 'bun') s += '<circle cx="0" cy="' + (hy - 29) + '" r="10" fill="' + hair + '"/>';
      s += '<path d="M-11 ' + (hy + 1) + 'h7M4 ' + (hy + 1) + 'h7" stroke="#2a2420" stroke-width="2.6" stroke-linecap="round"/><path d="M-6 ' + (hy + 13) + 'q6 ' + (o.smile == null ? 3 : o.smile) + ' 12 0" stroke="#8c4a3c" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
      if (o.specs) s += '<circle cx="-8" cy="' + (hy + 1) + '" r="7" fill="none" stroke="' + o.specs + '" stroke-width="2"/><circle cx="8" cy="' + (hy + 1) + '" r="7" fill="none" stroke="' + o.specs + '" stroke-width="2"/><path d="M-1 ' + (hy + 1) + 'h2" stroke="' + o.specs + '" stroke-width="2"/>';
    }
    if (o.extra) s += o.extra;
    return s;
  };
  /* as they are dressed on Michaelmas Day */
  X.PEOPLE = {
    bellamy: { skin: '#ecc9ac', hair: '#b9b4a8', style: 'bob', coat: '#5a6a4c', hem: 112, legs: '#3a3a34', shoes: '#2f4030', collar: '#c9a66a', apron: '#d9cdb0' },
    lumley: { skin: '#e9c7a8', hair: '#3a2c24', style: 'bun', coat: '#27344a', hem: 64, legs: '#1c2230', shoes: '#15161a', collar: '#e9e3d2', specs: '#7b2c22' },
    fair: { skin: '#c99670', hair: '#d9dcdc', style: 'crop', coat: '#2f6a52', hem: 124, legs: '#4a4a40', shoes: '#5a3a22', collar: '#e2b25c', pack: '#8c2f24', smile: 5 }
  };
  X.who = function (name, more) { var o = {}, k, b = X.PEOPLE[name]; for (k in b) o[k] = b[k]; for (k in (more || {})) o[k] = more[k]; return X.person(o); };
  return X;
})();
