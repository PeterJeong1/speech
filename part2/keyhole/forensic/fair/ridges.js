/* A Smell of Vinegar - fingerprints. None of them is a real person's: each one is grown by rule from a number,
   the way a real one grows from a few fixed points (a core, a delta) and the pull of its neighbours.

   RIDGES.get(card, finger)   a print: {cls: 'a' | 'l' | 'w', lines: [[[x, y] ...] ...], closed: [bool ...],
                              min: [{x, y, t}] (t: 'e' ridge ending, 'f' fork, 'i' island), core: [x, y], deltas: [[x, y] ...]}
                              in a box of 200 x 260; finger 0-4 = right thumb to right little finger, 5-9 = left
   RIDGES.d(print)            the same print as the "d" of one SVG path
   RIDGES.cls(card, finger)   only the pattern
   Loaded before the room's own script. Nothing in here knows an answer. */
(function (root) {
'use strict';
var W = 200, H = 260, DSEP = 6.4, DTEST = 3.5, STEP = 0.8, GUARD = 44, ALL = 1e9;

/* the eight cards in the box: right hand, then left hand, thumb first. a arch, l loop, w whorl, d a whorl made of two loops */
var CARDS = { 1: 'lllwllllwl', 2: 'wlllllwall', 3: 'wlllldllwl', 4: 'lawllwllwl', 5: 'wlallwllll', 6: 'dllwlllwll', 7: 'lwllwwllwl', 8: 'lllawlllll' };

function rng(seed) {
  var s = (seed >>> 0) || 7;
  return function () { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}
function inside(x, y) {
  var u = Math.abs(x - 100) / 92, v = Math.abs(y - 132) / (y < 132 ? 122 : 118);
  return u * u * Math.sqrt(u) + v * v * Math.sqrt(v) < 1;
}

/* where the fixed points of this finger are */
function spec(kind, seed, left) {
  var R = rng(seed * 7919 + 13), p = { kind: kind, cls: kind === 'd' ? 'w' : kind, seed: seed, cores: [], deltas: [] }, side, sep, off, ox;
  R(); R();
  p.ax = 100 + (R() - 0.5) * 8; p.k = 0.0040 + R() * 0.0016; p.y0 = 206 + R() * 12; p.hh = 150; p.A = 0;
  if (kind === 'a') { p.A = 30 + R() * 14; p.s = 30 + R() * 9; p.ym = 150 + R() * 12; p.sy = 44 + R() * 8; p.core = [p.ax, p.ym - 14]; }
  if (kind === 'l') {
    side = left ? -1 : 1; if (R() < 0.1) side = -side;                  /* most loops open towards the little finger */
    p.cores = [[100 + side * (1 + R() * 8), 112 + R() * 14]];
    p.deltas = [[100 - side * (40 + R() * 12), 184 + R() * 14]];
    p.core = p.cores[0];
  }
  if (kind === 'w' || kind === 'd') {
    sep = kind === 'd' ? 19 + R() * 6 : 4 + R() * 6; off = kind === 'd' ? (R() < 0.5 ? -1 : 1) * (7 + R() * 5) : (R() - 0.5) * 6; ox = (R() - 0.5) * 8;
    p.cores = [[100 + ox - off, 120 - sep], [100 + ox + off, 120 + sep]];
    p.deltas = [[44 + R() * 10, 192 + R() * 12], [156 - R() * 10, 192 + R() * 12]];
    p.core = [100 + ox, 120];
  }
  return p;
}

/* the direction the ridges run at (x, y): an angle, the same for t and t + 180 degrees */
function fieldOf(p) {
  var cs = p.cores, ds = p.deltas;
  return function (x, y) {
    var t = 0, i, tt, slope, u;
    for (i = 0; i < cs.length; i++) t += 0.5 * Math.atan2(cs[i][1] - y, x - cs[i][0]);
    for (i = 0; i < ds.length; i++) t -= 0.5 * Math.atan2(ds[i][1] - y, x - ds[i][0]);
    tt = (p.y0 - y) / p.hh; if (tt < 0) tt = 0;
    slope = -2 * p.k * tt * tt * (x - p.ax);
    if (p.A) { u = (x - p.ax) / p.s; tt = (y - p.ym) / p.sy; slope -= p.A * Math.exp(-tt * tt) * 2 * u / p.s * Math.exp(-u * u); }
    return t + Math.atan(slope);
  };
}

function grow(p) {
  var f = fieldOf(p), R = rng(p.seed * 104729 + 71), cell = DSEP, gw = Math.ceil(W / cell) + 1, gh = Math.ceil(H / cell) + 1, grid = new Array(gw * gh);
  var lines = [], queue = [], sing = p.cores.concat(p.deltas), qi = 0;

  function put(x, y, lid, idx) { var c = (y / cell | 0) * gw + (x / cell | 0); (grid[c] || (grid[c] = [])).push(x, y, lid, idx); }
  function unput(lid) { for (var c = 0, a, k; c < grid.length; c++) { a = grid[c]; if (!a) continue; for (k = a.length - 4; k >= 0; k -= 4) if (a[k + 2] === lid) a.splice(k, 4); } }
  /* the nearest stored point within d; points of line lid whose index is within guard of idx do not count */
  function near(x, y, d, lid, idx, guard) {
    var cx = x / cell | 0, cy = y / cell | 0, r = Math.ceil(d / cell), best = null, bd = d * d, i, j, a, k, dx, dy, q;
    for (j = cy - r; j <= cy + r; j++) {
      if (j < 0 || j >= gh) continue;
      for (i = cx - r; i <= cx + r; i++) {
        if (i < 0 || i >= gw) continue;
        a = grid[j * gw + i]; if (!a) continue;
        for (k = 0; k < a.length; k += 4) {
          if (a[k + 2] === lid && Math.abs(a[k + 3] - idx) < guard) continue;
          dx = a[k] - x; dy = a[k + 1] - y; q = dx * dx + dy * dy;
          if (q < bd) { bd = q; best = [a[k], a[k + 1], a[k + 2], a[k + 3]]; }
        }
      }
    }
    return best;
  }
  function atSing(x, y) { for (var i = 0, dx, dy; i < sing.length; i++) { dx = sing[i][0] - x; dy = sing[i][1] - y; if (dx * dx + dy * dy < 5.3) return true; } return false; }
  function stepFrom(x, y, px, py) {
    var t = f(x, y), dx = Math.cos(t), dy = -Math.sin(t), ex, ey;
    if (dx * px + dy * py < 0) { dx = -dx; dy = -dy; }
    t = f(x + dx * STEP * 0.5, y + dy * STEP * 0.5); ex = Math.cos(t); ey = -Math.sin(t);
    if (ex * dx + ey * dy < 0) { ex = -ex; ey = -ey; }
    return [x + ex * STEP, y + ey * STEP, ex, ey];
  }
  function trace(sx, sy, lid) {
    var t = f(sx, sy), d0x = Math.cos(t), d0y = -Math.sin(t), pts = [[sx, sy]], ends = [null, null], closed = false, pass, x, y, px, py, n, s, b, idx, arr;
    put(sx, sy, lid, 0);
    for (pass = 0; pass < 2 && !closed; pass++) {
      x = sx; y = sy; px = pass ? -d0x : d0x; py = pass ? -d0y : d0y; n = 0; arr = [];
      while (n < 1100) {
        s = stepFrom(x, y, px, py); x = s[0]; y = s[1]; px = s[2]; py = s[3]; n++; idx = pass ? -n : n;
        if (!inside(x, y)) { ends[pass] = { why: 'edge' }; break; }
        if (atSing(x, y)) { ends[pass] = { why: 'core' }; break; }
        b = near(x, y, DTEST, lid, idx, GUARD);
        if (b) {
          if (b[2] === lid && pass === 0 && Math.abs(b[3]) <= 4 && n > 30) { closed = true; break; }
          ends[pass] = { why: 'near', b: b }; break;
        }
        arr.push([x, y]); put(x, y, lid, idx);
      }
      if (!ends[pass] && !closed) ends[pass] = { why: 'long' };
      if (pass === 0) pts = pts.concat(arr); else pts = arr.reverse().concat(pts);
    }
    return { pts: pts, ends: ends, closed: closed, id: lid };       /* ends[0] belongs to the last point, ends[1] to the first */
  }
  function add(sx, sy) {
    if (!inside(sx, sy) || atSing(sx, sy) || near(sx, sy, DSEP * 0.95, -1, 0, 0)) return;
    var lid = lines.length, L = trace(sx, sy, lid), i, pt, t, nx, ny;
    if (!L.closed && L.pts.length * STEP < DSEP * 0.9) { unput(lid); lines.push(null); return; }
    lines.push(L);
    for (i = 0; i < L.pts.length; i += 3) {
      pt = L.pts[i]; t = f(pt[0], pt[1]); nx = Math.sin(t); ny = Math.cos(t);
      queue.push([pt[0] + nx * DSEP, pt[1] + ny * DSEP], [pt[0] - nx * DSEP, pt[1] - ny * DSEP]);
    }
  }
  add(100, 236);
  while (qi < queue.length) { add(queue[qi][0], queue[qi][1]); qi++; }

  /* what each loose end becomes: it runs into its neighbour (a fork), or it stops short of it (a ridge ending);
     a very short ridge with two loose ends is an island */
  var min = [], out = [], shut = [];
  function crowded(pt, lid) { return !!near(pt[0], pt[1], DSEP * 0.78, lid, 0, ALL); }
  lines.forEach(function (L) {
    if (!L) return;
    if (L.closed) { out.push(L.pts); shut.push(true); return; }
    var n = L.pts.length, a = 0, b = n, head = null, tail = null, e, E, B, bl, j, dj, pt, q, mid, cut, keep;
    if (L.ends[0].why === 'near' && L.ends[1].why === 'near' && n * STEP < DSEP * 3.1) {
      cut = Math.round(DSEP * 0.42 / STEP);
      if (n - 2 * cut < 4 || R() < 0.3) return;
      keep = L.pts.slice(cut, n - cut); mid = keep[keep.length >> 1];
      out.push(keep); shut.push(false); min.push({ x: mid[0], y: mid[1], t: 'i' });
      return;
    }
    for (e = 0; e < 2; e++) {
      E = L.ends[e];
      pt = e ? L.pts[0] : L.pts[n - 1];
      if (E.why === 'core') { min.push({ x: pt[0], y: pt[1], t: 'e', rod: 1 }); continue; }
      if (E.why !== 'near') continue;
      B = E.b; bl = lines[B[2]]; j = -1;
      if (bl && B[2] !== L.id && n > 24 && R() < 0.46) {              /* a fork: run on into the neighbour, a little way ahead */
        q = e ? L.pts[6] : L.pts[n - 7]; dj = 0;
        bl.pts.forEach(function (bp, bi) {
          var dx = bp[0] - B[0], dy = bp[1] - B[1], along = dx * (pt[0] - q[0]) + dy * (pt[1] - q[1]), dd = dx * dx + dy * dy;
          if (bi < 20 || bi > bl.pts.length - 21 || along <= 0 || dd < 40 || dd > 90) return;
          if (j < 0 || dd < dj) { j = bi; dj = dd; }
        });
      }
      if (j >= 0) {
        q = bl.pts[j]; mid = [(pt[0] + q[0]) / 2 + (B[0] - pt[0]) * 0.2, (pt[1] + q[1]) / 2 + (B[1] - pt[1]) * 0.2];
        if (e) head = [[q[0], q[1]], mid]; else tail = [mid, [q[0], q[1]]];
        min.push({ x: q[0], y: q[1], t: 'f' });
        continue;
      }
      cut = 0;                                                       /* a ridge ending: step back until there is room on both sides */
      if (e) { while (cut < 16 && a < b - 8 && crowded(L.pts[a], L.id)) { a++; cut++; } pt = L.pts[a]; }
      else { while (cut < 16 && b - 1 > a + 8 && crowded(L.pts[b - 1], L.id)) { b--; cut++; } pt = L.pts[b - 1]; }
      min.push({ x: pt[0], y: pt[1], t: 'e' });
    }
    keep = L.pts.slice(a, b);
    if (head) keep = head.concat(keep);
    if (tail) keep = keep.concat(tail);
    out.push(keep); shut.push(false);
  });

  /* islands: here and there a ridge is broken twice, and a short piece of it stands alone */
  var want = 5 + (R() * 3 | 0), tries = 0, li, pts, n, i, c, ok, k, GAP = 7, LEN, rest;
  function far(x, y, d) {
    var m, dx, dy;
    for (m = 0; m < min.length; m++) { dx = min[m].x - x; dy = min[m].y - y; if (dx * dx + dy * dy < d * d) return false; }
    for (m = 0; m < sing.length; m++) { dx = sing[m][0] - x; dy = sing[m][1] - y; if (dx * dx + dy * dy < 196) return false; }
    return true;
  }
  while (want > 0 && tries++ < 400) {
    li = R() * out.length | 0; pts = out[li]; n = pts.length; LEN = 9 + (R() * 5 | 0);
    if (n < 120) continue;
    i = 30 + (R() * (n - 60 - 2 * GAP - LEN) | 0); c = pts[i + GAP + (LEN >> 1)];
    ok = Math.abs(c[0] - p.core[0]) < 66 && Math.abs(c[1] - p.core[1]) < 74 && inside(100 + (c[0] - 100) * 1.25, 132 + (c[1] - 132) * 1.2) && far(c[0], c[1], 13);
    if (!ok) continue;
    rest = pts.slice(i + 2 * GAP + LEN);
    if (shut[li]) { out[li] = rest.concat(pts.slice(0, i)); shut[li] = false; }
    else { out[li] = pts.slice(0, i); out.push(rest); shut.push(false); }
    out.push(pts.slice(i + GAP, i + GAP + LEN)); shut.push(false);
    min.push({ x: c[0], y: c[1], t: 'i' });
    want--;
  }
  return { cls: p.cls, kind: p.kind, lines: out, closed: shut, min: min, core: p.core, deltas: p.deltas, cores: p.cores };
}

var cache = {}, OWN = { '4.2': 281 };               /* one finger was chosen for the clearness of its details */
function get(card, finger) {
  var key = card + '.' + finger;
  if (!cache[key]) cache[key] = grow(spec(CARDS[card].charAt(finger), OWN[key] || card * 31 + finger * 7 + 3, finger > 4));
  return cache[key];
}
function r1(v) { return Math.round(v * 10) / 10; }
/* one SVG path for the whole print; points that add nothing to the shape are left out */
function d(print) {
  var s = '';
  print.lines.forEach(function (pts, li) {
    var i, last = pts[0], lx = pts[1][0] - pts[0][0], ly = pts[1][1] - pts[0][1], p, dx, dy, c, len;
    s += 'M' + r1(last[0]) + ' ' + r1(last[1]);
    for (i = 1; i < pts.length - 1; i++) {
      p = pts[i]; dx = pts[i + 1][0] - p[0]; dy = pts[i + 1][1] - p[1];
      c = (dx * lx + dy * ly) / Math.sqrt((dx * dx + dy * dy) * (lx * lx + ly * ly) || 1);
      len = (p[0] - last[0]) * (p[0] - last[0]) + (p[1] - last[1]) * (p[1] - last[1]);
      if (c < 0.988 || len > 49) { s += 'L' + r1(p[0]) + ' ' + r1(p[1]); last = p; lx = dx; ly = dy; }
    }
    p = pts[pts.length - 1]; s += 'L' + r1(p[0]) + ' ' + r1(p[1]) + (print.closed[li] ? 'Z' : '');
  });
  return s;
}
/* the clearest details of a print inside an oval: the ones that stand well apart from every other detail, some of each kind */
function pick(print, cx, cy, rx, ry, n) {
  function d2(a, b) { return (a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y); }
  var mid = { x: cx, y: cy }, out = [], order = 'efiefiefiefi', k, c;
  var ok = print.min.filter(function (m, i) {
    var u = (m.x - cx) / rx, v = (m.y - cy) / ry;
    return !m.rod && u * u + v * v < 1 && print.min.every(function (o, j) { return j === i || d2(o, m) > 100; });
  });
  function free(m) { return out.indexOf(m) < 0 && out.every(function (o) { return d2(o, m) > 324; }); }
  function room(m) { return out.reduce(function (a, o) { return Math.min(a, d2(o, m)); }, 1e9); }
  for (k = 0; k < order.length * 2 && out.length < n; k++) {
    c = ok.filter(function (m) { return (k >= order.length || m.t === order.charAt(k)) && free(m); });
    if (out.length) c.sort(function (a, b) { return room(b) - room(a); });           /* as far as can be from the ones already taken */
    else c.sort(function (a, b) { return d2(a, mid) - d2(b, mid); });
    if (c.length) out.push(c[0]);
  }
  out.sort(function (a, b) { return Math.atan2(a.y - cy, a.x - cx) - Math.atan2(b.y - cy, b.x - cx); });
  return out;
}
/* is there a detail of this kind at (x, y) on this print? (within r) */
function has(print, x, y, t, r) {
  return print.min.some(function (m) { return m.t === t && (m.x - x) * (m.x - x) + (m.y - y) * (m.y - y) < r * r; });
}
root.RIDGES = { get: get, d: d, pick: pick, has: has, cls: function (card, finger) { var k = CARDS[card].charAt(finger); return k === 'd' ? 'w' : k; },
  cards: function () { return Object.keys(CARDS).map(Number); }, inside: inside, spec: spec, grow: grow, W: W, H: H, DSEP: DSEP };
if (typeof module !== 'undefined' && module.exports) module.exports = root.RIDGES;
})(typeof window !== 'undefined' ? window : globalThis);
