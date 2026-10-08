/* The Library That Locks at Dusk - sounds and small drawing helpers the four rooms share.
   No story text lives here (wordlist.py only reads the room pages). Load after engine.js. */
window.LIB = (function () {
  'use strict';
  var out = null, nbuf = null;

  /* ---- sound: built on the engine's audio context, and silent when the player has switched sound off ---- */
  function ctx() {
    var c = ER.audio();
    if (!c || !ER.sound()) return null;
    if (!out || out.context !== c) {
      out = c.createGain(); out.gain.value = 0.9; out.connect(c.destination);
      setInterval(function () { out.gain.value = ER.sound() ? 0.9 : 0; }, 250);     /* a long bell must stop too when sound is switched off */
    }
    if (!nbuf || nbuf.sampleRate !== c.sampleRate) {
      var n = c.sampleRate * 2, d, i;
      nbuf = c.createBuffer(1, n, c.sampleRate); d = nbuf.getChannelData(0);
      for (i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    }
    return c;
  }
  function env(c, a, o, t) {
    a.gain.setValueAtTime(0.0001, t);
    a.gain.exponentialRampToValueAtTime(o.peak || 0.2, t + (o.a || 0.005));
    a.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  }
  function tone(o) {
    var c = ctx(); if (!c) return;
    var t = c.currentTime + (o.when || 0), s = c.createOscillator(), a = c.createGain();
    s.type = o.type || 'sine'; s.frequency.setValueAtTime(o.f, t);
    if (o.f2) s.frequency.exponentialRampToValueAtTime(o.f2, t + o.dur);
    env(c, a, o, t); s.connect(a); a.connect(out); s.start(t); s.stop(t + o.dur + 0.05);
  }
  function noise(o) {
    var c = ctx(); if (!c) return;
    var t = c.currentTime + (o.when || 0), s = c.createBufferSource(), f = c.createBiquadFilter(), a = c.createGain();
    s.buffer = nbuf; s.loop = true;
    f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f || 1000, t);
    if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + o.dur);
    f.Q.value = o.q || 1;
    env(c, a, o, t); s.connect(f); f.connect(a); a.connect(out); s.start(t, Math.random()); s.stop(t + o.dur + 0.05);
  }
  var snd = {
    /* a big, slow bell, a long way up */
    bigBell: function (v) {
      v = v || 1;
      [1, 2.0, 2.4, 3.01, 4.2, 5.43].forEach(function (m, i) {
        tone({ f: 174.6 * m, dur: 4.2 / Math.pow(i + 1, 0.5), peak: 0.26 * v / (i + 1), a: 0.006 });
      });
      noise({ f: 2600, q: 1, dur: 0.03, peak: 0.16 * v });
    },
    flutter: function () { for (var i = 0; i < 5; i++) noise({ f: 700 + i * 90, q: 1.5, dur: 0.035, peak: 0.07, when: i * 0.05 }); },
    thud: function (v) { v = v || 1; tone({ f: 96, f2: 48, dur: 0.2, peak: 0.42 * v }); noise({ type: 'lowpass', f: 500, dur: 0.07, peak: 0.2 * v }); },
    book: function () { tone({ f: 130, f2: 70, dur: 0.12, peak: 0.24 }); noise({ type: 'highpass', f: 2200, dur: 0.09, peak: 0.06, a: 0.02 }); },
    ratchet: function () { noise({ f: 2600, q: 3, dur: 0.018, peak: 0.2 }); tone({ type: 'triangle', f: 760, dur: 0.05, peak: 0.07 }); },
    whoosh: function () { noise({ f: 300, f2: 1700, q: 0.8, dur: 0.6, peak: 0.2, a: 0.15 }); },
    snuff: function () { noise({ type: 'lowpass', f: 2600, f2: 260, dur: 0.24, peak: 0.16, a: 0.01 }); },
    relight: function () { noise({ type: 'highpass', f: 3000, dur: 0.08, peak: 0.07, a: 0.02 }); tone({ f: 1320, dur: 0.12, peak: 0.035 }); },
    squeak: function () { tone({ f: 1250, f2: 1650, dur: 0.09, peak: 0.03 }); tone({ f: 1500, f2: 1180, dur: 0.1, peak: 0.025, when: 0.1 }); },
    wood: function () { tone({ type: 'triangle', f: 210, f2: 120, dur: 0.07, peak: 0.3 }); tone({ type: 'triangle', f: 180, f2: 100, dur: 0.08, peak: 0.26, when: 0.13 }); },
    rise: function () {
      [261.63, 329.63, 392, 523.25, 659.25].forEach(function (f, i) {
        tone({ type: 'triangle', f: f, dur: 4.6 - i * 0.3, peak: 0.075, a: 1.1 + i * 0.25, when: i * 0.32 });
      });
    },
    cricket: function () { for (var i = 0; i < 3; i++) tone({ f: 4300, dur: 0.035, peak: 0.016, when: i * 0.07 }); },
    owl: function () { tone({ f: 392, f2: 350, dur: 0.34, peak: 0.05, a: 0.06 }); tone({ f: 370, f2: 322, dur: 0.5, peak: 0.05, a: 0.06, when: 0.46 }); },
    wind: function () { noise({ type: 'lowpass', f: 300, f2: 520, dur: 3.2, peak: 0.05, a: 1.4 }); },
    sparkle: function () { [1568, 2093, 2637].forEach(function (f, i) { tone({ f: f, dur: 0.5, peak: 0.035, when: i * 0.09 }); }); }
  };

  /* ---- a small repeatable random number maker, so a generated bookshelf looks the same every time ---- */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* ---- a shelf of book spines. o = {x, y (the board the books stand on), w, h (tallest book), seed, cols[], gap} ---- */
  function books(o) {
    var r = rng(o.seed || 1), x = o.x, s = '', cols = o.cols, w, h, c, lean, band;
    while (x < o.x + o.w - 10) {
      w = 13 + Math.floor(r() * 16); if (x + w > o.x + o.w) break;
      h = o.h * (0.66 + r() * 0.34); c = cols[Math.floor(r() * cols.length)];
      if (r() < 0.07) { x += w * 0.8; continue; }                           /* a gap where somebody took one out */
      lean = r() < 0.06;
      s += '<g' + (lean ? ' transform="rotate(' + (r() < 0.5 ? -7 : 7) + ' ' + (x + w / 2) + ' ' + o.y + ')"' : '') + '>' +
        '<rect x="' + x + '" y="' + (o.y - h).toFixed(1) + '" width="' + w + '" height="' + h.toFixed(1) + '" fill="' + c + '"/>' +
        '<rect x="' + x + '" y="' + (o.y - h).toFixed(1) + '" width="2.2" height="' + h.toFixed(1) + '" fill="#fff" opacity=".09"/>';
      band = r();
      if (band < 0.55) s += '<rect x="' + x + '" y="' + (o.y - h * 0.82).toFixed(1) + '" width="' + w + '" height="2.4" fill="' + (o.gold || '#c9a24a') + '" opacity=".75"/>' +
        '<rect x="' + x + '" y="' + (o.y - h * 0.2).toFixed(1) + '" width="' + w + '" height="2.4" fill="' + (o.gold || '#c9a24a') + '" opacity=".75"/>';
      else if (band < 0.8) s += '<rect x="' + (x + 3) + '" y="' + (o.y - h * 0.7).toFixed(1) + '" width="' + (w - 6) + '" height="' + (h * 0.22).toFixed(1) + '" fill="' + (o.label || '#e3d3a4') + '" opacity=".8"/>';
      s += '</g>';
      x += w + (o.gap == null ? 1.5 : o.gap);
    }
    return s;
  }

  /* ---- the eight brass signs of the Founder's door. Drawn about (0,0), roughly 40 across. ---- */
  var SIGN = {
    snail: '<path d="M-17 12H9Q16 12 16 5V-3M16-3l3.500-6M16-3l-3-6.500"/><circle cx="-3" cy="1.500" r="10.500"/><path d="M-8 2a5 5 0 1 1 5 5"/>',
    fish: '<path d="M-17 0Q-5-12 8 0Q-5 12-17 0Z"/><path d="M8 0L18-8V8Z"/><circle cx="-10" cy="-2" r="1.300"/><path d="M-3-5q4 5 0 10"/>',
    feather: '<path d="M-11 14Q-15-7 11-17Q13 4-11 14Z"/><path d="M-16 19L11-17M-9 5l9-1M-6-2l9-2M-2-8l8-2"/>',
    bell: '<path d="M-12 8Q-11-12 0-13Q11-12 12 8Z"/><path d="M-16 8H16"/><circle cx="0" cy="13" r="2.600"/><circle cx="0" cy="-16" r="2.400"/>',
    crown: '<path d="M-15 9V-9L-7 2L0-13L7 2L15-9V9Z"/><path d="M-15 14H15"/><circle cx="0" cy="-14" r="1.500"/>',
    leaf: '<path d="M0-17Q15-4 0 13Q-15-4 0-17Z"/><path d="M0-11V19M0-3l6-5M0 3l-6-5M0 8l5-4"/>',
    key: '<circle cx="0" cy="-11" r="6.500"/><path d="M0-4.500V17M0 10h7.500M0 16h5.500"/>',
    moon: '<path d="M6-16A16.500 16.500 0 1 0 6 16A20 20 0 0 1 6-16Z"/>'
  };
  var SIGNS = ['snail', 'key', 'bell', 'feather', 'moon', 'fish', 'crown', 'leaf'];
  /* one sign as SVG markup; ink = line colour, k = scale */
  function sign(name, ink, k) {
    return '<g fill="none" stroke="' + (ink || '#3a2a08') + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"' +
      (k ? ' transform="scale(' + k + ')"' : '') + '>' + SIGN[name] + '</g>';
  }
  /* a brass disc with a sign on it, as a whole <svg> (for HTML) */
  function disc(name, px) {
    return '<svg viewBox="-27 -27 54 54" width="' + (px || 54) + '" height="' + (px || 54) + '">' + discG(name) + '</svg>';
  }
  /* the same disc as a group, for use inside a scene */
  function discG(name) {
    return '<circle r="25" fill="#7d5f1d"/><circle r="23" fill="#e3c26a"/><circle r="23" fill="none" stroke="#f7e7ae" stroke-width="1.500" opacity=".8"/>' +
      '<circle r="19.500" fill="none" stroke="#8a6a26" stroke-width="1"/>' + sign(name, '#3a2a08', 0.82);
  }

  return { tone: tone, noise: noise, snd: snd, rng: rng, books: books, SIGNS: SIGNS, sign: sign, disc: disc, discG: discG };
})();
