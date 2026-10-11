/* Answer All Questions - what every room of the story shares: the school clock, a few sounds,
   and small helpers. Loaded after engine.js. Nothing in here knows an answer. */
window.EXAM = (function () {
  'use strict';
  var X = {}, D = document, played = 0, clk = null, walls = [];

  /* ---------- the clock. The story begins at nine and Mr Drummond locks up at half past.
     The minute hand follows the time really played, a wrong try costs a minute, and it never quite reaches the half hour. ---------- */
  function two(n) { return (n < 10 ? '0' : '') + n; }
  X.minute = function () {
    var out = ER.flag('out');
    if (out) return out;
    return Math.min(29, 2 + Math.floor(played / 100) + (ER.flag('lost') || 0));
  };
  X.time = function (m) { return '9.' + two(m == null ? X.minute() : m); };
  X.spare = function () { return 30 - X.minute(); };
  function draw() {
    var m = X.minute();
    if (clk && !clk.getAttribute('data-fixed')) { clk.children[1].textContent = X.time(m); clk.classList.toggle('late', m >= 25); }
    walls.forEach(function (w) {
      w.h.setAttribute('transform', 'rotate(' + (270 + m / 2).toFixed(1) + ' ' + w.cx + ' ' + w.cy + ')');
      w.m.setAttribute('transform', 'rotate(' + (m * 6) + ' ' + w.cx + ' ' + w.cy + ')');
    });
  }
  X.clock = function (fixed) {
    played = ER.flag('played') || 0;
    clk = ER.el('div', 'xclk', '<small>Thursday</small><b></b><i>pm</i>'); D.body.appendChild(clk);
    if (fixed) { clk.setAttribute('data-fixed', '1'); clk.children[0].textContent = fixed[0]; clk.children[1].textContent = fixed[1]; clk.children[2].textContent = fixed[2]; }
    draw();
    setInterval(function () {
      if (D.hidden || ER.flag('out')) return;
      played++; if (played % 5 === 0) ER.flag('played', played);
      draw();
    }, 1000);
    window.addEventListener('pagehide', function () { if (!ER.flag('out')) ER.flag('played', played); });
  };
  X.setClock = function (day, time, ap) {
    if (!clk) return;
    clk.setAttribute('data-fixed', '1'); clk.children[0].textContent = day; clk.children[1].textContent = time; clk.children[2].textContent = ap;
    clk.classList.remove('late'); clk.classList.remove('hit'); void clk.offsetWidth; clk.classList.add('hit');
  };
  /* a clock drawn on a wall of the scene: give it the two hands (lines drawn pointing up) and its centre */
  X.wall = function (hourSel, minSel, cx, cy) {
    var h = D.querySelector(hourSel), m = D.querySelector(minSel);
    if (h && m) { walls.push({ h: h, m: m, cx: cx, cy: cy }); draw(); }
  };
  /* a wrong try costs a minute */
  X.slip = function (n) {
    if (ER.flag('out')) return;
    ER.flag('lost', (ER.flag('lost') || 0) + (n || 1));
    ER.flag('slips', (ER.flag('slips') || 0) + 1);
    if (clk) { clk.classList.remove('hit'); void clk.offsetWidth; clk.classList.add('hit'); }
    draw();
  };
  /* the night is over: the time at which Mr Drummond lets you out (a minute after the last lock) */
  X.freeze = function () { if (ER.flag('out')) return; ER.flag('played', played); ER.flag('out', Math.min(29, X.minute() + 1)); };
  X.minutesPlayed = function () {
    var st = ER.state(), end = ER.flag('tEnd') || Date.now();
    return Math.max(1, Math.round((end - (st.t0 || end)) / 60000));
  };

  /* ---------- sounds (through the engine, so the sound button switches them) ---------- */
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };
  X.sfx = {
    key: function () { B({ dur: 0.05, f: 2600, q: 3, peak: 0.3 }); T({ f: 190, f2: 120, dur: 0.12, peak: 0.3, when: 0.07 }); B({ dur: 0.06, f: 1500, q: 2, peak: 0.34, when: 0.2 }); T({ f: 110, f2: 70, dur: 0.2, peak: 0.4, when: 0.22 }); },
    steps: function (n, v) { for (var i = 0; i < (n || 5); i++) { T({ f: 90, f2: 55, dur: 0.12, peak: 0.28 * (v || 1) * (1 - i * 0.1), when: i * 0.46 }); B({ type: 'lowpass', f: 600, dur: 0.07, peak: 0.16 * (v || 1) * (1 - i * 0.1), when: i * 0.46 }); } },
    stepsNear: function (n) { for (var i = 0; i < (n || 5); i++) { T({ f: 90, f2: 55, dur: 0.12, peak: 0.1 + i * 0.07, when: i * 0.5 }); B({ type: 'lowpass', f: 700, dur: 0.07, peak: 0.06 + i * 0.05, when: i * 0.5 }); } },
    buzz: function () { [0, 0.42].forEach(function (w) { T({ type: 'sawtooth', f: 160, dur: 0.26, peak: 0.07, when: w }); B({ type: 'lowpass', f: 420, dur: 0.26, peak: 0.12, when: w }); }); },
    wheel: function () { B({ dur: 0.03, f: 3400, q: 5, peak: 0.2 }); B({ dur: 0.03, f: 2800, q: 5, peak: 0.2, when: 0.07 }); T({ f: 300, f2: 210, dur: 0.1, peak: 0.16, when: 0.12 }); },
    pen: function () { B({ type: 'highpass', f: 3800, dur: 0.22, peak: 0.07, a: 0.04 }); },
    bolt: function () { B({ dur: 0.12, f: 900, q: 1.5, peak: 0.3, a: 0.02 }); T({ f: 140, f2: 62, dur: 0.24, peak: 0.5, when: 0.1 }); B({ dur: 0.04, f: 2200, q: 2, peak: 0.3, when: 0.1 }); },
    deny: function () { T({ type: 'square', f: 150, dur: 0.16, peak: 0.07 }); T({ type: 'square', f: 112, dur: 0.3, peak: 0.07, when: 0.18 }); },
    beep: function (f) { T({ type: 'square', f: f || 880, dur: 0.07, peak: 0.04 }); },
    copier: function () { B({ type: 'bandpass', f: 520, f2: 900, q: 1.2, dur: 0.5, peak: 0.07, a: 0.1 }); T({ f: 74, dur: 0.5, peak: 0.05, a: 0.1 }); B({ dur: 0.05, f: 1900, q: 2, peak: 0.06, when: 0.62 }); },
    shred: function () { B({ type: 'bandpass', f: 320, q: 2, dur: 0.5, peak: 0.24, a: 0.05 }); T({ type: 'sawtooth', f: 70, f2: 44, dur: 0.5, peak: 0.1 }); },
    tape: function () { B({ type: 'highpass', f: 2200, f2: 5200, dur: 0.16, peak: 0.12, a: 0.02 }); },
    rustle: function () { B({ type: 'highpass', f: 2500, dur: 0.6, peak: 0.12, a: 0.2 }); B({ type: 'highpass', f: 3200, dur: 0.5, peak: 0.1, a: 0.2, when: 0.35 }); },
    whistle: function () { [784, 880, 784, 659, 587].forEach(function (f, i) { T({ f: f, f2: f * 1.01, dur: 0.24, peak: 0.018, a: 0.05, when: i * 0.26 }); }); },
    stamp: function () { T({ f: 110, f2: 50, dur: 0.2, peak: 0.6 }); B({ type: 'lowpass', f: 900, dur: 0.07, peak: 0.4 }); }
  };

  /* A door opens. The music answers in the room's own key, as it does after ER.exit (these rooms leave through
     ER.exitOk and ER.leave, because something is always read between the lock and the door); without music, three plain notes. */
  X.solved = function (quiet) {
    var sung = false;
    try { sung = !!(ER.music && ER.music() && ER.track && ER.track.sting('solved', null, !!quiet)); } catch (e) {}
    if (!sung && !quiet) ER.sfx.ok();
  };
  X.mood = function (m) { try { if (ER.mood) ER.mood(m); } catch (e) {} };

  /* a name tag left over from the last click must not sit on top of whatever is opened next */
  var open0 = ER.open;
  ER.open = function (cls, node, onClose, o) {
    ER.$$('.wtag').forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
    return open0(cls, node, onClose, o);
  };

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
  /* the word a solved answer is listed under in words.js: itself, or one of a pair such as "accept / except" */
  X.entry = function (word) {
    var w = String(word).toLowerCase(), list = window.GLOSS || [], i, parts, best = null, bd = 3, d;
    for (i = 0; i < list.length; i++) {
      if (list[i][4] !== 0) continue;
      parts = list[i][0].toLowerCase().split(' / ');
      if (parts.indexOf(w) >= 0) return { head: list[i][0], other: parts.length > 1 ? parts[parts[0] === w ? 1 : 0] : parts[0], en: list[i][1] };
    }
    for (i = 0; i < list.length; i++) {                 /* a word that is only misspelt: the nearest headword */
      if (list[i][4] !== 0 || list[i][0].indexOf(' ') >= 0) continue;
      d = dist(w, list[i][0].toLowerCase());
      if (d < bd) { bd = d; best = { head: list[i][0], other: list[i][0].toLowerCase(), en: list[i][1] }; }
    }
    return best;
  };
  function dist(a, b) {
    var m = [], i, j;
    for (i = 0; i <= a.length; i++) { m[i] = [i]; }
    for (j = 0; j <= b.length; j++) m[0][j] = j;
    for (i = 1; i <= a.length; i++) for (j = 1; j <= b.length; j++)
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1));
    return m[a.length][b.length];
  }
  return X;
})();
