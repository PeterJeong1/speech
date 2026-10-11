/* The Keeper Gives No Change - small helpers that every room of the story shares. Loaded after engine.js.
   Nothing in here knows an answer. */
window.TOLL = (function () {
  'use strict';
  var X = {};
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so the sound button switches them) ---------- */
  X.sfx = {
    coin: function () { T({ f: 2400, dur: 0.2, peak: 0.07 }); T({ f: 3650, dur: 0.13, peak: 0.04 }); B({ dur: 0.02, f: 5000, q: 2, peak: 0.12 }); },          /* a penny on stone */
    bead: function () { B({ dur: 0.03, f: 1500, q: 3, peak: 0.2 }); T({ f: 420, dur: 0.05, peak: 0.08 }); },                                                  /* a wooden bead on its rod */
    pebble: function () { B({ dur: 0.04, f: 2200, q: 2, peak: 0.16 }); T({ f: 300, f2: 220, dur: 0.12, peak: 0.1, when: 0.03 }); },                           /* a pebble into a clay jar */
    stone: function () { B({ type: 'lowpass', f: 300, f2: 150, dur: 0.9, peak: 0.3, a: 0.12 }); },                                                           /* a slab turning on its foot */
    seal: function () { B({ type: 'lowpass', f: 500, dur: 0.12, peak: 0.25, a: 0.01 }); T({ f: 140, f2: 90, dur: 0.14, peak: 0.2 }); },                       /* brass into warm wax */
    pen: function () { B({ type: 'highpass', f: 3400, dur: 0.22, peak: 0.07, a: 0.04 }); },
    tear: function () { B({ type: 'highpass', f: 1800, f2: 4200, dur: 0.32, peak: 0.12, a: 0.02 }); },
    flint: function () {                                                                                                                                      /* a tinderbox, and a wick catching */
      B({ dur: 0.03, f: 6000, q: 3, peak: 0.14 }); B({ dur: 0.03, f: 6500, q: 3, peak: 0.14, when: 0.2 });
      B({ type: 'lowpass', f: 500, f2: 900, dur: 0.5, peak: 0.12, a: 0.15, when: 0.34 });
    },
    tap: function () { B({ dur: 0.03, f: 2600, q: 4, peak: 0.2 }); B({ dur: 0.03, f: 2400, q: 4, peak: 0.18, when: 0.22 }); },                                /* a nail knocked in with a mousetrap */
    cluck: function () { T({ type: 'square', f: 520, f2: 380, dur: 0.07, peak: 0.035 }); T({ type: 'square', f: 560, f2: 400, dur: 0.07, peak: 0.035, when: 0.15 }); },
    hm: function () { T({ type: 'triangle', f: 110, f2: 92, dur: 0.3, peak: 0.12, a: 0.06 }); },                                                              /* a troll who is not convinced */
    gate: function () { ER.sfx.creak(); setTimeout(ER.sfx.clunk, 620); },
    crow: function () {                                                                                                                                       /* cock-a-doodle-doo: four notes, the last one long */
      [[0, 520, 720, 0.15], [0.2, 700, 800, 0.13], [0.38, 780, 1010, 0.2], [0.62, 1010, 560, 0.85]].forEach(function (n) {
        T({ type: 'sawtooth', f: n[1], f2: n[2], dur: n[3], peak: 0.075, a: 0.03, when: n[0] });
        T({ type: 'square', f: n[1] * 2.01, f2: n[2] * 2.01, dur: n[3], peak: 0.018, a: 0.03, when: n[0] });
      });
    }
  };

  /* A door opens. The music answers in the room's own key, as it does after ER.exit (these rooms leave through
     ER.exitOk and ER.leave, because something is always said between the lock and the door); without music, three plain notes. */
  X.solved = function (quiet) {
    var sung = false;
    try { sung = !!(ER.music && ER.music() && ER.track && ER.track.sting('solved', null, !!quiet)); } catch (e) {}
    if (!sung && !quiet) ER.sfx.ok();
  };
  /* mark this room as done in the saved game (ER.exit does it; a room that uses ER.exitOk does it here) */
  X.done = function (id) { var st = ER.state(); st.done = st.done || {}; st.done[id] = 1; ER.persist(true); };

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
  /* the small words of the story go into the notebook when they are first needed */
  X.learn = function (list) {
    var G = window.GLOSS || [];
    list.forEach(function (w) {
      for (var i = 0; i < G.length; i++) if (G[i][0].toLowerCase() === w.toLowerCase()) { ER.addWord(G[i][0], G[i][1]); return; }
    });
  };
  X.bump = function (flag) { var n = (ER.flag(flag) || 0) + 1; ER.flag(flag, n); return n; };

  /* The Keeper counts mistakes: one pebble in his jar for each. It is not in the Charter. It is a hobby. */
  X.miss = function () { X.sfx.pebble(); return X.bump('pebbles'); };
  X.pebbles = function () { return ER.flag('pebbles') || 0; };
  X.jar = function () {
    var n = X.pebbles();
    return n ? 'The Keeper&rsquo;s jar. There ' + (n === 1 ? 'is one pebble' : 'are ' + n + ' pebbles') + ' in it: one for each mistake since the gate. He has not said whose.'
      : 'The Keeper&rsquo;s jar. It is for mistakes: one pebble each. So far it is empty, and he keeps looking into it to make sure.';
  };

  /* minutes played, for the last page */
  X.minutes = function () {
    var st = ER.state(), secs = st.fin && st.fin.secs ? st.fin.secs : (st.secs || 0);
    return Math.max(1, Math.round(secs / 60));
  };
  return X;
})();
