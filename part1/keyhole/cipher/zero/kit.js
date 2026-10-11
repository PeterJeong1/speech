/* Station Zero - what every room of the story shares: the station clock and the fuel gauge, the field
   telephone, a few sounds, and small helpers. Loaded after engine.js. Nothing in here knows an answer. */
window.ZERO = (function () {
  'use strict';
  var Z = {}, D = document, played = 0, hud = null, keyT = 0;

  /* ---------- the clock and the fuel. The standby engine started at midnight with a small tank.
     The clock follows the time really played; a wrong try burns fuel; the tank never quite runs dry. ---------- */
  function two(n) { return (n < 10 ? '0' : '') + n; }
  Z.minute = function () { return Math.min(56, 4 + Math.floor(played / 100)); };
  Z.time = function () { return ER.flag('over') ? ER.flag('over') : '00:' + two(Z.minute()); };
  Z.fuel = function () {
    if (ER.flag('over')) return 100;
    return Math.max(4, Math.min(100, 70 + (ER.flag('add') || 0) - (ER.flag('lost') || 0) - Math.floor(played / 100)));
  };
  function draw() {
    if (!hud) return;
    var f = Z.fuel(), over = ER.flag('over');
    hud.children[0].textContent = Z.time();
    hud.children[1].textContent = over ? 'Mains' : 'Fuel';
    hud.children[2].firstChild.style.width = f + '%';
    hud.classList.toggle('low', !over && f <= 20); hud.classList.toggle('ok', !!over);
    hud.setAttribute('data-fuel', f);
  }
  function hit() { if (!hud) return; hud.classList.remove('hit'); void hud.offsetWidth; hud.classList.add('hit'); draw(); }
  Z.clock = function () {
    played = ER.flag('played') || 0;
    hud = ER.el('div', 'zclk', '<b></b><small></small><span><i></i></span>'); D.body.appendChild(hud);
    draw();
    setInterval(function () {
      if (D.hidden || ER.flag('over')) return;
      played++; if (played % 5 === 0) ER.flag('played', played);
      draw();
    }, 1000);
    window.addEventListener('pagehide', function () { if (!ER.flag('over')) ER.flag('played', played); });
  };
  /* a wrong try burns fuel */
  Z.burn = function (n) {
    if (ER.flag('over')) return;
    ER.flag('lost', (ER.flag('lost') || 0) + (n || 2)); ER.flag('slips', (ER.flag('slips') || 0) + 1); hit();
  };
  Z.pour = function (n) { ER.flag('add', (ER.flag('add') || 0) + n); hit(); };
  Z.over = function (time) { if (ER.flag('over')) return; ER.flag('played', played); ER.flag('over', time || '00:58'); hit(); };
  Z.minutesPlayed = function () {
    var st = ER.state(), end = ER.flag('tEnd') || Date.now();
    return Math.max(1, Math.round((end - (st.t0 || end)) / 60000));
  };

  /* ---------- sounds (through the engine, so the sound button switches them) ---------- */
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };
  var MORSE = { a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.', h: '....', i: '..', j: '.---', k: '-.-', l: '.-..', m: '--',
    n: '-.', o: '---', p: '.--.', q: '--.-', r: '.-.', s: '...', t: '-', u: '..-', v: '...-', w: '.--', x: '-..-', y: '-.--', z: '--..' };
  Z.morse = function (ch) { return MORSE[String(ch).toLowerCase()] || ''; };
  /* one letter in Morse; returns how long it takes (seconds) */
  Z.send = function (ch, vol, when, f) {
    var m = Z.morse(ch), t = when || 0, u = 0.06, i;
    for (i = 0; i < m.length; i++) {
      T({ f: f || 640, dur: m.charAt(i) === '-' ? u * 3 : u, peak: vol || 0.05, a: 0.004, when: t });
      t += (m.charAt(i) === '-' ? u * 3 : u) + u;
    }
    return t + u * 2 - (when || 0);
  };
  Z.sfx = {
    ring: function () { for (var i = 0; i < 14; i++) { T({ type: 'square', f: 1020, dur: 0.028, peak: 0.05, when: i * 0.055 }); T({ type: 'square', f: 1340, dur: 0.02, peak: 0.03, when: i * 0.055 + 0.028 }); } },
    lift: function () { B({ dur: 0.05, f: 1800, q: 2, peak: 0.22 }); T({ f: 150, f2: 90, dur: 0.1, peak: 0.2, when: 0.04 }); },
    relay: function () { B({ dur: 0.025, f: 2600, q: 4, peak: 0.3 }); T({ f: 210, f2: 120, dur: 0.07, peak: 0.25 }); },
    notch: function () { B({ dur: 0.02, f: 3600, q: 6, peak: 0.16 }); },
    lever: function () { T({ f: 130, f2: 70, dur: 0.16, peak: 0.4 }); B({ dur: 0.05, f: 1500, q: 2, peak: 0.25 }); },
    spark: function () { B({ type: 'highpass', f: 3000, dur: 0.12, peak: 0.3 }); B({ dur: 0.05, f: 900, q: 1, peak: 0.3, when: 0.03 }); },
    plug: function () { B({ dur: 0.03, f: 1400, q: 3, peak: 0.3 }); T({ f: 180, f2: 110, dur: 0.09, peak: 0.3 }); },
    drum: function () { B({ dur: 0.025, f: 2100, q: 5, peak: 0.22 }); T({ f: 320, f2: 240, dur: 0.05, peak: 0.1 }); },
    punch: function () { B({ dur: 0.03, f: 1100, q: 2, peak: 0.34 }); T({ f: 95, f2: 60, dur: 0.08, peak: 0.3 }); },
    cough: function () { [0, 0.3, 0.52, 0.7].forEach(function (w, i) { B({ type: 'lowpass', f: 300 + i * 60, dur: 0.2, peak: 0.3, a: 0.02, when: w }); T({ type: 'sawtooth', f: 46 + i * 6, dur: 0.2, peak: 0.12, when: w }); }); },
    gust: function () { B({ type: 'bandpass', f: 380, f2: 900, q: 0.7, dur: 2.2, peak: 0.16, a: 0.9 }); },
    bolt: function () { B({ dur: 0.1, f: 800, q: 1.5, peak: 0.3, a: 0.02 }); T({ f: 140, f2: 62, dur: 0.24, peak: 0.5, when: 0.1 }); B({ dur: 0.04, f: 2200, q: 2, peak: 0.3, when: 0.1 }); },
    safe: function () { T({ f: 90, f2: 45, dur: 0.5, peak: 0.6, a: 0.01 }); B({ type: 'lowpass', f: 500, dur: 0.3, peak: 0.4 }); B({ dur: 0.05, f: 2400, q: 2, peak: 0.25, when: 0.32 }); },
    pour: function () { B({ type: 'bandpass', f: 500, f2: 1300, q: 1, dur: 1.8, peak: 0.2, a: 0.2 }); [0.3, 0.7, 1.1, 1.4].forEach(function (w) { T({ f: 200 + w * 120, f2: 420 + w * 100, dur: 0.1, peak: 0.08, when: w }); }); },
    die: function () { T({ type: 'sawtooth', f: 60, f2: 22, dur: 1.5, peak: 0.16, a: 0.02 }); B({ type: 'lowpass', f: 400, f2: 80, dur: 1.5, peak: 0.2 }); },
    tape: function () { B({ type: 'highpass', f: 2200, f2: 5200, dur: 0.16, peak: 0.1, a: 0.02 }); }
  };
  /* the sender, heard from where you stand: letters nobody can read, very quietly, for as long as the room is open */
  Z.keying = function (vol) {
    if (keyT) return;
    function go() {
      var wait = 0, i, n = 3 + Math.floor(Math.random() * 3);
      if (!D.hidden && !ER.flag('quiet')) for (i = 0; i < n; i++) wait += Z.send('abcdefghijklmnopqrstuvwxyz'.charAt(Math.floor(Math.random() * 26)), vol || 0.012, wait, 610);
      keyT = setTimeout(go, Math.max(wait, 0.5) * 1000 + 700 + Math.random() * 1600);
    }
    keyT = setTimeout(go, 1500);
  };
  Z.hush = function () { clearTimeout(keyT); keyT = 0; };

  /* A door opens: the music answers in the room's own key, as after ER.exit; without music, three plain notes. */
  Z.solved = function (quiet) {
    var sung = false;
    try { sung = !!(ER.music && ER.music() && ER.track && ER.track.sting('solved', null, !!quiet)); } catch (e) {}
    if (!sung && !quiet) ER.sfx.ok();
  };
  Z.mood = function (m) { try { if (ER.mood) ER.mood(m); } catch (e) {} };

  /* ---------- the field telephone ---------- */
  var ringT = 0, ringN = null;
  Z.ring = function (node) {
    Z.unring(); ringN = node; node.classList.add('ring'); Z.sfx.ring();
    ringT = setInterval(function () { if (!D.hidden && !ER.isOpen()) Z.sfx.ring(); }, 3200);
  };
  Z.unring = function () { clearInterval(ringT); ringT = 0; if (ringN) ringN.classList.remove('ring'); ringN = null; };
  Z.ringing = function () { return !!ringN; };
  /* a call: who = 'control' or 'quince' */
  Z.call = function (who, lines, clue, done, last) {
    var c = window.CAST[who];
    Z.unring(); Z.sfx.lift();
    ER.talk({ who: c.who, role: c.role, face: window.FACE(who), lines: lines, clue: clue, done: done, last: last || 'Ring off' });
  };

  /* a name tag left over from the last click must not sit on top of whatever is opened next */
  var open0 = ER.open;
  ER.open = function (cls, node, onClose, o) {
    ER.$$('.wtag').forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
    return open0(cls, node, onClose, o);
  };
  /* a thing in the scene that has a name and something to say */
  Z.thing = function (sel, word, line, busy) {
    ER.$$(sel).forEach(function (n) {
      n.addEventListener('click', function (e) {
        if (busy && busy()) return;
        if (word) ER.wordAt(e.clientX, e.clientY, word);
        if (line) ER.say(typeof line === 'function' ? line() : line);
      });
    });
  };
  /* a note of your own in the notebook */
  Z.mine = function (id, title, html, quiet) { return ER.addClue(id, title, '<h4>' + title + '</h4>' + html, 'mine', 'Your pencil', quiet); };
  Z.gobtn = function (label, fn) {
    var b = ER.el('button', 'gobtn on', label); b.type = 'button'; b.id = 'go'; b.addEventListener('click', fn); D.body.appendChild(b); return b;
  };
  return Z;
})();

/* The voice on the telephone has no face: its bust is the thing it speaks through. */
window.CAST_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>' +
'<symbol id="ch-phone" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#161a17"/>' +
'<g stroke="#0e110f" stroke-width="2"><path d="M0 52h200M0 104h200M0 156h200M0 208h200"/></g>' +
'<rect x="34" y="46" width="132" height="178" rx="8" fill="#3d4a34"/><rect x="34" y="46" width="132" height="178" rx="8" fill="none" stroke="#232b1f" stroke-width="4"/>' +
'<rect x="44" y="56" width="112" height="62" rx="4" fill="#2c3626"/>' +
'<g fill="#11150f"><circle cx="64" cy="76" r="2.6"/><circle cx="76" cy="76" r="2.6"/><circle cx="88" cy="76" r="2.6"/><circle cx="100" cy="76" r="2.6"/><circle cx="112" cy="76" r="2.6"/><circle cx="124" cy="76" r="2.6"/><circle cx="136" cy="76" r="2.6"/>' +
'<circle cx="70" cy="88" r="2.6"/><circle cx="82" cy="88" r="2.6"/><circle cx="94" cy="88" r="2.6"/><circle cx="106" cy="88" r="2.6"/><circle cx="118" cy="88" r="2.6"/><circle cx="130" cy="88" r="2.6"/>' +
'<circle cx="64" cy="100" r="2.6"/><circle cx="76" cy="100" r="2.6"/><circle cx="88" cy="100" r="2.6"/><circle cx="100" cy="100" r="2.6"/><circle cx="112" cy="100" r="2.6"/><circle cx="124" cy="100" r="2.6"/><circle cx="136" cy="100" r="2.6"/></g>' +
'<circle cx="166" cy="170" r="13" fill="#1b1f18"/><path d="M166 170h24v-16" stroke="#8d8a7c" stroke-width="5" fill="none" stroke-linecap="round"/><circle cx="190" cy="152" r="6" fill="#16130e"/>' +
'<path d="M20 70q-14 60 0 122" stroke="#0c0d0b" stroke-width="16" fill="none" stroke-linecap="round"/>' +
'<rect x="6" y="52" width="30" height="34" rx="12" fill="#141612"/><rect x="6" y="176" width="30" height="34" rx="12" fill="#141612"/>' +
'<path d="M22 206q4 40 60 34" stroke="#0c0d0b" stroke-width="4" fill="none"/>' +
'<g transform="rotate(-3 100 160)"><rect x="52" y="136" width="96" height="46" fill="#f1ede1"/><rect x="52" y="136" width="96" height="10" fill="#f4e04d"/>' +
'<text x="100" y="165" text-anchor="middle" font-family="Permanent Marker,cursive" font-size="17" fill="#1c1b18">ITEM 31</text>' +
'<text x="100" y="178" text-anchor="middle" font-family="Courier Prime,monospace" font-size="8.5" fill="#4a473e">field telephone</text></g>' +
'<rect x="56" y="196" width="88" height="16" rx="2" fill="#a88f4c"/><rect x="56" y="196" width="88" height="16" rx="2" fill="#3d4a34" opacity=".0"/>' +
'</symbol>' +
/* the Station Officer's house, three hundred yards down the hill: one lit window, and somebody in it */
'<symbol id="ch-quince" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#0b0f16"/>' +
'<g stroke="#c9d6e6" stroke-width="1.4" opacity=".28"><path d="M20 0l-14 60M70 10l-14 70M120 0l-16 80M170 6l-14 64M44 150l-10 50M190 120l-12 60M96 170l-10 56M150 190l-12 60"/></g>' +
'<path d="M18 260V96L100 38l82 58v164z" fill="#151a22"/><path d="M8 100L100 30l92 70" stroke="#232a36" stroke-width="10" fill="none" stroke-linecap="round"/>' +
'<rect x="56" y="110" width="88" height="104" fill="#f2c45a"/><rect x="56" y="110" width="88" height="104" fill="none" stroke="#0b0f16" stroke-width="7"/>' +
'<path d="M100 110v104M56 162h88" stroke="#0b0f16" stroke-width="5"/>' +
'<path d="M76 214v-22q0-22 24-22t24 22v22z" fill="#1a1512"/><ellipse cx="100" cy="150" rx="15" ry="18" fill="#1a1512"/>' +
'<path d="M114 148q14 0 14 16v10" stroke="#1a1512" stroke-width="7" fill="none" stroke-linecap="round"/>' +
'<path d="M128 176q8 26-10 38" stroke="#1a1512" stroke-width="2.5" fill="none"/>' +
'<rect x="18" y="236" width="164" height="24" fill="#0e1218"/>' +
'</symbol>' +
'</defs></svg>';
window.CAST = {
  control: { id: 'ch-phone', who: 'Control', role: 'A voice on the field telephone', bg: '#161a17' },
  quince: { id: 'ch-quince', who: 'Sir Aubrey Quince', role: 'Station Officer here, thirty years ago · 300 yards down the hill', bg: '#0b0f16' }
};
window.FACE = function (k) {
  var c = window.CAST[k];
  return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:' + c.bg + '"><use href="#' + c.id + '"/></svg>';
};
