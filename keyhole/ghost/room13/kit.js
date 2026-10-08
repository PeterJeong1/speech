/* "Room 13 Is Not on the Plan": what the four pages share. The drawing of the second floor,
   and a few sounds the engine does not have. No story text and no answers live here: a page
   passes in whatever labels it wants shown. */
window.R13 = (function () {
  'use strict';

  /* centre of each room on the plan (viewBox 760 x 430): four on the lift's left, three on its
     right (the stairs take the first place there), and the room at the end of the corridor */
  var SLOTS = [[114, 112], [284, 112], [414, 112], [534, 112], [254, 322], [379, 322], [529, 322], [670, 128]];
  var NAME = { '11': '11', '12': '12', '13': '13', '14': '14', '15': '15', '16': '16', bath: 'BATH', linen: 'LINEN' };
  /* A plan is kept in the notebook, and the engine underlines dictionary words in everything it shows there.
     Inside an SVG that would break the lettering, so letters are written as character codes it does not read. */
  function enc(s) { return String(s).replace(/[A-Za-z]/g, function (c) { return '&#' + c.charCodeAt(0) + ';'; }); }

  /* o.old     the builder's blueprint (with the room at the end); otherwise the printed plan, which stops at a wall
     o.labels  [id x 8]  paper labels stuck on the rooms          o.print  [text x 8]  numbers printed in the rooms
     o.you     a red "you are here" dot at the end of the corridor
     o.attrs   extra attributes for the <svg> tag */
  function plan(o) {
    o = o || {};
    var old = !!o.old, bg = old ? '#1d4a7a' : '#fbfaf4', ln = old ? '#e8f1fb' : '#1d1d1b', E = old ? 736 : 604, s, i, x, c, t;
    var F = old ? "'Architects Daughter','Caveat',cursive" : "'Outfit','Oswald',Arial,sans-serif";
    function path(d, w, extra) { return '<path d="' + d + '" fill="none" stroke="' + ln + '" stroke-width="' + w + '"' + (extra || '') + '/>'; }
    function txt(px, py, str, size, extra) { return '<text x="' + px + '" y="' + py + '" font-family="' + F + '" font-size="' + size + '" fill="' + ln + '"' + (extra || '') + '>' + enc(str) + '</text>'; }
    function win(px, py, len, upright) {
      return upright
        ? '<rect x="' + (px - 4) + '" y="' + py + '" width="8" height="' + len + '" fill="' + bg + '" stroke="' + ln + '" stroke-width="1.5"/><path d="M' + px + ' ' + py + 'v' + len + '" stroke="' + ln + '" stroke-width="1.2"/>'
        : '<rect x="' + px + '" y="' + (py - 4) + '" width="' + len + '" height="8" fill="' + bg + '" stroke="' + ln + '" stroke-width="1.5"/><path d="M' + px + ' ' + py + 'h' + len + '" stroke="' + ln + '" stroke-width="1.2"/>';
    }
    s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 430"' + (o.attrs || '') + '>';
    s += '<rect width="760" height="430" fill="' + bg + '"/>';
    if (old) {
      t = '';
      for (x = 38; x < 760; x += 38) t += 'M' + x + ' 0V430';
      for (x = 34; x < 430; x += 38) t += 'M0 ' + x + 'H760';
      s += '<path d="' + t + '" stroke="#2c5f96" stroke-width="1" fill="none"/>';
    }
    /* walls */
    s += path('M24 40H' + E + 'V390H24Z', 5, ' stroke-linejoin="miter"');
    s += path('M24 180H150M184 180H310M344 180H384M414 180H550M584 180H604' +
              'M24 250H120M190 250H250M280 250H400M434 250H550M584 250H604' +
              'M204 40V180M364 40V180M464 40V180M204 250V390M304 250V390M454 250V390' +
              'M104 180V195M104 235V250' + (old ? 'M604 40V197M604 233V390' : ''), 3);
    /* the lift, the stairs, doors swinging into their rooms */
    t = 'M24 180L104 250M24 250L104 180M44 296H184V366H44Z';
    for (x = 58; x < 184; x += 14) t += 'M' + x + ' 296V366';
    [[150, 184], [310, 344], [384, 414], [550, 584]].forEach(function (d) {
      var r = d[1] - d[0]; t += 'M' + d[1] + ' 180V' + (180 - r) + 'M' + d[0] + ' 180A' + r + ' ' + r + ' 0 0 1 ' + d[1] + ' ' + (180 - r);
    });
    [[250, 280], [400, 434], [550, 584]].forEach(function (d) {
      var r = d[1] - d[0]; t += 'M' + d[1] + ' 250V' + (250 + r) + 'M' + d[0] + ' 250A' + r + ' ' + r + ' 0 0 0 ' + d[1] + ' ' + (250 + r);
    });
    if (old) t += 'M604 233H640M604 197A36 36 0 0 1 640 233';
    t += 'M110 215h24M127 209l8 6-8 6';
    s += path(t, 1.3);
    /* windows */
    s += win(84, 40, 60) + win(254, 40, 60) + win(400, 40, 28) + win(504, 40, 60) + win(349, 390, 60) + win(499, 390, 60) + win(88, 390, 50);
    if (old) s += win(736, 82, 66, true) + win(736, 282, 66, true);
    /* lettering */
    s += '<rect x="42" y="205" width="44" height="20" fill="' + bg + '"/>' + txt(64, 220, 'LIFT', 13, ' text-anchor="middle" letter-spacing="1"');
    s += txt(114, 286, 'STAIRS', 13, ' text-anchor="middle" letter-spacing="1"');
    if (old) {
      s += txt(354, 221, 'CORRIDOR', 13, ' text-anchor="middle" letter-spacing="9" opacity=".8"');
      s += txt(24, 27, 'THE SWAN HOTEL · SECOND FLOOR', 17, ' letter-spacing="1.5"');
      s += txt(736, 417, 'J. PELLOW AND SON, BUILDERS · 1936', 13, ' text-anchor="end" letter-spacing="1"');
      s += path('M716 30V9M711 16l5-8 5 8', 1.5) + txt(725, 17, 'N', 12, '');
    } else {
      s += txt(24, 28, 'THE SWAN HOTEL', 16, ' font-weight="700" letter-spacing="4"') + txt(604, 28, 'SECOND FLOOR', 13, ' text-anchor="end" font-weight="500" letter-spacing="3"');
      s += txt(24, 417, 'Drawn for Mr B. Cray · June 1978', 12, ' font-weight="300"');
      s += '<path d="M330 215H196M206 209l-10 6 10 6" stroke="#2f7d46" stroke-width="2" fill="none"/>' +
        '<text x="340" y="219" font-family="' + F + '" font-size="11" font-weight="600" letter-spacing="2" fill="#2f7d46">' + enc('FIRE EXIT: STAIRS') + '</text>';
    }
    if (o.print) {
      for (i = 0; i < SLOTS.length; i++) {
        if (!o.print[i]) continue;
        c = SLOTS[i];
        /* a hairline stroke as well as the weight: some engines draw a variable font at its lightest */
        s += txt(c[0], c[1] + 6, o.print[i], o.print[i].length > 2 ? 13 : 19, ' text-anchor="middle" font-weight="600" stroke="' + ln + '" stroke-width=".45" letter-spacing="' + (o.print[i].length > 2 ? 2 : 0) + '"');
      }
    }
    if (o.you) {
      s += '<circle cx="586" cy="215" r="6.5" fill="#b3261c"/><circle cx="586" cy="215" r="11" fill="none" stroke="#b3261c" stroke-width="1.5"/>' +
        '<path d="M598 215H622" stroke="#b3261c" stroke-width="1.5"/>' +
        '<text x="628" y="212" font-family="' + F + '" font-size="12" font-weight="700" letter-spacing="1.5" fill="#b3261c">' + enc('YOU ARE') + '</text>' +
        '<text x="628" y="227" font-family="' + F + '" font-size="12" font-weight="700" letter-spacing="1.5" fill="#b3261c">' + enc('HERE') + '</text>';
    }
    if (o.labels) {
      for (i = 0; i < SLOTS.length; i++) {
        if (!o.labels[i]) continue;
        c = SLOTS[i]; t = NAME[o.labels[i]] || o.labels[i];
        s += '<g transform="rotate(' + ((i * 37) % 5 - 2) + ' ' + c[0] + ' ' + c[1] + ')"><rect x="' + (c[0] - 40) + '" y="' + (c[1] - 17) + '" width="80" height="34" fill="#f6efd9"/>' +
          '<text x="' + c[0] + '" y="' + (c[1] + 7) + '" text-anchor="middle" font-family="\'Special Elite\',monospace" font-size="' + (t.length > 2 ? 16 : 20) + '" fill="#27231d">' + enc(t) + '</text></g>';
      }
    }
    return s + '</svg>';
  }

  /* ---- sounds: built on the engine's audio context, and silent when the player has switched sound off ---- */
  var nb = null, windN = null;
  function ctx() { var c = window.ER && ER.audio ? ER.audio() : null; return c && ER.sound() ? c : null; }
  function buf(c) {
    if (!nb) { var n = c.sampleRate * 2, d, i; nb = c.createBuffer(1, n, c.sampleRate); d = nb.getChannelData(0); for (i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; }
    return nb;
  }
  function tone(o) {
    var c = ctx(); if (!c) return;
    var t = c.currentTime + (o.when || 0), s = c.createOscillator(), a = c.createGain();
    s.type = o.type || 'sine'; s.frequency.setValueAtTime(o.f, t);
    if (o.f2) s.frequency.exponentialRampToValueAtTime(o.f2, t + o.dur);
    a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime(o.peak || 0.15, t + (o.a || 0.004));
    a.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    s.connect(a); a.connect(c.destination); s.start(t); s.stop(t + o.dur + 0.05);
  }
  function noise(o) {
    var c = ctx(); if (!c) return;
    var t = c.currentTime + (o.when || 0), s = c.createBufferSource(), f = c.createBiquadFilter(), a = c.createGain();
    s.buffer = buf(c); s.loop = true;
    f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f || 1000, t);
    if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + o.dur);
    f.Q.value = o.q || 1;
    a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime(o.peak || 0.2, t + (o.a || 0.004));
    a.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    s.connect(f); f.connect(a); a.connect(c.destination); s.start(t, Math.random()); s.stop(t + o.dur + 0.05);
  }
  /* a small bell on a spring, the kind that hangs on a board behind a hotel desk */
  function bell(v) {
    var i; v = v || 1;
    for (i = 0; i < 9; i++) {
      tone({ f: 2380, dur: 0.24, peak: 0.075 * v * (1 - i * 0.07), when: i * 0.088 });
      tone({ f: 3570, dur: 0.15, peak: 0.035 * v * (1 - i * 0.07), when: i * 0.088 });
      noise({ f: 5200, q: 5, dur: 0.02, peak: 0.05 * v, when: i * 0.088 });
    }
  }
  function knock(v) { v = v || 1; tone({ f: 170, f2: 90, dur: 0.1, peak: 0.5 * v }); noise({ type: 'lowpass', f: 800, dur: 0.05, peak: 0.3 * v }); }
  function tear() { noise({ type: 'highpass', f: 1500 + Math.random() * 900, f2: 700, dur: 0.16, peak: 0.1, a: 0.01 }); }
  function cloth() { noise({ type: 'lowpass', f: 1100, f2: 220, dur: 0.6, peak: 0.22, a: 0.08 }); }
  function squeak() { var f = 1150 + Math.random() * 700; tone({ f: f, f2: f * (1.2 + Math.random() * 0.25), dur: 0.07 + Math.random() * 0.05, peak: 0.022 }); }
  function frost() { [3100, 3900, 4700, 5600, 4200].forEach(function (f, i) { tone({ f: f, dur: 0.5, peak: 0.03, when: i * 0.09 }); }); }
  function chirp(v) {
    var b = 2500 + Math.random() * 900, i, n = 2 + Math.floor(Math.random() * 3);
    for (i = 0; i < n; i++) tone({ f: b, f2: b * 1.35, dur: 0.07, peak: 0.03 * (v || 1), when: i * 0.11 });
  }
  /* wind in an old building. Starts silent if sound is off, and follows the sound switch. */
  function wind(vol) {
    var c = window.ER && ER.audio ? ER.audio() : null; if (!c || windN) return;
    var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), l = c.createOscillator(), lg = c.createGain();
    s.buffer = buf(c); s.loop = true; f.type = 'bandpass'; f.frequency.value = 360; f.Q.value = 1.6;
    l.frequency.value = 0.09; lg.gain.value = 170; l.connect(lg); lg.connect(f.frequency);
    g.gain.value = 0; s.connect(f); f.connect(g); g.connect(c.destination); s.start(); l.start();
    windN = { g: g, vol: vol || 0.05 };
    function level() { try { g.gain.setTargetAtTime(ER.sound() ? windN.vol : 0, c.currentTime, 0.5); } catch (e) {} }
    level(); setInterval(level, 500);
  }
  function windTo(vol) { if (windN) windN.vol = vol; }

  return { SLOTS: SLOTS, NAME: NAME, plan: plan, tone: tone, noise: noise, bell: bell, knock: knock, tear: tear, cloth: cloth,
           squeak: squeak, frost: frost, chirp: chirp, wind: wind, windTo: windTo };
})();
