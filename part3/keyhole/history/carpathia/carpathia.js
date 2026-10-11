/* Come at Once - what every room of the story shares: a few sounds, the Morse code and the two things that are
   done with it (a key to press, and a pencil that writes down what the telephones say), the papers that are
   needed in more than one room, and small helpers. Loaded after engine.js. Nothing in here knows an answer. */
window.CP = (function () {
  'use strict';
  var X = {}, D = document;
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so the sound button switches them) ---------- */
  X.sfx = {
    /* the sending spark in the box behind the operator: a crack, and a breath of it afterwards */
    spark: function (n) { for (var i = 0; i < (n || 3); i++) { B({ type: 'highpass', f: 3200, dur: 0.05 + (i % 2) * 0.07, peak: 0.16, when: i * 0.16 }); T({ type: 'sawtooth', f: 410, dur: 0.05 + (i % 2) * 0.07, peak: 0.03, when: i * 0.16 }); } },
    key: function () { B({ dur: 0.02, f: 2600, q: 3, peak: 0.12 }); },
    pencil: function () { B({ type: 'highpass', f: 3000, dur: 0.12, peak: 0.05, a: 0.03 }); },
    pin: function () { B({ dur: 0.025, f: 4200, q: 4, peak: 0.2 }); T({ f: 190, dur: 0.05, peak: 0.1 }); },
    rule: function () { B({ type: 'bandpass', f: 900, q: 1.2, dur: 0.12, peak: 0.1, a: 0.03 }); },
    brass: function () { T({ f: 1320, dur: 0.22, peak: 0.05 }); T({ f: 1990, dur: 0.14, peak: 0.025 }); B({ dur: 0.02, f: 3000, q: 2, peak: 0.12 }); },
    chalk: function () { B({ type: 'highpass', f: 3400, dur: 0.2, peak: 0.07, a: 0.04 }); },
    valve: function () { T({ type: 'sawtooth', f: 520, f2: 310, dur: 0.3, peak: 0.035, a: 0.06 }); B({ type: 'bandpass', f: 1400, q: 2, dur: 0.25, peak: 0.05, a: 0.05 }); },
    hiss: function () { B({ type: 'highpass', f: 2400, f2: 5200, dur: 1.3, peak: 0.1, a: 0.25 }); },
    wood: function () { T({ f: 240, f2: 170, dur: 0.07, peak: 0.22 }); B({ dur: 0.03, f: 1500, q: 2, peak: 0.14 }); },
    clang: function () { [1, 2.4, 3.1].forEach(function (m, i) { T({ f: 510 * m, dur: 0.7 / (i + 1), peak: 0.1 / (i + 1) }); }); },
    step: function () { T({ f: 110, f2: 70, dur: 0.1, peak: 0.25 }); },
    cloth: function () { B({ type: 'lowpass', f: 900, dur: 0.22, peak: 0.12, a: 0.06 }); },
    rocket: function () { B({ type: 'bandpass', f: 700, f2: 2600, q: 1.2, dur: 1.1, peak: 0.16, a: 0.3 }); B({ type: 'lowpass', f: 500, f2: 120, dur: 0.9, peak: 0.4, a: 0.01, when: 1.25 }); },
    /* a ship's bell: struck in pairs */
    bells: function (n) { for (var i = 0; i < n; i++) { var w = Math.floor(i / 2) * 1.05 + (i % 2) * 0.36; [1, 2.01, 2.9].forEach(function (m, j) { T({ f: 780 * m, dur: 1.1 / (j + 1), peak: 0.1 / (j + 1), when: w }); }); } }
  };

  /* A door opens. The music answers in the room's own key, as it does after ER.exit (these rooms leave through
     ER.exitOk and ER.leave, because something is always said between the lock and the door). */
  X.solved = function (quiet) {
    var sung = false;
    try { sung = !!(ER.music && ER.music() && ER.track && ER.track.sting('solved', null, !!quiet)); } catch (e) {}
    if (!sung && !quiet) ER.sfx.ok();
  };
  X.mood = function (m) { try { if (ER.mood) ER.mood(m); } catch (e) {} };

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
  /* a subject word goes into the notebook the first time it is needed */
  X.learn = function () {
    for (var i = 0; i < arguments.length; i++) {
      var w = arguments[i], list = window.GLOSS || [], j;
      for (j = 0; j < list.length; j++) if (list[j][0].toLowerCase() === w.toLowerCase()) { ER.addWord(list[j][0], list[j][1]); break; }
    }
  };
  /* a paper from an earlier room must be in the box even when a room is opened directly (a lesson that starts half way) */
  X.need = function (id, title, html, cls, kind) {
    var c = ER.state().clues, i;
    for (i = 0; i < c.length; i++) if (c[i].id === id) return;
    ER.addClue(id, title, html, cls, kind, true);
  };
  /* somebody had to put you right: counted, and shown on the last page */
  X.slip = function () { ER.flag('slips', (ER.flag('slips') || 0) + 1); };
  X.slips = function () { return ER.flag('slips') || 0; };
  X.minutesPlayed = function () {
    var st = ER.state(), end = ER.flag('tEnd') || Date.now();
    return Math.max(1, Math.round((end - (st.t0 || end)) / 60000));
  };
  /* a number as people say it (0 to 99), so that a page can repeat a right answer without holding it */
  var ONES = ['nought', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'],
    TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  X.num = function (n) { n = Math.round(+n) || 0; return n < 20 ? ONES[n] : n > 99 ? String(n) : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : ''); };
  X.cap = function (s) { s = String(s); return s.charAt(0).toUpperCase() + s.slice(1); };
  /* so many minutes, as people say it: "three hours and twenty-five minutes" */
  X.span = function (m) {
    var h = Math.floor(m / 60), r = m % 60;
    return (h ? X.num(h) + (h === 1 ? ' hour' : ' hours') : '') + (h && r ? ' and ' : '') + (r || !h ? X.num(r) + (r === 1 ? ' minute' : ' minutes') : '');
  };
  /* words that are on the record (wireless messages, evidence given on oath) are always set in typewriter letters */
  X.said = function (words) { return '<span class="said">&ldquo;' + words + '&rdquo;</span>'; };

  /* ---------- the Morse code ---------- */
  var M = X.MORSE = { a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.', h: '....', i: '..', j: '.---', k: '-.-', l: '.-..', m: '--',
    n: '-.', o: '---', p: '.--.', q: '--.-', r: '.-.', s: '...', t: '-', u: '..-', v: '...-', w: '.--', x: '-..-', y: '-.--', z: '--..',
    1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.', 0: '-----' };
  var INV = {};
  Object.keys(M).forEach(function (k) { INV[M[k]] = k; });
  /* a run of pencil marks: . a dot, - a dash, ~ a mark lost in the crackle */
  X.mk = function (code, cls) {
    return '<span class="mk' + (cls ? ' ' + cls : '') + '">' + String(code).split('').map(function (c) {
      return c === '.' ? '<i class="d"></i>' : c === '-' ? '<i class="D"></i>' : '<i class="x"></i>';
    }).join('') + '</span>';
  };

  /* ---------- a key to press. o = {label, onSend(text), onLetter(text), lock() -> bool, max}
     A short press is a dot and a long one a dash; a pause finishes the letter. Both can be seen as well as heard:
     one glass tube fills while the key is down, the other while it is up. The space bar works the key too. ---------- */
  var KEY = '<svg viewBox="0 0 520 150" preserveAspectRatio="xMidYMid meet">' +
    '<rect x="14" y="104" width="492" height="34" rx="5" fill="#5a3a1f"/><rect x="14" y="104" width="492" height="7" rx="3" fill="#7b5230"/>' +
    '<path d="M40 138v6h60v-6M420 138v6h60v-6" fill="#3a2412"/>' +
    '<rect x="318" y="62" width="26" height="44" fill="#b08a35"/><circle cx="331" cy="60" r="11" fill="#d9b860"/><circle cx="331" cy="60" r="4" fill="#6f531a"/>' +
    '<rect x="96" y="92" width="34" height="14" rx="2" fill="#b08a35"/><rect x="430" y="86" width="26" height="20" rx="2" fill="#b08a35"/><circle cx="443" cy="84" r="7" fill="#d9b860"/>' +
    '<path d="M456 96q30 2 44 20" stroke="#1d1d1d" stroke-width="5" fill="none"/><path d="M130 100q-24 6-30 34" stroke="#7a1f16" stroke-width="5" fill="none"/>' +
    '<g class="ky-up"><path d="M70 50L470 64v10L70 62z" fill="#d9b860"/><path d="M70 50L470 64" stroke="#f3e2a4" stroke-width="2"/>' +
    '<rect x="100" y="60" width="10" height="24" fill="#8a6a26"/><ellipse cx="72" cy="40" rx="42" ry="13" fill="#17120f"/><ellipse cx="72" cy="36" rx="42" ry="13" fill="#2c2420"/><ellipse cx="62" cy="33" rx="18" ry="4" fill="#4a3f38"/><rect x="66" y="46" width="12" height="12" fill="#17120f"/></g>' +
    '<g class="ky-dn"><path d="M70 62L470 60v10L70 74z" fill="#d9b860"/><path d="M70 62L470 60" stroke="#f3e2a4" stroke-width="2"/>' +
    '<rect x="100" y="72" width="10" height="22" fill="#8a6a26"/><ellipse cx="72" cy="52" rx="42" ry="13" fill="#17120f"/><ellipse cx="72" cy="48" rx="42" ry="13" fill="#2c2420"/><ellipse cx="62" cy="45" rx="18" ry="4" fill="#4a3f38"/><rect x="66" y="58" width="12" height="12" fill="#17120f"/>' +
    '<path d="M94 96l-10-8M100 98l-2-12M108 96l8-9" stroke="#ffe9a0" stroke-width="2.5" stroke-linecap="round"/></g></svg>';
  X.DASH = 240; X.GAP = 800;
  X.keyer = function (o) {
    o = o || {};
    var box = ER.el('div', 'ky'), letters = [], cur = '', downAt = 0, gapT = 0, osc = null, og = null;
    box.innerHTML = '<div class="ky-strip"><div class="ky-marks"></div></div>' +
      '<div class="ky-glass"><div class="ky-g ky-len"><i></i><u></u><span>dot</span><span>dash</span></div>' +
      '<div class="ky-g ky-gap"><i></i><u></u><span>the same letter</span><span>the next letter</span></div></div>' +
      '<div class="ky-board">' + KEY + '</div>' +
      '<div class="ky-btns"><button type="button" class="btn ky-clear">Rub it out</button><button type="button" class="btn ky-send" disabled>' + (o.label || 'That is my message') + '</button></div>';
    var marks = box.querySelector('.ky-marks'), board = box.querySelector('.ky-board'), sendB = box.querySelector('.ky-send');
    function text() { return letters.map(function (l) { return l.ch; }).join(''); }
    function locked() { return !!(o.lock && o.lock()); }
    function paint() {
      marks.innerHTML = letters.map(function (l) {
        return '<span class="ky-l' + (l.ch === '?' ? ' bad' : '') + '">' + X.mk(l.m) + '<b>' + l.ch.toUpperCase() + '</b></span>';
      }).join('') + (cur ? '<span class="ky-l now">' + X.mk(cur) + '<b>&hellip;</b></span>' : '');
      box.setAttribute('data-text', text()); box.setAttribute('data-cur', cur);
      sendB.disabled = !letters.length && !cur;
    }
    function toneOn() {
      var c = ER.audio && ER.audio(), f;
      if (!c || !ER.sound() || !ER.out()) return;
      try {
        osc = c.createOscillator(); og = c.createGain(); f = c.createBiquadFilter();
        osc.type = 'square'; osc.frequency.value = o.pitch || 330; f.type = 'lowpass'; f.frequency.value = 1500;
        og.gain.value = 0.0001; og.gain.setTargetAtTime(0.045, c.currentTime, 0.004);
        osc.connect(f); f.connect(og); og.connect(ER.out()); osc.start();
      } catch (e) { osc = null; }
    }
    function toneOff() {
      var c = ER.audio && ER.audio(); if (!osc || !c) return;
      try { og.gain.setTargetAtTime(0.0001, c.currentTime, 0.006); osc.stop(c.currentTime + 0.06); } catch (e) {}
      osc = null;
    }
    function closeLetter() {
      clearTimeout(gapT); box.classList.remove('gap');
      if (!cur) return;
      letters.push({ m: cur, ch: INV[cur] || '?' }); cur = '';
      if (letters.length > (o.max || 8)) letters.shift();
      paint();
      if (o.onLetter) o.onLetter(text());
    }
    function press(e) {
      if (downAt || locked()) return;
      if (e) e.preventDefault();
      clearTimeout(gapT); box.classList.remove('gap');
      downAt = Date.now(); box.classList.add('down'); toneOn(); X.sfx.key();
    }
    function release() {
      if (!downAt) return;
      var d = Date.now() - downAt; downAt = 0;
      box.classList.remove('down'); toneOff();
      if (cur.length < 7) cur += d < X.DASH ? '.' : '-';
      paint();
      void box.offsetWidth; box.classList.add('gap');
      gapT = setTimeout(closeLetter, X.GAP);
    }
    board.addEventListener('pointerdown', function (e) { if (e.button) return; try { board.setPointerCapture(e.pointerId); } catch (x) {} press(e); });
    board.addEventListener('pointerup', release); board.addEventListener('pointercancel', release);
    function live() { return D.body.contains(box) && box.offsetParent !== null && !ER.$('.ov-top.on'); }
    D.addEventListener('keydown', function (e) { if (e.code !== 'Space' || !live()) return; e.preventDefault(); if (!e.repeat) press(); });
    D.addEventListener('keyup', function (e) { if (e.code !== 'Space' || !live()) return; e.preventDefault(); release(); });
    box.querySelector('.ky-clear').addEventListener('click', function () { if (locked()) return; clearTimeout(gapT); box.classList.remove('gap'); letters = []; cur = ''; paint(); X.sfx.pencil(); });
    sendB.addEventListener('click', function () { if (locked()) return; closeLetter(); if (o.onSend) o.onSend(text()); });
    box.kyClear = function () { clearTimeout(gapT); box.classList.remove('gap', 'down'); toneOff(); downAt = 0; letters = []; cur = ''; paint(); };
    box.kyText = text;
    paint();
    return box;
  };

  /* ---------- what the telephones say, written down as marks.
     tokens: 'm' (a letter or a figure), a run of . - ~ (marks as they were heard; ~ is one lost in the crackle),
     '/' (the gap between two words), '*' (a stretch too fast to copy). Each word comes out as one span.wd, which
     the page keeps on one line. Returns {html, plan, ms}: the marks carry
     the moment at which each of them is written, and plan is the same thing for the ear: [[ms, length, kind], ...] ---------- */
  X.copy = function (tokens, unit, t0) {
    var u = unit || 60, t = t0 || 0, html = '', plan = [], open = false;
    function shut() { if (open) { html += '</span>'; open = false; } }        /* a word is kept in one piece: a line never breaks inside it */
    tokens.forEach(function (tk) {
      var code, i, c, len, s = '';
      if (tk === '/') { shut(); t += 4 * u; return; }
      if (tk === '*') {
        shut();
        html += '<span class="fast" style="animation-delay:' + Math.round(t) + 'ms"><svg viewBox="0 0 120 22"><path d="M2 12q6-12 12 0t12 0 12 0 12 0 12 0 12 0 12 0 12 0 12 0 8-4" fill="none" stroke="#3b4a6b" stroke-width="2.2" stroke-linecap="round"/></svg><em>too quick for me</em></span>';
        for (i = 0; i < 16; i++) { len = (i * 7) % 3 ? 0.4 * u : 1.1 * u; plan.push([t, len, 2]); t += len + 0.4 * u; }
        t += 3 * u; return;
      }
      code = M[String(tk).toLowerCase()] || String(tk);
      for (i = 0; i < code.length; i++) {
        c = code.charAt(i); len = c === '-' ? 3 * u : u;
        s += '<i class="' + (c === '.' ? 'd' : c === '-' ? 'D' : 'x') + '" style="animation-delay:' + Math.round(t) + 'ms"></i>';
        plan.push([t, len, c === '~' ? 1 : 0]); t += len + u;
      }
      if (!open) { html += '<span class="wd">'; open = true; }
      html += '<span class="mk' + (code.length > 6 ? ' long' : '') + '">' + s + '</span>';
      t += 2 * u;
    });
    shut();
    return { html: html, plan: plan, ms: t };
  };
  /* play a plan through the telephones: a thin rough note for each mark, a crackle for a lost one. Returns a function that stops it. */
  X.hear = function (plan, pitch) {
    var c = ER.audio && ER.audio(), o, g, f, t0, end = 0;
    if (!c || !ER.sound() || !ER.out() || !plan.length) return function () {};
    try {
      o = c.createOscillator(); g = c.createGain(); f = c.createBiquadFilter();
      o.type = 'sawtooth'; o.frequency.value = pitch || 660; f.type = 'bandpass'; f.frequency.value = (pitch || 660) * 1.5; f.Q.value = 1.4;
      t0 = c.currentTime + 0.08; g.gain.setValueAtTime(0, t0);
      plan.forEach(function (p) {
        var a = t0 + p[0] / 1000, b = a + p[1] / 1000, lv = p[2] === 2 ? 0.022 : 0.05;
        end = Math.max(end, b);
        if (p[2] === 1) { B({ type: 'highpass', f: 2600, dur: Math.max(0.05, p[1] / 1000), peak: 0.07, when: p[0] / 1000 + 0.08 }); return; }
        g.gain.setValueAtTime(0, a); g.gain.linearRampToValueAtTime(lv, a + 0.004); g.gain.setValueAtTime(lv, Math.max(a + 0.005, b - 0.004)); g.gain.linearRampToValueAtTime(0, b);
      });
      o.connect(f); f.connect(g); g.connect(ER.out()); o.start(t0); o.stop(end + 0.1);
    } catch (e) { return function () {}; }
    return function () { try { g.gain.cancelScheduledValues(0); g.gain.setValueAtTime(0, c.currentTime); o.stop(c.currentTime + 0.02); } catch (e) {} };
  };

  /* ---------- papers that are needed in more than one room ---------- */
  var ABC = 'abcdefghijklmnopqrstuvwxyz1234567890';
  X.abc = function (keys) {
    return '<div class="abc">' + ABC.split('').map(function (ch) {
      return (keys ? '<button type="button" class="abc-k" data-k="' + ch + '">' : '<span class="abc-k">') + '<b>' + ch.toUpperCase() + '</b>' + X.mk(M[ch]) + (keys ? '</button>' : '</span>');
    }).join('') + '</div>';
  };
  X.CODE = '<h4>The Morse Code</h4><div class="cg"><div class="ct">' +
    '<p>Every letter and figure is made of two signs: a <b>dot</b>, which is one short touch of the key, and a <b>dash</b>.</p>' +
    '<svg viewBox="0 0 440 58"><g fill="#22231e"><rect x="6" y="6" width="11" height="10"/><rect x="50" y="6" width="33" height="10"/><rect x="204" y="6" width="33" height="10"/><rect x="248" y="6" width="33" height="10"/><rect x="322" y="6" width="33" height="10"/><rect x="388" y="6" width="33" height="10"/></g>' +
    '<g font-family="\'Courier Prime\',monospace" font-size="14" font-weight="700" fill="#8c2f24"><text x="6" y="36">dot</text><text x="50" y="36">dash = 3 dots</text><text x="242" y="52" text-anchor="middle">M</text><text x="371" y="52" text-anchor="middle">T, T</text></g>' +
    '<path d="M237 20v6h11v-6M355 20v6h33v-6" stroke="#8c2f24" stroke-width="1.5" fill="none"/><g font-family="\'Courier Prime\',monospace" font-size="13" fill="#8c2f24"><text x="242" y="39" text-anchor="middle">1</text><text x="371" y="39" text-anchor="middle">3</text></g></svg>' +
    '<p>A dash is as long as three dots. Inside a letter, leave the length of one dot between the signs. Between two letters, leave the length of a dash. Between two words, leave more. The gaps are part of the code: two dashes close together are M, and two dashes apart are T, T.</p>' +
    '<p><b>CALLING.</b> First the three letters of the station that is wanted, then DE (&ldquo;from&rdquo;), then the three letters of the station that is sending.</p>' +
    '<p><b>SHORT SIGNS.</b> RD: received. K: go on. OM: old man (one operator to another).</p>' +
    '<p><b>DISTRESS.</b> CQ means &ldquo;all stations&rdquo;. CQD, the Marconi call since 1904, means &ldquo;all stations: distress&rdquo;. Its letters do not stand for words. Since 1908 the call agreed between the nations is SOS, and it is sent as ONE sign with no gaps in it:<br>' + X.mk('...---...', 'long') + '</p>' +
    '</div><div class="ca">' + X.abc(false) + '</div></div>';
  X.CALLS = '<h4>Stations</h4><p>Every station has three letters of its own, and signs every call with them.</p>' +
    '<table><tr><td><!--nogloss-->DFT<!--/nogloss--></td><td>Frankfurt</td></tr><tr><td><!--nogloss-->MBC<!--/nogloss--></td><td>Baltic</td></tr><tr><td><!--nogloss-->MCE<!--/nogloss--></td><td>Cape Race (a station on shore, in Newfoundland)</td></tr>' +
    '<tr><td><!--nogloss-->MGN<!--/nogloss--></td><td>Virginian</td></tr><tr><td><!--nogloss-->MGY<!--/nogloss--></td><td>Titanic</td></tr><tr><td><!--nogloss-->MKC<!--/nogloss--></td><td>Olympic</td></tr>' +
    '<tr><td><!--nogloss-->MLQ<!--/nogloss--></td><td>Mount Temple</td></tr><tr><td><!--nogloss-->MPA<!--/nogloss--></td><td>Carpathia</td></tr></table>' +
    '<p class="hw">My own note: the Olympic and the Titanic are sisters, both White Star. The Titanic is the new one. This is her first voyage.</p>';
  X.ORDERS = '<h4>Captain&rsquo;s orders, 12.50 a.m.</h4><h5>taken down by Sinclair, Q.M., as they were given</h5>' +
    '<p><b>ENGINE ROOM.</b> Call out the other watch of stokers. All possible speed. Steam to be kept on the forward winches.</p>' +
    '<p><b>DECK.</b> Look-outs doubled. All boats to be cleared and swung out. All gangway doors to be opened. At each gangway: electric lights; a chair in a rope sling, for the sick and the hurt; rope ladders; canvas ash bags, for the children. Company&rsquo;s rockets at <span class="fig">2.45</span>, and every quarter of an hour after.</p>' +
    '<p><b>DOCTORS.</b> English doctor to the first-class dining room. Italian doctor to the second-class. Hungarian doctor to the third-class.</p>' +
    '<p><b>PURSER AND CHIEF STEWARD.</b> To receive the people at the gangways, and to get the names of all as soon as possible, to send by wireless. Coffee for all our own men. Soup, coffee and tea in every saloon. Blankets at the gangways, in the saloons and public rooms, and some for the boats. Our own steerage passengers to be kept together below, out of the third-class dining hall and off the deck. A steward in each alleyway: any of our own passengers who asks is to be sent back to his cabin, politely but firmly.</p>' +
    '<p><b>TO ALL.</b> Order, discipline and quietness.</p>';
  return X;
})();
