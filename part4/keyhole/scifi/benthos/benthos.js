/* Word for Word - small helpers that every room of the story shares. Loaded after engine.js.
   Nothing in here knows an answer, and nothing in here is read by the player: the story's words are in the pages. */
window.BEN = (function () {
  'use strict';
  var X = {}, D = document;
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };
  function el(t, cls, html) { var e = D.createElement(t); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---------- sounds (through the engine, so the sound button switches them) ---------- */
  X.sfx = {
    /* the laboratory's own sonar: one long note, and (if a delay is given) its answer coming back */
    ping: function (echo) {
      T({ f: 1180, f2: 1150, dur: 1.5, peak: 0.13, a: 0.008 }); T({ f: 2360, dur: 0.5, peak: 0.02 });
      if (echo) T({ f: 1180, f2: 1160, dur: 0.9, peak: 0.05, a: 0.01, when: echo });
    },
    /* a machine answering through the water: short, higher, n of them */
    reply: function (n, gap) { for (var i = 0; i < n; i++) T({ f: 1560, dur: 0.34, peak: 0.1, a: 0.006, when: i * (gap || 0.42) }); },
    send: function () { [0, 0.07, 0.14].forEach(function (w, i) { T({ type: 'triangle', f: 700 + i * 180, dur: 0.06, peak: 0.07, when: w }); }); },      /* an order going out */
    beep: function () { T({ type: 'triangle', f: 880, dur: 0.09, peak: 0.08 }); },
    key: function () { B({ dur: 0.025, f: 2600, q: 3, peak: 0.16 }); },
    wheel: function () { B({ dur: 0.03, f: 1500, q: 4, peak: 0.2 }); T({ f: 300, dur: 0.04, peak: 0.07 }); },                                           /* a thumbwheel, one click round */
    servo: function (d) { T({ type: 'sawtooth', f: 120, f2: 210, dur: d || 0.5, peak: 0.045, a: 0.08 }); B({ type: 'lowpass', f: 600, dur: d || 0.5, peak: 0.07, a: 0.1 }); },
    splash: function () { B({ type: 'bandpass', f: 900, f2: 2400, q: 0.7, dur: 0.5, peak: 0.16, a: 0.04 }); },
    valve: function () { B({ dur: 0.07, f: 1300, q: 3, peak: 0.22 }); T({ type: 'triangle', f: 190, f2: 140, dur: 0.1, peak: 0.14 }); },
    flow: function (d) { B({ type: 'bandpass', f: 500, f2: 1300, q: 0.8, dur: d || 1.6, peak: 0.13, a: 0.3 }); },
    pump: function (d) { T({ type: 'sawtooth', f: 62, f2: 96, dur: d || 1.6, peak: 0.1, a: 0.3 }); T({ type: 'square', f: 124, f2: 190, dur: d || 1.6, peak: 0.03, a: 0.3 }); },
    trip: function () { B({ f: 1900, q: 1.2, dur: 0.06, peak: 0.5 }); T({ f: 190, f2: 60, dur: 0.25, peak: 0.4 }); },                                     /* a breaker going out */
    blow: function (d) { B({ type: 'highpass', f: 2600, dur: d || 1.2, peak: 0.1, a: 0.08 }); B({ type: 'lowpass', f: 420, dur: d || 1.2, peak: 0.1, a: 0.1 }); },      /* air into a tank */
    bang: function () { B({ f: 500, q: 0.6, dur: 0.3, peak: 0.7 }); T({ f: 90, f2: 40, dur: 0.4, peak: 0.5 }); },
    bubble: function () { var f = 300 + Math.random() * 260; T({ f: f, f2: f * 2.4, dur: 0.09, peak: 0.06 }); },
    winch: function (d) { T({ type: 'sawtooth', f: 48, f2: 60, dur: d || 2.4, peak: 0.12, a: 0.4 }); B({ type: 'bandpass', f: 320, q: 2, dur: d || 2.4, peak: 0.1, a: 0.4 }); },
    door: function () { T({ f: 110, f2: 52, dur: 0.5, peak: 0.5 }); B({ type: 'lowpass', f: 300, dur: 0.45, peak: 0.35, a: 0.02 }); },
    clip: function () { B({ dur: 0.04, f: 3200, q: 3, peak: 0.25 }); T({ f: 520, f2: 380, dur: 0.07, peak: 0.12, when: 0.03 }); },
    line: function () { B({ type: 'bandpass', f: 2400, q: 0.8, dur: 0.05, peak: 0.05 }); },                                                              /* one line of a picture arriving */
    hm: function () { T({ type: 'triangle', f: 130, f2: 104, dur: 0.28, peak: 0.12, a: 0.05 }); }
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
  X.mine = function (id, title, html, quiet) { return ER.addClue(id, title, '<h4>' + title + '</h4>' + html, 'mine', 'Your slate', quiet); };
  /* the story's own words go into the notebook when they are first needed */
  X.learn = function (list) {
    var G = window.GLOSS || [];
    list.forEach(function (w) {
      for (var i = 0; i < G.length; i++) if (G[i][0].toLowerCase() === w.toLowerCase()) { ER.addWord(G[i][0], G[i][1]); return; }
    });
  };
  X.bump = function (flag) { var n = (ER.flag(flag) || 0) + 1; ER.flag(flag, n); return n; };
  /* minutes played, for the last page */
  X.minutes = function () {
    var st = ER.state(), secs = st.fin && st.fin.secs ? st.fin.secs : (st.secs || 0);
    return Math.max(1, Math.round(secs / 60));
  };

  /* One thing after another, each after its own wait: [[ms, fn], ...]. setTimeout, not animation frames: a hidden tab
     must not stop a machine half way through an order. Returns a function that stops the run. */
  X.seq = function (steps, done) {
    var i = 0, t = 0, dead = false;
    function next() {
      if (dead) return;
      if (i >= steps.length) { if (done) done(); return; }
      var s = steps[i++];
      t = setTimeout(function () { if (dead) return; if (s[1]) s[1](); next(); }, s[0]);
    }
    next();
    return function () { dead = true; clearTimeout(t); };
  };

  /* ---------- the read-out ---------- */
  X.readout = function (host) {
    var box = el('div', 'rl'); host.appendChild(box);
    return {
      el: box,
      line: function (text, cls) { var p = el('p', cls || '', text); box.appendChild(p); box.scrollTop = box.scrollHeight; return p; },
      clear: function () { box.innerHTML = ''; }
    };
  };

  /* ---------- pings: n rings that light one after another, a label, and the sound of them ---------- */
  X.pings = function (host, n, bad, label) {
    var s = '', i;
    for (i = 0; i < n; i++) s += '<i' + (bad ? ' class="bad"' : '') + '></i>';
    host.innerHTML = '<span class="pg">' + s + '<b' + (bad ? ' class="bad"' : '') + '></b></span>';
    host.querySelector('b').textContent = label || '';
    host.setAttribute('data-pings', n);
    ER.$$('i', host).forEach(function (r, k) { setTimeout(function () { r.classList.add('on'); }, k * 420); });
    X.sfx.reply(n);
  };

  /* ---------- the order builder ----------
     o = { tiles: [{id, t}] in the order to show, slots: n, send: 'label', note: 'small print', all: true (every slot must be filled),
           onSend(ids), onShort() (Send pressed with a slot still empty) }
     Drag a strip into a slot, or click the strip and then the slot. Returns {el, ids(), clear(), busy(bool), now(n)}. */
  X.builder = function (host, o) {
    var box = el('div', 'ob'), slots = el('div', 'ob-slots'), tray = el('div', 'ob-tray'), foot = el('div', 'ob-foot'), busy = false, i, s;
    for (i = 1; i <= o.slots; i++) { s = el('div', 'ob-slot', '<i>' + i + '</i>'); s.setAttribute('data-n', i); slots.appendChild(s); }
    o.tiles.forEach(function (t) { var b = el('span', 'ob-tile dnd-item'); b.setAttribute('data-id', t.id); b.textContent = t.t; tray.appendChild(b); });
    foot.innerHTML = '<span></span><button type="button" class="btn ob-clear">Clear</button><button type="button" class="btn ob-send"></button>';
    foot.querySelector('span').textContent = o.note || '';
    foot.querySelector('.ob-send').textContent = o.send || 'Send';
    box.appendChild(slots); box.appendChild(tray); box.appendChild(foot); host.appendChild(box);
    function paint() { ER.$$('.ob-slot', box).forEach(function (n) { n.classList.toggle('full', !!n.querySelector('.ob-tile')); }); }
    function ids() { return ER.$$('.ob-slot', box).map(function (n) { var t = n.querySelector('.ob-tile'); return t ? t.getAttribute('data-id') : null; }).filter(Boolean); }
    function clear() { ER.$$('.ob-slot .ob-tile', box).forEach(function (t) { tray.appendChild(t); }); now(0); paint(); }
    function now(n) { ER.$$('.ob-slot', box).forEach(function (sl) { sl.classList.toggle('now', +sl.getAttribute('data-n') === n); }); }
    ER.dnd(box, { item: '.ob-tile', slot: '.ob-slot', home: tray, change: paint, lock: function () { return busy; } });
    foot.querySelector('.ob-clear').addEventListener('click', function () { if (!busy) { clear(); ER.sfx.click(); } });
    foot.querySelector('.ob-send').addEventListener('click', function () {
      if (busy) return;
      var list = ids();
      if (!list.length || (o.all !== false && list.length < o.slots)) { ER.shake(slots); if (o.onShort) o.onShort(list.length); return; }
      X.sfx.send(); o.onSend(list);
    });
    return { el: box, ids: ids, clear: clear, now: now, busy: function (b) { busy = !!b; box.classList.toggle('busy', busy); } };
  };
  return X;
})();
