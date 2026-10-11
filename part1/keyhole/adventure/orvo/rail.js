/* Rolling stock, the guard and the sounds that the rooms of "The Night Train to Orvo" share.
   RAIL.defs            gradients the drawings use (put them into a <defs>)
   RAIL.car(id, day)    one carriage, 212 wide, drawn with its roof at y = 0 and the rail at y = 228
   RAIL.engine(day)     the engine, about 300 wide, on the same base line
   RAIL.steam(x, y)     three puffs that rise from that point
   RAIL.vane(cx, fy)    Mr Vane standing, his feet at fy
   RAIL.snd.*           sounds made with the engine's audio context; they obey the sound button */
window.RAIL = (function () {
  'use strict';
  /* in alphabetical order: the order they travel in is not written down anywhere in the pages */
  var NAME = { dining: 'DINING CAR', guard: 'GUARD’S VAN', kitchen: 'KITCHEN CAR', mail: 'MAIL VAN', sleeping: 'SLEEPING CAR' };
  var WORD = { dining: 'dining car', guard: 'guard\'s van', kitchen: 'kitchen car', mail: 'mail van', sleeping: 'sleeping car' };

  var DEFS =
    '<linearGradient id="rl-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f2c3b"/><stop offset=".55" stop-color="#701f2d"/><stop offset="1" stop-color="#4f1420"/></linearGradient>' +
    '<linearGradient id="rl-roof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a4052"/><stop offset="1" stop-color="#1d2130"/></linearGradient>' +
    '<linearGradient id="rl-win" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9ad"/><stop offset="1" stop-color="#f0a245"/></linearGradient>' +
    '<linearGradient id="rl-hot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6d6"/><stop offset="1" stop-color="#ffc45e"/></linearGradient>' +
    '<linearGradient id="rl-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d7ecf7"/><stop offset=".5" stop-color="#9cc6de"/><stop offset="1" stop-color="#e6f3f9"/></linearGradient>' +
    '<linearGradient id="rl-brass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f5df98"/><stop offset=".5" stop-color="#c79b3b"/><stop offset="1" stop-color="#7d5f1d"/></linearGradient>' +
    '<linearGradient id="rl-boiler" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#454d61"/><stop offset=".4" stop-color="#1f2330"/><stop offset="1" stop-color="#0b0d13"/></linearGradient>' +
    '<linearGradient id="rl-beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff0b8" stop-opacity=".5"/><stop offset="1" stop-color="#fff0b8" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="rl-fire"><stop offset="0" stop-color="#ffd98a"/><stop offset="1" stop-color="#e2531f"/></radialGradient>' +
    '<radialGradient id="rl-red"><stop offset="0" stop-color="#ff5a48" stop-opacity=".85"/><stop offset=".4" stop-color="#ff3b2a" stop-opacity=".28"/><stop offset="1" stop-color="#ff3b2a" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="rl-puff"><stop offset="0" stop-color="#ffffff" stop-opacity=".9"/><stop offset=".6" stop-color="#e3ebf5" stop-opacity=".45"/><stop offset="1" stop-color="#e3ebf5" stop-opacity="0"/></radialGradient>';

  function wheels(xs, cy, r) {
    return xs.map(function (x) {
      return '<circle cx="' + x + '" cy="' + cy + '" r="' + r + '" fill="#171920" stroke="#4a4f5e" stroke-width="3"/>' +
        '<circle cx="' + x + '" cy="' + cy + '" r="' + (r * 0.58).toFixed(1) + '" fill="none" stroke="#343846" stroke-width="2"/>' +
        '<circle cx="' + x + '" cy="' + cy + '" r="' + (r * 0.2).toFixed(1) + '" fill="#7a8194"/>';
    }).join('');
  }
  function spoked(xs, cy, r) {
    return xs.map(function (x) {
      var s = '<circle cx="' + x + '" cy="' + cy + '" r="' + r + '" fill="#14161c" stroke="#8a2a38" stroke-width="4"/>', i, a;
      for (i = 0; i < 8; i++) {
        a = i * Math.PI / 4 + 0.3;
        s += '<path d="M' + x + ' ' + cy + 'L' + (x + Math.cos(a) * (r - 3)).toFixed(1) + ' ' + (cy + Math.sin(a) * (r - 3)).toFixed(1) + '" stroke="#8a2a38" stroke-width="2.4"/>';
      }
      return s + '<circle cx="' + x + '" cy="' + cy + '" r="6" fill="#c79b3b"/>';
    }).join('');
  }

  /* what is on the side of each carriage, between the name board and the frame */
  function side(id, day) {
    var W = day ? 'url(#rl-glass)' : 'url(#rl-win)', H = day ? 'url(#rl-glass)' : 'url(#rl-hot)', s = '', i, x;
    if (id === 'mail') {
      s += '<rect x="56" y="57" width="100" height="5" fill="#2a2d38"/>' +
        '<rect x="64" y="62" width="84" height="104" fill="#5c1c28" stroke="#3d111a" stroke-width="2"/>' +
        '<path d="M78 62v104M92 62v104M106 62v104M120 62v104M134 62v104" stroke="#3d111a" stroke-width="1.5"/>' +
        '<path d="M64 62L148 166M148 62L64 166" stroke="#3d111a" stroke-width="3" opacity=".65"/>' +
        '<rect x="139" y="106" width="5" height="18" rx="2" fill="#d9ae48"/>' +
        '<rect x="18" y="70" width="34" height="30" rx="2" fill="' + W + '"/><path d="M26.5 70v30M35 70v30M43.5 70v30" stroke="#3d111a" stroke-width="2.6"/>' +
        '<rect x="18" y="70" width="34" height="30" rx="2" fill="none" stroke="#d9ae48" stroke-width="2"/>' +
        '<rect x="160" y="72" width="38" height="26" rx="2" fill="#f3efe2" stroke="#d9ae48" stroke-width="2"/><path d="M161 74l18 13 18-13" stroke="#b8923a" stroke-width="2" fill="none"/>' +
        '<rect x="161" y="134" width="36" height="9" rx="2" fill="#d9ae48"/><rect x="165" y="137" width="28" height="3" fill="#2a0c12"/>';
    } else if (id === 'kitchen') {
      s += '<rect x="14" y="64" width="92" height="52" rx="3" fill="' + H + '"/>' +
        '<path d="M30 64v10M54 64v7M80 64v12" stroke="#3a2412" stroke-width="2"/>' +
        '<circle cx="30" cy="81" r="7.5" fill="#3a2412"/><path d="M46 71h16v6q0 7-8 7t-8-7z" fill="#3a2412"/><ellipse cx="80" cy="82" rx="10" ry="6.5" fill="#3a2412"/>' +
        '<rect x="14" y="64" width="92" height="52" rx="3" fill="none" stroke="#d9ae48" stroke-width="2.5"/>' +
        '<rect x="118" y="64" width="40" height="52" rx="3" fill="' + H + '"/>' +
        '<path d="M127 116v-11q-1-6 4-9-5-2-5-8 0-5 5-6 0-7 7-7t7 7q5 1 5 6 0 6-5 8 5 3 4 9v11z" fill="#4a2e16" opacity=".85"/>' +
        '<rect x="118" y="64" width="40" height="52" rx="3" fill="none" stroke="#d9ae48" stroke-width="2.5"/>' +
        '<circle cx="184" cy="90" r="14" fill="' + H + '" stroke="#d9ae48" stroke-width="2.5"/>' +
        '<g stroke="#e6c268" stroke-width="3" stroke-linecap="round" fill="none"><path d="M96 131l20 26M116 131l-20 26"/></g>' +
        '<ellipse cx="95" cy="130" rx="4" ry="5.5" fill="#e6c268"/><path d="M113 126v8M117 127v8M121 129v8" stroke="#e6c268" stroke-width="1.6" stroke-linecap="round"/>';
    } else if (id === 'dining') {
      [14, 79, 144].forEach(function (wx) {
        var p = 'M' + wx + ' 116V78Q' + wx + ' 64 ' + (wx + 14) + ' 64H' + (wx + 40) + 'Q' + (wx + 54) + ' 64 ' + (wx + 54) + ' 78V116Z';
        s += '<path d="' + p + '" fill="' + W + '"/>' +
          '<path d="M' + wx + ' 66Q' + (wx + 17) + ' 90 ' + wx + ' 116ZM' + (wx + 54) + ' 66Q' + (wx + 37) + ' 90 ' + (wx + 54) + ' 116Z" fill="#7c2532"/>' +
          '<path d="M' + (wx + 27) + ' 116v-13" stroke="#3a2412" stroke-width="2.5"/><path d="M' + (wx + 18) + ' 103l5-12h8l5 12z" fill="#d9483c"/>' +
          '<path d="' + p + '" fill="none" stroke="#d9ae48" stroke-width="2.5"/>';
      });
      s += '<text x="106" y="148" class="rl-line">ORVO LINE</text>';
    } else if (id === 'sleeping') {
      for (i = 0; i < 5; i++) {
        x = 15 + i * 38;
        s += '<rect x="' + x + '" y="64" width="30" height="52" rx="3" fill="#3a456c"/>' +
          '<path d="M' + x + ' 74h30M' + x + ' 84h30M' + x + ' 94h30M' + x + ' 104h30" stroke="#2a3354" stroke-width="2"/>' +
          (i === 3 && !day ? '<rect x="' + x + '" y="108" width="30" height="8" fill="#f2c56f"/>' : '') +
          '<rect x="' + x + '" y="64" width="30" height="52" rx="3" fill="none" stroke="#d9ae48" stroke-width="2.2"/>';
      }
      s += '<text x="106" y="148" class="rl-line">ORVO LINE</text>';
    } else {
      s += '<rect x="20" y="62" width="44" height="106" rx="3" fill="#5c1c28" stroke="#3d111a" stroke-width="2"/>' +
        '<rect x="27" y="70" width="30" height="34" rx="2" fill="' + W + '" stroke="#d9ae48" stroke-width="2"/>' +
        '<circle cx="56" cy="124" r="3.5" fill="#e6c268"/><rect x="18" y="170" width="48" height="5" fill="#3a3f4d"/>' +
        '<rect x="82" y="66" width="48" height="46" rx="3" fill="' + W + '" stroke="#d9ae48" stroke-width="2.5"/>' +
        '<path d="M148 64h36q10 0 10 10v34q0 8-10 8h-36z" fill="#5c1c28" stroke="#d9ae48" stroke-width="1.6"/><rect x="156" y="72" width="28" height="24" rx="2" fill="' + W + '"/>' +
        '<circle cx="106" cy="142" r="13" fill="none" stroke="#e6c268" stroke-width="3"/><path d="M106 129v26M93 142h26" stroke="#e6c268" stroke-width="2"/><circle cx="106" cy="142" r="3" fill="#e6c268"/>';
    }
    return s;
  }
  /* what stands on the roof, or hangs off the end */
  function extras(id, day) {
    if (id === 'kitchen') return '<rect x="150" y="-24" width="12" height="34" fill="#2a2d38"/><path d="M144 -24h24l-4-8h-16z" fill="#2a2d38"/>' +
      '<circle class="rl-puff s1" cx="156" cy="-40" r="10" fill="url(#rl-puff)"/><circle class="rl-puff s2" cx="156" cy="-40" r="10" fill="url(#rl-puff)"/>';
    if (id === 'guard') return '<rect x="70" y="-12" width="72" height="22" rx="3" fill="#5c1c28"/>' +
      '<rect x="78" y="-7" width="18" height="10" fill="' + (day ? '#cfe9f5' : '#f2c56f') + '"/><rect x="116" y="-7" width="18" height="10" fill="' + (day ? '#cfe9f5' : '#f2c56f') + '"/>' +
      '<path d="M64 -11Q106 -26 148 -11Q148 -6 142 -8H70Q64 -6 64 -11Z" fill="#eef4fb"/>' +
      (day ? '' : '<circle class="rl-tail" cx="-4" cy="150" r="26" fill="url(#rl-red)"/>');
    if (id === 'sleeping' && !day) return '<text x="92" y="-2" class="rl-z z1">z</text><text x="108" y="-2" class="rl-z z2">z</text><text x="124" y="-2" class="rl-z z3">Z</text>';
    return '';
  }
  function car(id, day) {
    return extras(id, day) +
      '<path d="M-3 24Q-3 4 16 4H196Q215 4 215 24Z" fill="url(#rl-roof)"/>' +
      '<path d="M0 14Q4 2 22 1H190Q208 2 212 14Q198 8 176 10T132 9 88 11 44 9 0 14Z" fill="#eef4fb"/>' +
      '<rect x="0" y="22" width="212" height="148" rx="5" fill="url(#rl-body)"/>' +
      '<rect x="0" y="22" width="212" height="9" fill="#000" opacity=".2"/>' +
      '<rect x="7" y="58" width="198" height="106" rx="3" fill="none" stroke="#d9ae48" stroke-width="1.6"/>' +
      '<path d="M7 122H205" stroke="#d9ae48" stroke-width="1.1" opacity=".75"/>' +
      side(id, day) +
      '<rect x="14" y="29" width="184" height="24" rx="3" fill="#f3efe2" stroke="#b8923a" stroke-width="1.5"/>' +
      '<text x="106" y="47" class="rl-name">' + NAME[id] + '</text>' +
      '<rect x="4" y="170" width="204" height="13" fill="#14161d"/><rect x="20" y="183" width="172" height="8" fill="#0c0d12"/>' +
      '<rect x="-9" y="172" width="13" height="7" fill="#2a2d38"/><rect x="208" y="172" width="13" height="7" fill="#2a2d38"/>' +
      wheels([40, 76, 136, 172], 206, 22) +
      (id === 'guard' ? '<rect x="-11" y="141" width="13" height="18" rx="3" fill="#2a2d38"/><circle cx="-5" cy="150" r="5.5" fill="' + (day ? '#b3261c' : '#ff5a48') + '"/>' : '');
  }

  function engine(day) {
    return (day ? '' : '<path d="M296 101L640 40V180Z" fill="url(#rl-beam)" pointer-events="none"/>') +
      '<rect x="2" y="174" width="290" height="12" fill="#14161d"/>' +
      '<rect x="286" y="164" width="10" height="32" fill="#b3261c"/><rect x="296" y="172" width="12" height="7" fill="#2a2d38"/><rect x="-9" y="172" width="13" height="7" fill="#2a2d38"/>' +
      /* boiler, smokebox, chimney */
      '<rect x="84" y="62" width="192" height="76" rx="30" fill="url(#rl-boiler)"/>' +
      '<rect x="246" y="56" width="38" height="88" rx="10" fill="#0d0f15"/><path d="M250 142h30l6 32h-42z" fill="#0d0f15"/>' +
      '<path d="M122 63v40M172 63v40M224 63v74" stroke="#c79b3b" stroke-width="3"/>' +
      '<path d="M150 64V52Q150 37 168 37T186 52V64Z" fill="url(#rl-brass)"/>' +
      '<rect x="112" y="46" width="6" height="18" fill="#c79b3b"/><circle cx="115" cy="44" r="4.5" fill="#e6c268"/>' +
      '<path d="M253 58V26h24V58Z" fill="#12141c"/><path d="M247 26h36l-4-13h-28z" fill="#12141c"/><rect x="249" y="22" width="32" height="5" fill="#c79b3b"/>' +
      '<path d="M258 30v26M252 64v72" stroke="#4a5266" stroke-width="3.5" stroke-linecap="round" opacity=".85"/><path d="M252 16h26" stroke="#3a4052" stroke-width="2"/>' +
      '<path d="M96 76h146" stroke="#8a93a8" stroke-width="3" stroke-linecap="round" opacity=".45"/>' +
      '<path d="M104 63Q150 55 148 63ZM190 63Q230 56 244 62Z" fill="#eef4fb"/>' +
      /* side tank */
      '<rect x="88" y="104" width="124" height="70" fill="url(#rl-body)"/><rect x="94" y="110" width="112" height="58" rx="3" fill="none" stroke="#d9ae48" stroke-width="1.6"/>' +
      '<text x="150" y="145" class="rl-line">ORVO LINE</text>' +
      /* cab */
      '<path d="M-4 46H96V38Q46 22 -4 38Z" fill="#1d2130"/><path d="M-2 37Q46 21 94 37Q46 28 -2 37Z" fill="#eef4fb"/>' +
      '<rect x="4" y="46" width="84" height="128" fill="url(#rl-body)"/><rect x="10" y="52" width="72" height="116" rx="3" fill="none" stroke="#d9ae48" stroke-width="1.6"/>' +
      '<path d="M24 112V80Q24 66 38 66H56Q70 66 70 80V112Z" fill="' + (day ? 'url(#rl-glass)' : 'url(#rl-fire)') + '"/>' +
      '<path d="M36 112V99q0-8 7-10-4-3-4-8 0-8 8-8t8 8q0 5-4 8 7 2 7 10v13z" fill="#2a120a" opacity=".85"/>' +
      '<path d="M24 112V80Q24 66 38 66H56Q70 66 70 80V112Z" fill="none" stroke="#d9ae48" stroke-width="2.5"/>' +
      '<rect x="30" y="130" width="34" height="24" rx="3" fill="#e6c268"/><text x="47" y="149" class="rl-num">7</text>' +
      /* lamp, cylinder, wheels, rods */
      '<rect x="280" y="90" width="14" height="22" rx="3" fill="#2a2d38"/><ellipse cx="294" cy="101" rx="4" ry="8" fill="' + (day ? '#d9d3c5' : '#fff0b8') + '"/>' +
      '<rect x="230" y="176" width="46" height="24" rx="5" fill="#1d2130"/><rect x="230" y="176" width="46" height="6" fill="#c79b3b"/>' +
      spoked([62, 128, 194], 200, 28) + wheels([258], 213, 15) +
      '<rect x="54" y="203" width="148" height="8" rx="4" fill="#9aa2b3"/><path d="M196 207L238 190" stroke="#9aa2b3" stroke-width="6" stroke-linecap="round"/>' +
      '<circle cx="62" cy="207" r="4" fill="#4a4f5e"/><circle cx="128" cy="207" r="4" fill="#4a4f5e"/><circle cx="194" cy="207" r="4" fill="#4a4f5e"/>';
  }
  function steam(x, y) {
    return '<circle class="rl-puff p1" cx="' + x + '" cy="' + y + '" r="20" fill="url(#rl-puff)"/><circle class="rl-puff p2" cx="' + x + '" cy="' + y + '" r="20" fill="url(#rl-puff)"/>' +
      '<circle class="rl-puff p3" cx="' + x + '" cy="' + y + '" r="20" fill="url(#rl-puff)"/>';
  }

  /* Mr Vane on his feet: cx is the middle of him, fy is the floor. He is 556 tall. The watch never leaves his hand. */
  function vane(cx, fy) {
    function X(v) { return (cx + v).toFixed(0); }
    function Y(v) { return (fy + v).toFixed(0); }
    return '<ellipse cx="' + cx + '" cy="' + Y(4) + '" rx="88" ry="10" fill="#000" opacity=".35"/>' +
      '<rect x="' + X(-34) + '" y="' + Y(-214) + '" width="32" height="204" fill="#161b2a"/><rect x="' + X(4) + '" y="' + Y(-214) + '" width="32" height="204" fill="#161b2a"/>' +
      '<rect x="' + X(-46) + '" y="' + Y(-16) + '" width="48" height="16" rx="6" fill="#07080c"/><rect x="' + X(0) + '" y="' + Y(-16) + '" width="48" height="16" rx="6" fill="#07080c"/>' +
      '<path d="M' + X(-64) + ' ' + Y(-356) + 'h128l10 198H' + X(-74) + 'z" fill="#1c2233"/>' +
      '<path d="M' + X(0) + ' ' + Y(-336) + 'v178" stroke="#131827" stroke-width="3"/>' +
      '<g fill="#e6c268"><circle cx="' + X(-18) + '" cy="' + Y(-306) + '" r="5"/><circle cx="' + X(18) + '" cy="' + Y(-306) + '" r="5"/><circle cx="' + X(-20) + '" cy="' + Y(-264) + '" r="5"/><circle cx="' + X(20) + '" cy="' + Y(-264) + '" r="5"/>' +
      '<circle cx="' + X(-22) + '" cy="' + Y(-222) + '" r="5"/><circle cx="' + X(22) + '" cy="' + Y(-222) + '" r="5"/></g>' +
      '<rect x="' + X(-92) + '" y="' + Y(-358) + '" width="32" height="150" rx="15" fill="#1a2031"/><circle cx="' + X(-76) + '" cy="' + Y(-202) + '" r="13" fill="#eee8d8"/>' +
      '<path d="M' + X(60) + ' ' + Y(-352) + 'q28 6 28 34v54q0 14-14 14t-14-14z" fill="#1a2031"/>' +
      '<path d="M' + X(86) + ' ' + Y(-258) + 'q-4 12-18 10l-42-22q-8-8-2-16t16-4l42 20z" fill="#1a2031"/>' +
      '<path d="M' + X(20) + ' ' + Y(-276) + 'q-16 30-2 60" stroke="#d9ae48" stroke-width="2" fill="none"/>' +
      '<circle cx="' + X(34) + '" cy="' + Y(-282) + '" r="13" fill="#eee8d8"/>' +
      '<circle cx="' + X(32) + '" cy="' + Y(-294) + '" r="18" fill="url(#rl-brass)"/><circle cx="' + X(32) + '" cy="' + Y(-294) + '" r="13.5" fill="#fbf3dc"/>' +
      '<path d="M' + X(32) + ' ' + Y(-294) + 'v-10M' + X(32) + ' ' + Y(-294) + 'l6 4" stroke="#1b140f" stroke-width="2" stroke-linecap="round"/>' +
      '<use href="#ch-vane" x="' + X(-88) + '" y="' + Y(-556) + '" width="176" height="229"/>';
  }

  /* ---- sound ---- */
  var nbuf = null;
  function ctx(always) {
    try { return window.ER && (always || ER.sound()) ? ER.audio() : null; } catch (e) { return null; }
  }
  function buf(c) {
    if (!nbuf) {
      var n = c.sampleRate * 2, d, i;
      nbuf = c.createBuffer(1, n, c.sampleRate); d = nbuf.getChannelData(0);
      for (i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    }
    return nbuf;
  }
  function tone(o) {
    var c = ctx(); if (!c) return;
    var t = c.currentTime + (o.when || 0), s = c.createOscillator(), g = c.createGain();
    s.type = o.type || 'sine'; s.frequency.setValueAtTime(o.f, t);
    if (o.f2) s.frequency.exponentialRampToValueAtTime(o.f2, t + (o.glide || o.dur));
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.peak || 0.1, t + (o.a || 0.01));
    if (o.hold) g.gain.setValueAtTime(o.peak || 0.1, t + o.dur - o.hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    s.connect(g); g.connect(c.destination); s.start(t); s.stop(t + o.dur + 0.05);
  }
  function noise(o) {
    var c = ctx(); if (!c) return;
    var t = c.currentTime + (o.when || 0), s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = buf(c); s.loop = true;
    f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f || 1000, t);
    if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + o.dur);
    f.Q.value = o.q || 1;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(o.peak || 0.2, t + (o.a || 0.005));
    g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    s.connect(f); f.connect(g); g.connect(c.destination); s.start(t, Math.random()); s.stop(t + o.dur + 0.05);
  }
  /* a steady background noise; it goes quiet when the sound button is off */
  function loop(o) {
    var c = ctx(true), dead = { stop: function () {}, vol: function () {} };
    if (!c) return dead;
    var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), on = true, vol = o.vol;
    s.buffer = buf(c); s.loop = true; f.type = o.type || 'lowpass'; f.frequency.value = o.f || 200; f.Q.value = o.q || 0.7;
    g.gain.value = 0; s.connect(f); f.connect(g); g.connect(c.destination); s.start();
    function set() { if (on) g.gain.setTargetAtTime(ER.sound() ? vol : 0, c.currentTime, 0.4); }
    var t = setInterval(set, 400); set();
    return {
      vol: function (v) { vol = v; set(); },
      stop: function () { on = false; clearInterval(t); g.gain.setTargetAtTime(0, c.currentTime, 0.25); setTimeout(function () { try { s.stop(); } catch (e) {} }, 1400); }
    };
  }
  function blast(when, dur) {
    [698, 880, 1046].forEach(function (f) { tone({ type: 'triangle', f: f * 0.92, f2: f, glide: 0.12, dur: dur, peak: 0.06, a: 0.05, hold: 0.12, when: when }); });
    noise({ type: 'bandpass', f: 2400, q: 1.1, dur: dur, peak: 0.045, a: 0.05, when: when });
  }
  var snd = {
    whistle: function () { blast(0, 1.05); blast(1.25, 0.42); },
    hiss: function () { noise({ type: 'highpass', f: 3000, dur: 1.5, peak: 0.03, a: 0.3 }); },
    chuff: function (v) { noise({ type: 'lowpass', f: 760, f2: 240, dur: 0.34, peak: 0.16 * (v || 1), a: 0.03 }); },
    couple: function () {
      tone({ f: 170, f2: 70, dur: 0.17, peak: 0.3 }); noise({ f: 1900, q: 1.5, dur: 0.06, peak: 0.2 });
      tone({ f: 130, f2: 62, dur: 0.12, peak: 0.16, when: 0.1 }); noise({ f: 2400, q: 2, dur: 0.04, peak: 0.1, when: 0.1 });
    },
    clack: function (v) {
      v = v || 1;
      noise({ type: 'lowpass', f: 520, dur: 0.06, peak: 0.2 * v }); tone({ f: 105, f2: 68, dur: 0.08, peak: 0.1 * v });
      noise({ type: 'lowpass', f: 460, dur: 0.06, peak: 0.15 * v, when: 0.13 }); tone({ f: 96, f2: 62, dur: 0.08, peak: 0.08 * v, when: 0.13 });
    },
    punch: function () {
      noise({ f: 2600, q: 2, dur: 0.025, peak: 0.32 }); tone({ f: 210, f2: 110, dur: 0.07, peak: 0.24, when: 0.012 });
      noise({ type: 'highpass', f: 4200, dur: 0.04, peak: 0.1, when: 0.06 });
    },
    ding: function () {
      [2093, 3140, 4190, 5290].forEach(function (f, i) { tone({ f: f, dur: 1.3 / (i + 1), peak: 0.11 / (i + 1) }); });
      noise({ f: 5000, q: 2, dur: 0.02, peak: 0.12 });
    },
    knock: function () { [0, 0.16, 0.32].forEach(function (w) { tone({ f: 190, f2: 120, dur: 0.07, peak: 0.22, when: w }); noise({ type: 'lowpass', f: 900, dur: 0.04, peak: 0.1, when: w }); }); },
    loop: loop
  };

  return { defs: DEFS, car: car, engine: engine, steam: steam, vane: vane, name: NAME, word: WORD, snd: snd };
})();
