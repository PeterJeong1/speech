/* Lots and Lots of People - what every room of the story shares: a few sounds, the typed transcript,
   the time stamp, and small helpers. Loaded after engine.js. Nothing in here knows an answer. */
window.AP = (function () {
  'use strict';
  var X = {}, D = document;
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so the sound button switches them) ---------- */
  X.sfx = {
    /* the speaker on the shelf: the short beep that opened every call from Houston, and a breath of static */
    squawk: function () { T({ f: 2525, dur: 0.24, peak: 0.022, a: 0.01 }); B({ type: 'bandpass', f: 1900, q: 0.8, dur: 0.6, peak: 0.045, a: 0.05, when: 0.2 }); },
    over: function () { T({ f: 2475, dur: 0.24, peak: 0.02, a: 0.01 }); },
    stamp: function () { T({ f: 120, f2: 52, dur: 0.2, peak: 0.6 }); B({ type: 'lowpass', f: 900, dur: 0.07, peak: 0.4 }); },
    wheel: function () { B({ dur: 0.03, f: 3200, q: 5, peak: 0.18 }); T({ f: 320, f2: 240, dur: 0.06, peak: 0.1, when: 0.02 }); },
    tube: function () { B({ type: 'bandpass', f: 500, f2: 1600, q: 1.5, dur: 0.7, peak: 0.16, a: 0.2 }); T({ f: 110, f2: 60, dur: 0.22, peak: 0.45, when: 0.72 }); },
    key: function () { B({ dur: 0.03, f: 2400, q: 3, peak: 0.22 }); T({ f: 210, f2: 150, dur: 0.05, peak: 0.12 }); },
    print: function () { for (var i = 0; i < 5; i++) B({ dur: 0.03, f: 1700 + i * 90, q: 3, peak: 0.16, when: i * 0.05 }); T({ f: 90, f2: 70, dur: 0.3, peak: 0.12 }); },
    tear: function () { B({ type: 'highpass', f: 2200, f2: 5200, dur: 0.18, peak: 0.13, a: 0.02 }); },
    pin: function () { B({ dur: 0.025, f: 4200, q: 4, peak: 0.2 }); T({ f: 190, dur: 0.05, peak: 0.1 }); },
    tape: function () { B({ type: 'highpass', f: 1800, f2: 4200, dur: 0.3, peak: 0.12, a: 0.03 }); },
    snip: function () { B({ dur: 0.03, f: 5200, q: 4, peak: 0.2 }); B({ dur: 0.03, f: 3800, q: 4, peak: 0.18, when: 0.09 }); },
    phone: function () { [0, 0.09, 0.18, 0.27].forEach(function (w) { T({ f: 1250, dur: 0.07, peak: 0.05, when: w }); T({ f: 1580, dur: 0.07, peak: 0.04, when: w }); }); },
    chalk: function () { B({ type: 'highpass', f: 3400, dur: 0.2, peak: 0.07, a: 0.04 }); },
    cheer: function () { B({ type: 'bandpass', f: 900, f2: 1500, q: 0.5, dur: 3.2, peak: 0.2, a: 0.5 }); B({ type: 'bandpass', f: 2200, q: 0.7, dur: 2.6, peak: 0.08, a: 0.6, when: 0.2 }); }
  };

  /* A door opens. The music answers in the room's own key, as it does after ER.exit (these rooms leave through
     ER.exitOk and ER.leave, because something is always heard between the lock and the door). */
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
  /* a piece of paper handed back: counted, and shown on the last page */
  X.slip = function () { ER.flag('slips', (ER.flag('slips') || 0) + 1); };
  X.slips = function () { return ER.flag('slips') || 0; };
  X.minutesPlayed = function () {
    var st = ER.state(), end = ER.flag('tEnd') || Date.now();
    return Math.max(1, Math.round((end - (st.t0 || end)) / 60000));
  };

  /* words that really went between the spacecraft and the ground are always set in typewriter letters */
  X.said = function (who, words) { return (who ? '<em>' + who + ':</em> ' : '') + '<span class="said">&ldquo;' + words + '&rdquo;</span>'; };

  /* ---------- the air-to-ground, typed. rows: [time, who, words, id] or null for a place where lines are cut out ---------- */
  X.rows = function (rows, pick) {
    return '<table class="ts">' + rows.map(function (r) {
      if (!r) return '<tr class="cut"><td colspan="3">&nbsp;</td></tr>';
      return '<tr' + (pick && r[3] ? ' class="tl" data-id="' + r[3] + '"' : '') + '><td class="t"><!--nogloss-->' + r[0] + '<!--/nogloss--></td><td class="s"><!--nogloss-->' + r[1] + '<!--/nogloss--></td><td class="x">' + r[2] + '</td></tr>';
    }).join('') + '</table>';
  };
  X.page = function (no, note, rows) {
    return '<h4><span>APOLLO 13 AIR-TO-GROUND VOICE</span><span>Page ' + no + '</span></h4>' + (note ? '<h5>' + note + '</h5>' : '') + X.rows(rows);
  };

  /* ---------- the time stamp: a day, and four wheels. o.day = where the day wheel starts; o.onStamp(key, dayIndex, hh, mm) ---------- */
  var DAYS = ['SAT 11', 'SUN 12', 'MON 13', 'TUE 14', 'WED 15', 'THU 16', 'FRI 17'], DKEY = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'], LIM = [3, 10, 6, 10];
  X.days = DAYS;
  X.stamp = function (o) {
    var box = ER.el('div', 'stp'), day = o.day || 0, d = [0, 0, 0, 0], s = '<h6>Time stamp &middot; Houston time</h6><div class="stp-wheels">';
    function wheel(i, cls) { return '<div class="stp-w' + (cls ? ' ' + cls : '') + '" data-i="' + i + '"><button type="button" class="stp-up" title="up">&#9650;</button><b></b><button type="button" class="stp-dn" title="down">&#9660;</button></div>'; }
    s += wheel('d', 'day') + wheel(0) + wheel(1) + '<span class="stp-colon">:</span>' + wheel(2) + wheel(3) + '</div><button type="button" class="btn stp-go">' + (o.label || 'Stamp it') + '</button>';
    box.innerHTML = s;
    function draw() {
      ER.$$('.stp-w', box).forEach(function (w) { var i = w.getAttribute('data-i'); w.children[1].textContent = i === 'd' ? DAYS[day] : d[+i]; });
      box.setAttribute('data-v', X.stampKey(day, d));
    }
    box.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null, w, i, up; if (!b || (o.lock && o.lock())) return;
      if (b.classList.contains('stp-go')) { o.onStamp(X.stampKey(day, d), day, d[0] * 10 + d[1], d[2] * 10 + d[3]); return; }
      w = b.parentNode; i = w.getAttribute('data-i'); up = b.classList.contains('stp-up') ? 1 : -1;
      if (i === 'd') day = (day + up + DAYS.length) % DAYS.length; else d[+i] = (d[+i] + up + LIM[+i]) % LIM[+i];
      X.sfx.wheel(); draw();
    });
    draw();
    return box;
  };
  X.stampKey = function (day, d) { return DKEY[day] + '-' + d.join(''); };
  X.ink = function (day, hh, mm) { function two(n) { return (n < 10 ? '0' : '') + n; } return DAYS[day].replace(' ', ' ') + ' APR 1970 ' + two(hh) + ':' + two(mm); };

  /* a name tag left over from the last click must not sit on top of whatever is opened next */
  var open0 = ER.open;
  ER.open = function (cls, node, onClose, o) {
    ER.$$('.wtag').forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
    return open0(cls, node, onClose, o);
  };
  return X;
})();
