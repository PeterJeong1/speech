/* The Eleventh Hour - small helpers that every room of the story shares. Loaded after engine.js.
   Nothing in here knows an answer. (Byword's sayings are kept here: proofread them with the pages.) */
window.HRS = (function () {
  'use strict';
  var X = {};
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so the sound button switches them) ---------- */
  X.sfx = {
    stroke: function (v) {                                                                         /* the hour bell: low, and a long time dying */
      [1, 2.0, 2.4, 3.01, 4.1].forEach(function (m, i) { T({ f: 196 * m, dur: 2.6 / Math.pow(i + 1, 0.5), peak: (v || 1) * 0.3 / (i + 1) }); });
      B({ dur: 0.03, f: 1400, q: 1, peak: 0.22 });
    },
    ting: function () { [1, 2.01, 2.9].forEach(function (m, i) { T({ f: 784 * m, dur: 1.1 / (i + 1), peak: 0.14 / (i + 1) }); }); },      /* the two quarter bells */
    tang: function () { [1, 2.01, 2.9].forEach(function (m, i) { T({ f: 587 * m, dur: 1.2 / (i + 1), peak: 0.14 / (i + 1) }); }); },
    caw: function () { T({ type: 'sawtooth', f: 1500, f2: 980, dur: 0.11, peak: 0.05, a: 0.01 }); T({ type: 'square', f: 760, f2: 520, dur: 0.1, peak: 0.02, a: 0.01 }); },      /* a jackdaw says "tchack" */
    lever: function () { B({ dur: 0.05, f: 1500, q: 2, peak: 0.25 }); T({ f: 150, f2: 70, dur: 0.22, peak: 0.4, when: 0.03 }); },
    ratchet: function () { for (var i = 0; i < 5; i++) B({ dur: 0.025, f: 2600, q: 4, peak: 0.16, when: i * 0.11 }); },
    rattle: function () { for (var i = 0; i < 9; i++) B({ dur: 0.03, f: 1900 + i * 90, q: 3, peak: 0.14, when: i * 0.07 }); },         /* a line running down over a pulley */
    plate: function () { T({ f: 1250, dur: 0.5, peak: 0.07 }); T({ f: 1890, dur: 0.3, peak: 0.04 }); B({ dur: 0.02, f: 3000, q: 2, peak: 0.14 }); },      /* enamelled iron on an iron hook */
    drop: function () { B({ dur: 0.06, f: 900, q: 1, peak: 0.3 }); T({ f: 300, f2: 120, dur: 0.25, peak: 0.25 }); },
    pin: function () { T({ f: 3100, dur: 0.25, peak: 0.08 }); T({ f: 4650, dur: 0.15, peak: 0.04, when: 0.02 }); },                      /* the pin falls out of the candle into its dish */
    pour: function () { B({ type: 'bandpass', f: 1200, f2: 2400, q: 1.5, dur: 0.5, peak: 0.1, a: 0.08 }); },
    stir: function () { B({ type: 'bandpass', f: 700, f2: 1100, q: 3, dur: 0.3, peak: 0.1, a: 0.06 }); },
    hiss: function () { B({ type: 'highpass', f: 3200, dur: 0.7, peak: 0.12, a: 0.03 }); },
    flint: function () { B({ dur: 0.03, f: 6000, q: 3, peak: 0.14 }); B({ type: 'lowpass', f: 500, f2: 900, dur: 0.4, peak: 0.1, a: 0.12, when: 0.12 }); },
    hm: function () { T({ type: 'triangle', f: 130, f2: 104, dur: 0.3, peak: 0.12, a: 0.06 }); },
    door: function () { ER.sfx.clunk(); setTimeout(ER.sfx.creak, 380); }
  };

  /* A door opens. The music answers in the room's own key; without music, three plain notes. */
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
  X.mine = function (id, title, html, quiet) { return ER.addClue(id, title, '<h4>' + title + '</h4>' + html, 'mine', 'Your notes', quiet); };
  X.learn = function (list) {
    var G = window.GLOSS || [];
    list.forEach(function (w) {
      for (var i = 0; i < G.length; i++) if (G[i][0].toLowerCase() === w.toLowerCase()) { ER.addWord(G[i][0], G[i][1]); return; }
    });
  };
  X.bump = function (flag) { var n = (ER.flag(flag) || 0) + 1; ER.flag(flag, n); return n; };

  /* Byword counts slips: of the tongue and of the hand. He says nothing about them. He only counts. */
  X.slip = function () { X.sfx.caw(); return X.bump('slips'); };
  X.slips = function () { return ER.flag('slips') || 0; };

  /* ---------- Byword: a jackdaw who knows a hundred sayings, and not one of them is an order ---------- */
  var SAID = {
    fly: ['Time flies.', 'when you asked him what had happened to the clock'],
    deaf: ['There&rsquo;s none so deaf as those who will not hear.', 'when you asked him whether the Warden would let you in'],
    will: ['Where there&rsquo;s a will, there&rsquo;s a way.', 'when you asked him how to get in'],
    hands: ['Many hands make light work.', 'when you asked him who winds the clock'],
    cooks: ['Too many cooks spoil the broth.', 'in the same breath, in a cross old voice'],
    feast: ['Enough is as good as a feast.', 'when you asked him how far to wind'],
    haste: ['More haste, less speed.', 'when you asked him how fast to wind'],
    steady: ['Slow and steady wins the race.', 'when you asked him about the pendulum'],
    sides: ['There are two sides to every question.', 'behind the great dial, about the hours as they look from inside'],
    glitter: ['All that glitters is not gold.', 'when you picked up the hour that reads XI'],
    stitch: ['A stitch in time saves nine.', 'when the ninth hour was back on its hook'],
    pot: ['A watched pot never boils.', 'while you were waiting for the candle'],
    early: ['The early bird catches the worm.', 'when the grease went in before the pan had settled'],
    late: ['Better late than never.', 'at midnight, when everything had been said']
  };
  X.said = function (id) { return SAID[id] ? SAID[id][0] : ''; };
  /* file a saying in the notebook: one paper, which grows */
  X.byword = function (id, quiet) {
    if (!SAID[id]) return;
    var list = ER.flag('bw') || [], st = ER.state(), i, html, isNew = list.indexOf(id) < 0;
    if (isNew) { list.push(id); ER.flag('bw', list); }
    html = '<h4>What Byword has said</h4>' + list.map(function (k) { return '<p><b>&ldquo;' + SAID[k][0] + '&rdquo;</b><span>He said it ' + SAID[k][1] + '.</span></p>'; }).join('');
    for (i = 0; i < st.clues.length; i++) if (st.clues[i].id === 'byword') { st.clues[i].h = html; ER.persist(true); if (isNew && !quiet) ER.toast('In your notebook: another of Byword&rsquo;s sayings'); return; }
    ER.addClue('byword', 'What Byword has said', html, 'bird', 'A jackdaw', quiet);
  };

  /* minutes played, for the last page */
  X.minutes = function () {
    var st = ER.state(), secs = st.fin && st.fin.secs ? st.fin.secs : (st.secs || 0);
    return Math.max(1, Math.round(secs / 60));
  };
  return X;
})();
