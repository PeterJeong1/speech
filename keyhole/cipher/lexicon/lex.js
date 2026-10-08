/* The Final Word - what every room of the story shares: the countdown to eight o'clock, the studio's own
   sounds, buzzers and "because" cards, and a few small helpers. Loaded after engine.js.
   Nothing in here knows an answer. */
window.LEX = (function () {
  'use strict';
  var L = {}, D = document;

  /* ---------- sound: built from the engine's two blocks, so the sound button switches it ---------- */
  function tone(o) { try { ER.tone(o); } catch (e) {} }
  function burst(o) { try { ER.burst(o); } catch (e) {} }
  L.sfx = {
    buzz: function () { tone({ type: 'sawtooth', f: 118, dur: 0.5, peak: 0.15, a: 0.01 }); tone({ type: 'square', f: 59, dur: 0.5, peak: 0.09, a: 0.01 }); },
    ding: function () { tone({ type: 'triangle', f: 1318.5, dur: 0.5, peak: 0.13 }); tone({ type: 'triangle', f: 1760, dur: 0.7, peak: 0.1, when: 0.09 }); },
    press: function () { tone({ f: 190, f2: 90, dur: 0.14, peak: 0.4 }); burst({ f: 2200, q: 2, dur: 0.04, peak: 0.22 }); },
    flip: function () { burst({ f: 2600, q: 3, dur: 0.05, peak: 0.2 }); tone({ type: 'triangle', f: 420, f2: 300, dur: 0.06, peak: 0.1 }); },
    tick: function () { burst({ dur: 0.025, f: 4200, q: 8, peak: 0.1 }); },
    sting: function () {
      [392, 523.25, 659.25, 783.99].forEach(function (f, i) {
        tone({ type: 'sawtooth', f: f, dur: 0.34, peak: 0.06, when: i * 0.11 }); tone({ type: 'triangle', f: f * 2, dur: 0.34, peak: 0.05, when: i * 0.11 });
      });
    },
    timeup: function () {
      [0, 0.16, 0.32].forEach(function (w) { tone({ type: 'square', f: 300, dur: 0.12, peak: 0.07, when: w }); });
      tone({ type: 'square', f: 200, dur: 0.5, peak: 0.08, when: 0.5 });
    },
    door: function () { ER.sfx.clunk(); tone({ type: 'sawtooth', f: 80, f2: 150, dur: 0.9, peak: 0.05, a: 0.2, when: 0.15 }); },
    clap: function (dur) {
      burst({ type: 'bandpass', f: 1700, q: 0.5, dur: dur || 2.6, peak: 0.16, a: 0.25 });
      burst({ type: 'highpass', f: 3000, dur: dur || 2.6, peak: 0.06, a: 0.3 });
    }
  };

  /* ---------- the clock: so many minutes to eight o'clock ----------
     Each room owns a stretch of the half hour. Inside it the clock runs at the speed of a real one for
     `lin` seconds and then slows down, so that eight o'clock never comes while somebody is still thinking.
     A wrong answer costs seconds (LEX.lose). The time really played is kept apart, for the last page. */
  var cfg = null, secs = 0, total = 0, node = null, fns = [];
  function two(n) { return (n < 10 ? '0' : '') + n; }
  L.storyTime = function () {                      /* seconds after seven o'clock */
    if (!cfg || cfg.live) return 3600;
    var lin = cfg.lin, r = cfg.range;
    return cfg.start + (secs <= lin ? secs : lin + (r - lin) * (1 - Math.exp(-(secs - lin) / 400)));
  };
  L.hhmm = function () { var t = Math.floor(L.storyTime() / 60); return (7 + Math.floor(t / 60)) + '.' + two(t % 60); };
  function draw() {
    if (!node) return;
    if (cfg.live) { node.lastChild.textContent = 'ON AIR'; return; }
    var left = Math.max(0, Math.round(3600 - L.storyTime()));
    node.lastChild.textContent = two(Math.floor(left / 60)) + ':' + two(left % 60);
    fns.forEach(function (f) { f(); });
  }
  function keep() { if (!cfg || cfg.live) return; ER.flag('pl', total); ER.flag('rs.' + ER.cfg.id, secs); }
  L.clock = function (o) {
    cfg = o; total = ER.flag('pl') || 0; secs = o.live ? 0 : (ER.flag('rs.' + ER.cfg.id) || 0);
    node = ER.el('div', 'lexclk' + (o.live ? ' live' : ''), '<i></i><small>' + (o.live ? 'LEXICON' : 'ON AIR IN') + '</small><b></b>');
    D.body.appendChild(node); draw();
    if (o.live) return;
    setInterval(function () {
      if (D.hidden || L.stopped) return;
      if (D.querySelector('.tc:not(.off)')) return;         /* the title card is still up: the clock waits */
      secs++; total++; if (total % 5 === 0) keep();
      draw();
    }, 1000);
    window.addEventListener('pagehide', keep);
  };
  L.onTick = function (f) { fns.push(f); f(); };
  L.lose = function (s) {
    secs += s; keep(); draw();
    if (node) { node.classList.remove('hit'); void node.offsetWidth; node.classList.add('hit'); }
  };
  L.stop = function () { L.stopped = true; keep(); };
  L.minutes = function () { return Math.max(1, Math.round((ER.flag('pl') || total) / 60)); };

  /* ---------- LEX can say twelve things. Dexter Valentine recorded all of them in one afternoon ---------- */
  var nNo = 0, nYes = 0, NO = ['Ooh, unlucky!', 'Not this time, my friend!', 'So close!'], YES = ['Lovely!', 'Correct!', 'Oh, very good!'];
  L.no = function () { return '&ldquo;' + NO[nNo++ % NO.length] + '&rdquo;'; };
  L.yes = function () { return '&ldquo;' + YES[nYes++ % YES.length] + '&rdquo;'; };

  /* ---------- buzzers, and the cards that ask why ---------- */
  /* items: [{id, label}]; onPress(id, button). Add the class "lock" to the row to switch them off. */
  L.buzzers = function (root, items, onPress) {
    var row = ER.el('div', 'lx-buzzers');
    items.forEach(function (it, i) {
      var b = ER.el('button', 'lx-buzz lx-c' + (i % 4), '<span class="lx-dome"></span><span class="lx-plate"></span>');
      b.type = 'button'; b.setAttribute('data-id', it.id); b.lastChild.textContent = it.label;
      b.addEventListener('click', function () { if (row.classList.contains('lock')) return; L.sfx.press(); onPress(it.id, b); });
      row.appendChild(b);
    });
    root.appendChild(row);
    return row;
  };
  /* opts: [[id, text], ...]; onPick(id, card) */
  L.because = function (root, opts, onPick) {
    var box = ER.el('div', 'lx-why', '<h5>And why?</h5>');
    opts.forEach(function (o) {
      var b = ER.el('button', 'lx-card'); b.type = 'button'; b.setAttribute('data-id', o[0]); b.textContent = o[1];
      b.addEventListener('click', function () { if (!box.classList.contains('lock')) onPick(o[0], b); });
      box.appendChild(b);
    });
    root.appendChild(box);
    return box;
  };

  /* ---------- small helpers ---------- */
  L.shuffle = function (a) {
    a = a.slice();
    for (var i = a.length - 1, j, t; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  };
  /* a thing in the scene that has a name and something to say */
  L.thing = function (sel, word, line, busy) {
    ER.$$(sel).forEach(function (n) {
      n.addEventListener('click', function (e) {
        if (busy && busy()) return;
        if (word) ER.wordAt(e.clientX, e.clientY, word);
        if (line) ER.say(typeof line === 'function' ? line() : line);
      });
    });
  };
  L.talk = function (k, lines, clue, done, last) {
    var c = window.CAST[k];
    ER.talk({ who: c.who, role: c.role, face: window.FACE(k), lines: lines, clue: clue, done: done, last: last });
  };
  /* the way on, once a room is finished */
  L.go = function (label, fn) {
    var b = D.getElementById('go');
    if (!b) {
      b = ER.el('button', 'lx-go'); b.type = 'button'; b.id = 'go'; D.body.appendChild(b);
      b.addEventListener('click', function () { if (b._fn) b._fn(); });
    }
    b.textContent = label; b._fn = fn; b.classList.add('on'); D.body.classList.add('lx-has-go'); ER.hush();
  };
  /* What was typed into a wk-gap, kept at the moment the kit marks it wrong (the kit then wipes it),
     so that the room can say the wrong word back. Returns {get(key), stop()}. */
  L.badWords = function (root) {
    var last = {}, mo = new MutationObserver(function (list) {
      list.forEach(function (m) {
        var n = m.target;
        if (!n.classList || !n.classList.contains('wk-gap') || !n.classList.contains('bad')) return;
        last[n.getAttribute('data-key')] = ER.$$('.wk-part', n).map(function (p) { return p.textContent; }).join(' ');
      });
    });
    mo.observe(root, { attributes: true, attributeFilter: ['class'], subtree: true });
    return { get: function (k) { return last[k] || ''; }, stop: function () { mo.disconnect(); } };
  };
  /* a word the player has just made goes into the notebook, if the dictionary has it (spaces do not matter) */
  L.learn = function (w, quiet) {
    var g = (window.GLOSS || []).filter(function (x) { return WK.norm(x[0]) === WK.norm(w); })[0];
    return g ? WK.learn(g[0], quiet) : false;
  };
  return L;
})();
