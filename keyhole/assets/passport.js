/* KEYHOLE passport: a stamp for every theme where the player has finished a story, and badges for things done.
   account.js loads this file on every page. Nothing here is sent anywhere by itself: it reads the saved games in this
   browser (the same ones engine.js and shelf.js keep), and what it has awarded is kept under the key "_/passport"
   among them, so that a player with a name finds the passport again on another computer (account.js copies every key
   with a slash in it to the record book).

   Window.Passport: open() shows the passport · check() works out what is newly earned and says so (the last room
   calls it as the record is fixed) · button(parent) adds a Passport button. */
(function () {
'use strict';
if (window.Passport) return;
var D = document, P = window.Passport = {}, KEY = '_/passport';

/* the open themes and stories (build.py writes assets/catalog.js next to this file) */
function catalog(done) {
  if (window.KEYHOLE_CATALOG) { done(window.KEYHOLE_CATALOG); return; }
  var s = D.createElement('script'), base = (D.querySelector('script[src$="passport.js"]') || {}).src || '';
  s.src = base.replace(/passport\.js.*$/, 'catalog.js');
  s.onload = function () { done(window.KEYHOLE_CATALOG || []); };
  s.onerror = function () { done([]); };
  D.head.appendChild(s);
}
function storeKey() { try { var u = JSON.parse(localStorage.getItem('keyhole.user')); return 'keyhole.v2' + (u && u.id ? '@' + u.id : ''); } catch (e) { return 'keyhole.v2'; } }
function store() { try { return JSON.parse(localStorage.getItem(storeKey())) || {}; } catch (e) { return {}; } }
function save(s) { try { localStorage.setItem(storeKey(), JSON.stringify(s)); } catch (e) {} }
function el(t, c, h) { var e = D.createElement(t); if (c) e.className = c; if (h != null) e.innerHTML = h; return e; }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

/* a story counts as finished when its last room was reached by the long way round (not by a teacher's shortcut) */
function done(st) { return !!(st && ((st.fin && !st.fin.skipped) || st.again)); }

var BADGES = [
  { id: 'first', name: 'First Door', how: 'Finish any story.', test: function (x) { return x.done >= 1; } },
  { id: 'sharp', name: 'Sharp Eyes', how: 'Finish a story without a single hint.', test: function (x) { return x.noHint; } },
  { id: 'three', name: 'Three Stars', how: 'Finish a three-star story.', test: function (x) { return x.stars[3]; } },
  { id: 'four', name: 'Four Stars', how: 'Finish a four-star story.', test: function (x) { return x.stars[4]; } },
  { id: 'five', name: 'Five Stars', how: 'Finish a five-star story.', test: function (x) { return x.stars[5]; } },
  { id: 'clock', name: 'Against the Clock', how: 'Finish a story faster than the shortest time on its card.', test: function (x) { return x.quick; } },
  { id: 'five-doors', name: 'Explorer', how: 'Get stamps from five different themes.', test: function (x) { return x.themes >= 5; } },
  { id: 'wings', name: 'All Three Wings', how: 'Get a stamp in every wing of the corridor.', test: function (x) { return x.wings >= 3; } },
  { id: 'full', name: 'Full House', how: 'Finish every story of one theme (a theme with three or more).', test: function (x) { return x.full; } },
  { id: 'ten', name: 'Ten Stories', how: 'Finish ten stories.', test: function (x) { return x.done >= 10; } },
  { id: 'words', name: 'Word Collector', how: 'Keep 100 words in your notebooks.', test: function (x) { return x.words >= 100; } },
  { id: 'dictionary', name: 'Walking Dictionary', how: 'Keep 300 words in your notebooks.', test: function (x) { return x.words >= 300; } },
  { id: 'together', name: 'Better Together', how: 'Finish a story for two or three players.', test: function (x) { return x.team; } },
  { id: 'again', name: 'Second Time Round', how: 'Play a story you have finished all the way through again.', test: function (x) { return x.again; } }
];

/* what this player has done, from the saved games and the catalogue */
function facts(cat, s) {
  var x = { done: 0, noHint: false, stars: {}, quick: false, themes: 0, wings: 0, full: false, words: 0, team: false, again: false, stamps: {} }, wings = {};
  cat.forEach(function (t) {
    var n = 0, first = 0;
    t.stories.forEach(function (c) {
      var st = s[t.id + '/' + c.id], f = st && st.fin;
      if (st && st.words) x.words += Object.keys(st.words).length;
      if (!done(st)) return;
      n++; x.done++;
      x.stars[c.stars || 3] = true;
      if (c.team) x.team = true;
      if (st.again && f) x.again = true;
      if (f && !f.skipped) {
        if (!f.hints) x.noHint = true;
        var low = parseInt(String(c.minutes || ''), 10);
        if (low && f.secs > 0 && f.secs < low * 60) x.quick = true;
        if (!first || (f.at && f.at < first)) first = f.at || first;
      }
    });
    if (n) { x.themes++; wings[t.wing] = 1; x.stamps[t.id] = { n: n, of: t.stories.length, at: first }; }
    if (n && t.stories.length >= 3 && n === t.stories.length) x.full = true;
  });
  x.wings = Object.keys(wings).length;
  return x;
}

/* award what is newly earned (kept for good, even if a story is started again later) -> {stamps: [...], badges: [...]} */
function award(cat) {
  /* in a room the engine holds the saved games and writes them back over anything else: so go through the engine there */
  var inRoom = !!(window.ER && ER.cfg && ER.cfg.story && ER.readStore);
  var s = inRoom ? ER.readStore() : store(), first = !s[KEY], pp = s[KEY] || { badges: {}, stamps: {} }, x = facts(cat, s), fresh = { stamps: [], badges: [] }, now = Date.now(), changed = false;
  pp.badges = pp.badges || {}; pp.stamps = pp.stamps || {};
  Object.keys(x.stamps).forEach(function (t) { if (!pp.stamps[t]) { pp.stamps[t] = x.stamps[t].at || now; fresh.stamps.push(t); changed = true; } });
  BADGES.forEach(function (b) { if (!pp.badges[b.id] && b.test(x)) { pp.badges[b.id] = now; fresh.badges.push(b.id); changed = true; } });
  if (changed) {
    pp.upd = now; s[KEY] = pp;
    if (inRoom) ER.persist(true); else save(s);
    if (window.Account && Account.flush) Account.flush();
  }
  return { pp: pp, x: x, fresh: fresh, first: first };
}

/* ---------- what the player sees ---------- */
var COL = { mystery: '#a8781c', scifi: '#1a7fa0', fantasy: '#6e4bb8', ghost: '#4f6d5e', adventure: '#a3302c', cipher: '#2b2b2b',
  forensic: '#34509e', history: '#8a5626', court: '#2b6542', news: '#5e574b', wild: '#bb5a26', econ: '#257044', lang: '#2a6894',
  lit: '#86356f', ai: '#11786f', duo: '#b8701f' };
var GLYPH = { mystery: '?', scifi: '✶', fantasy: '✧', ghost: '☾', adventure: '➶', cipher: 'A', forensic: '◎',
  history: 'Ⅻ', court: '§', news: '¶', wild: '▲', econ: '£', lang: 'Ω', lit: '❦', ai: '◈', duo: '∞' };
var MEDAL = { first: '1', sharp: '◉', three: '3★', four: '4★', five: '5★', clock: '⏱', 'five-doors': '5', wings: 'III',
  full: '⌂', ten: '10', words: 'Aa', dictionary: 'Az', together: '∞', again: '↺' };
var CSS = '.pp-veil{position:fixed;top:0;right:0;bottom:0;left:0;z-index:96;display:flex;align-items:center;justify-content:center;background:rgba(4,7,9,.84);padding:18px;-webkit-user-select:none;user-select:none}' +
  '.pp-book{position:relative;width:1000px;max-width:100%;max-height:calc(100vh - 36px);overflow:auto;border-radius:12px;background:#1c2742;padding:12px;box-shadow:0 30px 90px rgba(0,0,0,.65),inset 0 0 0 2px #2b3a60;text-align:left;letter-spacing:0;text-transform:none}' +
  '.pp-in{display:grid;grid-template-columns:1fr 1fr;border-radius:6px;overflow:hidden;color:#27231d;font-family:"EB Garamond",Georgia,serif;' +
    'background:#f6f0de repeating-radial-gradient(circle at 50% 115%,rgba(28,39,66,.045) 0 1.5px,transparent 1.5px 8px)}' +
  '.pp-page{position:relative;padding:20px 26px 30px}.pp-page+.pp-page{box-shadow:inset 14px 0 18px -14px rgba(0,0,0,.35)}' +
  '.pp-page:first-child{box-shadow:inset -14px 0 18px -14px rgba(0,0,0,.25)}' +
  '.pp-page .pn{position:absolute;bottom:8px;left:0;right:0;text-align:center;font:11px "Oswald",Arial,sans-serif;letter-spacing:.3em;color:#a39880}' +
  '.pp-head{display:flex;align-items:center;gap:10px;margin:0 0 10px;font:500 13px "Oswald",Arial,sans-serif;letter-spacing:.32em;text-transform:uppercase;color:#1c2742}' +
  '.pp-head:after{content:"";flex:1;height:1px;background:#cbbd98}' +
  '.pp-id{display:grid;grid-template-columns:110px 1fr;gap:16px;align-items:start;padding:12px;border:1px solid #d8cba6;border-radius:6px;background:rgba(255,255,255,.45)}' +
  '.pp-photo{height:132px;border-radius:4px;background:#dfe5ee linear-gradient(160deg,#e8edf4,#c9d3e2);display:flex;align-items:flex-end;justify-content:center;overflow:hidden}' +
  '.pp-photo svg{width:96px}' +
  '.pp-f{display:grid;grid-template-columns:1fr 1fr;gap:6px 14px}.pp-f div{min-width:0}.pp-f label{display:block;font:10.5px "Oswald",Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;color:#8a7f6a}' +
  '.pp-f b{display:block;font:500 19px "Special Elite","Courier New",monospace;color:#1c2742;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}' +
  '.pp-f .wide{grid-column:1/3}' +
  '.pp-mrz{margin:12px 0 0;padding:8px 10px 6px;border-top:1px dashed #cbbd98;font:15px/1.35 "Courier New",monospace;letter-spacing:.14em;color:#4a443a;word-break:break-all}' +
  '.pp-wing{margin:14px 0 2px;font:11px "Oswald",Arial,sans-serif;letter-spacing:.26em;text-transform:uppercase;color:#8a7f6a}' +
  '.pp-stamps{display:grid;grid-template-columns:repeat(auto-fill,minmax(88px,1fr));gap:4px 6px}' +
  '.pp-stamp{position:relative;height:94px;display:flex;align-items:center;justify-content:center}.pp-stamp svg{width:90px;height:90px;mix-blend-mode:multiply}' +
  '.pp-stamp.off svg{opacity:.13;filter:grayscale(1)}.pp-stamp small{position:absolute;bottom:4px;left:0;right:0;text-align:center;font:10.5px "Oswald",Arial,sans-serif;letter-spacing:.1em;color:#9a8f78;text-transform:uppercase}' +
  '.pp-badges{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
  '.pp-badge{display:flex;gap:11px;align-items:center;padding:7px 10px 7px 7px;border-radius:30px 8px 8px 30px;background:rgba(255,255,255,.55);border:1px solid #ddd0ae}' +
  '.pp-medal{position:relative;flex:none;width:46px;height:46px}.pp-medal:before,.pp-medal:after{content:"";position:absolute;top:34px;width:12px;height:16px;background:#a3302c;z-index:0}' +
  '.pp-medal:before{left:10px;transform:skewX(14deg)}.pp-medal:after{right:10px;transform:skewX(-14deg);background:#1c2742}' +
  '.pp-medal i{position:relative;z-index:1;display:flex;width:46px;height:46px;border-radius:50%;align-items:center;justify-content:center;font:600 15px "Oswald",Arial,sans-serif;font-style:normal;color:#4a3608;' +
    'background:radial-gradient(circle at 35% 30%,#fff3c4,#e2b84c 55%,#a87a1c);box-shadow:inset 0 0 0 3px rgba(255,255,255,.5),0 2px 4px rgba(0,0,0,.25)}' +
  '.pp-badge b{display:block;font:500 14.5px "Oswald",Arial,sans-serif;letter-spacing:.05em;color:#1c2742}.pp-badge span{display:block;font-size:14.5px;line-height:1.25;color:#6b6457}' +
  '.pp-badge em{display:block;font:11px "Oswald",Arial,sans-serif;letter-spacing:.12em;color:#2b6542;font-style:normal;text-transform:uppercase}' +
  '.pp-badge.off{opacity:.62;background:rgba(255,255,255,.25)}.pp-badge.off .pp-medal:before,.pp-badge.off .pp-medal:after{background:#c9c0ab}' +
  '.pp-badge.off i{background:radial-gradient(circle at 35% 30%,#f2eee4,#cfc7b3 60%,#aaa18c);color:#8a7f6a}' +
  '.pp-sum{margin:0 0 6px;font-size:16.5px;color:#4a443a}' +
  '.pp-top{display:flex;align-items:center;gap:14px;padding:4px 8px 12px;color:#e3c46a}' +
  '.pp-top svg{width:34px;height:34px}.pp-top h2{margin:0;font:500 22px "Oswald",Arial,sans-serif;letter-spacing:.42em}.pp-top p{margin:0;font:13px "Oswald",Arial,sans-serif;letter-spacing:.3em;color:#9fb0d0}' +
  '.pp-top button{margin-left:auto;padding:7px 16px;border:1px solid #e3c46a;background:transparent;color:#e3c46a;font:13px "Oswald",Arial,sans-serif;letter-spacing:.18em;text-transform:uppercase;cursor:pointer}.pp-top button:hover{background:#e3c46a;color:#1c2742}' +
  '.pp-toast{position:fixed;left:18px;bottom:18px;z-index:67;display:flex;flex-direction:column;gap:8px;pointer-events:none}' +
  '.pp-toast div{display:flex;align-items:center;gap:10px;max-width:420px;padding:8px 16px 8px 10px;background:#1c2742;color:#f4eedd;border:1px solid #e3c46a;border-radius:8px;box-shadow:0 12px 30px rgba(0,0,0,.5);font:16px/1.3 "EB Garamond",Georgia,serif;animation:ppin .6s cubic-bezier(.2,1.4,.4,1)}' +
  '.pp-toast div b{color:#e3c46a;font-weight:normal}.pp-toast svg{flex:none;width:46px;height:46px}.pp-toast .pp-medal{transform:scale(.85)}' +
  '@keyframes ppin{from{transform:translateY(24px) scale(.9);opacity:0}to{transform:none;opacity:1}}' +
  '.pp-btn{position:fixed;left:14px;bottom:14px;z-index:6;padding:8px 14px;border:1px solid #e3c46a;border-radius:3px;background:rgba(8,8,9,.75);color:#e3c46a;font:14px "Oswald",Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;cursor:pointer}' +
  '.pp-veil svg,.pp-toast svg{position:static!important;top:auto!important;left:auto!important;right:auto!important;bottom:auto!important;display:block}' +
  '@media (max-width:780px){.pp-in{grid-template-columns:1fr}.pp-badges{grid-template-columns:1fr}.pp-id{grid-template-columns:80px 1fr}}';
function css() { if (D.getElementById('pp-css')) return; var s = el('style'); s.id = 'pp-css'; s.textContent = CSS; D.head.appendChild(s); }

var KEYHOLE_MARK = '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="20" cy="20" r="18"/><circle cx="20" cy="16" r="5.5"/><path d="M17.2 20.5l-2.2 9.5h10l-2.2-9.5"/></svg>';
var MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
function day(at) { var d = new Date(at); return d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear(); }

/* a rubber stamp in the theme's own colour: round, oblong or eight-sided, a little crooked, a little worn */
function stamp(t, at, n, of) {
  var c = COL[t.id] || '#8c2f24', h = 0, i;
  for (i = 0; i < t.id.length; i++) h = (h * 31 + t.id.charCodeAt(i)) % 997;
  var r = (h % 27) - 13, shape = h % 3, name = esc(String(t.name).toUpperCase()), size = name.length > 10 ? 9.5 : name.length > 7 ? 11 : 12.5;
  var g = esc(GLYPH[t.id] || '★'), date = at ? day(at) : 'KEYHOLE', count = of ? n + ' / ' + of : '';
  var frame = shape === 0 ? '<circle cx="50" cy="50" r="44" stroke-width="3.6"/><circle cx="50" cy="50" r="38" stroke-width="1.1"/>'
    : shape === 1 ? '<rect x="6" y="22" width="88" height="56" rx="7" stroke-width="3.6"/><rect x="11" y="27" width="78" height="46" rx="4" stroke-width="1.1"/>'
    : '<path d="M33 7h34l26 26v34L67 93H33L7 67V33z" stroke-width="3.6"/><path d="M35 13h30l22 22v30L65 87H35L13 65V35z" stroke-width="1.1"/>';
  var gy = shape === 1 ? 44 : 38, ny = shape === 1 ? 58 : 55, dy = shape === 1 ? 69 : 67, cy = shape === 1 ? 0 : 80;
  return '<svg viewBox="0 0 100 100"><defs><filter id="pw' + t.id + '"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="1" seed="' + h + '"/>' +
    '<feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.85 1.4"/><feComposite in="SourceGraphic" operator="in"/></filter></defs>' +
    '<g transform="rotate(' + r + ' 50 50)" fill="none" stroke="' + c + '" filter="url(#pw' + t.id + ')">' + frame +
    '<text x="50" y="' + gy + '" text-anchor="middle" fill="' + c + '" stroke="none" font-family="Georgia,serif" font-size="15">' + g + '</text>' +
    '<text x="50" y="' + ny + '" text-anchor="middle" fill="' + c + '" stroke="none" font-family="Oswald,Arial,sans-serif" font-weight="600" font-size="' + size + '" letter-spacing="1">' + name + '</text>' +
    '<text x="50" y="' + dy + '" text-anchor="middle" fill="' + c + '" stroke="none" font-family="Oswald,Arial,sans-serif" font-size="7.5" letter-spacing="1.2">' + date + '</text>' +
    (cy && count ? '<text x="50" y="' + cy + '" text-anchor="middle" fill="' + c + '" stroke="none" font-family="Oswald,Arial,sans-serif" font-size="7" letter-spacing="2">' + count + '</text>' : '') +
    '</g></svg>';
}
function medal(b) { return '<span class="pp-medal"><i>' + esc(MEDAL[b.id] || '★') + '</i></span>'; }

P.open = function () {
  css();
  catalog(function (cat) {
    var a = award(cat), u = null; try { u = JSON.parse(localStorage.getItem('keyhole.user')); } catch (e) {}
    var name = u && u.name ? u.name : 'Guest', open = cat.filter(function (t) { return t.stories.length; });
    var veil = el('div', 'pp-veil'), book = el('div', 'pp-book'), wing = '', st = '', bd = '', got = 0;
    var firsts = Object.keys(a.pp.stamps).map(function (k) { return a.pp.stamps[k]; }).concat(Object.keys(a.pp.badges).map(function (k) { return a.pp.badges[k]; })).filter(Boolean).sort();
    open.forEach(function (t) {
      if (t.wing !== wing) {
        if (wing) st += '</div>';
        wing = t.wing;
        st += '<div class="pp-wing">' + esc({ '이야기 구역': 'Story doors', '과목 구역': 'Study doors', '세 번째 구역': 'The third wing' }[wing] || wing) + '</div><div class="pp-stamps">';
      }
      var m = a.x.stamps[t.id], at = a.pp.stamps[t.id];
      st += '<div class="pp-stamp' + (at ? '' : ' off') + '" title="' + esc(t.name) + (at ? ': ' + (m ? m.n : 0) + ' of ' + t.stories.length + ' stories' : ': not visited yet') + '">' +
        stamp(t, at, m ? m.n : 0, t.stories.length) + (at ? '' : '<small>' + esc(t.name) + '</small>') + '</div>';
    });
    if (wing) st += '</div>';
    BADGES.forEach(function (b) {
      var at = a.pp.badges[b.id]; if (at) got++;
      bd += '<div class="pp-badge' + (at ? '' : ' off') + '">' + medal(b) + '<div><b>' + esc(b.name) + '</b><span>' + esc(b.how) + '</span>' + (at ? '<em>' + day(at) + '</em>' : '') + '</div></div>';
    });
    var mrz = ('P<KEYHOLE<<' + String(name).toUpperCase().replace(/[^A-Z0-9]+/g, '<') + '<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<').slice(0, 44) + '<br>' +
      ('KH' + ('000' + a.x.done).slice(-3) + '<' + ('000' + Object.keys(a.pp.stamps).length).slice(-2) + 'ST<' + ('000' + got).slice(-2) + 'BD<' + ('0000' + a.x.words).slice(-4) + 'WD<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<').slice(0, 44);
    book.innerHTML = '<div class="pp-top">' + KEYHOLE_MARK + '<div><h2>PASSPORT</h2><p>KEYHOLE · EVERY DOOR, ONE BOOK</p></div><button type="button" class="pp-x">Close</button></div>' +
      '<div class="pp-in"><div class="pp-page"><div class="pp-head">Holder</div>' +
      '<div class="pp-id"><div class="pp-photo"><svg viewBox="0 0 100 110"><circle cx="50" cy="40" r="22" fill="#9aa8bd"/><path d="M8 110c4-30 22-44 42-44s38 14 42 44z" fill="#9aa8bd"/>' +
      '<circle cx="50" cy="38" r="6" fill="#dfe5ee"/><path d="M47 42l-3 12h12l-3-12z" fill="#dfe5ee"/></svg></div>' +
      '<div class="pp-f"><div class="wide"><label>Name</label><b>' + esc(name) + '</b></div>' +
      '<div><label>First stamp</label><b>' + (firsts.length ? day(firsts[0]) : '—') + '</b></div>' +
      '<div><label>Stories</label><b>' + a.x.done + '</b></div>' +
      '<div><label>Stamps</label><b>' + Object.keys(a.pp.stamps).length + ' / ' + open.length + '</b></div>' +
      '<div><label>Words kept</label><b>' + a.x.words + '</b></div></div></div>' +
      '<div class="pp-mrz">' + mrz + '</div>' +
      '<div class="pp-head" style="margin-top:16px">Stamps</div><p class="pp-sum">One stamp for every theme where you finish a story. Pale ones are still waiting.</p>' + st +
      '<div class="pn">1</div></div>' +
      '<div class="pp-page"><div class="pp-head">Badges</div><p class="pp-sum">' + got + ' of ' + BADGES.length + ' won. The pale ones say how to win them.</p><div class="pp-badges">' + bd + '</div>' +
      '<div class="pn">2</div></div></div>';
    veil.appendChild(book); D.body.appendChild(veil);
    function close() { if (veil.parentNode) veil.parentNode.removeChild(veil); }
    book.querySelector('.pp-x').addEventListener('click', close);
    veil.addEventListener('pointerdown', function (e) { if (e.target === veil) close(); });
    veil.addEventListener('keydown', function (e) { e.stopPropagation(); if (e.key === 'Escape') close(); });
    veil.tabIndex = -1; veil.focus();
  });
};

/* say what is new, in the corner, for a few seconds (it never takes a click) */
function tell(cat, fresh, first) {
  if (!fresh.stamps.length && !fresh.badges.length) return;
  css();
  var box = D.querySelector('.pp-toast') || D.body.appendChild(el('div', 'pp-toast'));
  if (first || fresh.stamps.length + fresh.badges.length > 3) {           /* a passport opened for the first time, or a great deal at once: one line */
    box.appendChild(el('div', '', medal({ id: 'first' }) + '<span>Your passport now has <b>' + fresh.stamps.length + (fresh.stamps.length === 1 ? ' new stamp' : ' new stamps') + '</b> and <b>' + fresh.badges.length + (fresh.badges.length === 1 ? ' new badge' : ' new badges') + '</b>.<br>Open it with the Passport button.</span>'));
    setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 9000);
    return;
  }
  fresh.stamps.forEach(function (id) {
    var t = cat.filter(function (x) { return x.id === id; })[0]; if (!t) return;
    box.appendChild(el('div', '', stamp(t, Date.now(), 0, 0) + '<span>A new stamp in your passport: <b>' + esc(t.name) + '</b></span>'));
  });
  fresh.badges.forEach(function (id) {
    var b = BADGES.filter(function (x) { return x.id === id; })[0]; if (!b) return;
    box.appendChild(el('div', '', medal(b) + '<span>New badge: <b>' + esc(b.name) + '</b><br>' + esc(b.how) + '</span>'));
  });
  setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 12000);
}
P.check = function (quiet) { catalog(function (cat) { var a = award(cat); if (!quiet) tell(cat, a.fresh, a.first); }); };
P.badges = BADGES;

/* a Passport button where account.js has no plate to put one on (a copy of the site with no record book) */
P.button = function () {
  if (D.querySelector('.pp-btn') || D.querySelector('.ac-chip')) return;
  css();
  var b = el('button', 'pp-btn', 'Passport'); b.type = 'button'; b.addEventListener('click', P.open); D.body.appendChild(b);
};

/* in a room: the last room fixes the record, and that is when a stamp or a badge may be earned */
var ER = window.ER;
if (ER && ER.cfg && ER.cfg.story) {
  if (ER.cfg.exit && ER.cfg.exit.last) setTimeout(function () { P.check(false); }, 2500);
} else {
  D.addEventListener('DOMContentLoaded', function () { setTimeout(function () { P.check(false); if (!(window.Account && Account.online())) P.button(); }, 900); });
  if (D.readyState !== 'loading') setTimeout(function () { P.check(false); if (!(window.Account && Account.online())) P.button(); }, 900);
}
})();
