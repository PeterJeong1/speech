/* KEYHOLE - what the lobby and the story-list pages share: saved progress, difficulty stars,
   and the "go on / start again" question. Works without the engine.

   A story card (from build.py) looks like:
     {id, title, stars, minutes, level, blurb, rooms, first:'street.html', firstId:'street', last:'morning'} */
window.Shelf = (function () {
  'use strict';
  var KEY = 'keyhole.v2', D = document, fade = null, pick = null;

  function store() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } }
  function put(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function el(t, cls, html) { var e = D.createElement(t); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  function css() {
    var s = el('style');
    s.textContent =
      '.sh-fade{position:fixed;top:0;right:0;bottom:0;left:0;z-index:99;background:#000;opacity:0;pointer-events:none;transition:opacity .85s}' +
      '.sh-fade.on{opacity:1;pointer-events:auto}' +
      '.sh-pick{position:fixed;top:0;right:0;bottom:0;left:0;z-index:90;display:none;align-items:center;justify-content:center;background:rgba(4,7,9,.74)}' +
      '.sh-pick.on{display:flex}' +
      '.sh-pick>div{background:#f3ecd9;color:#27231d;padding:28px 34px 26px;width:430px;max-width:92vw;text-align:center;box-shadow:0 26px 70px rgba(0,0,0,.6)}' +
      '.sh-pick h2{margin:0 0 6px;font-family:"Special Elite","Courier New",monospace;font-weight:normal;font-size:25px;line-height:1.2}' +
      '.sh-pick p{margin:0 0 18px;font-family:"EB Garamond",Georgia,serif;font-size:19px;line-height:1.4}' +
      '.sh-pick button{display:block;width:100%;margin-top:8px;padding:11px 14px;border:1px solid #27231d;background:transparent;' +
      'font-family:"Oswald",Arial,sans-serif;font-size:14px;letter-spacing:.16em;text-transform:uppercase;color:#27231d;cursor:pointer}' +
      '.sh-pick button:hover{background:#27231d;color:#f3ecd9}' +
      '.sh-pick button.q{border-color:transparent;opacity:.6;font-size:12px}';
    D.head.appendChild(s);
  }

  /* where the player is in one story: 'new', 'going' (somewhere past the first room) or 'solved' */
  function status(theme, s) {
    var st = store()[theme + '/' + s.id], at = st && st.at;
    if (!at || !at.file || at.id === s.firstId) return { state: 'new' };
    if (at.id === s.last) return { state: 'solved', at: at, hints: st.hints || 0 };
    return { state: 'going', at: at };
  }
  function stars(n) {
    n = Math.max(1, Math.min(5, n || 3));
    return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
  }
  function go(href) { if (fade) fade.classList.add('on'); setTimeout(function () { location.href = href; }, 850); }

  /* open a story from its theme page. Asks first if the player has been inside before. */
  function open(theme, s) {
    var st = status(theme, s), base = s.id + '/';
    if (st.state === 'new') { go(base + s.first); return; }
    pick.innerHTML = '<div><h2></h2><p></p><button type="button" class="a"></button>' +
      '<button type="button" class="b">Start again from the beginning</button><button type="button" class="q">Not now</button></div>';
    pick.querySelector('h2').textContent = s.title;
    pick.querySelector('p').textContent = st.state === 'solved' ? 'You have already finished this one.' : 'You have been here before. You got as far as ' + st.at.title + '.';
    pick.querySelector('.a').textContent = st.state === 'solved' ? 'Look at the last page again' : 'Go on from ' + st.at.title;
    pick.querySelector('.a').addEventListener('click', function () { go(base + st.at.file); });
    pick.querySelector('.b').addEventListener('click', function () { var all = store(); delete all[theme + '/' + s.id]; put(all); go(base + s.first); });
    pick.querySelector('.q').addEventListener('click', function () { pick.classList.remove('on'); });
    pick.classList.add('on');
  }

  function init() {
    css();
    pick = el('div', 'sh-pick'); D.body.appendChild(pick);
    fade = el('div', 'sh-fade on'); D.body.appendChild(fade);
    setTimeout(function () { fade.classList.remove('on'); }, 80);
  }
  /* stories that are held back (still being written) are listed only when the address ends in ?all=1 */
  function visible(list) { return /[?&]all=1/.test(location.search) ? list : list.filter(function (s) { return !s.hold; }); }
  return { init: init, store: store, status: status, stars: stars, open: open, go: go, visible: visible };
})();
