/* The Third Arch After the Fountain - what every room of the story shares.
   THE CITY IS STORED HERE, ONCE: the streets of Ombra (EDGE), what stands at their ends (SPOT), the trades (TR) and the
   two towers (LM). The street views of room one, the picture from the roof in room four, Master Solheim's walk and the
   words under every view are all made from these tables, so that they cannot disagree.
   Loaded after engine.js. Nothing in here knows an answer. */
window.BZ = (function () {
  'use strict';
  var X = {};
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so that the sound button switches them) ---------- */
  X.sfx = {
    coin: function () { B({ dur: 0.03, f: 5200, q: 5, peak: 0.1 }); B({ dur: 0.03, f: 4300, q: 5, peak: 0.08, when: 0.07 }); },
    step: function () { B({ type: 'lowpass', f: 480, dur: 0.07, peak: 0.16 }); B({ type: 'lowpass', f: 400, dur: 0.07, peak: 0.13, when: 0.17 }); },
    knock: function () { [0, 0.17].forEach(function (w) { T({ f: 180, f2: 110, dur: 0.07, peak: 0.3, when: w }); B({ dur: 0.03, f: 1100, q: 2, peak: 0.1, when: w }); }); },
    chalk: function () { B({ type: 'bandpass', f: 2600, q: 1.2, dur: 0.12, peak: 0.07, a: 0.02 }); },
    pen: function () { B({ type: 'bandpass', f: 1700, q: 1, dur: 0.16, peak: 0.05, a: 0.03 }); },
    flap: function () { [0, 0.09, 0.18].forEach(function (w) { B({ type: 'bandpass', f: 600, f2: 900, q: 0.8, dur: 0.08, peak: 0.1, a: 0.02, when: w }); }); },
    lark: function () { [0, 0.1, 0.2, 0.34, 0.44].forEach(function (w, i) { T({ f: 2300 + (i % 3) * 280, f2: 2900 + (i % 2) * 300, dur: 0.08, peak: 0.03, when: w }); }); },
    swap: function () { B({ type: 'lowpass', f: 900, dur: 0.06, peak: 0.16 }); T({ f: 300, f2: 220, dur: 0.08, peak: 0.12, when: 0.05 }); },
    stamp: function () { T({ f: 90, f2: 50, dur: 0.16, peak: 0.5 }); B({ type: 'lowpass', f: 900, dur: 0.05, peak: 0.3 }); }
  };

  /* ---------- small helpers ---------- */
  X.thing = function (sel, word, line, busy) {
    ER.$$(sel).forEach(function (n) {
      n.addEventListener('click', function (e) {
        if (busy && busy()) return;
        if (word) ER.wordAt(e.clientX, e.clientY, word);
        if (line) ER.say(typeof line === 'function' ? line() : line);
      });
    });
  };
  X.mine = function (id, title, html, quiet) { return ER.addClue(id, title, '<h4>' + title + '</h4>' + html, 'mine', 'Your own note', quiet); };
  X.words = function (list) {
    var G = window.GLOSS || [];
    list.forEach(function (w) { for (var i = 0; i < G.length; i++) if (G[i][0] === w) { ER.addWord(G[i][0], G[i][1]); break; } });
  };
  X.mins = function () {
    var st = ER.state(), end = Date.now();
    if (st.fin && st.fin.secs) return Math.max(1, Math.round(st.fin.secs / 60));
    return Math.max(1, Math.round((end - (st.t0 || end)) / 60000));
  };
  /* a number set with two arrows.  o = {max, start, unit, change}  */
  X.count = function (box, o) {
    var v = o.start || 0, n = ER.el('span', 'cnt', '<button type="button" data-d="-1" title="fewer">&#9664;</button><b></b><button type="button" data-d="1" title="more">&#9654;</button>' + (o.unit ? '<i>' + o.unit + '</i>' : '')),
      cell = n.querySelector('b');
    function draw() { cell.textContent = v; }
    n.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null; if (!b) return;
      v = Math.max(0, Math.min(o.max, v + (+b.getAttribute('data-d')))); X.sfx.coin(); draw(); if (o.change) o.change(v);
    });
    box.appendChild(n); draw();
    return { node: n, get: function () { return v; }, set: function (x) { v = x; draw(); } };
  };
  function seeded(str) {
    var h = 2166136261, i; for (i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
  }

  /* ================= THE CITY ================= */
  /* Trades. who: what Ombra calls the people; here: what you find when you stand among them; side: what you see of them
     from the corner; col: the colour of their awnings. */
  var TR = X.TR = {
    copper:  { who: 'the coppersmiths', col: '#c96a2b', here: 'Pots, pans and kettles, as red as new pennies. Everybody here is hitting one of them with a hammer.', side: 'pots and pans, and a great deal of hammering' },
    leather: { who: 'the leather-workers', col: '#7b4a25', here: 'It is quieter here. Belts, bags and boots hang on both sides, and the air smells like a new pair of shoes.', side: 'belts, bags and boots: you can smell them from here' },
    cages:   { who: 'the cage-makers', col: '#8d8a63', here: 'Birdcages, from the size of a hat to the size of a wardrobe. Every one of them is empty.', side: 'empty birdcages, hanging in rows' },
    baskets: { who: 'the basket-weavers', col: '#c9a55a', here: 'Baskets, in towers taller than you are. The whole lane creaks like a boat.', side: 'towers of baskets' },
    dye:     { who: 'the dyers', col: '#2f5fa8', here: 'Wet cloth hangs across the lane in blue, red and yellow, and drips. The stones under your feet are all three colours.', side: 'wet cloth in three colours, dripping' },
    spice:   { who: 'the spice-sellers', col: '#d99a1c', here: 'Open sacks of red, yellow and brown powder, each with a little hill on top. You sneeze twice.', side: 'open sacks of red and yellow powder' },
    cloth:   { who: 'the drapers', col: '#a8437a', here: 'Rolls of cloth stand on end on both sides, like a crowd of thin people. A man is measuring a length against his arm.', side: 'rolls of cloth, standing on end' },
    paper:   { who: 'the letter-writers', col: '#e6dfc8', here: 'Paper, pens and ink. The letter-writers sit at small tables, and none of them is in a hurry.', side: 'small tables with paper and ink on them' },
    potters: { who: 'the potters', col: '#b8663a', here: 'Jars, bowls and water pots, the colour of the ground that they are standing on.', side: 'clay jars and bowls' },
    bread:   { who: 'the bakers', col: '#e0b468', here: 'Round loaves on long boards, and the hot smell of the ovens.', side: 'loaves on long boards, and the smoke of ovens' },
    saddle:  { who: 'the rope-makers', col: '#6b7a4a', here: 'Rope in coils as big as cartwheels, and harness for mules hanging from hooks.', side: 'coils of rope, and harness on hooks' },
    fish:    { who: 'the fish market', col: '#6fa0b5', here: 'Wet stone tables as far as the river, and the fattest cats in Ombra. You have reached the fish.', side: 'wet stone tables, with something silver on them. It does not smell of leather' },
    alley:   { who: 'a blind alley', col: '#a39a86', here: 'A narrow alley, with washing hung across it from window to window.', side: 'a narrow alley with washing across it' },
    tailors: { who: 'the tailors', col: '#8f7d4c' }, lamps: { who: 'the lamp-makers', col: '#8f7d4c' }, scales: { who: 'the scale-makers', col: '#8f7d4c' }
  };
  /* Streets: [one end, the other end, trade, 1 = it is entered through an arch and roofed].  A place is "x,y": x counts
     east from the Salt Gate, y counts south. */
  var EDGE = X.EDGE = [
    ['0,3', '1,3', 'copper'], ['1,3', '2,3', 'copper'], ['2,3', '3,3', 'leather'], ['3,3', '4,3', 'leather'], ['4,3', '5,3', 'leather'], ['5,3', '6,3', 'saddle'],
    ['1,3', '1,2', 'cages'], ['2,3', '2,2', 'baskets'], ['2,2', '2,1', 'baskets'], ['2,3', '2,4', 'dye'], ['3,3', '3,2', 'alley'],
    ['2,1', '1,1', 'spice'], ['2,1', '3,1', 'cloth'], ['3,1', '4,1', 'cloth'], ['4,1', '5,1', 'paper'], ['5,1', '6,1', 'paper'], ['6,1', '7,1', 'fish'],
    ['4,1', '4,2', 'potters'], ['4,2', '4,3', 'potters'], ['4,3', '4,4', 'bread'],
    ['3,1', '3,0', 'tailors', 1], ['5,1', '5,0', 'lamps', 1], ['6,1', '6,0', 'scales', 1]
  ];
  /* What stands where there is no way on (wall: {direction: thing}; directions 0 north, 1 east, 2 south, 3 west), and in the middle. */
  var SPOT = X.SPOT = {
    '0,3': { wall: { 3: 'gate' } }, '1,2': { wall: { 0: 'cage' } }, '1,1': { wall: { 3: 'well' } }, '2,4': { wall: { 2: 'vats' } },
    '3,2': { wall: { 0: 'cats' } }, '6,3': { wall: { 1: 'stork' } }, '7,1': { wall: { 1: 'river' }, mid: 'fish' }, '4,4': { wall: { 2: 'yard' } },
    '2,1': { wall: { 0: 'houses' }, mid: 'fountain' }, '4,1': { wall: { 0: 'bricked' } }
  };
  var LM = X.LM = { clock: { x: 2, y: -5, name: 'The Clock Tower' }, stork: { x: 7, y: 3, name: 'The tower with the stork’s nest' } };
  var WALL = {
    gate: 'the Salt Gate, and the white road outside it', cage: 'the end of the lane, and the biggest cage of all, with a cage-maker asleep inside it',
    well: 'a well, and the end of the lane', vats: 'three stone tubs of dye: one blue, one red, one yellow. The lane ends here',
    cats: 'a wall, and three cats who have seen strangers before', stork: 'the foot of the tower with the stork’s nest. The stork looks down at you and tells you nothing',
    river: 'the river, and no more city', yard: 'the gate of the Yard: mules, salt carts, and a bell on a post',
    houses: 'a row of tall houses. The Clock Tower stands far behind them', bricked: 'an arch that has been filled in with bricks', wall: 'a wall'
  };
  var DIR = [[0, -1], [1, 0], [0, 1], [-1, 0]], WAYS = {};
  function xy(id) { var p = id.split(','); return [+p[0], +p[1]]; }
  EDGE.forEach(function (e) {
    var a = xy(e[0]), b = xy(e[1]), d, i;
    for (i = 0; i < 4; i++) if (a[0] + DIR[i][0] === b[0] && a[1] + DIR[i][1] === b[1]) d = i;
    (WAYS[e[0]] = WAYS[e[0]] || {})[d] = { to: e[1], trade: e[2], arch: !!e[3] };
    (WAYS[e[1]] = WAYS[e[1]] || {})[(d + 2) % 4] = { to: e[0], trade: e[2], arch: !!e[3] };
  });
  X.xy = xy;
  X.way = function (id, d) { return (WAYS[id] || {})[d] || null; };
  X.wallAt = function (id, d) { return ((SPOT[id] || {}).wall || {})[d] || 'wall'; };
  X.mid = function (id) { return (SPOT[id] || {}).mid || null; };
  /* how far round from straight ahead a tower stands, in degrees: negative = to the left */
  X.bearing = function (id, h, lm) {
    var p = xy(id), dx = LM[lm].x - p[0], dy = LM[lm].y - p[1], hx = DIR[h][0], hy = DIR[h][1];
    return Math.atan2(hx * dy - hy * dx, hx * dx + hy * dy) * 180 / Math.PI;
  };
  function shoulder(a) {
    var side = a < 0 ? 'left' : 'right', m = Math.abs(a);
    return m <= 25 ? 'is straight ahead of you' : m <= 62 ? 'is ahead of you, on your ' + side : m <= 125 ? 'is at your ' + side + ' shoulder' : m <= 155 ? 'is behind you, on your ' + side : 'is behind you';
  }
  function sideText(id, d) {
    var w = X.way(id, d);
    return w ? (w.arch ? 'an arch, with a dark lane behind it' : TR[w.trade].side) : WALL[X.wallAt(id, d)];
  }
  /* the words under a view: where you are standing, what is on each hand, and where the towers are */
  X.lines = function (id, h, came) {      /* came: the trade of the street you walked here by */
    var m = X.mid(id), here;
    here = m === 'fountain' ? 'A square, with a fountain in the middle of it: a stone bowl as wide as a cart.' : id === '0,3' || !came ? 'Just inside the Salt Gate. The street runs straight on into the city.' : TR[came].here;
    return {
      here: here, left: sideText(id, (h + 3) % 4), ahead: sideText(id, h), right: sideText(id, (h + 1) % 4),
      towers: ['clock', 'stork'].map(function (k) { return LM[k].name + ' ' + shoulder(X.bearing(id, h, k)) + '.'; }).join(' ')
    };
  };

  /* ---------- drawing: the goods of each trade, in a box 60 wide and 80 high ---------- */
  function item(k) {
    var s = '', i;
    if (k === 'copper') return '<ellipse cx="20" cy="66" rx="18" ry="13" fill="#c96a2b"/><ellipse cx="20" cy="56" rx="14" ry="4" fill="#7d3b14"/><path d="M8 64q6 8 14 9" stroke="#f0a060" stroke-width="2" fill="none"/><ellipse cx="45" cy="70" rx="13" ry="9" fill="#d9813a"/><ellipse cx="45" cy="63" rx="10" ry="3" fill="#7d3b14"/>' +
      '<path d="M30 30h22v8q-11 9 -22 0z" fill="#c96a2b"/><path d="M52 32h8" stroke="#7d3b14" stroke-width="3"/><circle cx="14" cy="34" r="10" fill="#e09050"/><circle cx="14" cy="34" r="5.500" fill="#c96a2b"/>';
    if (k === 'leather') return '<path d="M7 18V4M30 18V4M49 14V4" stroke="#3a2412" stroke-width="2"/><path d="M0 18h14v34q-7 5 -14 0z" fill="#7b4a25"/><path d="M0 28h14" stroke="#4a2b12" stroke-width="2"/><rect x="20" y="18" width="20" height="24" rx="4" fill="#9a6232"/><path d="M20 26h20" stroke="#5a3718" stroke-width="2"/>' +
      '<rect x="28" y="28" width="4" height="5" fill="#d9b05a"/><path d="M46 14h6v40h-6z" fill="#5a3718"/><rect x="46" y="18" width="6" height="5" fill="#d9b05a"/><path d="M8 80V63h10v9q9 0 11 8z" fill="#6b3f1e"/><path d="M36 80V65h9v8q8 0 10 7z" fill="#8a5528"/>';
    if (k === 'cages') return '<path d="M30 2v10" stroke="#5c5a3c" stroke-width="2"/><path d="M9 72V36q0 -24 21 -24t21 24v36z" fill="#f1e2bb" fill-opacity=".35" stroke="#5c5a3c" stroke-width="2.500"/><path d="M19 72V18M30 72V12M41 72V18M9 44h42" stroke="#5c5a3c" stroke-width="1.800" fill="none"/><rect x="5" y="72" width="50" height="6" fill="#5c5a3c"/>';
    if (k === 'baskets') { [78, 60, 42, 26].forEach(function (y, j) { s += '<path d="M' + (6 + j * 2) + ' ' + y + 'h' + (48 - j * 4) + 'l-4 -16h-' + (40 - j * 4) + 'z" fill="' + (j % 2 ? '#d9b76a' : '#c9a55a') + '" stroke="#8a6a2a" stroke-width="1.500"/><path d="M' + (10 + j * 2) + ' ' + (y - 8) + 'h' + (40 - j * 4) + '" stroke="#8a6a2a" stroke-width="1"/>'; }); return s; }
    if (k === 'dye') return '<path d="M0 6h60" stroke="#3a2a1a" stroke-width="2"/><path d="M4 6h14v50q-7 6 -14 0z" fill="#2f5fa8"/><path d="M23 6h14v60q-7 6 -14 0z" fill="#b8322a"/><path d="M42 6h14v44q-7 6 -14 0z" fill="#e2b521"/><circle cx="11" cy="68" r="2.200" fill="#2f5fa8"/><circle cx="30" cy="76" r="2.200" fill="#b8322a"/><circle cx="49" cy="62" r="2.200" fill="#e2b521"/>';
    if (k === 'spice') { ['#c8402c', '#e2b521', '#8a5a2a'].forEach(function (c, j) { var x = j * 20; s += '<path d="M' + x + ' 80q-3 -24 2 -28h16q5 4 2 28z" fill="#cdb78c" stroke="#8f7a52" stroke-width="1"/><path d="M' + (x + 2) + ' 54l8 -13 8 13z" fill="' + c + '"/>'; }); return s; }
    if (k === 'cloth') { ['#a8437a', '#2f5fa8', '#e2b521', '#3f7a5a', '#b8322a'].forEach(function (c, j) { var x = j * 12, t = 18 + (j * 7) % 16; s += '<rect x="' + x + '" y="' + t + '" width="11" height="' + (80 - t) + '" rx="5" fill="' + c + '"/><ellipse cx="' + (x + 5.5) + '" cy="' + (t + 3) + '" rx="5.500" ry="3" fill="#f1ecdf" opacity=".7"/>'; }); return s; }
    if (k === 'paper') return '<rect x="4" y="50" width="52" height="5" fill="#6b4a2a"/><path d="M11 55v25M49 55v25" stroke="#6b4a2a" stroke-width="4"/><path d="M10 40l20 -3 2 12 -20 3z" fill="#f6f0dc"/><rect x="30" y="42" width="15" height="8" fill="#efe6c8"/><rect x="46" y="38" width="7" height="12" rx="2" fill="#22283c"/><path d="M49 38l8 -18" stroke="#f6f0dc" stroke-width="2.500" stroke-linecap="round"/><path d="M14 44l12 -2" stroke="#22283c" stroke-width="1"/>';
    if (k === 'potters') return '<path d="M5 80q-8 -22 4 -34v-6h12v6q12 12 4 34z" fill="#b8663a"/><ellipse cx="15" cy="40" rx="7" ry="2.500" fill="#6e3a1c"/><path d="M34 80q-6 -14 2 -22h14q8 8 2 22z" fill="#c97a48"/><ellipse cx="43" cy="58" rx="8" ry="2.500" fill="#6e3a1c"/><path d="M36 44h14l-2 9h-10z" fill="#a85a30"/>';
    if (k === 'bread') return '<rect x="1" y="50" width="58" height="5" fill="#8a6a3a"/><path d="M8 55v25M52 55v25" stroke="#6b4a2a" stroke-width="4"/><ellipse cx="12" cy="44" rx="10" ry="7" fill="#d9a04a"/><ellipse cx="32" cy="44" rx="10" ry="7" fill="#c98e3c"/><ellipse cx="50" cy="45" rx="8" ry="6" fill="#d9a04a"/><path d="M7 43l10 -2M27 43l10 -2M46 44l8 -2" stroke="#8a5a1e" stroke-width="1.500"/><ellipse cx="22" cy="33" rx="9" ry="6" fill="#e0ae5a"/>';
    if (k === 'saddle') return '<g fill="none" stroke="#c9b27a" stroke-width="4"><circle cx="18" cy="62" r="16"/><circle cx="18" cy="62" r="9"/><circle cx="45" cy="69" r="10"/><circle cx="45" cy="69" r="4.500"/></g><path d="M34 4v10q0 18 10 18t10 -18V4" fill="none" stroke="#5a3718" stroke-width="4"/><path d="M12 4v22" stroke="#5a3718" stroke-width="3"/>';
    if (k === 'fish') return '<rect x="1" y="52" width="58" height="7" fill="#9aa6a8"/><path d="M8 59v21M52 59v21" stroke="#6f7a7c" stroke-width="5"/><path d="M4 46q11 -9 24 0q-13 9 -24 0zM28 46l8 -6v12z" fill="#c2d4dc"/><path d="M30 40q10 -8 20 0q-10 8 -20 0zM50 40l7 -5v10z" fill="#a9c0cb"/><circle cx="10" cy="45" r="1.200" fill="#22283c"/>';
    return '<path d="M0 12q30 12 60 0" stroke="#3a2a1a" stroke-width="1.500" fill="none"/><rect x="7" y="17" width="12" height="18" fill="#f1ecdf"/><path d="M25 21h12v15h-4v-9h-4v9h-4z" fill="#b8322a"/><rect x="44" y="16" width="10" height="14" fill="#2f5fa8"/>' + cat(20, 80, '#3a332c') + cat(44, 80, '#c98a4a');
  }
  X.item = item;
  function cat(x, y, c) { return '<g transform="translate(' + x + ' ' + y + ')"><path d="M-9 0q-2 -14 6 -14t8 14z" fill="' + c + '"/><circle cx="-5" cy="-17" r="5" fill="' + c + '"/><path d="M-9 -20l1 -6 4 4zM-3 -22l3 -5 1 6z" fill="' + c + '"/><path d="M5 -2q8 -2 6 -10" stroke="' + c + '" stroke-width="2.500" fill="none" stroke-linecap="round"/></g>'; }
  function fig(x, y, s, c1, c2) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><ellipse cx="0" cy="0" rx="14" ry="3" fill="#000" opacity=".22"/><path d="M-10 0q-3 -36 10 -46q13 10 10 46z" fill="' + c1 + '"/><circle cx="0" cy="-54" r="8.500" fill="' + c2 + '"/></g>';
  }
  X.fig = fig;
  /* somebody standing in a scene (about 240 high at scale 1; x, y = the feet).  c = {coat, skin, hair, top, apron, hand, sit, sash}
     top: 'straw' 'scarf' 'bald' 'cap' 'plait' 'bun' 'brim' 'crop' 'tuft' */
  X.person = function (x, y, k, c) {
    var s = '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')"><ellipse cx="0" cy="2" rx="48" ry="7" fill="#000" opacity=".22"/>', hr = c.hair || '#2a2018', lift = c.sit ? 34 : 0;
    s += c.sit ? '<path d="M-22 0v-44h16V0zM6 0v-44h16V0z" fill="#3a3028"/><path d="M-30 -40h60v14h-60z" fill="#3a3028"/>' : '<path d="M-15 0v-80h13V0zM3 0v-80h13V0z" fill="#3a3028"/>';
    s += '<path d="M-21 0h21v8h-25zM1 0h21v8h-18z" fill="#1c140c"/><g transform="translate(0 ' + lift + ')">';
    s += '<path d="M-34 -72q-8 -108 34 -118t36 118z" fill="' + c.coat + '"/>';
    if (c.apron) s += '<path d="M-20 -156h40l6 86h-52z" fill="' + c.apron + '"/>';
    if (c.sash) s += '<path d="M-33 -110q33 12 68 0v12q-35 12 -68 0z" fill="' + c.sash + '"/>';
    s += '<path d="M-25 -172q-18 34 -10 72M25 -172q18 34 10 72" stroke="' + c.coat + '" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="-35" cy="-98" r="7.500" fill="' + (c.hand || c.skin) + '"/><circle cx="35" cy="-98" r="7.500" fill="' + (c.hand || c.skin) + '"/>';
    s += '<rect x="-5" y="-204" width="11" height="15" fill="' + c.skin + '"/><circle cx="0" cy="-220" r="20" fill="' + c.skin + '"/>';
    if (c.top === 'plait') s += '<path d="M12 -214q22 30 12 80" stroke="' + hr + '" stroke-width="9" fill="none" stroke-linecap="round"/>';
    if (c.top !== 'bald' && c.top !== 'scarf') s += '<path d="M-20 -218q-2 -24 20 -24t20 24q-8 -12 -20 -12t-20 12z" fill="' + hr + '"/>';
    if (c.top === 'bald') s += '<path d="M-16 -212q16 34 32 0q-2 22 -16 26t-16 -26z" fill="' + hr + '"/>';
    if (c.top === 'bun') s += '<circle cx="0" cy="-244" r="9" fill="' + hr + '"/>';
    if (c.top === 'tuft') s += '<path d="M-8 -238l3 -10 5 8 4 -11 4 11z" fill="' + hr + '"/>';
    if (c.top === 'scarf') s += '<path d="M-22 -214q-2 -30 22 -30t22 30q4 22 -6 30h-32q-10 -8 -6 -30z" fill="' + hr + '"/><circle cx="0" cy="-216" r="15" fill="' + c.skin + '"/>';
    if (c.top === 'straw') s += '<ellipse cx="0" cy="-234" rx="46" ry="9" fill="#d9b05a"/><path d="M-19 -236q0 -22 19 -22t19 22z" fill="#e6c373"/>';
    if (c.top === 'cap') s += '<path d="M-21 -230q2 -18 21 -18t21 18z" fill="#3a3a44"/><path d="M-26 -230h30v5h-30z" fill="#2a2a32"/>';
    if (c.top === 'brim') s += '<ellipse cx="0" cy="-234" rx="42" ry="7" fill="#3a3a44"/><path d="M-18 -236q0 -20 18 -20t18 20z" fill="#4a4a56"/>';
    s += '<circle cx="-7" cy="-220" r="2" fill="#22180e"/><circle cx="7" cy="-220" r="2" fill="#22180e"/><path d="M-6 -210q6 4 12 0" stroke="#6b3a2a" stroke-width="2" fill="none" stroke-linecap="round"/>';
    return s + '</g></g>';
  };
  var COATS = ['#7b4a25', '#2f5fa8', '#b8322a', '#3f7a5a', '#e9dfc4', '#a8437a', '#d99a1c', '#4a4a56', '#c96a2b'], SKINS = ['#c99a6e', '#8a5a36', '#e2bc94', '#6b4423', '#b98558'];
  X.crowd = function (seed, n, x0, x1, y0, y1, s0, s1) {
    var r = seeded(seed), a = [], i, y;
    for (i = 0; i < n; i++) { y = y0 + r() * (y1 - y0); a.push([x0 + r() * (x1 - x0), y, s0 + (s1 - s0) * (y - y0) / Math.max(1, y1 - y0), COATS[Math.floor(r() * COATS.length)], SKINS[Math.floor(r() * SKINS.length)]]); }
    a.sort(function (p, q) { return p[1] - q[1]; });
    return a.map(function (p) { return fig(p[0].toFixed(0), p[1].toFixed(0), p[2].toFixed(2), p[3], p[4]); }).join('');
  };

  /* ---------- drawing: what is seen through one opening (200 x 200) ---------- */
  var ARCH = 'M45 200V88Q45 26 100 26Q155 26 155 88V200';
  function inside(id, d) {
    var w = X.way(id, d), k, c, s, i, y;
    if (w && !w.arch) {
      c = TR[w.trade].col;
      s = '<rect width="200" height="200" fill="#f1e2bb"/><path d="M0 0L74 48V150L0 200Z" fill="#cfae7c"/><path d="M200 0L126 48V150L200 200Z" fill="#bd9a6b"/><path d="M0 200L74 150h52L200 200Z" fill="#b89a72"/>' +
        '<path d="M0 0h200L152 32H48Z" fill="' + c + '"/><path d="M48 32h104l-22 16H70Z" fill="' + c + '" opacity=".75"/><path d="M40 0l26 32M80 0l10 32M120 0l-10 32M160 0l-26 32" stroke="#fff" stroke-opacity=".35" stroke-width="5"/>' +
        '<g transform="translate(62 96) scale(.48)">' + item(w.trade) + '</g><g transform="translate(138 96) scale(-.48 .48)">' + item(w.trade) + '</g>' + fig(100, 152, 0.42, '#5a4a3a', '#c99a6e') +
        '<g transform="translate(4 104) scale(1.15)">' + item(w.trade) + '</g><g transform="translate(196 104) scale(-1.15 1.15)">' + item(w.trade) + '</g>';
      return s + '<rect width="200" height="200" fill="none" stroke="#6b4a2a" stroke-width="9"/>';
    }
    s = '<rect width="200" height="200" fill="#dcc092"/>';
    k = w ? 'arch' : X.wallAt(id, d);
    if (k === 'arch') return s + '<path d="' + ARCH + 'Z" fill="#1c130c"/><path d="M70 200L88 128h24L130 200Z" fill="#2e2015"/><circle cx="100" cy="92" r="44" fill="#f0c860" opacity=".16"/><circle cx="100" cy="92" r="20" fill="#f0c860" opacity=".25"/><path d="M100 28v50" stroke="#6b5326" stroke-width="2"/><path d="M93 78h14l4 13H89z" fill="#f0c860"/><path d="' + ARCH + '" fill="none" stroke="#8a7350" stroke-width="12"/><path d="' + ARCH + '" fill="none" stroke="#a89068" stroke-width="3"/>';
    if (k === 'bricked') {
      s += '<g clip-path="url(#bzArch)"><rect x="40" y="20" width="120" height="180" fill="#a8623a"/><g stroke="#d9c3a0" stroke-width="2">';
      for (i = 0, y = 35; y < 200; y += 15, i++) s += '<path d="M40 ' + y + 'h120' + [0, 1, 2, 3, 4].map(function (j) { return 'M' + (48 + j * 26 + (i % 2) * 13) + ' ' + y + 'v15'; }).join('') + '"/>';
      return s + '</g></g><path d="' + ARCH + '" fill="none" stroke="#8a7350" stroke-width="12"/><path d="' + ARCH + '" fill="none" stroke="#a89068" stroke-width="3"/>';
    }
    if (k === 'gate') return s + '<path d="M24 200V84Q24 8 100 8Q176 8 176 84V200Z" fill="#fbf3d9"/><path d="M24 150h152v50H24z" fill="#efe1b8"/><path d="M70 200L92 150h16L130 200Z" fill="#f6ecc8"/>' + fig(84, 176, 0.5, '#6b4a2a', '#b98558') + fig(120, 188, 0.62, '#2f5fa8', '#8a5a36') + '<path d="M24 200V84Q24 8 100 8Q176 8 176 84V200" fill="none" stroke="#8a7350" stroke-width="14"/><path d="M92 14h16v16h-16z" fill="#a89068"/>';
    if (k === 'cage') return s + '<g transform="translate(34 24) scale(2.200)">' + item('cages') + '</g><path d="M64 184q20 -16 44 -4q14 -10 26 4z" fill="#6b4a2a"/><circle cx="72" cy="172" r="9" fill="#b98558"/>';
    if (k === 'well') return s + '<rect x="54" y="142" width="92" height="34" fill="#a8946c"/><ellipse cx="100" cy="176" rx="46" ry="13" fill="#a8946c"/><ellipse cx="100" cy="142" rx="46" ry="13" fill="#3a4a56"/><ellipse cx="100" cy="142" rx="46" ry="13" fill="none" stroke="#8a7a5a" stroke-width="5"/><path d="M58 142V70h84v72" fill="none" stroke="#6b4a2a" stroke-width="7"/><path d="M100 70v46" stroke="#c9b27a" stroke-width="2.500"/><rect x="92" y="114" width="16" height="16" fill="#6b4a2a"/>';
    if (k === 'vats') { ['#2f5fa8', '#b8322a', '#e2b521'].forEach(function (c2, j) { var x = 36 + j * 64; s += '<rect x="' + (x - 28) + '" y="140" width="56" height="44" fill="#a8946c"/><ellipse cx="' + x + '" cy="184" rx="28" ry="8" fill="#a8946c"/><ellipse cx="' + x + '" cy="140" rx="28" ry="9" fill="' + c2 + '"/><ellipse cx="' + x + '" cy="140" rx="28" ry="9" fill="none" stroke="#8a7a5a" stroke-width="4"/>'; }); return s + '<g transform="translate(40 20) scale(2 1.300)">' + item('dye').replace(/<circle[^>]*>/g, '') + '</g>'; }
    if (k === 'cats') return s + '<g transform="translate(10 10) scale(3 2)">' + item('alley').replace(/<g.*$/, '') + '</g>' + cat(60, 196, '#3a332c') + cat(108, 196, '#c98a4a') + cat(150, 196, '#e9e2d2');
    if (k === 'stork') return s + '<rect x="40" y="0" width="120" height="200" fill="#c9a877"/><path d="M40 0v200M160 0v200" stroke="#a8875a" stroke-width="5"/><path d="M78 200v-70q0 -24 22 -24t22 24v70z" fill="#4a3219"/><circle cx="114" cy="158" r="3" fill="#d9b05a"/><path d="M60 40h80M60 70h80" stroke="#b8955f" stroke-width="2"/>';
    if (k === 'river') return '<rect width="200" height="200" fill="#f3e2b4"/><rect y="70" width="200" height="130" fill="#6fa0b5"/><path d="M0 96q50 -8 100 0t100 0M0 130q50 -8 100 0t100 0M0 166q50 -8 100 0t100 0" stroke="#cfe6f2" stroke-width="3" fill="none" opacity=".6"/><path d="M60 110h70l-12 18H72z" fill="#6b4a2a"/><path d="M96 110V56M96 60l30 40H96z" stroke="#4a3219" stroke-width="3" fill="#f1ecdf"/>';
    if (k === 'yard') return s + '<path d="M24 200V84Q24 8 100 8Q176 8 176 84V200Z" fill="#f6ecc8"/>' + fig(70, 184, 0.5, '#b8322a', '#e2bc94') + '<path d="M118 190v-70" stroke="#4a3219" stroke-width="5"/><path d="M106 120h24" stroke="#4a3219" stroke-width="5"/><path d="M110 124q8 -10 16 0v12h-16z" fill="#d9b05a"/><path d="M24 200V84Q24 8 100 8Q176 8 176 84V200" fill="none" stroke="#8a7350" stroke-width="14"/>';
    if (k === 'houses') { [0, 68, 134].forEach(function (x, j) { s += '<rect x="' + x + '" y="0" width="66" height="200" fill="' + ['#d2b383', '#e2c89a', '#c9a877'][j] + '"/><rect x="' + (x + 20) + '" y="40" width="26" height="36" fill="#5a7a6a"/><rect x="' + (x + 20) + '" y="104" width="26" height="36" fill="#7a5a44"/><path d="M' + (x + 33) + ' 40v36" stroke="#3a5648" stroke-width="2"/>'; }); return s + '<path d="M84 200v-44h30v44z" fill="#4a3219"/>'; }
    return s + '<rect x="68" y="50" width="64" height="74" fill="#5a7a6a"/><path d="M100 50v74M68 68h64M68 86h64M68 104h64" stroke="#3a5648" stroke-width="2"/><rect x="60" y="124" width="80" height="8" fill="#b89a72"/><circle cx="82" cy="118" r="8" fill="#b8322a"/><circle cx="96" cy="120" r="6" fill="#3f7a5a"/>';
  }
  function tower(k, x, sc) {
    var t = '<g transform="translate(' + x.toFixed(0) + ' 122) scale(' + sc.toFixed(2) + ')">';
    if (k === 'clock') return t + '<rect x="-15" y="-112" width="30" height="112" fill="#b08d5e"/><path d="M-15 -112v112" stroke="#8f6f44" stroke-width="5"/><path d="M-20 -112h40l-20 -28z" fill="#7a3a2a"/><circle cx="0" cy="-86" r="11" fill="#f6efd9" stroke="#4a3219" stroke-width="2.500"/><path d="M0 -86v-8M0 -86l5 3" stroke="#22201c" stroke-width="1.800"/></g>';
    return t + '<path d="M-9 0v-100h18v100z" fill="#c9a877"/><path d="M-9 -100v100" stroke="#a8875a" stroke-width="4"/><rect x="-13" y="-108" width="26" height="8" fill="#8a6a44"/><ellipse cx="0" cy="-110" rx="14" ry="4.500" fill="#5a4426"/><path d="M1 -114v-13q7 -4 9 2" stroke="#f6f3ea" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M10 -125l8 1" stroke="#c8402c" stroke-width="2"/></g>';
  }
  /* the view from a place, facing h: sky and towers, and three openings (left, ahead, right). 720 x 430 */
  X.view = function (id, h) {
    var r = seeded('v' + id), s = '', x, a, k, m = X.mid(id), i, hgt;
    s += '<defs><clipPath id="bzArch"><path d="' + ARCH + 'Z"/></clipPath></defs><rect width="720" height="430" fill="#f3d9a4"/><rect width="720" height="60" fill="#e8c489"/><circle cx="600" cy="38" r="60" fill="#fbeec4" opacity=".5"/>';
    ['clock', 'stork'].forEach(function (lm) {
      a = X.bearing(id, h, lm);
      if (Math.abs(a) <= 125) { var p = xy(id), dist = Math.sqrt(Math.pow(LM[lm].x - p[0], 2) + Math.pow(LM[lm].y - p[1], 2)); s += tower(lm, 360 + Math.max(-1, Math.min(1, a / 100)) * 322, lm === 'clock' ? 0.82 : Math.max(0.6, Math.min(0.95, 1.2 - dist * 0.09))); }
    });
    for (x = -10; x < 720; x += 46) { hgt = 10 + r() * 30; s += '<rect x="' + x + '" y="' + (122 - hgt).toFixed(0) + '" width="' + (30 + r() * 26).toFixed(0) + '" height="' + (hgt + 4).toFixed(0) + '" fill="' + (r() < 0.5 ? '#d8b986' : '#cba873') + '"/>'; }
    s += '<rect y="112" width="720" height="214" fill="#dcc092"/><path d="M0 112h720" stroke="#b89a72" stroke-width="5"/>';
    [['L', (h + 3) % 4, 30], ['A', h, 260], ['R', (h + 1) % 4, 490]].forEach(function (o) {
      var w = X.way(id, o[1]);
      s += '<svg class="vw-op' + (w ? ' go' : '') + '" data-d="' + o[0] + '" data-see="' + (w ? (w.arch ? 'arch' : w.trade) : X.wallAt(id, o[1])) + '" x="' + o[2] + '" y="120" width="200" height="200" viewBox="0 0 200 200">' + inside(id, o[1]) + '</svg>';
    });
    s += '<rect y="320" width="720" height="110" fill="#c9ab7c"/><path d="M0 320h720" stroke="#a88a5e" stroke-width="4"/><g stroke="#b3956a" stroke-width="2" opacity=".7"><path d="M0 352h720M0 392h720M90 320l-60 110M250 320l-30 110M470 320l30 110M630 320l60 110"/></g>';
    if (m === 'fountain') s += '<ellipse cx="360" cy="398" rx="128" ry="24" fill="#a8946c"/><ellipse cx="360" cy="390" rx="116" ry="19" fill="#5f93b0"/><path d="M350 390v-44h20v44z" fill="#b8a47a"/><ellipse cx="360" cy="346" rx="34" ry="8" fill="#a8946c"/><ellipse cx="360" cy="344" rx="26" ry="5" fill="#5f93b0"/><path d="M360 342q-26 -34 -36 10M360 342q26 -34 36 10" stroke="#e3f1f7" stroke-width="3" fill="none"/>';
    if (m === 'fish') s += '<g transform="translate(60 320) scale(1.600)">' + item('fish') + '</g><g transform="translate(560 320) scale(1.600)">' + item('fish') + '</g>' + cat(330, 420, '#c98a4a') + cat(400, 424, '#3a332c');
    if (!m) s += X.crowd('c' + id + h, 5, 20, 700, 356, 424, 0.7, 1.05);
    return s;
  };

  /* ---------- the picture from Mistress Veck's roof: the whole city, looking SOUTH (so east is on the left). 1000 x 420 ---------- */
  function RP(x, y) { var t = y / 4, s = 1 - 0.38 * t; return [500 + (3.5 - x) * 118 * s, 388 - 300 * (1 - Math.pow(Math.max(0, 1 - t), 1.3)) - Math.max(0, t - 1) * 70, s]; }
  X.rp = function (id) { var p = xy(id), q = RP(p[0], p[1]); return [q[0], q[1]]; };
  X.roof = function () {
    var r = seeded('roofs'), s = '', i, a, b, p, q, e, mx, my, w, c;
    function P(x, y) { var v = RP(x, y); return v[0].toFixed(1) + ' ' + v[1].toFixed(1); }
    s += '<rect width="1000" height="420" fill="#f1dcae"/><rect width="1000" height="74" fill="#e9c98f"/><path d="M0 74h1000v22H0z" fill="#fbf6e6"/><path d="M0 96h1000" stroke="#e3d6b4" stroke-width="2"/>';
    s += '<path d="M' + P(-0.7, 4.45) + 'L' + P(7.7, 4.45) + 'L' + P(7.9, -0.6) + 'L' + P(-0.9, -0.6) + 'Z" fill="#c4a070" stroke="#8a6a44" stroke-width="5"/>';
    s += '<path d="M' + P(7.55, 4.45) + 'L' + P(8.5, 4.45) + 'L' + P(8.9, -0.6) + 'L' + P(7.75, -0.6) + 'Z" fill="#6fa0b5"/>';
    for (i = 0; i < 150; i++) { p = RP(-0.5 + r() * 7.8, -0.4 + r() * 4.6); w = (16 + r() * 26) * p[2]; s += '<rect x="' + (p[0] - w / 2).toFixed(0) + '" y="' + (p[1] - w * 0.3).toFixed(0) + '" width="' + w.toFixed(0) + '" height="' + (w * 0.6).toFixed(0) + '" fill="' + ['#cfae7c', '#b8935f', '#d8ba88', '#bd9a6b'][i % 4] + '" stroke="#a5814f" stroke-width="1"/>'; }
    /* streets, far ones first */
    EDGE.slice().sort(function (u, v) { return xy(v[0])[1] + xy(v[1])[1] - xy(u[0])[1] - xy(u[1])[1]; }).forEach(function (ed) {
      a = xy(ed[0]); b = xy(ed[1]); p = RP(a[0], a[1]); q = RP(b[0], b[1]); w = 30 * (p[2] + q[2]) / 2; c = TR[ed[2]].col;
      if (ed[3]) {
        s += '<path d="M' + p[0].toFixed(1) + ' ' + (p[1] + w * 0.4).toFixed(1) + 'L' + q[0].toFixed(1) + ' ' + q[1].toFixed(1) + '" stroke="#8f7d4c" stroke-width="' + (w * 1.1).toFixed(1) + '"/>' +
          '<path d="M' + p[0].toFixed(1) + ' ' + (p[1] + w * 0.4).toFixed(1) + 'L' + q[0].toFixed(1) + ' ' + q[1].toFixed(1) + '" stroke="#b5a36c" stroke-width="' + (w * 1.1).toFixed(1) + '" stroke-dasharray="5 6"/>';
        return;
      }
      s += '<path d="M' + p[0].toFixed(1) + ' ' + p[1].toFixed(1) + 'L' + q[0].toFixed(1) + ' ' + q[1].toFixed(1) + '" stroke="#f0e0b8" stroke-width="' + w.toFixed(1) + '" stroke-linecap="round"/>';
    });
    EDGE.forEach(function (ed) {
      if (ed[3]) return;
      a = xy(ed[0]); b = xy(ed[1]); c = TR[ed[2]].col;
      [0.3, 0.7].forEach(function (f) {
        var v = RP(a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f), across = a[1] === b[1], d = 17 * v[2], z = 13 * v[2];
        [-1, 1].forEach(function (sg) { s += '<rect x="' + (v[0] + (across ? 0 : sg * d) - z / 2).toFixed(1) + '" y="' + (v[1] + (across ? sg * d * 0.8 : 0) - z / 2).toFixed(1) + '" width="' + z.toFixed(1) + '" height="' + z.toFixed(1) + '" fill="' + c + '" stroke="#5a4426" stroke-width=".8"/>'; });
      });
      mx = RP((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
      s += '<g transform="translate(' + (mx[0] - 11 * mx[2]).toFixed(1) + ' ' + (mx[1] - 17 * mx[2]).toFixed(1) + ') scale(' + (0.36 * mx[2]).toFixed(3) + ')">' + item(ed[2]).replace(/<g transform="translate\((20|44) 80\)".*?<\/g>/g, '') + '</g>';
    });
    /* arches on the near side of the street of arches: three open, one bricked up */
    ['3,1', '4,1', '5,1', '6,1'].forEach(function (id) {
      p = X.rp(id); var open = !!X.way(id, 0);
      s += '<path d="M' + (p[0] - 12) + ' ' + (p[1] + 27) + 'v-9q0 -11 12 -11t12 11v9z" fill="' + (open ? '#1c130c' : '#a8623a') + '" stroke="#f1ecdf" stroke-width="2.500"/>' + (open ? '' : '<path d="M' + (p[0] - 10) + ' ' + (p[1] + 14) + 'h20M' + (p[0] - 11) + ' ' + (p[1] + 20) + 'h22M' + p[0] + ' ' + (p[1] + 8) + 'v6M' + (p[0] - 5) + ' ' + (p[1] + 14) + 'v6M' + (p[0] + 6) + ' ' + (p[1] + 14) + 'v6" stroke="#e6d2b0" stroke-width="1.400"/>');
    });
    /* the square and its fountain, the fish, the Yard, the Salt Gate, the stork's tower */
    p = X.rp('2,1'); s += '<ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="46" ry="24" fill="#f0e0b8"/><ellipse cx="' + p[0] + '" cy="' + p[1] + '" rx="17" ry="8" fill="#5f93b0" stroke="#a8946c" stroke-width="4"/>';
    p = X.rp('7,1'); s += '<ellipse cx="' + (p[0] + 4) + '" cy="' + p[1] + '" rx="34" ry="24" fill="#dfe7e4"/>' + [[-14, -8], [6, -12], [-4, 6], [14, 4]].map(function (o) { return '<g transform="translate(' + (p[0] + o[0] - 8) + ' ' + (p[1] + o[1] - 12) + ') scale(.28)">' + item('fish') + '</g>'; }).join('');
    p = X.rp('4,4'); s += '<path d="M' + (p[0] - 44) + ' ' + (p[1] - 34) + 'h88v30h-88z" fill="#f6ecc8" stroke="#8a6a44" stroke-width="4"/>' + [[-30, -16], [-18, -24], [-4, -14], [10, -24], [24, -16], [32, -26]].map(function (o) { return '<ellipse cx="' + (p[0] + o[0]) + '" cy="' + (p[1] + o[1]) + '" rx="5" ry="2.600" fill="#6b4a2a"/>'; }).join('') +
      '<path d="M' + (p[0] + 40) + ' ' + (p[1] - 34) + 'v-22" stroke="#4a3219" stroke-width="2"/><path d="M' + (p[0] + 40) + ' ' + (p[1] - 56) + 'h16l-5 5 5 5h-16z" fill="#b8322a"/><rect x="' + (p[0] - 7) + '" y="' + (p[1] - 8) + '" width="14" height="8" fill="#4a3219"/>';
    p = X.rp('0,3'); s += '<path d="M' + (p[0] + 6) + ' ' + (p[1] - 22) + 'h26v40h-26z" fill="#a8875a" stroke="#6b4a2a" stroke-width="2"/><path d="M' + (p[0] + 6) + ' ' + (p[1] + 8) + 'v-10q0 -8 8 -8t8 8v10z" fill="#fbf3d9"/>';
    p = RP(7.25, 3); s += '<g transform="translate(' + p[0].toFixed(0) + ' ' + (p[1] + 8).toFixed(0) + ') scale(.6)"><path d="M-9 0v-100h18v100z" fill="#c9a877" stroke="#8a6a44" stroke-width="2"/><ellipse cx="0" cy="-104" rx="14" ry="4.500" fill="#5a4426"/><path d="M1 -108v-13q7 -4 9 2" stroke="#f6f3ea" stroke-width="3" fill="none" stroke-linecap="round"/></g>';
    /* where you stand */
    p = X.rp('6,0'); s += '<path d="M' + (p[0] - 34) + ' ' + (p[1] + 6) + 'h68v26h-68z" fill="#e6d2a4" stroke="#6b4a2a" stroke-width="3"/><text x="' + p[0] + '" y="' + (p[1] + 25) + '" text-anchor="middle" font-family="Josefin Sans,sans-serif" font-weight="700" font-size="13" letter-spacing="1.500" fill="#4a3219">YOU</text>';
    /* things to click: every street, and the places */
    EDGE.forEach(function (ed) {
      a = X.rp(ed[0]); b = X.rp(ed[1]);
      s += '<path class="rf-e" data-t="' + ed[2] + '" d="M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + 'L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + '" stroke="#fff" stroke-opacity="0" stroke-width="24" stroke-linecap="butt"/>';
    });
    [['2,1', 'fountain', 24], ['7,1', 'fishm', 30], ['4,4', 'yard', 40], ['0,3', 'gate', 26], ['6,0', 'you', 30]].forEach(function (f) { p = X.rp(f[0]); s += '<circle class="rf-e" data-t="' + f[1] + '" cx="' + (p[0] + (f[1] === 'gate' ? 18 : 0)) + '" cy="' + (p[1] + (f[1] === 'yard' ? -18 : f[1] === 'you' ? 18 : 0)) + '" r="' + f[2] + '" fill="#fff" fill-opacity="0"/>'; });
    p = X.rp('4,1'); s += '<circle class="rf-e" data-t="bricked" cx="' + p[0] + '" cy="' + (p[1] + 18) + '" r="13" fill="#fff" fill-opacity="0"/>';
    p = RP(7.25, 3); s += '<rect class="rf-e" data-t="storkt" x="' + (p[0] - 12) + '" y="' + (p[1] - 60) + '" width="24" height="70" fill="#fff" fill-opacity="0"/>';
    return s + '<g id="rf-s" style="display:none"><circle r="9" fill="#b8322a" stroke="#fff" stroke-width="2.500"/><circle cy="-11" r="5" fill="#e2bc94" stroke="#fff" stroke-width="1.500"/></g>';
  };

  /* ---------- somebody walks a written way: out of the Yard gate, by what the note says she will pass ----------
     n = {past, cross, between, facing, turn: 'left'|'right', nth: 1.., side: 'left'|'right'}  (trades and things by their keys)
     Returns {path: [places], stop: the first line that did not fit ('past', 'cross', 'between', 'facing', 'count'), saw: what was
     really there, end: the trade of the roofed lane she went into, at: where she is} */
  X.walkNote = function (n) {
    var at = '4,4', h = 0, path = [at], e, l, r, side, cnt = 0, a;
    e = X.way(at, h);
    if (!e || e.trade !== n.past) return { stop: 'past', saw: e ? e.trade : 'wall', at: at, path: path };
    at = e.to; path.push(at);
    l = X.way(at, 3); r = X.way(at, 1);
    if (!(l && r && l.trade === n.cross && r.trade === n.cross)) return { stop: 'cross', saw: l ? l.trade : 'wall', at: at, path: path };
    e = X.way(at, h);
    if (!e || e.trade !== n.between) return { stop: 'between', saw: e ? e.trade : 'wall', at: at, path: path };
    while ((e = X.way(at, h)) && !e.arch) { at = e.to; path.push(at); }
    a = e ? 'arch' : X.wallAt(at, h);
    if (a !== n.facing) return { stop: 'facing', saw: a, at: at, path: path };
    h = n.turn === 'left' ? (h + 3) % 4 : (h + 1) % 4; side = n.side === 'left' ? (h + 3) % 4 : (h + 1) % 4;
    while ((e = X.way(at, h)) && !e.arch) {
      at = e.to; path.push(at);
      a = X.way(at, side);
      if (a && a.arch && ++cnt === n.nth) { path.push(a.to); return { end: a.trade, at: a.to, path: path }; }
      if (X.mid(at)) break;
    }
    return { stop: 'count', saw: X.mid(at) || 'wall', cnt: cnt, at: at, path: path };
  };
  return X;
})();
