/* Seven Down - what every room of the story shares: the press clock, the unfinished grid and its clue sheet,
   a few sounds, and small helpers. Loaded after engine.js and wordkit.js. Nothing in here knows an answer:
   a square is only ever filled with a letter that the player has earned (see put and ensure). */
window.SEV = (function () {
  'use strict';
  var S = {}, D = document;
  var ROOMS = ['desk', 'library', 'composing', 'press', 'landing', 'edition'];
  function here() { return ROOMS.indexOf(ER.cfg.id); }

  /* ---------- the clock. The story begins at eleven and the first edition goes to press at two.
     Each room has its own stretch of the night; the hand follows the time really played, a wrong try costs a minute,
     and it never quite reaches the end of the stretch. ---------- */
  var clk = null, C = null, played = 0;
  function two(n) { return (n < 10 ? '0' : '') + n; }
  S.fmt = function (m) {                      /* minutes after eleven at night -> ['11.07', 'pm'] */
    var t = 23 * 60 + m, h = Math.floor(t / 60) % 24;
    return [(h === 23 ? 11 : h === 0 ? 12 : h) + '.' + two(t % 60), h === 23 ? 'pm' : 'am'];
  };
  S.minute = function () {
    if (!C) return 0;
    if (C.fixed != null) return C.fixed;
    return Math.min(C.to - 1, C.from + Math.floor(played / 24) + (ER.flag('l-' + ER.cfg.id) || 0));
  };
  S.time = function () { var f = S.fmt(S.minute()); return f[0] + ' ' + (f[1] === 'pm' ? 'at night' : 'in the morning'); };
  var walls = [];
  function draw() {
    if (!clk) return;
    var m = S.minute(), f = S.fmt(m);
    clk.querySelector('b').textContent = f[0]; clk.querySelector('i').textContent = f[1];
    clk.querySelector('small').textContent = m >= 60 ? 'Tue' : 'Mon';      /* midnight is sixty minutes after eleven */
    clk.classList.toggle('late', C.fixed == null && m >= 150);
    walls.forEach(function (w) {
      w.h.setAttribute('transform', 'rotate(' + (330 + m / 2).toFixed(1) + ' ' + w.cx + ' ' + w.cy + ')');
      w.m.setAttribute('transform', 'rotate(' + ((m % 60) * 6) + ' ' + w.cx + ' ' + w.cy + ')');
    });
  }
  /* a clock drawn on a wall of the scene: give it the two hands (lines drawn pointing up) and its centre */
  S.wall = function (hourSel, minSel, cx, cy) {
    var h = D.querySelector(hourSel), m = D.querySelector(minSel);
    if (h && m) { walls.push({ h: h, m: m, cx: cx, cy: cy }); draw(); }
  };
  S.clock = function (o) {
    C = o; played = ER.flag('p-' + ER.cfg.id) || 0;
    clk = ER.el('div', 'sv-clk', '<span><small>' + (o.day || 'Mon') + '</small><b></b><i></i></span><button type="button" class="sv-gbtn" title="The unfinished grid"><u></u>Grid</button>');
    D.body.appendChild(clk);
    clk.querySelector('.sv-gbtn').addEventListener('click', function () {
      if (D.querySelector('.tc') || D.querySelector('.capshade.on')) return;
      if (D.querySelector('.ov.on')) S.peek(); else if (S.onGrid) S.onGrid(); else S.peek();
    });
    draw();
    if (o.fixed != null) return;
    setInterval(function () {
      if (D.hidden || C.stop) return;
      played++; if (played % 5 === 0) ER.flag('p-' + ER.cfg.id, played);
      draw();
    }, 1000);
    window.addEventListener('pagehide', function () { ER.flag('p-' + ER.cfg.id, played); });
  };
  S.stopClock = function () { if (C) { C.stop = true; ER.flag('p-' + ER.cfg.id, played); } };
  S.setClock = function (day, m) { if (!clk) return; C.fixed = m; clk.querySelector('small').textContent = day; hit(); };
  function hit() { if (!clk) return; clk.classList.remove('hit'); void clk.offsetWidth; clk.classList.add('hit'); draw(); }
  /* a wrong try costs a minute */
  S.slip = function (n) {
    if (!C || C.fixed != null) return;
    ER.flag('l-' + ER.cfg.id, (ER.flag('l-' + ER.cfg.id) || 0) + (n || 1));
    ER.flag('slips', (ER.flag('slips') || 0) + 1);
    hit();
  };
  S.minutesPlayed = function () {
    var st = ER.state(), end = ER.flag('tEnd') || Date.now();
    return Math.max(1, Math.round((end - (st.t0 || end)) / 60000));
  };

  /* ---------- sounds (through the engine, so the sound button switches them) ---------- */
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };
  S.sfx = {
    phone: function () { [0, 0.4, 1.6, 2].forEach(function (w) { T({ type: 'square', f: 400, dur: 0.34, peak: 0.035, when: w }); T({ type: 'square', f: 450, dur: 0.34, peak: 0.035, when: w }); }); },
    hangup: function () { B({ dur: 0.04, f: 1800, q: 2, peak: 0.3 }); T({ f: 130, f2: 80, dur: 0.12, peak: 0.3, when: 0.03 }); },
    pencil: function () { B({ type: 'highpass', f: 3600, dur: 0.2, peak: 0.07, a: 0.03 }); },
    ink: function () { T({ f: 120, f2: 60, dur: 0.16, peak: 0.45 }); B({ type: 'lowpass', f: 900, dur: 0.06, peak: 0.3 }); },
    sort: function () { B({ dur: 0.03, f: 2400, q: 4, peak: 0.26 }); T({ type: 'triangle', f: 520, f2: 380, dur: 0.05, peak: 0.08 }); },
    slug: function () { B({ dur: 0.05, f: 1400, q: 2, peak: 0.3 }); B({ dur: 0.04, f: 900, q: 2, peak: 0.24, when: 0.08 }); T({ f: 150, f2: 90, dur: 0.14, peak: 0.26, when: 0.08 }); },
    proof: function () { B({ type: 'lowpass', f: 500, f2: 240, dur: 0.5, peak: 0.26, a: 0.08 }); T({ f: 90, f2: 60, dur: 0.3, peak: 0.3, when: 0.42 }); },
    gate: function () { [0, 0.07, 0.14, 0.21, 0.28].forEach(function (w, i) { B({ dur: 0.035, f: 2600 - i * 200, q: 4, peak: 0.2, when: w }); }); T({ f: 110, f2: 70, dur: 0.22, peak: 0.4, when: 0.34 }); },
    steps: function (n, v) { for (var i = 0; i < (n || 5); i++) { T({ f: 90, f2: 55, dur: 0.12, peak: 0.26 * (v || 1) * (1 - i * 0.1), when: i * 0.46 }); B({ type: 'lowpass', f: 600, dur: 0.07, peak: 0.14 * (v || 1) * (1 - i * 0.1), when: i * 0.46 }); } },
    keys: function (n) { for (var i = 0; i < (n || 6); i++) B({ dur: 0.025, f: 2800 + (i % 3) * 300, q: 5, peak: 0.1, when: i * 0.11 + (i % 2) * 0.03 }); },
    hook: function () { B({ dur: 0.03, f: 3200, q: 5, peak: 0.2 }); T({ f: 240, f2: 180, dur: 0.1, peak: 0.16, when: 0.03 }); },
    rumble: function (dur) { B({ type: 'lowpass', f: 140, dur: dur || 2.4, peak: 0.5, a: 0.5 }); T({ type: 'sawtooth', f: 44, f2: 58, dur: dur || 2.4, peak: 0.1, a: 0.5 }); },
    whisper: function () { B({ type: 'bandpass', f: 2200, q: 0.7, dur: 0.5, peak: 0.035, a: 0.1 }); }
  };
  /* A door opens. The music answers in the room's own key, as it does after ER.exit (these rooms leave through
     ER.exitOk and ER.leave, because something is always read between the lock and the door); without music, three plain notes. */
  S.solved = function (quiet) {
    var sung = false;
    try { sung = !!(ER.music && ER.music() && ER.track && ER.track.sting('solved', null, !!quiet)); } catch (e) {}
    if (!sung && !quiet) ER.sfx.ok();
  };
  S.mood = function (m) { try { if (ER.mood) ER.mood(m); } catch (e) {} };

  /* a name tag left over from the last click must not sit on top of whatever is opened next */
  var open0 = ER.open;
  ER.open = function (cls, node, onClose, o) {
    ER.$$('.wtag').forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });
    return open0(cls, node, onClose, o);
  };
  /* a thing in the scene that has a name and something to say */
  S.thing = function (sel, word, line, busy) {
    ER.$$(sel).forEach(function (n) {
      n.addEventListener('click', function (e) {
        if (busy && busy()) return;
        if (word) ER.wordAt(e.clientX, e.clientY, word);
        if (line) ER.say(typeof line === 'function' ? line() : line);
      });
    });
  };
  /* a note of your own in the notebook */
  S.mine = function (id, title, html, quiet) { return ER.addClue(id, title, '<h4>' + title + '</h4>' + html, 'mine', 'Your notes', quiet); };
  S.hand = function (t) { return '<span class="sv-hand">' + t + '</span>'; };

  /* ---------- the grid: eleven by eleven, drawn by the setter and half finished ---------- */
  var PAT = ['.......#...', '#.#.#.#.#.#', '#.#.......#', '#.#.#.#.#.#', '#........##', '###.###.###', '##........#', '#.#.#.#.#.#', '#.......#.#', '#.#.#.#.#.#', '...#.......'];
  var ENT = {}, NUM = {}, ORDER = [];
  (function () {
    var n = 0, r, c, a, d;
    function w(r, c) { return r >= 0 && r < 11 && c >= 0 && c < 11 && PAT[r].charAt(c) === '.'; }
    function add(key, num, dir, r, c, dr, dc) {
      var cells = [];
      while (w(r, c)) { cells.push(r + ',' + c); r += dr; c += dc; }
      ENT[key] = { key: key, n: num, dir: dir, cells: cells }; ORDER.push(key);
    }
    for (r = 0; r < 11; r++) for (c = 0; c < 11; c++) {
      if (!w(r, c)) continue;
      a = !w(r, c - 1) && w(r, c + 1); d = !w(r - 1, c) && w(r + 1, c);
      if (!a && !d) continue;
      n++; NUM[r + ',' + c] = n;
      if (a) add('a' + n, n, 'A', r, c, 0, 1);
      if (d) add('d' + n, n, 'D', r, c, 1, 0);
    }
  })();
  S.entries = ENT; S.pat = PAT; S.nums = NUM;
  /* The clue sheet. `room` is where a clue can be done; until the player is there, the sheet says only where to go.
     star: one of the six that the setter has used before. h: what he has added in blue pencil. */
  var CLUES = {
    a1:  { room: 'composing', loc: 'In the composing room', t: 'To change a document so that it tells a lie.' },
    a5:  { room: 'desk', star: 1, t: 'A solemn promise, as at a wedding.', h: 'My first Editor made one about me, and kept it.' },
    a8:  { room: 'composing', loc: 'In the composing room', t: 'A person who lives alone and keeps away from everybody.', h: 'It is what the whole town thinks I am.' },
    a9:  { room: 'composing', loc: 'In the composing room', t: 'Somebody who pretends to be somebody else.' },
    a10: { room: 'composing', star: 1, loc: 'In the composing room', t: 'A gap in the rules, just wide enough for a dishonest person to walk through.' },
    a14: { room: 'desk', t: 'Not graceful; or uncomfortable, like a silence in a lift.' },
    a15: { room: 'desk', t: 'What most people write with; and the kind of name I write under.' },
    a16: { room: 'library', loc: 'In the library: 1959', t: 'Things you have only been told, and cannot prove.' },
    d2:  { room: 'library', star: 1, loc: 'In the library: 1961', t: 'Proof that you were somewhere else at the time.' },
    d3:  { room: 'library', loc: 'In the library', t: 'Books for pasting cuttings into. Miss Abbas has forty of them on the top shelf.' },
    d4:  { room: 'desk', t: 'Things that are known to be true. A good reporter checks them twice.' },
    d6:  { room: 'library', star: 1, loc: 'In the library: 1936', t: 'A sign of what is going to happen.' },
    d7:  { room: 'press', len: '3, 2, 5', h: 'No clue. It has never needed one.' },
    d11: { room: 'press', loc: 'In the press hall', t: 'Read the five famous heads from the top: what every page must become before it can be printed.' },
    d12: { room: 'library', star: 1, loc: 'In the library: 1936, the other one', t: 'More than is usual; or a late edition, printed when the news will not wait.' },
    d13: { room: 'desk', star: 1, t: 'To look at something for a long time without looking away.' }
  };
  S.clues = CLUES;
  var LEARN = { d7: 'out of order' };

  function got() { return ER.flag('g') || {}; }
  S.word = function (key) { return got()[key] || null; };
  S.letters = function () {
    var m = {}, g = got(), k;
    for (k in g) if (ENT[k]) ENT[k].cells.forEach(function (c, i) { m[c] = g[k].charAt(i); });
    return m;
  };
  S.count = function (keys) { var g = got(); return (keys || ORDER).filter(function (k) { return g[k]; }).length; };
  /* an answer the player has earned goes into the grid, and into the notebook as a word */
  S.put = function (key, word, quiet) {
    var g = got();
    if (g[key] || !ENT[key]) return false;
    g[key] = String(word).toLowerCase(); ER.flag('g', g);
    WK.learn(LEARN[key] || g[key], !!quiet);
    var b = D.querySelector('.sv-gbtn'); if (b && !quiet) { b.classList.remove('ping'); void b.offsetWidth; b.classList.add('ping'); }
    return true;
  };
  /* A teacher may open a later room directly. The squares of the earlier rooms are then filled in from this room's own
     checks, a letter at a time, so that the grid is whole (the room's case.json lists those words for this reason). */
  S.ensure = function (keys) {
    keys.forEach(function (k) {
      if (got()[k]) return;
      var s = '', i, j, ch, AB = 'abcdefghijklmnopqrstuvwxyz';
      for (i = 0; i < ENT[k].cells.length; i++) {
        ch = '';
        for (j = 0; j < 26 && !ch; j++) if (WK.at(k, i, AB.charAt(j))) ch = AB.charAt(j);
        if (!ch) return;
        s += ch;
      }
      S.put(k, s, true);
    });
  };
  /* the letters of an entry that are known from the words crossing it: 'i?p?s???' */
  S.pattern = function (key) { var m = S.letters(); return ENT[key].cells.map(function (c) { return m[c] || '?'; }).join(''); };

  function gridEl(mini, hl) {
    var g = ER.el('div', 'sv-grid' + (mini ? ' sv-mini' : '')), m = S.letters(), r, c, k, n, cells = {};
    for (r = 0; r < 11; r++) for (c = 0; c < 11; c++) {
      k = r + ',' + c;
      if (PAT[r].charAt(c) !== '.') { g.appendChild(ER.el('div', 'sv-c sv-x')); continue; }
      n = ER.el('div', 'sv-c' + (hl && ENT[hl].cells.indexOf(k) >= 0 ? ' hl' : ''), (NUM[k] ? '<i>' + NUM[k] + '</i>' : '') + '<b></b>');
      n.setAttribute('data-rc', k); n.lastChild.textContent = m[k] || '';
      cells[k] = n; g.appendChild(n);
    }
    g.cells = cells;
    return g;
  }
  /* a small copy of the grid for the side of a puzzle, with one entry marked */
  S.mini = function (hl) { return gridEl(true, hl); };

  function lenOf(k) { return CLUES[k].len || String(ENT[k].cells.length); }
  function clueHtml(k, type) {
    var c = CLUES[k], w = S.word(k), far = ROOMS.indexOf(c.room) > here(), s = '<b>' + ENT[k].n + '</b>' + (w ? '<u>' + (LEARN[k] || w).toUpperCase() + '</u> ' : '') + (c.star ? '<span class="sv-star">&#10033;</span> ' : '');
    if (far && !w && c.loc) s += '<span class="sv-hand">' + c.loc + '</span>';
    else s += (c.t ? ER.gloss(c.t) + ' ' : '') + (c.h ? '<span class="sv-hand">' + ER.gloss(c.h) + '</span> ' : '');
    s += ' <em>(' + lenOf(k) + ')</em>';
    return s;                                 /* a clue that is done takes one line: its answer first, and a click opens the rest */
  }
  /* The sheet: the grid on the left, the clues on the right.
     o = { type: [keys that can be filled in from here], peek: true (look only), sel: key to begin with, msg: first line,
           onRight(key, word), onWrong(key, word) -> what to say, onSelect(key), shut(key) -> what to say when a clue cannot be done here } */
  var live = null;
  S.sheet = function (o) {
    o = o || {};
    var type = o.peek ? [] : (o.type || []), box = ER.el('div', 'sv-g'), sheet = ER.el('div', 'sv-sheet'), cl = ER.el('div', 'sv-clues'), grid = gridEl(false), cells = grid.cells;
    var cur = null, at = 0, pencil = {}, busy = false, msgEl, lis = {}, api;
    sheet.innerHTML = '<h5>THE CLARION &middot; No. 10,000 <span>unfinished</span></h5>';
    sheet.appendChild(grid);
    sheet.appendChild(ER.el('p', 'sv-note', 'Finish it and you can find me. Tell nobody upstairs.<br><span class="sv-star">&#10033;</span> Six old friends. I do not repeat myself. Ask yourself why I have.'));
    function can(k) { return type.indexOf(k) >= 0 && !S.word(k); }
    function list(dir, title) {
      var ol = ER.el('ol');
      cl.appendChild(ER.el('h6', '', title));
      ORDER.forEach(function (k) {
        if (ENT[k].dir !== dir) return;
        var li = ER.el('li'); li.setAttribute('data-k', k); lis[k] = li; ol.appendChild(li);
        li.addEventListener('click', function () { pick(k); });
      });
      cl.appendChild(ol);
    }
    list('A', 'Across'); list('D', 'Down');
    msgEl = ER.el('p', 'sv-msg'); cl.appendChild(msgEl);
    box.appendChild(sheet); box.appendChild(cl);
    function msg(t) { msgEl.innerHTML = ER.gloss(t || ''); }
    function val(c, m) { return m[c] || pencil[c] || ''; }
    function paint() {
      var m = S.letters(), cs = cur ? ENT[cur].cells : [];
      Object.keys(cells).forEach(function (c) {
        var n = cells[c];
        if (m[c]) delete pencil[c];
        n.lastChild.textContent = val(c, m);
        n.classList.toggle('pen', !m[c] && !!pencil[c]);
        n.classList.toggle('in', cs.indexOf(c) >= 0);
        n.classList.toggle('at', !!cur && cs[at] === c);
        n.classList.toggle('can', ORDER.some(function (k) { return can(k) && ENT[k].cells.indexOf(c) >= 0; }));
      });
      ORDER.forEach(function (k) {
        lis[k].className = S.word(k) ? 'done' : can(k) ? 'open' : 'shut';
        if (k === cur) lis[k].classList.add('cur');
        lis[k].innerHTML = clueHtml(k);
      });
      box.setAttribute('data-cur', cur || '');
      var all = ORDER.every(function (k) { return S.word(k); }), stamp = sheet.querySelector('h5 span');
      stamp.textContent = all ? 'finished' : 'unfinished'; stamp.classList.toggle('fin', all);
    }
    function freeIdx(from, dir, emptyOnly) {
      var cs = ENT[cur].cells, m = S.letters(), i;
      for (i = from; i >= 0 && i < cs.length; i += dir) if (!m[cs[i]] && (!emptyOnly || !pencil[cs[i]])) return i;
      return -1;
    }
    function select(k, cell) {
      if (!can(k)) return false;
      cur = k;
      var i = cell ? ENT[k].cells.indexOf(cell) : -1;
      at = i >= 0 ? i : 0;                    /* the cursor begins on the first square, even if that one is in ink already */
      paint();
      if (o.onSelect) o.onSelect(k);
      return true;
    }
    function pick(k) {
      if (busy) return;
      if (S.word(k)) { lis[k].classList.toggle('full'); return; }
      if (!select(k)) msg(o.shut ? o.shut(k) : 'That one cannot be done from here.');
      else msg('');
    }
    function full() { var m = S.letters(); return ENT[cur].cells.every(function (c) { return val(c, m); }); }
    function check() {
      if (!cur || busy || !full()) return;
      var k = cur, m = S.letters(), cs = ENT[k].cells, word = cs.map(function (c) { return val(c, m); }).join('');
      if (WK.is(k, word)) {
        S.put(k, word); S.sfx.ink();
        cs.forEach(function (c) { delete pencil[c]; cells[c].classList.remove('new'); void cells[c].offsetWidth; cells[c].classList.add('new'); });
        cur = null; paint();
        if (o.onRight) o.onRight(k, word, api);
        if (!cur) ORDER.some(function (x) { return can(x) && select(x); });
        return;
      }
      busy = true; ER.sfx.no();
      cs.forEach(function (c) { ER.shake(cells[c]); });
      setTimeout(function () {
        cs.forEach(function (c) { delete pencil[c]; });
        busy = false; at = 0; paint();
        S.slip(1);
        msg((o.onWrong && o.onWrong(k, word)) || 'You rub it out. The clue says exactly what it means: read it once more, slowly.');
      }, 650);
    }
    /* The cursor walks along every square of the entry. A square that is already in ink can be typed over (if it is
       the same letter, nothing happens and the cursor moves on) or simply left out: both ways of typing a word work. */
    function press(k) {
      if (busy || !cur) return false;
      var cs = ENT[cur].cells, m = S.letters(), i;
      if (k === 'back') {
        if (!m[cs[at]] && pencil[cs[at]]) delete pencil[cs[at]];
        else { i = freeIdx(at - 1, -1, false); if (i >= 0) { at = i; delete pencil[cs[at]]; } }
        paint(); return;
      }
      if (k === 'left' || k === 'right') { i = at + (k === 'left' ? -1 : 1); if (i >= 0 && i < cs.length) at = i; paint(); return; }
      if (k === 'enter') { check(); return; }
      if (k.length !== 1) return false;
      if (m[cs[at]]) {
        if (m[cs[at]] === k) { if (at < cs.length - 1) at++; paint(); return; }
        i = freeIdx(at, 1, false); if (i < 0) return; at = i;
      }
      pencil[cs[at]] = k; S.sfx.pencil();
      if (at < cs.length - 1) at++;
      paint();
      if (full()) setTimeout(check, 320);
    }
    grid.addEventListener('click', function (e) {
      var n = e.target.closest ? e.target.closest('.sv-c') : null, c = n && n.getAttribute('data-rc'), ks;
      if (!c || busy) return;
      ks = ORDER.filter(function (k) { return can(k) && ENT[k].cells.indexOf(c) >= 0; });
      if (!ks.length) return;
      select(ks.length > 1 && ks[0] === cur ? ks[1] : ks[0], c); msg('');
    });
    if (!o.peek) WK.keys(box, press);
    paint();
    msg(o.msg || '');
    if (o.sel) select(o.sel); else if (!o.peek) ORDER.some(function (k) { return can(k) && select(k); });
    api = { el: box, select: select, cur: function () { return cur; }, msg: msg, paint: paint, type: function (list) { type = list; paint(); } };
    return api;
  };
  S.cur = function () { return live ? live.cur() : null; };
  S.live = function () { return live; };
  /* open the sheet as a puzzle (letters can be typed) */
  S.openSheet = function (o) {
    var sh = S.sheet(o); live = sh;
    ER.open('ov-lock', sh.el, function () { live = null; if (o && o.onClose) o.onClose(); });
    return sh;
  };
  /* only look at it: on top of whatever else is open */
  S.peek = function () {
    var sh = S.sheet({ peek: true, msg: 'The squares you have earned are in ink. The rest wait for their clues.' });
    ER.open('ov-sheet', sh.el, null, { top: true });
  };
  /* ---------- the solutions book: the last six puzzles, pasted in by the junior. Every word in it has been printed
     in the Clarion already; it is a haystack, and the page that shows it never says which straws matter. ---------- */
  var SOLS = [
    ['9,994', 'Tuesday', '1 Harvest, 5 Tact, 8 Reluctant, 9 Ivory, 11 Echo, 12 Thimble, 15 Lantern, 17 Orchard', '2 Riddle, 3 Envy, 4 Tamper, 6 Attic, 7 Omen, 10 Yonder, 13 Marrow, 14 Hinge, 16 Nib'],
    ['9,995', 'Wednesday', '1 Culprit, 5 Dusk, 8 Lullaby, 10 Anchor, 11 Seldom, 14 Pigeon, 17 Quarrel, 18 Kiln', '2 Umbrella, 3 Plank, 4 Idle, 6 Kettle, 7 Vow, 9 Ransom, 12 Dagger, 13 Forge, 15 Glue, 16 Oar'],
    ['9,996', 'Thursday', '1 Anonymous, 6 Brisk, 8 Thistle, 9 Gull, 11 Eavesdrop, 13 Mimic, 15 Cobweb, 16 Stern', '2 Nettle, 3 Yeast, 4 Oath, 5 Shrug, 7 Alibi, 10 Lodger, 12 Dwell, 14 Inch'],
    ['9,997', 'Friday', '1 Genuine, 5 Moth, 8 Parlour, 10 Whisk, 12 Trespass, 14 Raven, 16 Bargain, 17 Yawn', '2 Ember, 3 Urn, 4 Niece, 6 Hoax, 7 Gaze, 9 Rascal, 11 Shiver, 13 Plea, 15 Vex'],
    ['9,998', 'Saturday', '1 Lighthouse, 6 Fib, 8 Sparrow, 9 Deceive, 12 Thrift, 14 Ounce, 15 Wander, 17 Mast', '2 Granite, 3 Tweed, 4 Outwit, 5 Elbow, 7 Extra, 10 Canoe, 11 Vanish, 13 Fret, 16 Dew'],
    ['9,999', 'Monday', '1 Pilgrim, 5 Sly, 8 Rumour, 9 Nudge, 11 Verify, 13 Cloak, 15 Kindle, 16 Bluff', '2 Inkwell, 3 Grudge, 4 Moor, 6 Lurk, 7 Loophole, 10 Decoy, 12 Fable, 14 Oak']
  ];
  S.sols = function () {
    return '<!--nogloss--><div class="sv-sols">' + SOLS.map(function (s) {
      return '<div class="sv-sol"><h6><span>No. ' + s[0] + '</span><span>' + s[1] + '</span></h6><p><b>Across</b> ' + s[2] + '.</p><p><b>Down</b> ' + s[3] + '.</p></div>';
    }).join('') + '</div><!--/nogloss-->';
  };
  S.solbook = function () { return '<h4>Solutions: the last six, pasted in by you</h4>' + S.sols(); };

  /* the sheet as it is kept in the notebook: the setter's line, and where each clue is */
  S.keep = function () {
    function line(k) { var c = CLUES[k]; return '<p><b>' + ENT[k].n + '</b> ' + (c.star ? '&#10033; ' : '') + (c.loc ? S.hand(c.loc) : (c.t ? c.t + ' ' : '') + (c.h ? S.hand(c.h) : '')) + ' (' + lenOf(k) + ')</p>'; }
    ER.addClue('sheet', 'The unfinished grid', '<h4>THE CLARION &middot; No. 10,000</h4><p>' + S.hand('Finish it and you can find me. Tell nobody upstairs.') + '</p>' +
      '<p>&#10033; ' + S.hand('Six old friends. I do not repeat myself. Ask yourself why I have.') + '</p>' +
      '<h5>ACROSS</h5>' + ORDER.filter(function (k) { return ENT[k].dir === 'A'; }).map(line).join('') +
      '<h5>DOWN</h5>' + ORDER.filter(function (k) { return ENT[k].dir === 'D'; }).map(line).join(''), 'sheet', 'From Sphinx');
  };
  return S;
})();
