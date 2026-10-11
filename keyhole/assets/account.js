/* KEYHOLE accounts: a name and a password, a saved game that follows the player to another computer,
   and this week's records. Loaded by the corridor and the story lists, and by engine.js in every room.

   Where things are kept
     in the browser   keyhole.user              who is signed in here: {name, id, key}
                      keyhole.v2@<id>           that player's saved game (engine.js and shelf.js read and write it)
                      keyhole.v2                the game of somebody playing without a name
                      keyhole.accounts          the players this computer has seen: {id: {name, key}}
                      keyhole.sent@<id>         what has reached the record book: {story: upd}
     in the record book (a Google Sheet behind a small web app, recordbook/Code.gs; its address is in src/config.json
                      and build.py writes it in below): the players, a copy of every saved game, and one tab of
                      finished stories for each week.
   With no address the whole thing sleeps: no card, no plate, no records. (engine.js still keeps the time played, so a
   story begun now has a true record on the day the record book is switched on.) With an address but no connection,
   a player this computer has seen before can still come in, and what was not sent is sent later.

   A record is the time really played plus two minutes for every hint. Only the first time a player finishes a story
   counts, and a run that skipped a room does not count at all.

   The password itself is never stored or sent: only a one-way hash of it (the "key"). */
(function () {
'use strict';
var D = document, A = window.Account = {}, BASE = 'keyhole.v2';
var API = "";
if (window.KEYHOLE_API_OVERRIDE != null) API = String(window.KEYHOLE_API_OVERRIDE);
A.HINT = 120;                    /* one hint counts as two minutes */

/* ---------- small things ---------- */
function get(k, d) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } }
function put(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function el(t, c, h) { var e = D.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
A.clock = function (secs) { secs = Math.max(0, Math.round(secs)); var m = Math.floor(secs / 60), s = secs % 60; return m + ':' + (s < 10 ? '0' : '') + s; };
A.score = function (secs, hints) { return Math.round(secs) + (hints || 0) * A.HINT; };
function hintWord(n) { return n ? n + (n === 1 ? ' hint' : ' hints') : 'no hints'; }
function norm(name) { return String(name == null ? '' : name).replace(/\s+/g, ' ').trim().slice(0, 20); }
function idOf(name) { return norm(name).toLowerCase(); }
/* a name begins with a letter or a number and has letters, numbers, spaces, and . _ - (the record book has the same rule) */
var NAME_OK; try { NAME_OK = new RegExp('^[\\p{L}\\p{N}][\\p{L}\\p{N} ._-]*$', 'u'); } catch (e) { NAME_OK = /^[^\s=+\-@'"<>&.][^=+@'"<>&]*$/; }

/* SHA-256 of a string (as UTF-8), in hex. Whole numbers only, so every browser gives the same answer. */
var K256 = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
var H256 = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
function sha256(str) {
  var K = K256, H = H256.slice(), i, j, w = [], bytes = unescape(encodeURIComponent(str)), len = bytes.length, m = [];
  for (i = 0; i < len; i++) m[i >> 2] |= bytes.charCodeAt(i) << (24 - (i % 4) * 8);
  m[len >> 2] |= 0x80 << (24 - (len % 4) * 8);
  m[((len + 8) >> 6 << 4) + 15] = len * 8;
  for (i = 0; i < m.length; i += 16) {
    var a = H[0], b = H[1], cc = H[2], d = H[3], e = H[4], f = H[5], g = H[6], h = H[7];
    for (j = 0; j < 64; j++) {
      if (j < 16) w[j] = m[i + j] | 0;
      else { var x = w[j - 15], y = w[j - 2]; w[j] = (((x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ (x >>> 3)) + w[j - 7] + ((y >>> 17 | y << 15) ^ (y >>> 19 | y << 13) ^ (y >>> 10)) + w[j - 16]) | 0; }
      var t1 = (h + ((e >>> 6 | e << 26) ^ (e >>> 11 | e << 21) ^ (e >>> 25 | e << 7)) + ((e & f) ^ (~e & g)) + K[j] + w[j]) | 0;
      var t2 = (((a >>> 2 | a << 30) ^ (a >>> 13 | a << 19) ^ (a >>> 22 | a << 10)) + ((a & b) ^ (a & cc) ^ (b & cc))) | 0;
      h = g; g = f; f = e; e = (d + t1) | 0; d = cc; cc = b; b = a; a = (t1 + t2) | 0;
    }
    H[0] = (H[0] + a) | 0; H[1] = (H[1] + b) | 0; H[2] = (H[2] + cc) | 0; H[3] = (H[3] + d) | 0; H[4] = (H[4] + e) | 0; H[5] = (H[5] + f) | 0; H[6] = (H[6] + g) | 0; H[7] = (H[7] + h) | 0;
  }
  return H.map(function (v) { return ('0000000' + (v >>> 0).toString(16)).slice(-8); }).join('');
}
A.sha256 = sha256;

/* ---------- who is here ---------- */
A.user = function () { var u = get('keyhole.user', null); return u && u.id ? u : null; };
A.storeKey = function (id) { if (id == null) id = A.user() ? A.user().id : ''; return BASE + (id ? '@' + id : ''); };
A.online = function () { return !!API; };
function store(id) { return get(A.storeKey(id), {}); }
function isStory(k) { return k.indexOf('/') > 0; }
function inRoom() { return !!(window.ER && ER.cfg && ER.cfg.story); }

/* ---------- the record book ---------- */
function call(payload, ms) {
  return new Promise(function (res, rej) {
    if (!API || !window.fetch) { rej(new Error('offline')); return; }
    var over = false, t = setTimeout(function () { if (!over) { over = true; rej(new Error('timeout')); } }, ms || 25000);
    /* sent as plain text: a browser then asks the record book no question beforehand (which it could not answer) */
    fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload), redirect: 'follow' })
      .then(function (r) { return r.json(); })
      .then(function (j) { if (!over) { over = true; clearTimeout(t); res(j); } }, function (e) { if (!over) { over = true; clearTimeout(t); rej(e); } });
  });
}

/* ---------- coming in ---------- */
function signIn(user, cloud, made) {
  var mine = store(user.id), guest, sent = get('keyhole.sent@' + user.id, {}), k, known = get('keyhole.accounts', {});
  if (made && !Object.keys(mine).filter(isStory).length) {          /* a new name takes over the game played here without one */
    guest = store('');
    Object.keys(guest).filter(isStory).forEach(function (s) { mine[s] = guest[s]; delete guest[s]; });
    put(A.storeKey(''), guest);
  }
  for (k in (cloud || {})) {
    if (!mine[k] || (cloud[k].upd || 0) >= (mine[k].upd || 0)) { mine[k] = cloud[k]; sent[k] = cloud[k].upd || 0; }
  }
  put(A.storeKey(user.id), mine); put('keyhole.sent@' + user.id, sent);
  known[user.id] = { name: user.name, key: user.key }; put('keyhole.accounts', known);
  put('keyhole.user', user);
  try { sessionStorage.removeItem('keyhole.guest'); } catch (e) {}
}
/* -> a promise of {ok: true} or {ok: false, err}:  'name' no name · 'chars' a name the record book would not take ·
      'short' password under four characters · 'new' nobody has this name yet, or its password was cleared by the teacher
      (reset: true): ask for the password again, then call with make = true · 'pass' the name is taken and this is not
      its password · 'net' the record book cannot be reached */
A.enter = function (name, pass, make) {
  name = norm(name);
  var id = idOf(name), key, known = get('keyhole.accounts', {});
  if (!id) return Promise.resolve({ ok: false, err: 'name' });
  if (!NAME_OK.test(name)) return Promise.resolve({ ok: false, err: 'chars' });
  if (String(pass || '').length < 4) return Promise.resolve({ ok: false, err: 'short' });
  key = sha256('keyhole|' + id + '|' + pass);
  function here() {                                                   /* this computer's own list of players */
    if (known[id]) { if (known[id].key !== key) return { ok: false, err: 'pass' }; signIn({ name: known[id].name, id: id, key: key }, null, false); return { ok: true, local: true }; }
    if (!make) return { ok: false, err: 'new' };
    signIn({ name: name, id: id, key: key }, null, true); return { ok: true, local: true, made: true };
  }
  if (!API) return Promise.resolve(here());
  return call({ a: 'enter', name: name, key: key, make: !!make }).then(function (r) {
    if (r && r.ok) signIn({ name: r.name || name, id: id, key: key }, r.saves, !!r.made);
    return r && (r.ok || r.err === 'new' || r.err === 'pass' || r.err === 'chars') ? r : { ok: false, err: 'net' };
  }, function () {
    if (known[id] && known[id].key === key) { signIn({ name: known[id].name, id: id, key: key }, null, false); return { ok: true, local: true }; }
    return { ok: false, err: 'net' };
  });
};
A.leave = function () { try { localStorage.removeItem('keyhole.user'); } catch (e) {} };

/* ---------- keeping the record book up to date ---------- */
var busy = false;
/* send every story of the player's that has changed since it was last sent (one at a time) */
A.flush = function () {
  var u = A.user(); if (!u || !API || busy) return Promise.resolve(false);
  var mine = store(u.id), sent = get('keyhole.sent@' + u.id, {}), k = Object.keys(mine).filter(function (s) { return isStory(s) && (mine[s].upd || 0) > (sent[s] || 0); })[0];
  if (!k) return Promise.resolve(false);
  busy = true;
  return call({ a: 'save', name: u.name, key: u.key, story: k, upd: mine[k].upd, data: mine[k] }).then(function (r) {
    busy = false;
    if (r && r.ok) { sent = get('keyhole.sent@' + u.id, {}); sent[k] = mine[k].upd; put('keyhole.sent@' + u.id, sent); return A.flush(); }
    return false;
  }, function () { busy = false; return false; });
};
/* as the page goes away: one last copy of the story being played */
function farewell(k) {
  var u = A.user(), mine, blob; if (!u || !API || !navigator.sendBeacon) return;
  mine = store(u.id); if (!mine[k]) return;
  try { blob = new Blob([JSON.stringify({ a: 'save', name: u.name, key: u.key, story: k, upd: mine[k].upd || Date.now(), data: mine[k] })], { type: 'text/plain;charset=utf-8' }); navigator.sendBeacon(API, blob); } catch (e) {}
}

/* ---------- this week's records ---------- */
function monday(t) { var d = new Date(t || Date.now()); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; }
function label(d) { var e = new Date(d.getTime() + 6 * 86400000 + 43200000), M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']; return d.getDate() + ' ' + M[d.getMonth()] + ' – ' + e.getDate() + ' ' + M[e.getMonth()]; }
function counts(f) { return f && !f.skipped && !f.again; }
function localRank() {                                                 /* the people who have played on this computer */
  var from = monday().getTime(), known = get('keyhole.accounts', {}), out = {}, id, st, k, f;
  for (id in known) {
    st = store(id);
    for (k in st) {
      f = isStory(k) && st[k].fin;
      if (!counts(f) || (f.at || 0) < from) continue;
      (out[k] = out[k] || { title: f.title || k, stars: f.stars || 0, rows: [] }).rows.push({ name: known[id].name, secs: f.secs, hints: f.hints || 0, score: A.score(f.secs, f.hints) });
    }
  }
  for (k in out) out[k].rows.sort(function (a, b) { return a.score - b.score; });
  return { ok: true, local: true, label: label(monday()), stories: out };
}
/* -> a promise of {label: '5 Oct – 11 Oct', stories: {'cipher/wrong': {title, stars, rows: [{name, secs, hints, score}, ...]}}, local: true|undefined} */
A.rank = function () {
  if (!API) return Promise.resolve(localRank());
  return call({ a: 'rank' }).then(function (r) { return r && r.ok ? r : localRank(); }, function () { return localRank(); });
};
/* A finished story goes into the week's records (once). st is the story's saved state: st.fin is marked here, and
   the caller saves it. -> a promise of the answer ({ok, rank, of} · {ok, again: true} · null: not sent) */
function report(k, st) {
  var u = A.user(), f = st.fin, p = k.split('/');
  if (!u || !counts(f) || f.sent) return Promise.resolve(null);
  if (!API) {
    f.sent = 1;
    var rows = (localRank().stories[k] || { rows: [] }).rows.filter(function (r) { return r.name.toLowerCase() !== u.id; }), mineScore = A.score(f.secs, f.hints);
    return Promise.resolve({ ok: true, local: true, rank: rows.filter(function (r) { return r.score <= mineScore; }).length + 1, of: rows.length + 1 });
  }
  return call({ a: 'finish', name: u.name, key: u.key, theme: p[0], story: p[1], title: f.title || '', stars: f.stars || 0, secs: f.secs, hints: f.hints || 0, at: f.at })
    .then(function (r) {
      if (r && r.ok) { f.sent = 1; if (r.again) f.again = 1; else { f.rank = r.rank; f.of = r.of; } }
      return r;
    }, function () { return null; });
}
/* on the corridor and the lists: a finished story that could not be sent when it was finished */
function pending() {
  var u = A.user(); if (!u || inRoom()) return Promise.resolve();
  var mine = store(u.id), k = Object.keys(mine).filter(function (s) { var f = isStory(s) && mine[s].fin; return counts(f) && !f.sent; })[0];
  if (!k) return Promise.resolve();
  return report(k, mine[k]).then(function (r) {
    if (!r || !r.ok) return;
    mine = store(u.id); if (!mine[k] || !mine[k].fin) return;
    mine[k].fin.sent = 1; if (r.again) mine[k].fin.again = 1; else { mine[k].fin.rank = r.rank; mine[k].fin.of = r.of; }
    mine[k].upd = Date.now(); put(A.storeKey(u.id), mine);
    return pending();
  });
}

/* ---------- what the player sees ---------- */
var CSS = '.ac-veil{position:fixed;top:0;right:0;bottom:0;left:0;z-index:95;display:flex;align-items:center;justify-content:center;background:rgba(4,7,9,.8);padding:20px;overflow:auto;-webkit-user-select:text;user-select:text}' +
  '.ac-card{width:440px;max-width:100%;padding:30px 34px 24px;background:#f3ecd9;color:#27231d;box-shadow:0 26px 70px rgba(0,0,0,.6);font-family:"EB Garamond",Georgia,serif;font-size:19px;line-height:1.4;text-align:left;letter-spacing:0;text-transform:none}' +
  '.ac-card h2{margin:0 0 4px;font-family:"Special Elite","Courier New",monospace;font-weight:normal;font-size:27px;color:#27231d}' +
  '.ac-card p{margin:0 0 14px}.ac-card small{display:block;margin:12px 0 0;font-size:15.5px;line-height:1.35;color:#6b6457}' +
  '.ac-card label{display:block;margin:12px 0 3px;font-family:"Oswald",Arial,sans-serif;font-size:12.5px;letter-spacing:.18em;text-transform:uppercase;color:#6b6457}' +
  '.ac-card input{display:block;width:100%;box-sizing:border-box;margin:0;padding:9px 11px;border:1px solid #27231d;border-radius:0;background:#fffdf6;color:#27231d;font:20px "Special Elite","Courier New",monospace;-webkit-user-select:text;user-select:text}' +
  '.ac-card .ac-msg{min-height:1.4em;margin:12px 0 0;color:#8c2f24;font-size:17px}' +
  '.ac-card button{display:block;width:100%;margin:12px 0 0;padding:12px 14px;border:1px solid #27231d;border-radius:0;background:#27231d;color:#f3ecd9;font-family:"Oswald",Arial,sans-serif;font-size:15px;letter-spacing:.18em;text-transform:uppercase;cursor:pointer}' +
  '.ac-card button:hover{background:#000}.ac-card button[disabled]{opacity:.5;cursor:default}' +
  '.ac-card button.ac-quiet{margin-top:6px;padding:8px 14px;border-color:transparent;background:transparent;color:#6b6457;font-size:12.5px}.ac-card button.ac-quiet:hover{background:transparent;color:#27231d}' +
  '.ac-chip{position:fixed;right:14px;top:12px;z-index:6;display:flex;height:36px;align-items:center;border:1px solid rgba(255,255,255,.24);border-radius:3px;background:rgba(8,8,9,.7);color:#efe9dc;font-family:"Oswald",Arial,sans-serif;font-size:14px;letter-spacing:.13em;text-transform:uppercase}' +
  '.ac-chip b{padding:0 12px;font-weight:500;color:#f4e04d;max-width:200px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}' +
  '.ac-chip button{height:34px;margin:0;padding:0 12px;border:0;border-left:1px solid rgba(255,255,255,.24);border-radius:0;background:transparent;color:inherit;font:inherit;letter-spacing:inherit;text-transform:inherit;cursor:pointer}.ac-chip button:hover{color:#f4e04d}' +
  '.ac-board{width:780px;max-width:100%;max-height:calc(100vh - 40px);box-sizing:border-box;overflow:auto;padding:28px 34px 24px;background:#f3ecd9;color:#27231d;box-shadow:0 26px 70px rgba(0,0,0,.6);font-family:"EB Garamond",Georgia,serif;font-size:18px;text-align:left;letter-spacing:0;text-transform:none}' +
  '.ac-board h2{margin:0;font-family:"Special Elite","Courier New",monospace;font-weight:normal;font-size:27px;color:#27231d}' +
  '.ac-board .ac-week{margin:2px 0 16px;font-family:"Oswald",Arial,sans-serif;font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#6b6457}' +
  '.ac-board h3{margin:20px 0 4px;font-family:"Oswald",Arial,sans-serif;font-weight:500;font-size:16px;letter-spacing:.08em;border-bottom:2px solid #27231d;padding-bottom:3px;color:#27231d}' +
  '.ac-board h3 i{font-style:normal;color:#8c2f24;letter-spacing:2px;margin-left:8px;font-size:14px}' +
  '.ac-board table{width:100%;border-collapse:collapse;font-size:17.5px}.ac-board td,.ac-board th{padding:3px 6px;border-bottom:1px solid #d6cdbb}' +
  '.ac-board th{font-family:"Oswald",Arial,sans-serif;font-weight:400;font-size:11.5px;letter-spacing:.16em;text-transform:uppercase;color:#6b6457;text-align:right}.ac-board th.l{text-align:left}' +
  '.ac-board td:first-child{width:34px;color:#6b6457}.ac-board td.n{width:96px;text-align:right;font-family:"Special Elite","Courier New",monospace;font-size:16px;white-space:nowrap}' +
  '.ac-board tr.me td{background:#f4e04d}.ac-board .ac-none{margin:18px 0;color:#6b6457}' +
  '.ac-board .ac-foot{margin:16px 0 0;font-size:15.5px;color:#6b6457;line-height:1.4}' +
  '.ac-board button{display:block;margin:14px 0 0 auto;padding:9px 22px;border:1px solid #27231d;border-radius:0;background:transparent;color:#27231d;font-family:"Oswald",Arial,sans-serif;font-size:13px;letter-spacing:.18em;text-transform:uppercase;cursor:pointer}.ac-board button:hover{background:#27231d;color:#f3ecd9}' +
  '.ac-note{position:fixed;left:50%;top:60px;transform:translateX(-50%);z-index:66;max-width:92vw;padding:10px 20px 9px;border:1px solid #27231d;background:#f3ecd9;color:#27231d;box-shadow:0 12px 34px rgba(0,0,0,.5);font-family:"Special Elite","Courier New",monospace;font-size:17px;line-height:1.35;text-align:center;cursor:pointer}' +
  '.ac-note b{font-weight:normal;background:#f4e04d;padding:0 4px}';
function css() { if (D.getElementById('ac-css')) return; var s = el('style'); s.id = 'ac-css'; s.textContent = CSS; D.head.appendChild(s); }
A.ui = {};
/* The card that asks who is playing. done(user or null) is called when it closes with an answer (null = without a name).
   o.cancel: the card can also be put away with nothing changed (done is then not called). */
A.ui.card = function (done, o) {
  css(); o = o || {};
  var veil = el('div', 'ac-veil'), card = el('form', 'ac-card'), step = 0, working = false;
  card.setAttribute('autocomplete', 'off');
  card.innerHTML = '<h2>Who is playing?</h2><p>A name and a password of your own keep your game for you, on this computer and on any other.</p>' +
    '<label for="ac-name">Name</label><input id="ac-name" type="text" maxlength="20" autocomplete="off" autocapitalize="off" spellcheck="false">' +
    '<label for="ac-pass">Password</label><input id="ac-pass" type="password" maxlength="40" autocomplete="off">' +
    '<div class="ac-again" style="display:none"><label for="ac-pass2">The same password once more</label><input id="ac-pass2" type="password" maxlength="40" autocomplete="off"></div>' +
    '<div class="ac-msg"></div><button type="submit" class="ac-go">Come in</button><button type="button" class="ac-quiet ac-guest">Play without a name</button>' +
    (o.cancel ? '<button type="button" class="ac-quiet ac-stay">Not now</button>' : '') +
    '<small>A nickname is fine. Choose a password that you do not use anywhere else. If you forget it, your teacher can let you choose a new one. Without a name, your game stays on this computer and is not in the records.</small>';
  veil.appendChild(card); D.body.appendChild(veil);
  var name = card.querySelector('#ac-name'), pass = card.querySelector('#ac-pass'), pass2 = card.querySelector('#ac-pass2'), msg = card.querySelector('.ac-msg'), go = card.querySelector('.ac-go');
  function say(t) { msg.textContent = t || ''; }
  function close() { if (veil.parentNode) veil.parentNode.removeChild(veil); }
  function fresh() { if (step) { step = 0; card.querySelector('.ac-again').style.display = 'none'; pass2.value = ''; go.textContent = 'Come in'; say(''); } }
  name.addEventListener('input', fresh);
  veil.addEventListener('keydown', function (e) { e.stopPropagation(); });        /* typing here is not for the page behind */
  card.addEventListener('submit', function (e) {
    e.preventDefault(); if (working) return;
    if (step === 1 && pass2.value !== pass.value) { say('The two passwords are not the same. Type them again.'); pass2.value = ''; pass2.focus(); return; }
    working = true; go.disabled = true; say(A.online() ? 'Looking in the record book …' : '');
    A.enter(name.value, pass.value, step === 1).then(function (r) {
      working = false; go.disabled = false;
      if (r.ok) { close(); if (done) done(A.user()); return; }
      if (r.err === 'name') { say('Type a name first.'); name.focus(); }
      else if (r.err === 'chars') { say('A name starts with a letter or a number, and has only letters, numbers and spaces.'); name.focus(); }
      else if (r.err === 'short') { say('A password needs four characters or more.'); pass.focus(); }
      else if (r.err === 'new') {
        step = 1; card.querySelector('.ac-again').style.display = 'block'; go.textContent = r.reset ? 'Keep this password' : 'Keep this name';
        say(r.reset ? 'Your teacher has cleared the old password. Type the new one once more.' : 'A new name. Type the password once more, and the name is yours.'); pass2.focus();
      }
      else if (r.err === 'pass') { say('That name is taken, and this is not its password.'); pass.value = ''; pass.focus(); }
      else say('The record book cannot be reached just now. Try again, or play without a name.');
    });
  });
  card.querySelector('.ac-guest').addEventListener('click', function () {
    A.leave(); try { sessionStorage.setItem('keyhole.guest', '1'); } catch (e) {}
    close(); if (done) done(null);
  });
  if (o.cancel) card.querySelector('.ac-stay').addEventListener('click', close);
  setTimeout(function () { try { name.focus(); } catch (e) {} }, 60);
  return veil;
};
/* this week's records */
A.ui.board = function () {
  css();
  var veil = el('div', 'ac-veil'), box = el('div', 'ac-board', '<h2>This week’s records</h2><div class="ac-week">…</div><div class="ac-list"><p class="ac-none">Opening the record book …</p></div>' +
    '<p class="ac-foot">Time is the time really played, and every hint adds two minutes. Only your first time through a story counts. The list starts again every Monday.</p><button type="button">Close</button>');
  veil.appendChild(box); D.body.appendChild(veil);
  function close() { if (veil.parentNode) veil.parentNode.removeChild(veil); }
  box.querySelector('button').addEventListener('click', close);
  veil.addEventListener('pointerdown', function (e) { if (e.target === veil) close(); });
  veil.addEventListener('keydown', function (e) { e.stopPropagation(); });
  A.rank().then(function (r) {
    var me = A.user(), keys = Object.keys(r.stories || {}).sort(), list = box.querySelector('.ac-list'), s = '';
    box.querySelector('.ac-week').textContent = (r.label || '') + (r.local ? ' · on this computer only' : '');
    keys.forEach(function (k) {
      var st = r.stories[k];
      s += '<h3>' + esc(st.title || k) + '<i>' + '★★★★★'.slice(0, st.stars || 0) + '</i></h3><table><tr><th></th><th class="l">Name</th><th>Time</th><th>Hints</th><th>Record</th></tr>';
      st.rows.slice(0, 10).forEach(function (row, i) {
        s += '<tr' + (me && String(row.name).toLowerCase() === me.id ? ' class="me"' : '') + '><td>' + (i + 1) + '</td><td>' + esc(row.name) + '</td><td class="n">' + A.clock(row.secs) + '</td><td class="n">' +
          hintWord(row.hints) + '</td><td class="n"><b>' + A.clock(row.score) + '</b></td></tr>';
      });
      s += '</table>';
    });
    list.innerHTML = s || '<p class="ac-none">Nobody has finished a story yet this week. The first name on this list could be yours.</p>';
  });
  return veil;
};
/* the small plate in the corner of the corridor and of the story lists: who is playing, the records, another player */
A.ui.chip = function () {
  if (!API) return null;
  css();
  var old = D.querySelector('.ac-chip'), u = A.user(), chip = el('div', 'ac-chip'), b;
  if (old) old.parentNode.removeChild(old);
  chip.appendChild(el('b', '', esc(u ? u.name : 'No name')));
  b = el('button', 'ac-rec', 'Records'); b.type = 'button'; b.addEventListener('click', A.ui.board); chip.appendChild(b);
  b = el('button', 'ac-who', u ? 'Change' : 'Sign in'); b.type = 'button';
  b.addEventListener('click', function () { A.ui.card(function () { location.reload(); }, { cancel: true }); });      /* another player: the page reads that player's game */
  chip.appendChild(b); D.body.appendChild(chip);
  return chip;
};
/* on the corridor: ask once who is playing, then show the plate. Calls ready() when the player is known. */
A.ui.welcome = function (ready) {
  if (!API) { if (ready) ready(); return; }
  var guest = false; try { guest = sessionStorage.getItem('keyhole.guest') === '1'; } catch (e) {}
  function go() { A.ui.chip(); pending().then(A.flush); if (ready) ready(); }
  if (A.user() || guest) { go(); return; }
  A.ui.card(function (u) { if (u) location.reload(); else go(); });        /* a new player: the page reads that player's own game */
};
/* a line at the top of a room, put away with a click (or by itself) */
function note(html, ms) {
  css();
  var n = el('div', 'ac-note', html);
  function gone() { if (n.parentNode) n.parentNode.removeChild(n); }
  n.addEventListener('click', gone); setTimeout(gone, ms || 14000);
  (function show() { if (D.querySelector('.tc')) { setTimeout(show, 400); return; } D.body.appendChild(n); })();      /* after the title card */
}

/* ---------- in a room (engine.js has loaded this file) ---------- */
function room() {
  var ER = window.ER, k = ER.cfg.theme + '/' + ER.cfg.story, st = ER.state(), f = st.fin, u = A.user();
  setTimeout(A.flush, 1500);
  setInterval(A.flush, 60000);
  window.addEventListener('pagehide', function () { farewell(k); });
  if (ER.cfg.exit && ER.cfg.exit.last) {                                 /* the last room has a way to the records */
    var hud = D.querySelector('.hud-tr'), b;
    if (hud && !hud.querySelector('.rec')) { b = el('button', 'hbtn rec', 'Records'); b.type = 'button'; b.addEventListener('click', A.ui.board); hud.insertBefore(b, hud.firstChild); }
  }
  if (!f || f.skipped || f.sent || (!u && f.told)) return;
  var mine = A.clock(f.secs) + (f.hints ? ' + ' + hintWord(f.hints) + ' = <b>' + A.clock(A.score(f.secs, f.hints)) + '</b>' : ', no hints');
  if (!u) { f.told = 1; ER.persist(false); note('Your time: ' + mine + '. Play with a name, and your next one is in the records.'); return; }
  if (f.again) { f.sent = 1; ER.persist(true); note('Played again: ' + mine + '. The records keep your first time.'); return; }
  report(k, st).then(function (r) {
    if (!r || !r.ok) return;
    ER.persist(true);                                                  /* 'sent' has to reach the copy in the record book as well */
    A.flush();
    if (r.again) note('Played again: ' + mine + '. The records keep your first time.');
    else note('Your record: ' + mine + (r.rank ? ' · No. ' + r.rank + ' of ' + r.of + ' this week' : ''));
  });
}
if (API && inRoom() && !ER.cfg.transient) room();
})();
