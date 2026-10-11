/* Wrong Number - what every room of the story shares: a few sounds, the clock in Mercer Row,
   and the messages with letters missing. Loaded after engine.js and wordkit.js.
   Nothing in here knows an answer: a mended message is filed from what the player typed. */
window.WN = (function () {
  'use strict';
  var W = {}, D = document, clk = null;

  /* ---------- sounds (all through the engine, so the sound button switches them) ---------- */
  W.sfx = {
    ring: function () {
      [0, 0.52].forEach(function (w) {
        ER.tone({ type: 'triangle', f: 400, dur: 0.4, peak: 0.09, when: w });
        ER.tone({ type: 'triangle', f: 450, dur: 0.4, peak: 0.09, when: w });
        ER.tone({ type: 'square', f: 25, dur: 0.4, peak: 0.03, when: w });
      });
    },
    coin: function () {
      ER.burst({ dur: 0.03, f: 5400, q: 8, peak: 0.3 }); ER.tone({ f: 2500, f2: 1900, dur: 0.1, peak: 0.1 });
      ER.tone({ f: 170, f2: 90, dur: 0.14, peak: 0.34, when: 0.2 }); ER.burst({ dur: 0.04, f: 1500, q: 1, peak: 0.2, when: 0.2 });
    },
    clatter: function (n) {
      for (var i = 0; i < (n || 9); i++) ER.burst({ dur: 0.028, f: 2300 + (i % 3) * 500, q: 3, peak: 0.16, when: i * 0.075 });
    },
    blip: function () { ER.tone({ type: 'square', f: 1250, dur: 0.035, peak: 0.03 }); },
    dead: function () { ER.tone({ type: 'triangle', f: 420, f2: 110, dur: 0.7, peak: 0.14 }); },
    lamp: function (f) { ER.tone({ f: f || 880, dur: 0.1, peak: 0.08 }); ER.burst({ dur: 0.02, f: 3000, q: 2, peak: 0.1 }); },
    bolt: function () { ER.tone({ f: 110, f2: 52, dur: 0.5, peak: 0.5 }); ER.burst({ dur: 0.09, f: 1300, q: 1, peak: 0.3 }); ER.burst({ type: 'lowpass', f: 300, dur: 0.5, peak: 0.3, when: 0.05 }); },
    chime: function (n) {                              /* several clocks, not quite together: notes of D major, the key of the last music */
      var notes = [587.33, 880, 739.99, 659.25], i;
      for (i = 0; i < (n || 5); i++) {
        ER.tone({ f: notes[i % 4], dur: 1.6, peak: 0.1, when: i * 0.42 });
        ER.tone({ f: notes[i % 4] * 2.01, dur: 1.1, peak: 0.04, when: i * 0.42 });
      }
    }
  };

  /* A door opens. The engine's own ER.exit leaves the room after a fixed wait; these rooms tell a little more of the story
     first, so they sound the room's "solved" phrase themselves (a gentler one with soft), exactly as ER.exit would. */
  W.solved = function (soft) {
    var sung = ER.music && ER.music() && ER.track && ER.track.sting('solved', null, !!soft);
    if (!sung && !soft) ER.sfx.ok();
  };
  /* A small thing is finished and a clue is filed with it: the music has its own two notes for that, so stay out of their way. */
  W.done = function () {
    if (!(ER.music && ER.music() && ER.track && ER.track.info().on)) ER.sfx.ok();
  };
  /* What each room sounds like (the theme's scape, "wire", with a voice left out where the story makes that kind of sound itself):
       phonebox  slower, and no tune: there is a great deal to read, and a telephone is ringing
       shop      a new key, and no pulse: the room is full of clocks, and the music must not tick; tense once the lamps are green
       midnight  only the long notes, low, while you wait in the dark; when the strongroom opens, "morning", in a major key,
                 without its small bright notes, because the clocks are about to strike */
  W.SOUND = {
    phonebox: ['wire', { bpm: 84, drop: ['mel'] }],
    shop: ['wire', { root: 43, bpm: 88, drop: ['ost'] }],
    midnight: ['wire', { root: 38, bpm: 76, mood: 'tense', drop: ['mel', 'ost'] }],
    open: ['morning', { root: 50, bpm: 66, drop: ['mel'] }]
  };

  /* ---------- the time in Mercer Row: it moves when the story moves, never by itself ---------- */
  W.clock = function (start) {
    clk = ER.el('div', 'wn-clk', '<small>Mercer Row</small><b></b>'); D.body.appendChild(clk);
    clk.lastChild.textContent = ER.flag('time') || start;
    if (!ER.flag('time')) ER.flag('time', start);
  };
  W.now = function () { return ER.flag('time'); };
  W.time = function (t) {
    if (ER.flag('time') === t) return;
    ER.flag('time', t);
    if (!clk) return;
    clk.lastChild.textContent = t;
    clk.classList.remove('hit'); void clk.offsetWidth; clk.classList.add('hit');
  };

  /* a thing in the scene that has a name and something to say */
  W.thing = function (sel, word, line, busy) {
    ER.$$(sel).forEach(function (n) {
      n.addEventListener('click', function (e) {
        if (busy && busy()) return;
        if (word) ER.wordAt(e.clientX, e.clientY, word);
        if (line) ER.say(typeof line === 'function' ? line() : line);
      });
    });
  };

  /* the strip under a close-up where the story goes on: text, and a button when there is somewhere to go */
  W.cap = function (box) {
    var bar = ER.el('div', 'wn-cap', '<p></p><button type="button" class="btn"></button>'), p = bar.firstChild, b = bar.lastChild, fn = null;
    box.appendChild(bar);
    b.addEventListener('click', function () { var f = fn; fn = null; b.classList.remove('on'); if (f) f(); });
    return {
      el: bar,
      say: function (html) { p.innerHTML = ER.gloss(html); },
      go: function (label, f) { b.textContent = label; fn = f; b.classList.add('on'); },
      stop: function () { fn = null; b.classList.remove('on'); }
    };
  };

  /* ---------- messages with letters missing ---------- */
  /* In a message, {key:S_RONGROOM} is a word with letters missing ('_' for each one). */
  W.tpl = function (s) {
    return s.replace(/\{(\w+):([A-Za-z_]+)\}/g, '<span class="wk-gap" data-key="$1" data-show="$2"></span>');
  };
  /* Put a message into host and let the player mend it.
     o = { had: {key: 1} (words mended before the close-up was shut: they are shown mended),
           board: bool, boardIn: node, onWord(key, word, node), onMiss(key, node, misses), onDone() } */
  W.mend = function (host, html, o) {
    var had = o.had || {}, quiet = true, g;
    host.innerHTML = ER.gloss(W.tpl(html));
    g = WK.gaps(host, { board: !!o.board, boardIn: o.boardIn,
      onWord: function (key, word, node) {
        if (had[key]) return;
        had[key] = 1; WK.learn(word, true);
        node.classList.add('wn-new'); setTimeout(function () { node.classList.remove('wn-new'); }, 900);
        if (o.onWord) o.onWord(key, word, node);
      },
      onMiss: function (key, node, n) { if (o.onMiss) o.onMiss(key, node, n); },
      onDone: function () { if (!quiet && o.onDone) o.onDone(); } });
    Object.keys(had).forEach(function (k) { g.fill(k); });
    quiet = false;
    return g;
  };
  /* File a mended message in the notebook, with the letters the player put in marked as handwriting. */
  function esc(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function walk(n) {
    var out = '';
    Array.prototype.forEach.call(n.childNodes, function (c) {
      if (c.nodeType === 3) { out += esc(c.nodeValue); return; }
      if (c.nodeType !== 1) return;
      if (c.classList.contains('wk-gap')) {
        out += '<!--nogloss--><span class="wn-word">';
        Array.prototype.forEach.call(c.querySelectorAll('.wk-cell'), function (cell) {
          out += cell.classList.contains('blank') ? '<i>' + esc(cell.textContent) + '</i>' : esc(cell.textContent);
        });
        out += '</span><!--/nogloss-->';
      } else if (c.tagName === 'BR') out += '<br>';
      else if (c.tagName === 'P') out += '<p>' + walk(c) + '</p>';
      else out += walk(c);
    });
    return out;
  }
  W.file = function (host, id, title) {
    return ER.addClue(id, title, '<h4>' + title + '</h4>' + walk(host), 'wn-msg', 'Message, mended');
  };
  /* every mended message so far, one under another */
  W.roll = function (ids) {
    var cl = ER.state().clues, out = '';
    ids.forEach(function (id) { cl.forEach(function (c) { if (c.id === id) out += '<div class="wn-m">' + c.h + '</div>'; }); });
    return out;
  };
  return W;
})();
