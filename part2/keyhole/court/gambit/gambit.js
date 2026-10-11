/* Move Sixteen - small helpers that every room of the story shares. Loaded after engine.js.
   Nothing in here knows an answer. */
window.GB = (function () {
  'use strict';
  var X = {}, D = document;
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so the sound button switches them).
     A chess hall is quiet, and its clocks are part of the story: nothing here ticks, and nothing knocks. ---------- */
  X.sfx = {
    pin: function () { B({ dur: 0.025, f: 3400, q: 4, peak: 0.14 }); T({ f: 240, f2: 150, dur: 0.07, peak: 0.1 }); },                  /* a drawing pin into cork */
    card: function () { B({ type: 'highpass', f: 1800, dur: 0.08, peak: 0.12, a: 0.01 }); },                                         /* stiff card on a table */
    pencil: function () { B({ type: 'highpass', f: 3600, dur: 0.22, peak: 0.07, a: 0.04 }); },
    strike: function () { B({ type: 'highpass', f: 2800, f2: 4600, dur: 0.3, peak: 0.08, a: 0.05 }); },                              /* a pencil line drawn through a sentence */
    flag: function () { B({ dur: 0.03, f: 2200, q: 3, peak: 0.12 }); },                                                              /* a paper flag set down */
    mint: function () { B({ dur: 0.03, f: 5200, q: 5, peak: 0.1 }); B({ dur: 0.03, f: 4300, q: 5, peak: 0.08, when: 0.09 }); },      /* a peppermint tin */
    peel: function () { B({ type: 'highpass', f: 1500, f2: 5200, dur: 0.34, peak: 0.1, a: 0.03 }); },                                /* a sticker coming off card */
    buzz: function () { [0, 0.34].forEach(function (w) { T({ type: 'sawtooth', f: 150, dur: 0.2, peak: 0.045, when: w }); B({ type: 'lowpass', f: 400, dur: 0.2, peak: 0.08, when: w }); }); },   /* a telephone on a windowsill */
    hm: function () { T({ type: 'triangle', f: 196, f2: 174, dur: 0.22, peak: 0.07, a: 0.05 }); }                                    /* a small doubtful sound, for a wrong try */
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
  /* the story's own words go into the notebook when they are first needed */
  X.learn = function (list) {
    var G = window.GLOSS || [];
    list.forEach(function (w) {
      for (var i = 0; i < G.length; i++) if (G[i][0].toLowerCase() === w.toLowerCase()) { ER.addWord(G[i][0], G[i][1]); return; }
    });
  };
  X.bump = function (flag) { var n = (ER.flag(flag) || 0) + 1; ER.flag(flag, n); return n; };
  /* a paper from the notebook, shown on top of whatever is open */
  X.look = function (id, missing) {
    var c = ER.state().clues.filter(function (x) { return x.id === id; })[0];
    var d = c ? ER.el('div', 'doc ' + c.c, ER.gloss(c.h)) : ER.el('div', 'doc typed', '<p>' + missing + '</p>');
    ER.sfx.paper(); ER.open('ov-read', d, null, { top: true });
  };
  /* minutes played, for the last page */
  X.minutes = function () {
    var st = ER.state(), secs = st.fin && st.fin.secs ? st.fin.secs : (st.secs || 0);
    return Math.max(1, Math.round(secs / 60));
  };
  /* 37 minutes after two o'clock -> "2.37" */
  X.clock = function (m) { var h = 2 + Math.floor(m / 60), r = m % 60; return h + '.' + (r < 10 ? '0' : '') + r; };
  return X;
})();
