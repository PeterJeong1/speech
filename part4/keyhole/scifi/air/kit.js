/* Seven Hours of Air - what every room of the story shares: extra sounds, the air clock,
   things that float, and Keel. Loaded after engine.js. Nothing in here knows an answer. */
window.AIR = (function () {
  'use strict';
  var A = {}, D = document, out = null, nbuf = null, vent = null;

  /* ---------- sound: synthesised, and silent whenever the engine's sound switch is off ---------- */
  function ctx() {
    var c = null;
    try { c = ER.audio(); } catch (e) { return null; }
    if (!c) return null;
    if (!out) {
      try {
        out = c.createGain(); out.gain.value = ER.sound() ? 1 : 0; out.connect(c.destination);
        var n = c.sampleRate * 2, d, i;
        nbuf = c.createBuffer(1, n, c.sampleRate); d = nbuf.getChannelData(0);
        for (i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
        setInterval(function () { try { out.gain.setTargetAtTime(ER.sound() ? 1 : 0, c.currentTime, 0.05); } catch (e) {} }, 300);
      } catch (e) { out = null; return null; }
    }
    return c;
  }
  function tone(o) {
    var c = ctx(); if (!c || !ER.sound()) return;
    try {
      var t = c.currentTime + (o.when || 0), s = c.createOscillator(), a = c.createGain();
      s.type = o.type || 'sine'; s.frequency.setValueAtTime(o.f, t);
      if (o.f2) s.frequency.exponentialRampToValueAtTime(o.f2, t + o.dur);
      a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime(o.peak || 0.2, t + (o.a || 0.006));
      a.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
      s.connect(a); a.connect(out); s.start(t); s.stop(t + o.dur + 0.05);
    } catch (e) {}
  }
  function noise(o) {
    var c = ctx(); if (!c || !ER.sound()) return;
    try {
      var t = c.currentTime + (o.when || 0), s = c.createBufferSource(), f = c.createBiquadFilter(), a = c.createGain();
      s.buffer = nbuf; s.loop = true;
      f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f || 1000, t);
      if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + o.dur);
      f.Q.value = o.q || 1;
      a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime(o.peak || 0.3, t + (o.a || 0.01));
      a.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
      s.connect(f); f.connect(a); a.connect(out); s.start(t, Math.random()); s.stop(t + o.dur + 0.05);
    } catch (e) {}
  }
  A.tone = tone; A.noise = noise;
  A.sfx = {
    alarm: function () { [0, 0.5, 1].forEach(function (w) { tone({ type: 'square', f: 640, dur: 0.22, peak: 0.07, when: w }); tone({ type: 'square', f: 470, dur: 0.22, peak: 0.07, when: w + 0.24 }); }); },
    buzz: function () { tone({ type: 'sawtooth', f: 112, dur: 0.5, peak: 0.16, a: 0.01 }); tone({ type: 'square', f: 56, dur: 0.5, peak: 0.1, a: 0.01 }); },
    hiss: function (dur, v) { noise({ type: 'highpass', f: 3200, dur: dur || 0.6, peak: 0.1 * (v || 1), a: 0.05 }); },
    pump: function () { noise({ type: 'lowpass', f: 700, f2: 180, dur: 0.22, peak: 0.42, a: 0.02 }); tone({ f: 96, f2: 60, dur: 0.18, peak: 0.25 }); },
    beep: function (f) { tone({ f: f || 880, dur: 0.11, peak: 0.1 }); },
    blip: function () { tone({ type: 'triangle', f: 1320, dur: 0.05, peak: 0.07 }); },
    servo: function (dur) { tone({ type: 'sawtooth', f: 90, f2: 260, dur: dur || 1.2, peak: 0.07, a: 0.2 }); noise({ type: 'lowpass', f: 500, dur: dur || 1.2, peak: 0.12, a: 0.2 }); },
    lock: function () { tone({ f: 160, f2: 70, dur: 0.16, peak: 0.4 }); noise({ f: 2400, q: 2, dur: 0.05, peak: 0.25 }); },
    turn: function () { noise({ f: 1500, q: 3, dur: 0.07, peak: 0.2 }); tone({ type: 'triangle', f: 210, f2: 150, dur: 0.07, peak: 0.12 }); },
    flow: function (dur) { noise({ type: 'bandpass', f: 600, f2: 1500, q: 0.8, dur: dur || 1.4, peak: 0.16, a: 0.3 }); },
    bubble: function () { var f = 280 + Math.random() * 260; tone({ f: f, f2: f * 2.6, dur: 0.09, peak: 0.07 }); },
    radio: function () { noise({ type: 'bandpass', f: 2600, q: 0.6, dur: 0.35, peak: 0.1 }); tone({ f: 1180, dur: 0.12, peak: 0.05, when: 0.3 }); },
    ring: function () { tone({ f: 988, dur: 0.16, peak: 0.08 }); tone({ f: 1318, dur: 0.22, peak: 0.08, when: 0.18 }); },
    power: function () { tone({ type: 'sawtooth', f: 60, f2: 240, dur: 1.4, peak: 0.07, a: 0.5 }); tone({ f: 660, dur: 0.9, peak: 0.06, when: 1.1 }); tone({ f: 990, dur: 1.1, peak: 0.05, when: 1.25 }); },
    trip: function () { noise({ f: 1900, q: 1.2, dur: 0.06, peak: 0.5 }); tone({ f: 190, f2: 60, dur: 0.22, peak: 0.4 }); },
    thud: function () { tone({ f: 70, f2: 34, dur: 0.6, peak: 0.6, a: 0.01 }); noise({ type: 'lowpass', f: 240, dur: 0.4, peak: 0.4 }); }
  };
  A.amb = {
    /* the sound of a station breathing: low, steady air */
    vent: function (vol, freq) {
      var c = ctx(); if (!c || vent) return;
      try {
        var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
        s.buffer = nbuf; s.loop = true; f.type = 'lowpass'; f.frequency.value = freq || 380;
        g.gain.value = 0; g.gain.linearRampToValueAtTime(vol || 0.06, c.currentTime + 2.5);
        s.connect(f); f.connect(g); g.connect(out); s.start(); vent = { s: s, g: g };
      } catch (e) {}
    },
    stop: function () {
      if (!vent) return;
      var n = vent, c = ctx(); vent = null;
      try { n.g.gain.linearRampToValueAtTime(0, c.currentTime + 1); setTimeout(function () { try { n.s.stop(); } catch (e) {} }, 1200); } catch (e) {}
    }
  };

  /* ---------- the air clock: seven hours, less the time actually played ---------- */
  var played = 0, clk = null;
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function draw() {
    if (!clk) return;
    if (ER.flag('fixed')) { clk.classList.add('ok'); clk.lastChild.textContent = 'OK'; return; }
    var s = Math.max(0, A.left());
    clk.lastChild.textContent = two(Math.floor(s / 3600)) + ':' + two(Math.floor(s / 60) % 60) + ':' + two(s % 60);
  }
  A.left = function () { return 7 * 3600 + (ER.flag('bonus') || 0) - (ER.flag('lost') || 0) - played; };
  A.minutes = function () { return Math.max(1, Math.round((ER.flag('played') || played) / 60)); };
  A.clock = function () {
    played = ER.flag('played') || 0;
    clk = ER.el('div', 'airclk', '<small>AIR</small><b></b>'); D.body.appendChild(clk);
    draw();
    setInterval(function () {
      if (D.hidden || ER.flag('fixed')) return;
      played++; if (played % 5 === 0) ER.flag('played', played);
      draw();
    }, 1000);
    window.addEventListener('pagehide', function () { ER.flag('played', played); });
  };
  function hit() { if (!clk) return; clk.classList.remove('hit'); void clk.offsetWidth; clk.classList.add('hit'); draw(); }
  A.lose = function (sec) { ER.flag('lost', (ER.flag('lost') || 0) + sec); hit(); };
  A.gain = function (sec) { ER.flag('bonus', (ER.flag('bonus') || 0) + sec); hit(); };
  A.fixed = function () { ER.flag('played', played); ER.flag('fixed', 1); hit(); };

  /* ---------- things that float. o = {x, y, a, box:[x0,y0,x1,y1], tap(e), moved(f), lock()} ---------- */
  var flo = [], raf = 0, last = 0;
  function place(f) { f.n.style.transform = 'translate(' + f.x.toFixed(1) + 'px,' + f.y.toFixed(1) + 'px) rotate(' + f.a.toFixed(1) + 'deg)'; }
  function step(t) {
    var dt = last ? Math.min(40, t - last) : 16, live = false, k = Math.exp(-dt / 900);
    last = t;
    flo.forEach(function (f) {
      if (f.held || Math.abs(f.vx) + Math.abs(f.vy) < 0.006) { if (!f.held) f.vx = f.vy = 0; return; }
      live = true;
      var b = f.o.box || [70, 130, 1530, 790];
      f.x += f.vx * dt; f.y += f.vy * dt; f.a += f.va * dt;
      f.vx *= k; f.vy *= k; f.va *= k;
      if (f.x < b[0]) { f.x = b[0]; f.vx = Math.abs(f.vx) * 0.55; }
      if (f.x > b[2]) { f.x = b[2]; f.vx = -Math.abs(f.vx) * 0.55; }
      if (f.y < b[1]) { f.y = b[1]; f.vy = Math.abs(f.vy) * 0.55; }
      if (f.y > b[3]) { f.y = b[3]; f.vy = -Math.abs(f.vy) * 0.55; }
      place(f);
      if (f.o.moved) f.o.moved(f);
    });
    raf = live ? requestAnimationFrame(step) : 0;
    if (!live) last = 0;
  }
  A.float = function (svg, node, o) {
    var f = { n: node, o: o, x: o.x, y: o.y, a: o.a || 0, vx: 0, vy: 0, va: 0, held: false }, dx = 0, dy = 0, lx = 0, ly = 0, lt = 0;
    ER.drag(node, {
      start: function (e) {
        if (o.lock && o.lock()) return false;
        var p = ER.pt(svg, e); dx = p.x - f.x; dy = p.y - f.y; lx = p.x; ly = p.y; lt = Date.now(); f.held = true; f.vx = f.vy = f.va = 0;
      },
      move: function (e, moved) {
        if (!moved) return;
        var p = ER.pt(svg, e), t = Date.now(), dt = Math.max(8, t - lt), b = o.box || [70, 130, 1530, 790];
        f.vx = 0.5 * f.vx + 0.5 * (p.x - lx) / dt; f.vy = 0.5 * f.vy + 0.5 * (p.y - ly) / dt; lx = p.x; ly = p.y; lt = t;
        f.x = Math.max(b[0], Math.min(b[2], p.x - dx)); f.y = Math.max(b[1], Math.min(b[3], p.y - dy));
        place(f);
        if (o.moved) o.moved(f);
      },
      end: function (e, moved) {
        f.held = false;
        if (!moved) { if (o.tap) o.tap(e, f); return; }
        if (Date.now() - lt > 140) f.vx = f.vy = 0;                /* held still before letting go */
        var sp = Math.sqrt(f.vx * f.vx + f.vy * f.vy), cap = 1.1;
        if (sp > cap) { f.vx *= cap / sp; f.vy *= cap / sp; }
        f.va = f.vx * 0.12;
        if (!raf) { last = 0; raf = requestAnimationFrame(step); }
      }
    });
    place(f); flo.push(f);
    return f;
  };

  /* ---------- Keel, and small helpers ---------- */
  A.keel = function (lines, clue, done, last) {
    var c = window.CAST.keel;
    ER.talk({ who: c.who, role: c.role, face: window.FACE('keel'), lines: lines, clue: clue, done: done, last: last });
  };
  /* a thing in the scene that has a name and something to say */
  A.thing = function (sel, word, line, busy) {
    ER.$$(sel).forEach(function (n) {
      n.addEventListener('click', function (e) {
        if (busy && busy()) return;
        if (word) ER.wordAt(e.clientX, e.clientY, word);
        if (line) ER.say(typeof line === 'function' ? line() : line);
      });
    });
  };
  return A;
})();
