/* KEYHOLE word kit - letter and word games on top of engine.js (ER).

   The answers stay in case.json. A room lists them under "words" (and "groups"), and build.py turns
   each one into checks (see spell_tags in build.py), so nothing here ever holds an answer: a widget
   only learns a letter when the player has earned it.

       "words":  {"w1": "jeweller"}                 WK.is('w1', guess)  WK.at('w1', 0, 'j')  WK.count('w1', 'l')  WK.len('w1')
       "groups": {"g1": ["oak", "elm", "ash"]}      used by WK.groups

   Every widget draws plain boxes with wk-* classes into a node that the room gives it, and reports
   through callbacks. wordkit.css gives the shapes; the room gives the look (a coin slot, a rain-washed
   note, a row of studio lights ...). Letters come from the real keyboard, whatever input language is
   switched on, and from an on-screen keyboard if the room asks for one. */
(function () {
'use strict';
var WK = window.WK = {}, D = document;
function el(t, c, h) { return ER.el(t, c, h); }
function each(list, fn) { Array.prototype.forEach.call(list, fn); }
function snd(o, name) { if (o && o.sound === false) return; if (ER.sfx[name]) ER.sfx[name](); }

/* ---------- checks ---------- */
WK.norm = function (s) { return String(s == null ? '' : s).toLowerCase().replace(/[^a-z]/g, ''); };
WK.is = function (key, guess) { return ER.check(key, WK.norm(guess)); };                         /* the whole word */
WK.at = function (key, i, ch) { return ER.check(key + '@', i + String(ch).toLowerCase()); };     /* this letter in this place (letters only, from 0) */
WK.count = function (key, ch) {                                                                 /* how many times the letter occurs */
  var n = 0; ch = String(ch).toLowerCase();
  while (n < 15 && ER.check(key + '?', ch + (n + 1))) n++;
  return n;
};
WK.len = function (key) { for (var n = 1; n <= 80; n++) if (ER.check(key + '#', n)) return n; return 0; };
WK.where = function (key, ch) {                                                                 /* every place where the letter stands */
  var out = [], n = WK.len(key), i;
  for (i = 0; i < n; i++) if (WK.at(key, i, ch)) out.push(i);
  return out;
};
/* A guess of the right length, marked letter by letter: 'hit' (right place), 'near' (in the word, somewhere else), 'miss'. */
WK.score = function (key, guess) {
  var g = WK.norm(guess).split(''), marks = [], used = {}, i;
  for (i = 0; i < g.length; i++) {
    marks[i] = WK.at(key, i, g[i]) ? 'hit' : 'miss';
    if (marks[i] === 'hit') used[g[i]] = (used[g[i]] || 0) + 1;
  }
  for (i = 0; i < g.length; i++) {
    if (marks[i] === 'hit') continue;
    if ((used[g[i]] || 0) < WK.count(key, g[i])) { marks[i] = 'near'; used[g[i]] = (used[g[i]] || 0) + 1; }
  }
  return marks;
};
/* A solved word goes into the notebook with its meaning from words.js (give answer words flag 0 there). */
WK.learn = function (word, quiet) {
  var w = String(word).toLowerCase(), g = (window.GLOSS || []).filter(function (x) { return x[0].toLowerCase() === w; })[0];
  if (!g || !ER.addWord(g[0], g[1])) return false;
  if (!quiet) ER.toast('New word: ' + g[0]);
  return true;
};

/* ---------- the keyboard ---------- */
/* WK.keys(root, fn): fn(k) gets 'a'..'z', 'back', 'enter', 'left', 'right' or 'space' while root is on the page and nothing
   lies over it. Return false from fn for a key you do not use. The last widget made (or clicked) has the keyboard. */
var stack = [];
function gone(h) { return !D.body.contains(h.root); }
D.addEventListener('keydown', function (e) {
  var i, k = null, t = e.target, h;
  for (i = stack.length - 1; i >= 0; i--) if (gone(stack[i])) stack.splice(i, 1);
  if (!stack.length || e.ctrlKey || e.metaKey || e.altKey) return;
  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
  if (D.querySelector('.ov-top.on, .capshade.on, .tc')) return;              /* notebook, a run of captions, a title card */
  if (e.key && e.key.length === 1 && /[a-z]/i.test(e.key)) k = e.key.toLowerCase();
  else if (/^Key[A-Z]$/.test(e.code || '')) k = e.code.charAt(3).toLowerCase();   /* Korean (or another) input is on: read the key itself */
  else if (e.key === 'Backspace' || e.key === 'Delete') k = 'back';
  else if (e.key === 'Enter') k = 'enter';
  else if (e.key === 'ArrowLeft') k = 'left';
  else if (e.key === 'ArrowRight') k = 'right';
  else if (e.key === ' ' || e.code === 'Space') k = 'space';
  if (!k) return;
  h = stack[stack.length - 1];
  if (h.fn(k) !== false) e.preventDefault();
});
WK.keys = function (root, fn) {
  var h = { root: root, fn: fn };
  function top() { var i = stack.indexOf(h); if (i >= 0 && i < stack.length - 1) { stack.splice(i, 1); stack.push(h); } }
  stack.push(h);
  root.addEventListener('pointerdown', top);
  return function () { var i = stack.indexOf(h); if (i >= 0) stack.splice(i, 1); };
};

/* An on-screen keyboard. o = {layout:'qwerty'|'abc', back:bool, enter:bool|'label', key:fn(k)} */
WK.board = function (root, o) {
  o = o || {};
  var rows = o.layout === 'abc' ? ['abcdefghi', 'jklmnopqr', 'stuvwxyz'] : ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
  var box = el('div', 'wk-board'), keys = {};
  function mk(k, label, wide) {
    var b = el('button', 'wk-key' + (wide ? ' wide' : '')); b.type = 'button'; b.textContent = label; b.setAttribute('data-k', k);
    keys[k] = b; return b;
  }
  rows.forEach(function (r, ri) {
    var row = el('div', 'wk-row'), last = ri === rows.length - 1;
    if (o.enter && last) row.appendChild(mk('enter', o.enter === true ? 'Enter' : o.enter, true));
    r.split('').forEach(function (ch) { row.appendChild(mk(ch, ch.toUpperCase())); });
    if (o.back && last) row.appendChild(mk('back', '←', true));
    box.appendChild(row);
  });
  box.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.wk-key') : null;
    if (b && !b.disabled && o.key) o.key(b.getAttribute('data-k'));
  });
  root.appendChild(box);
  return {
    el: box,
    mark: function (k, cls) { if (keys[k]) keys[k].className = 'wk-key' + (k.length > 1 ? ' wide' : '') + (cls ? ' ' + cls : ''); },
    off: function (k, v) { if (keys[k]) keys[k].disabled = v !== false; },
    reset: function () { Object.keys(keys).forEach(function (k) { keys[k].disabled = false; keys[k].className = 'wk-key' + (k.length > 1 ? ' wide' : ''); }); }
  };
};

/* Cells for one answer. In the pattern '_' is a letter to find, a letter is a letter that is given,
   a space parts two words, and anything else is printed as it is. Returns the letter cells in order. */
function buildCells(host, pattern) {
  var cells = [], part = el('span', 'wk-part');
  host.innerHTML = ''; host.appendChild(part);
  String(pattern).split('').forEach(function (ch) {
    var c;
    if (ch === ' ') { part = el('span', 'wk-part'); host.appendChild(part); return; }
    if (ch === '_' || /[a-z]/i.test(ch)) {
      c = el('span', 'wk-cell' + (ch === '_' ? '' : ' given on'));
      c.textContent = ch === '_' ? '' : ch.toUpperCase();
      cells.push(c);
    } else { c = el('span', 'wk-lit'); c.textContent = ch; }
    part.appendChild(c);
  });
  return cells;
}
function blanks(n) { return new Array(n + 1).join('_'); }

/* ---------- hangman: find the word a letter at a time, with only so many wrong letters ---------- */
/* o = { key | keys:[...]   one word, or a pool (each new game takes the next one, so a lost game cannot simply be replayed)
         mask | masks:[...] pattern (see buildCells); default: one '_' for each letter
         lives: 6, free: 'rstlne' (letters shown at the start for nothing), board: true | false, layout: 'qwerty'|'abc'
         onGuess(ch, hit, st), onWin(word, st), onLose(st) }       st = {wrong, left, lives, tried, round, key}
   Returns {el, guess(ch), state(), word(), again(sameWord), destroy()}. The lives are also on the box as data-left,
   and as <i class="on"> marks in .wk-lives (hide that and draw coins, floors, fuses ... from onGuess). */
WK.hangman = function (root, o) {
  var box = el('div', 'wk wk-hang'), wordEl = el('div', 'wk-word'), livesEl = el('div', 'wk-lives'), board = null;
  var round = 0, key, cells, got, wrong, tried, over;
  box.appendChild(wordEl); box.appendChild(livesEl); root.appendChild(box);
  if (o.board !== false) board = WK.board(box, { layout: o.layout, key: function (k) { guess(k); } });
  var off = WK.keys(box, function (k) { if (k.length !== 1) return false; guess(k); });
  function total() { return o.lives || 6; }
  function st() { return { wrong: wrong, left: total() - wrong, lives: total(), tried: tried.slice(), round: round, key: key }; }
  function word() { return cells.map(function (c) { return c.textContent; }).join('').toLowerCase(); }
  function paint() {
    var s = '', i;
    for (i = 0; i < total(); i++) s += '<i' + (i < total() - wrong ? ' class="on"' : '') + '></i>';
    livesEl.innerHTML = s; box.setAttribute('data-left', total() - wrong);
  }
  function start() {
    var keys = o.keys || [o.key], i = round % keys.length;
    key = keys[i];
    cells = buildCells(wordEl, (o.masks && o.masks[i]) || o.mask || blanks(WK.len(key)));
    got = cells.filter(function (c) { return c.textContent; }).length; wrong = 0; tried = []; over = false;
    box.classList.remove('won', 'lost');
    if (board) board.reset();
    paint();
    (o.free || '').split('').forEach(function (c) { if (c) guess(c, true); });
  }
  function guess(ch, free) {
    ch = String(ch).toLowerCase();
    if (over || !/^[a-z]$/.test(ch) || tried.indexOf(ch) >= 0) return;
    tried.push(ch);
    var pos = WK.where(key, ch), hit = pos.length > 0;
    pos.forEach(function (i) { var c = cells[i]; if (c && !c.textContent) { c.textContent = ch.toUpperCase(); c.classList.add('on'); got++; } });
    if (board) { board.mark(ch, hit ? 'hit' : 'miss'); board.off(ch); }
    if (!hit && !free) wrong++;
    paint();
    if (!free) { snd(o, hit ? 'tick' : 'no'); if (o.onGuess) o.onGuess(ch, hit, st()); }
    if (got >= cells.length) { over = true; box.classList.add('won'); if (o.onWin) o.onWin(word(), st()); }
    else if (wrong >= total()) { over = true; box.classList.add('lost'); if (o.onLose) o.onLose(st()); }
  }
  start();
  return { el: box, guess: guess, state: st, word: word, again: function (sameWord) { if (!sameWord) round++; start(); }, destroy: off };
};

/* ---------- gaps: words with letters missing, anywhere in a text ---------- */
/* Upgrades every  <span class="wk-gap" data-key="w1" data-show="l_tt_r"></span>  inside root ('_' is a letter to fill in).
   One cursor serves them all: type to fill, Backspace to go back, arrows or a click to move. A word is checked when its
   last gap is filled; a wrong word shakes, keeps the letters that were right and empties the rest.
   o = { board: true | {layout} (an on-screen keyboard, put into o.boardIn or root), mark: true (false: a wrong word is emptied completely),
         onWord(key, word, node), onMiss(key, node, misses, typed), onDone() }
   Returns {done(), solved(key), fill(key) (shows a word for nothing, e.g. as a last hint: counts as solved), destroy()}. */
WK.gaps = function (root, o) {
  o = o || {};
  var gaps = [], bl = [], cur = -1, busy = false, done = false;
  each(root.querySelectorAll('.wk-gap'), function (node) {
    var g = { node: node, key: node.getAttribute('data-key'), ok: false, miss: 0 };
    g.cells = buildCells(node, node.getAttribute('data-show') || blanks(WK.len(g.key)));
    g.cells.forEach(function (c, i) {
      if (c.classList.contains('given')) return;
      var b = { g: g, i: i, c: c };
      c.classList.add('blank'); bl.push(b);
      c.addEventListener('click', function () { if (!g.ok && !busy && !c.classList.contains('fix')) setCur(bl.indexOf(b)); });
    });
    gaps.push(g);
  });
  if (o.board) WK.board(o.boardIn || root, { layout: o.board.layout, back: true, key: press });
  var off = WK.keys(root, press);
  function open(b) { return !b.g.ok && !b.c.classList.contains('fix'); }
  function setCur(i) {
    if (bl[cur]) bl[cur].c.classList.remove('cur');
    cur = i;
    if (bl[cur]) bl[cur].c.classList.add('cur');
  }
  function step(from, dir) { for (var i = from + dir; i >= 0 && i < bl.length; i += dir) if (open(bl[i])) return i; return -1; }
  function emptyIn(g, from) {                              /* the next empty place in this word: after `from` first, then from its start */
    var i, first = -1;
    for (i = 0; i < bl.length; i++) {
      if (bl[i].g !== g || !open(bl[i]) || bl[i].c.textContent) continue;
      if (i > from) return i;
      if (first < 0) first = i;
    }
    return first;
  }
  function nextGap(g) {                                    /* the first empty place of the next unsolved word */
    var at = gaps.indexOf(g), n = gaps.length, k, i;
    for (k = 1; k <= n; k++) { i = emptyIn(gaps[(at + k) % n], -1); if (i >= 0) return i; }
    return -1;
  }
  function settle(g) {
    g.ok = true; g.node.classList.add('ok');
    g.cells.forEach(function (c) { c.classList.remove('cur'); });
    if (o.onWord) o.onWord(g.key, g.cells.map(function (c) { return c.textContent; }).join('').toLowerCase(), g.node);
    if (gaps.every(function (x) { return x.ok; })) { done = true; setCur(-1); if (o.onDone) o.onDone(); }
    else setCur(nextGap(g));
  }
  function check(g) {
    var word = g.cells.map(function (c) { return c.textContent; }).join('');
    if (WK.is(g.key, word)) { settle(g); return; }
    g.miss++; busy = true; g.node.classList.add('bad'); ER.shake(g.node); snd(o, 'no');
    setTimeout(function () {
      g.node.classList.remove('bad');
      g.cells.forEach(function (c, i) {
        if (!c.classList.contains('blank') || c.classList.contains('fix')) return;
        if (o.mark !== false && WK.at(g.key, i, c.textContent)) c.classList.add('fix'); else c.textContent = '';
      });
      busy = false; setCur(emptyIn(g, -1));
      if (o.onMiss) o.onMiss(g.key, g.node, g.miss, word.toLowerCase());
    }, 700);
  }
  function press(k) {
    var b = bl[cur], i;
    if (done || busy) return false;
    if (k === 'left' || k === 'right') { i = step(cur, k === 'left' ? -1 : 1); if (i >= 0) setCur(i); return; }
    if (k === 'back') {
      if (b && b.c.textContent) { b.c.textContent = ''; return; }
      i = step(cur, -1); if (i >= 0) { setCur(i); bl[i].c.textContent = ''; }
      return;
    }
    if (k.length !== 1 || !b || !open(b)) return false;
    b.c.textContent = k.toUpperCase(); snd(o, 'tick');
    i = emptyIn(b.g, cur);
    if (i >= 0) setCur(i); else check(b.g);
  }
  setCur(step(-1, 1));
  return {
    done: function () { return done; },
    solved: function (key) { return gaps.some(function (g) { return g.key === key && g.ok; }); },
    fill: function (key) {
      gaps.forEach(function (g) {
        if (g.key !== key || g.ok) return;
        g.cells.forEach(function (c, i) { 'abcdefghijklmnopqrstuvwxyz'.split('').some(function (ch) { if (WK.at(key, i, ch)) { c.textContent = ch.toUpperCase(); return true; } return false; }); });
        settle(g);
      });
    },
    destroy: off
  };
};

/* ---------- a word in so many tries, with a mark on every letter ---------- */
/* o = { key, tries: 6, board: true | false, layout, onRow(guess, marks, row), onWin(word, rows), onLose(rows) }
   Type a word of the right length and press Enter. Each letter turns 'hit', 'near' or 'miss' (classes on the cell).
   Returns {el, reset(), destroy()}. */
WK.wordle = function (root, o) {
  var n = WK.len(o.key), tries = o.tries || 6, box = el('div', 'wk wk-wordle'), grid = el('div', 'wk-grid'), board = null;
  var rows = [], r = 0, buf = '', over = false, best = {}, RANK = { hit: 3, near: 2, miss: 1 };
  box.appendChild(grid); root.appendChild(box);
  if (o.board !== false) board = WK.board(box, { layout: o.layout, back: true, enter: true, key: press });
  var off = WK.keys(box, press);
  function build() {
    var i, j, row;
    grid.innerHTML = ''; rows = []; r = 0; buf = ''; over = false; best = {};
    for (i = 0; i < tries; i++) { row = el('div', 'wk-try'); for (j = 0; j < n; j++) row.appendChild(el('span', 'wk-cell')); grid.appendChild(row); rows.push(row); }
    box.classList.remove('won', 'lost');
    if (board) board.reset();
    draw();
  }
  function draw() {
    rows.forEach(function (row, i) { row.classList.toggle('cur', i === r && !over); });
    if (!rows[r] || over) return;
    each(rows[r].children, function (c, i) { c.textContent = (buf.charAt(i) || '').toUpperCase(); c.classList.toggle('on', i < buf.length); });
  }
  function submit() {
    if (buf.length < n) { ER.shake(rows[r]); snd(o, 'no'); return; }
    var guess = buf, marks = WK.score(o.key, guess), row = rows[r];
    each(row.children, function (c, i) {
      c.className = 'wk-cell on ' + marks[i]; c.style.transitionDelay = (i * 90) + 'ms';
      var ch = guess.charAt(i);
      if (!best[ch] || RANK[marks[i]] > RANK[best[ch]]) { best[ch] = marks[i]; if (board) board.mark(ch, marks[i]); }
    });
    r++; buf = '';
    if (marks.every(function (m) { return m === 'hit'; })) { over = true; box.classList.add('won'); }
    else if (r >= tries) { over = true; box.classList.add('lost'); }
    draw();
    if (o.onRow) o.onRow(guess, marks, r);
    if (over && box.classList.contains('won')) { if (o.onWin) o.onWin(guess, r); }
    else if (over) { if (o.onLose) o.onLose(r); }
  }
  function press(k) {
    if (over) return false;
    if (k === 'back') { buf = buf.slice(0, -1); draw(); return; }
    if (k === 'enter') { submit(); return; }
    if (k.length !== 1) return false;
    if (buf.length < n) { buf += k; snd(o, 'tick'); draw(); }
  }
  build();
  return { el: box, reset: build, destroy: off };
};

/* ---------- tiles to put in order: the letters of a word, or the words of a sentence ---------- */
/* o = { key, items: 'tcaeh' | ['is', 'this', 'it'] (in the mixed-up order to show), column: true (one under another, for
         lines or sentences), onMove(text), onDone(text) }
   Drag a tile to a new place, or click two tiles to swap them. Checked after every move.
   Returns {el, text(), destroy()}. */
WK.tiles = function (root, o) {
  var box = el('div', 'wk wk-tiles'), items = typeof o.items === 'string' ? o.items.split('') : o.items.slice(), held = null, done = false;
  var words = typeof o.items !== 'string';
  if (words) box.classList.add('wk-words');
  if (o.column) box.classList.add('wk-column');
  items.forEach(function (t) { var b = el('span', 'wk-tile'); b.textContent = words ? t : t.toUpperCase(); box.appendChild(b); });
  root.appendChild(box);
  function text() { return Array.prototype.map.call(box.children, function (b) { return b.textContent; }).join(words ? ' ' : '').toLowerCase(); }
  function hold(n) { if (held) held.classList.remove('held'); held = n; if (n) n.classList.add('held'); }
  function moved() {
    var t = text(); snd(o, 'click');
    if (o.onMove) o.onMove(t);
    if (WK.is(o.key, t)) { done = true; box.classList.add('done'); hold(null); if (o.onDone) o.onDone(t); }
  }
  box.addEventListener('pointerdown', function (e) {
    var tile = e.target.closest ? e.target.closest('.wk-tile') : null;
    if (!tile || e.button || done) return;
    e.preventDefault();
    var sx = e.clientX, sy = e.clientY, drag = false;
    function mv(ev) {
      if (!drag) { if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 6) return; drag = true; hold(null); tile.classList.add('drag'); }
      tile.style.transform = 'translate(' + (ev.clientX - sx) + 'px,' + (ev.clientY - sy) + 'px)';
    }
    function up(ev) {
      D.removeEventListener('pointermove', mv); D.removeEventListener('pointerup', up); D.removeEventListener('pointercancel', up);
      if (!drag) {                                         /* a click: pick it up, or swap it with the one already picked up */
        if (!held) { hold(tile); return; }
        if (held === tile) { hold(null); return; }
        var a = held, an = a.nextSibling === tile ? a : a.nextSibling;
        hold(null); box.insertBefore(a, tile); box.insertBefore(tile, an); moved();
        return;
      }
      tile.classList.remove('drag'); tile.style.transform = '';
      var kids = Array.prototype.slice.call(box.children), i, r, target = null, after = false, bestD = 1e9, d;
      for (i = 0; i < kids.length; i++) {
        if (kids[i] === tile) continue;
        r = kids[i].getBoundingClientRect();
        d = Math.abs(ev.clientX - (r.left + r.width / 2)) * (o.column ? 0 : 1) + Math.abs(ev.clientY - (r.top + r.height / 2)) * 3;   /* the row counts for more than the place in it */
        if (d < bestD) { bestD = d; target = kids[i]; after = o.column ? ev.clientY > r.top + r.height / 2 : ev.clientX > r.left + r.width / 2; }
      }
      if (!target) return;
      var ref = after ? target.nextSibling : target;
      if (ref === tile || (after ? target.nextSibling === tile : target.previousSibling === tile)) return;      /* dropped where it was */
      box.insertBefore(tile, ref); moved();
    }
    D.addEventListener('pointermove', mv); D.addEventListener('pointerup', up); D.addEventListener('pointercancel', up);
  });
  return { el: box, text: text, destroy: function () {} };
};

/* ---------- a text with gaps and a tray of words to put in them ---------- */
/* root holds the text, with  <span class="wk-blank" data-key="c1"></span>  for each gap, and the tray:
   <div class="wk-bank"><span class="wk-chip">reluctant</span> ...</div>   (more chips than gaps is fine).
   Drag a chip into a gap, or click the chip and then the gap.
   o = { check: 'full' (when every gap is filled; default) | 'each' (as each chip lands), onRight(key, node),
         onMiss(wrong, misses, detail) (detail: [[key, word], ...] for the gaps that were wrong), onDone() }
   A right chip stays and locks. A wrong one shakes and goes back to the tray. Returns {done(), destroy()}. */
WK.cloze = function (root, o) {
  o = o || {};
  var bank = root.querySelector('.wk-bank'), slots = ER.$$('.wk-blank', root), busy = false, done = false, misses = 0;
  each(root.querySelectorAll('.wk-chip'), function (c) { c.classList.add('dnd-item'); });
  function chipIn(s) { return s.querySelector('.wk-chip'); }
  function lock(s) { var c = chipIn(s); c.classList.remove('wk-chip', 'dnd-item', 'held'); c.classList.add('wk-set'); s.classList.add('ok'); if (o.onRight) o.onRight(s.getAttribute('data-key'), s); }
  function judge(list) {
    var wrong = list.filter(function (s) { return !WK.is(s.getAttribute('data-key'), chipIn(s).textContent); });
    list.forEach(function (s) { if (wrong.indexOf(s) < 0) lock(s); });
    if (wrong.length) {
      misses++; busy = true; snd(o, 'no');
      wrong.forEach(function (s) { ER.shake(s); });
      var detail = wrong.map(function (s) { return [s.getAttribute('data-key'), chipIn(s).textContent]; });       /* which word was wrong in which gap */
      setTimeout(function () { wrong.forEach(function (s) { var c = chipIn(s); if (c) bank.appendChild(c); }); busy = false; if (o.onMiss) o.onMiss(wrong.length, misses, detail); }, 700);
    } else if (slots.every(function (s) { return s.classList.contains('ok'); })) { done = true; if (o.onDone) o.onDone(); }
  }
  ER.dnd(root, { item: '.wk-chip', slot: '.wk-blank:not(.ok)', home: bank, lock: function () { return busy || done; }, change: function () {
    var open = slots.filter(function (s) { return !s.classList.contains('ok'); }), filled = open.filter(chipIn);
    if (o.check === 'each') { if (filled.length) judge(filled); }
    else if (filled.length === open.length && open.length) judge(open);
  } });
  return { done: function () { return done; }, destroy: function () {} };
};

/* ---------- pick the word: every word of a text can be clicked ---------- */
/* o = { key (a plain tag in case.json: the right answers as "word" or, when a word occurs twice, "<n>:word", n counting words from 0),
         onRight(word, node, n), onWrong(word, node, n) }
   Words inside an element with class wk-skip are left alone. Returns {words (the nodes), destroy()}. */
WK.pick = function (root, o) {
  var n = 0, nodes = [], texts = [], walker = D.createTreeWalker(root, 4, null, false), t;
  while ((t = walker.nextNode())) if (!(t.parentNode.closest && t.parentNode.closest('.wk-skip, .wk-w'))) texts.push(t);
  texts.forEach(function (tn) {
    var parts = tn.nodeValue.split(/([A-Za-z][A-Za-z’'-]*)/), frag = D.createDocumentFragment();
    if (parts.length < 2) return;
    parts.forEach(function (p, i) {
      if (i % 2) { var s = el('span', 'wk-w'); s.textContent = p; s.setAttribute('data-n', n++); nodes.push(s); frag.appendChild(s); }
      else if (p) frag.appendChild(D.createTextNode(p));
    });
    tn.parentNode.replaceChild(frag, tn);
  });
  function click(e) {
    var s = e.target.closest ? e.target.closest('.wk-w') : null; if (!s || !root.contains(s)) return;
    var w = WK.norm(s.textContent), i = +s.getAttribute('data-n');
    if (ER.check(o.key, i + ':' + w) || ER.check(o.key, w)) { s.classList.add('ok'); if (o.onRight) o.onRight(w, s, i); }
    else { ER.shake(s); snd(o, 'no'); if (o.onWrong) o.onWrong(w, s, i); }
  }
  root.classList.add('wk-pick');
  root.addEventListener('click', click);
  return { words: nodes, destroy: function () { root.removeEventListener('click', click); root.classList.remove('wk-pick'); } };
};

/* ---------- sort the words into sets ---------- */
/* o = { words: [...] (in the order to show), keys: ['g1', 'g2', ...] (from "groups" in case.json), size: 4,
         labels: {g1: 'Things that ...'} (shown when a set is found), onGroup(key, words, left), onMiss(oneAway, misses), onDone() }
   Click `size` words; they are checked at once. Returns {el, done(), destroy()}. */
WK.groups = function (root, o) {
  var size = o.size || 4, box = el('div', 'wk wk-groups'), found = el('div', 'wk-found'), pool = el('div', 'wk-pool');
  var left = o.keys.slice(), busy = false, misses = 0;
  box.appendChild(found); box.appendChild(pool); root.appendChild(box);
  o.words.forEach(function (w) { var b = el('button', 'wk-tile'); b.type = 'button'; b.textContent = w; pool.appendChild(b); });
  function low(b) { return b.textContent.trim().toLowerCase(); }
  pool.addEventListener('click', function (e) {
    var b = e.target.closest ? e.target.closest('.wk-tile') : null; if (!b || busy) return;
    var sel = ER.$$('.wk-tile.sel', pool);
    if (b.classList.contains('sel')) { b.classList.remove('sel'); return; }
    if (sel.length >= size) return;
    b.classList.add('sel'); snd(o, 'click'); sel.push(b);
    if (sel.length < size) return;
    var names = sel.map(low).sort(), joined = names.join('+'), hit = null, away = false;
    left.forEach(function (k) {
      if (ER.check(k, joined)) hit = k;
      else if (names.filter(function (w) { return ER.check(k + '~', w); }).length === size - 1) away = true;
    });
    busy = true;
    if (!hit) {
      misses++; snd(o, 'no'); sel.forEach(function (x) { ER.shake(x); });
      setTimeout(function () { sel.forEach(function (x) { x.classList.remove('sel'); }); busy = false; if (o.onMiss) o.onMiss(away, misses); }, 650);
      return;
    }
    setTimeout(function () {
      var row = el('div', 'wk-set'), lab = el('b'), ws = el('span');
      lab.textContent = (o.labels && o.labels[hit]) || ''; ws.textContent = sel.map(function (x) { return x.textContent; }).join(', ');
      row.setAttribute('data-key', hit); row.appendChild(lab); row.appendChild(ws); found.appendChild(row);
      sel.forEach(function (x) { pool.removeChild(x); });
      left.splice(left.indexOf(hit), 1); busy = false;
      if (o.onGroup) o.onGroup(hit, names, left.length);
      if (!left.length && o.onDone) o.onDone();
    }, 350);
  });
  return { el: box, done: function () { return !left.length; }, destroy: function () {} };
};

/* ---------- a line to type on ---------- */
/* For an answer whose length must not show. o = { max: 16, spaces: false, board: true | {layout}, enter: 'label',
   placeholder: '...', onEnter(text) -> return false to wipe the line (a wrong answer) }
   Returns {el, text(), clear(), destroy()}. */
WK.line = function (root, o) {
  o = o || {};
  var box = el('div', 'wk wk-line'), out = el('div', 'wk-typed'), buf = '', max = o.max || 16;
  box.appendChild(out); root.appendChild(box);
  if (o.board) WK.board(box, { layout: o.board.layout, back: true, enter: o.enter || true, key: press });
  var off = WK.keys(box, press);
  function draw() { out.textContent = buf ? buf.toUpperCase() : (o.placeholder || ''); out.classList.toggle('empty', !buf); }
  function press(k) {
    if (k === 'back') buf = buf.slice(0, -1);
    else if (k === 'space') { if (!o.spaces) return false; if (buf && buf.slice(-1) !== ' ' && buf.length < max) buf += ' '; }
    else if (k === 'enter') { if (!buf) return; if (o.onEnter && o.onEnter(buf.trim()) === false) { ER.shake(out); snd(o, 'no'); buf = ''; } }
    else if (k.length === 1) { if (buf.length < max) { buf += k; snd(o, 'tick'); } }
    else return false;
    draw();
  }
  draw();
  return { el: box, text: function () { return buf; }, clear: function () { buf = ''; draw(); }, destroy: off };
};
})();
