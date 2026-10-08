/* KEYHOLE - shared engine. Every room page calls ER.init({...}) and builds on the helpers below.
   Answers never appear in a page: build.py stores only hashes, and the name of the next room
   is unwrapped from the right answer.

   A site has themes (mystery, scifi ...), a theme has stories, a story has rooms.
   Saved progress lives in localStorage under one key, one entry per "theme/story". */
(function () {
'use strict';
var ER = window.ER = { cfg: null };
var KEY = 'keyhole.v2';
var D = document;
var HOME = ((D.currentScript && D.currentScript.src) || '').replace(/engine\.js.*$/, '');      /* where the shared files are */
var S = {};

/* ---------- hashing ---------- */
function xmur3(str) {
  var h = 1779033703 ^ str.length, i;
  for (i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = h << 13 | h >>> 19;
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}
function hex8(n) { return ('0000000' + (n >>> 0).toString(16)).slice(-8); }
function tag(scope, c) { return hex8(xmur3('t|' + scope + '|' + c)()); }
function pad(scope, c) { return xmur3('k|' + scope + '|' + c)(); }

/* ---------- saved state ---------- */
function load() { try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { S = {}; } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
function NS() { return ER.cfg.theme + '/' + ER.cfg.story; }
function scope() { return NS() + '/' + ER.cfg.id; }
function T() {
  var t = NS(), o = S[t] || (S[t] = {});
  o.words = o.words || {}; o.clues = o.clues || []; o.flags = o.flags || {};
  return o;
}
ER.state = function () { return T(); };
ER.flag = function (k, v) { var f = T().flags; if (v === undefined) return f[k]; f[k] = v; save(); return v; };
ER.readStore = function () { load(); return S; };
ER.resetStory = function () { load(); delete S[NS()]; save(); };

/* ---------- small helpers ---------- */
function el(t, cls, html) { var e = D.createElement(t); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
ER.el = el;
ER.$ = function (s, r) { return (r || D).querySelector(s); };
ER.$$ = function (s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); };
ER.wait = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
ER.shake = function (n) { n.classList.remove('shake'); void n.offsetWidth; n.classList.add('shake'); };
ER.pt = function (svg, e) {
  var p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
  return p.matrixTransform(svg.getScreenCTM().inverse());
};
ER.words = function (s) {
  return String(s).toLowerCase().replace(/[‘’'`]s\b/g, '').replace(/[‘’'`]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').trim().split(' ').filter(Boolean);
};

/* ---------- glossary: hover a hard word to see what it means ---------- */
var GL = {}, HEAD = {}, GLRE = null, tipEl = null, tipT = 0, tipNode = null;
var ENT = { '&rsquo;': '\u2019', '&lsquo;': '\u2018', '&ldquo;': '\u201c', '&rdquo;': '\u201d', '&middot;': '\u00b7',
  '&pound;': '\u00a3', '&mdash;': '\u2014', '&ndash;': '\u2013', '&hellip;': '\u2026' };
function buildGloss() {
  var forms = [];
  (window.GLOSS || []).forEach(function (g) {
    var e = { h: g[0], en: g[1], ko: g[2] || '' };
    HEAD[g[0]] = e; HEAD[g[0].toLowerCase()] = e;
    if (g[4] === 0) return;                       /* object name only: never underlined in running text */
    (g[4] === 2 ? [] : [g[0]]).concat(g[3] ? g[3].split('|') : []).forEach(function (f) {
      f = f.toLowerCase(); if (!GL[f]) { GL[f] = e; forms.push(f); }
    });
  });
  if (!forms.length) return;
  forms.sort(function (a, b) { return b.length - a.length; });
  GLRE = new RegExp('(^|[^A-Za-z])(' + forms.map(function (f) {
    return f.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/ /g, '[\\s\\u00a0]+').replace(/'/g, '[\'\u2019]');
  }).join('|') + ')(?![A-Za-z])', 'gi');
}
ER.gloss = function (html) {
  if (!GLRE || !html) return html;
  html = String(html).replace(/&[a-z]+;/g, function (m) { return ENT[m] || m; });
  var skip = 0;     /* nothing is underlined inside a drawing, or between <!--nogloss--> and <!--/nogloss--> */
  return html.split(/(<[^>]*>)/).map(function (seg) {
    if (seg.charAt(0) === '<') {
      if (/^<svg[\s>]/i.test(seg) || seg === '<!--nogloss-->') skip++;
      else if (/^<\/svg>/i.test(seg) || seg === '<!--/nogloss-->') skip = Math.max(0, skip - 1);
      return seg;
    }
    if (skip) return seg;
    return seg.replace(GLRE, function (m, pre, word) {
      var e = GL[word.toLowerCase().replace(/[\s\u00a0]+/g, ' ').replace(/\u2019/g, '\'')];
      return e ? pre + '<span class="w" data-k="' + e.h + '">' + word + '</span>' : m;
    });
  }).join('');
};
ER.glossIn = function (root, sel) { ER.$$(sel, root).forEach(function (n) { n.innerHTML = ER.gloss(n.innerHTML); }); };
ER.ko = function (on) {
  if (on === undefined) return !!S.ko;
  load(); S.ko = !!on; save();
};
function tipHide() { clearTimeout(tipT); tipNode = null; if (tipEl) tipEl.classList.remove('on'); }
function tipShow(node, sticky) {
  var e = HEAD[node.getAttribute('data-k')]; if (!e) return;
  if (!tipEl) { tipEl = el('div', 'wtip', '<b></b><span></span><i></i>'); D.body.appendChild(tipEl); }
  tipNode = node;
  tipEl.children[0].textContent = e.h; tipEl.children[1].textContent = e.en;
  tipEl.children[2].textContent = S.ko ? e.ko : ''; tipEl.children[2].style.display = S.ko && e.ko ? 'block' : 'none';
  tipEl.classList.add('on');
  var r = node.getBoundingClientRect(), t = tipEl.getBoundingClientRect();
  var L = Math.min(Math.max(8, r.left + r.width / 2 - t.width / 2), innerWidth - t.width - 8), Tp = r.top - t.height - 10;
  if (Tp < 8) Tp = r.bottom + 10;
  tipEl.style.left = L + 'px'; tipEl.style.top = Tp + 'px';
  clearTimeout(tipT);
  tipT = setTimeout(function () {
    if (tipNode !== node) return;
    ER.addWord(e.h, e.en);                         /* looked at for a moment: keep it in the notebook */
    if (sticky) tipT = setTimeout(tipHide, 3200);
  }, sticky ? 10 : 550);
}

/* ---------- sound (all synthesised, no files) ---------- */
/* Sound effects go to master; the music (soundtrack.js) goes through mus, so that it can be switched off by itself. */
var AC = null, master = null, mus = null, noiseBuf = null, soundOn = true, musicOn = true, ambNodes = null, humNodes = null;
try { soundOn = localStorage.getItem(KEY + '.snd') !== '0'; musicOn = localStorage.getItem(KEY + '.mus') !== '0'; } catch (e) {}
function ac() {
  if (!AC) {
    var C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    try { AC = new C(); } catch (e) { return null; }
    master = AC.createGain(); master.gain.value = soundOn ? 1 : 0;
    var lim = null;                                  /* a limiter, so that thunder on top of music cannot crackle */
    try {
      lim = AC.createDynamicsCompressor();
      lim.threshold.value = -9; lim.knee.value = 6; lim.ratio.value = 12; lim.attack.value = 0.003; lim.release.value = 0.2;
      master.connect(lim); lim.connect(AC.destination);
    } catch (e) { master.connect(AC.destination); }
    mus = AC.createGain(); mus.gain.value = musicOn ? 1 : 0; mus.connect(master);
    var n = AC.sampleRate * 2, d, i;
    noiseBuf = AC.createBuffer(1, n, AC.sampleRate); d = noiseBuf.getChannelData(0);
    for (i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  }
  if (AC.state !== 'running' && AC.state !== 'closed') {          /* 'suspended' before the first click; Safari says 'interrupted' after a tab change */
    try { var p = AC.resume(); if (p && p.catch) p.catch(function () {}); } catch (e) {}
  }
  return AC;
}
function burst(o) {
  var c = ac(); if (!c || !soundOn) return;
  var t = c.currentTime + (o.when || 0), s = c.createBufferSource(), f = c.createBiquadFilter(), a = c.createGain();
  s.buffer = noiseBuf; s.loop = true;
  f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f || 1000, t);
  if (o.f2) f.frequency.exponentialRampToValueAtTime(o.f2, t + o.dur);
  f.Q.value = o.q || 1;
  a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime(o.peak || 0.3, t + (o.a || 0.004));
  a.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  s.connect(f); f.connect(a); a.connect(master); s.start(t, Math.random()); s.stop(t + o.dur + 0.05);
}
function tone(o) {
  var c = ac(); if (!c || !soundOn) return;
  var t = c.currentTime + (o.when || 0), s = c.createOscillator(), a = c.createGain();
  s.type = o.type || 'sine'; s.frequency.setValueAtTime(o.f, t);
  if (o.f2) s.frequency.exponentialRampToValueAtTime(o.f2, t + o.dur);
  a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime(o.peak || 0.2, t + (o.a || 0.004));
  a.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  s.connect(a); a.connect(master); s.start(t); s.stop(t + o.dur + 0.05);
}
ER.sfx = {
  tick: function (v) { burst({ dur: 0.03, f: 5200, q: 6, peak: 0.16 * (v || 1) }); },
  tock: function (v) { burst({ dur: 0.05, f: 900, q: 4, peak: 0.28 * (v || 1) }); tone({ f: 170, dur: 0.07, peak: 0.16 * (v || 1) }); },
  click: function () { burst({ dur: 0.02, f: 3000, q: 2, peak: 0.2 }); },
  clunk: function () { tone({ f: 120, f2: 60, dur: 0.2, peak: 0.5 }); burst({ dur: 0.05, f: 1800, q: 1, peak: 0.25 }); },
  bell: function () {
    [1, 2.01, 2.76, 3.9, 5.2].forEach(function (m, i) { tone({ f: 620 * m, dur: 1.7 / Math.pow(i + 1, 0.45), peak: 0.2 / (i + 1) }); });
    burst({ dur: 0.02, f: 4000, q: 1, peak: 0.2 });
  },
  thunder: function () {
    burst({ type: 'lowpass', f: 420, dur: 0.5, peak: 0.5, a: 0.02 });
    burst({ type: 'lowpass', f: 190, f2: 55, dur: 3.4, peak: 0.85, a: 0.12, when: 0.12 });
  },
  paper: function () { burst({ type: 'highpass', f: 2500, dur: 0.15, peak: 0.1, a: 0.03 }); },
  creak: function () { tone({ type: 'sawtooth', f: 230, f2: 150, dur: 0.55, peak: 0.05, a: 0.1 }); tone({ type: 'sawtooth', f: 345, f2: 240, dur: 0.5, peak: 0.025, a: 0.1 }); },
  drip: function () { tone({ f: 1500, f2: 520, dur: 0.09, peak: 0.16 }); },
  ok: function () {                                  /* three rising notes: in the key of the room's music when there is music */
    var k = ER.track && ER.track.key && ER.music() ? ER.track.key() : null;
    (k || [523.25, 659.25, 783.99]).forEach(function (f, i) { tone({ type: 'triangle', f: f, dur: 0.6, peak: 0.14, when: i * 0.13 }); });
  },
  no: function () { tone({ type: 'triangle', f: 150, f2: 92, dur: 0.26, peak: 0.28 }); },
  pop: function () { burst({ f: 600, q: 0.7, dur: 0.28, peak: 0.8 }); tone({ f: 84, f2: 40, dur: 0.32, peak: 0.5 }); },
  chain: function () { burst({ dur: 0.08, f: 6500, q: 3, peak: 0.12 }); burst({ dur: 0.06, f: 4200, q: 3, peak: 0.1, when: 0.07 }); },
  glass: function () { tone({ f: 2100, dur: 0.35, peak: 0.06 }); tone({ f: 3170, dur: 0.25, peak: 0.03 }); },
  gull: function () { tone({ type: 'sawtooth', f: 1250, f2: 760, dur: 0.32, peak: 0.035, a: 0.05 }); tone({ type: 'sawtooth', f: 1180, f2: 700, dur: 0.3, peak: 0.03, a: 0.05, when: 0.38 }); }
};
ER.amb = {
  rain: function (vol) {
    var c = ac(); if (!c || ambNodes) return;
    var s = c.createBufferSource(), hp = c.createBiquadFilter(), lp = c.createBiquadFilter(), g = c.createGain();
    s.buffer = noiseBuf; s.loop = true; hp.type = 'highpass'; hp.frequency.value = 700; lp.type = 'lowpass'; lp.frequency.value = 7000;
    g.gain.value = 0; g.gain.linearRampToValueAtTime(vol || 0.05, c.currentTime + 2.5);
    s.connect(hp); hp.connect(lp); lp.connect(g); g.connect(master); s.start();
    ambNodes = { s: s, g: g };
  },
  stop: function () {
    if (!ambNodes || !AC) return;
    var n = ambNodes; ambNodes = null;
    n.g.gain.linearRampToValueAtTime(0, AC.currentTime + 1.2);
    setTimeout(function () { try { n.s.stop(); } catch (e) {} }, 1400);
  },
  hum: function (on) {
    var c = ac(); if (!c) return;
    if (on && !humNodes) {
      var o = c.createOscillator(), f = c.createBiquadFilter(), g = c.createGain();
      o.type = 'sawtooth'; o.frequency.value = 50; f.type = 'lowpass'; f.frequency.value = 220; g.gain.value = 0.022;
      o.connect(f); f.connect(g); g.connect(master); o.start(); humNodes = { o: o };
    } else if (!on && humNodes) { try { humNodes.o.stop(); } catch (e) {} humNodes = null; }
  }
};
/* The speaker button has three settings: sound and music, sound effects only, nothing.
   ER.sound() is true while effects can be heard, ER.music() while music can. */
function paintSound() {
  var b = ER.$('.hbtn.snd'); if (!b) return;
  b.classList.toggle('off', !soundOn); b.classList.toggle('fx', soundOn && !musicOn);
  b.title = !soundOn ? 'Sound is off' : musicOn ? 'Sound and music are on' : 'Music is off (sound effects are on)';
}
ER.sound = function (on) {
  if (on === undefined) return soundOn;
  soundOn = !!on;
  try { localStorage.setItem(KEY + '.snd', soundOn ? '1' : '0'); } catch (e) {}
  if (master && AC) master.gain.setTargetAtTime(soundOn ? 1 : 0, AC.currentTime, 0.05);
  paintSound();
};
ER.music = function (on) {
  if (on === undefined) return soundOn && musicOn;
  musicOn = !!on;
  try { localStorage.setItem(KEY + '.mus', musicOn ? '1' : '0'); } catch (e) {}
  if (mus && AC) mus.gain.setTargetAtTime(musicOn ? 1 : 0, AC.currentTime, 0.3);
  paintSound();
};
ER.musicOut = function () { return ac() ? mus : null; };
/* 'tense' or 'calm': a room says so when its story tightens or lets go, and the music follows */
ER.mood = function (m) { ER.wantMood = m; if (ER.track) ER.track.mood(m); };
ER.audio = ac;
/* For a story's own sounds: the same two building blocks, and the output that the sound button switches. */
ER.tone = tone; ER.burst = burst;
ER.out = function () { return ac() ? master : null; };

/* ---------- HUD, captions, overlays ---------- */
var BASE, TOPL, capEl, capShade, capQ = [], capDone = null, sayT = 0, fadeEl, hintEl = null, hintKey = null, hintPoll = 0;
var ICON_SND = '<svg viewBox="0 0 30 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
  '<path d="M3 8h3l4-3.5v11L6 12H3z"/><path class="wv" d="M13 7.5c1.2 1.4 1.2 3.6 0 5M15.3 5.5c2.2 2.6 2.2 6.4 0 9"/>' +
  '<g class="nt"><path d="M24 14.5V5.500l4.200-1.100V12.800"/><circle cx="22.500" cy="14.500" r="1.500" fill="currentColor"/><circle cx="26.700" cy="12.800" r="1.500" fill="currentColor"/></g></svg>';

function buildUi() {
  var c = ER.cfg, tl = el('div', 'hud hud-tl'), tr = el('div', 'hud hud-tr');
  tl.innerHTML = '<a class="hbtn" href="' + (c.back || '../index.html') + '" title="Leave this story">&larr; ' + (c.backLabel || 'Stories') + '</a>' +
    '<span class="chip"><i>' + (c.no || '') + '</i>' + c.title + '<span class="pips" id="pips"></span></span>';
  tr.innerHTML = (c.hints ? '<button class="hbtn hnt" type="button">Hint</button>' : '') +
    '<button class="hbtn snd" type="button">' + ICON_SND + '</button>' +
    '<button class="hbtn nbk" type="button">Notebook<b>0</b></button>';
  D.body.appendChild(tl); D.body.appendChild(tr);
  if (c.hints) ER.$('.hbtn.hnt').addEventListener('click', toggleHints);
  ER.$('.hbtn.snd').addEventListener('click', function () {      /* all -> effects only -> off -> all */
    ac();
    if (soundOn && musicOn) ER.music(false);
    else if (soundOn) ER.sound(false);
    else { ER.sound(true); ER.music(true); }
  });
  ER.$('.hbtn.nbk').addEventListener('click', function () { openNotebook(); });
  paintSound();

  capShade = el('div', 'capshade'); D.body.appendChild(capShade);
  capEl = el('div', 'cap', '<p></p><small>click to go on</small>'); D.body.appendChild(capEl);
  capShade.addEventListener('click', nextCap);
  capEl.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.w')) return;
    if (capShade.classList.contains('on')) nextCap(); else ER.hush();
  });
  capEl.addEventListener('mouseenter', function () { clearTimeout(sayT); });
  capEl.addEventListener('mouseleave', function () {
    if (!capShade.classList.contains('on')) sayT = setTimeout(function () { capEl.classList.remove('on'); }, 1600);
  });

  BASE = mkLayer(false); TOPL = mkLayer(true);
  fadeEl = el('div', 'fade on'); D.body.appendChild(fadeEl);
  setTimeout(function () { fadeEl.classList.remove('on'); }, 80);

  D.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { if (hintEl) closeHints(); else ER.close(); }
    else if ((e.key === ' ' || e.key === 'Enter') && capShade.classList.contains('on')) { e.preventDefault(); nextCap(); }
  });
  D.addEventListener('mouseover', function (e) { var w = e.target.closest ? e.target.closest('.w') : null; if (w && w !== tipNode) tipShow(w); });
  D.addEventListener('mouseout', function (e) { var w = e.target.closest ? e.target.closest('.w') : null; if (w) tipHide(); });
  D.addEventListener('click', function (e) { var w = e.target.closest ? e.target.closest('.w') : null; if (w) tipShow(w, true); else if (tipNode) tipHide(); });
  updateBadge();
}
function updateBadge(ping) {
  var st = T(), b = ER.$('.hbtn.nbk b'); if (!b) return;
  b.textContent = st.clues.length + Object.keys(st.words).length;
  if (ping) { var h = ER.$('.hbtn.nbk'); h.classList.remove('ping'); void h.offsetWidth; h.classList.add('ping'); }
}
ER.pips = function (done, total) {
  var p = ER.$('#pips'), s = '', i; if (!p) return;
  for (i = 0; i < total; i++) s += '<u' + (i < done ? ' class="on"' : '') + '></u>';
  p.innerHTML = s;
};

function nextCap() {
  if (!capQ.length) {
    capEl.classList.remove('on', 'seq'); capShade.classList.remove('on');
    var f = capDone; capDone = null; if (f) f();
    return;
  }
  capEl.querySelector('p').innerHTML = ER.gloss(capQ.shift());
}
/* A run of captions the player clicks through. Blocks the scene until finished. */
ER.narrate = function (lines, done) {
  clearTimeout(sayT);
  capQ = lines.slice(); capDone = done || null;
  capEl.classList.add('on', 'seq'); capShade.classList.add('on');
  nextCap();
};
/* One short line that fades by itself. Never interrupts a running narration. */
ER.say = function (text, ms) {
  if (capShade.classList.contains('on')) { capQ.push(text); return; }
  clearTimeout(sayT);
  capEl.classList.remove('seq'); capEl.querySelector('p').innerHTML = ER.gloss(text); capEl.classList.add('on');
  sayT = setTimeout(function () { capEl.classList.remove('on'); }, ms || Math.max(2800, text.replace(/<[^>]+>/g, '').length * 62));
};
ER.hush = function () { clearTimeout(sayT); if (!capShade.classList.contains('on')) capEl.classList.remove('on'); };

/* Two layers: the base one for whatever the room opens (interviews, papers, puzzles), and a top one
   for the notebook, so it can be read in the middle of a puzzle without losing the puzzle. */
function mkLayer(top) {
  var L = { ov: el('div', 'ov' + (top ? ' ov-top' : '')), box: el('div', 'ov-box'), onClose: null, top: top };
  L.ov.appendChild(L.box); D.body.appendChild(L.ov);
  L.ov.addEventListener('pointerdown', function (e) { if (e.target === L.ov) closeLayer(L); });
  return L;
}
/* the music steps back while something is being read (an interview, a paper, the notebook), but not for a puzzle */
function duckNow() {
  if (!ER.track) return;
  var b = BASE.ov.className, t = TOPL.ov.className;
  ER.track.duck(/ on( |$)/.test(t) || (/ on( |$)/.test(b) && !/ov-lock/.test(b)));
}
function barBtn(label, fn) { var b = el('button', 'ov-x', label); b.type = 'button'; b.addEventListener('click', fn); return b; }
function openLayer(L, cls, node, onClose) {
  if (L.ov.classList.contains('on')) closeLayer(L);
  ER.$$('.wtag').forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); });      /* a name tag from the last click would sit on top */
  L.ov.className = 'ov on ' + (L.top ? 'ov-top ' : '') + (cls || '');
  L.box.innerHTML = '';
  var bar = el('div', 'ov-bar');
  if (!L.top && /ov-lock/.test(cls || '')) {
    if (ER.cfg.hints) bar.appendChild(barBtn('Hint', toggleHints));
    bar.appendChild(barBtn('Notebook', openNotebook));
  }
  bar.appendChild(barBtn('Close', function () { closeLayer(L); }));
  L.box.appendChild(bar); L.box.appendChild(node); L.onClose = onClose || null;
  ER.hush(); duckNow();
  return node;
}
function closeLayer(L) {
  if (!L || !L.ov.classList.contains('on')) return false;
  L.ov.className = 'ov' + (L.top ? ' ov-top' : ''); L.box.innerHTML = '';
  duckNow();
  var f = L.onClose; L.onClose = null; if (f) f();
  return true;
}
ER.open = function (cls, node, onClose, o) { return openLayer(o && o.top ? TOPL : BASE, cls, node, onClose); };
ER.close = function () { if (!closeLayer(TOPL)) closeLayer(BASE); };          /* whatever is in front */
ER.closeAll = function () { closeLayer(TOPL); closeLayer(BASE); };
ER.isOpen = function () { return BASE.ov.classList.contains('on') || TOPL.ov.classList.contains('on'); };

/* ---------- hints: up to three for the step the player is on, weakest first ---------- */
function hintData() {
  var h = ER.cfg.hints ? ER.cfg.hints() : null;
  return h && h[1] && h[1].length ? { k: ER.cfg.id + '.' + h[0], list: h[1] } : null;
}
function closeHints() { clearInterval(hintPoll); if (hintEl && hintEl.parentNode) hintEl.parentNode.removeChild(hintEl); hintEl = null; hintKey = null; }
function toggleHints() {
  if (hintEl) { closeHints(); return; }
  hintEl = el('div', 'hintbox'); D.body.appendChild(hintEl); renderHints(); ER.sfx.paper();
  hintPoll = setInterval(function () { var d = hintData(); if ((d ? d.k : null) !== hintKey) renderHints(); }, 800);
}
function renderHints() {
  var d = hintData(), st = T(), lv, i, s = '<button type="button" class="hint-x" title="Close">&times;</button><h6>Hint</h6>';
  st.hintLv = st.hintLv || {};
  hintKey = d ? d.k : null; lv = d ? Math.min(st.hintLv[d.k] || 0, d.list.length) : 0;
  if (!d) s += '<p class="hint-none">Nothing to add just now. Look around, and read what you find.</p>';
  else {
    if (!lv) s += '<p class="hint-none">Stuck? There ' + (d.list.length === 1 ? 'is 1 hint' : 'are ' + d.list.length + ' hints') + ' for this step. The first is a small push. The last is a big one.</p>';
    for (i = 0; i < lv; i++) s += '<p><i>' + (i + 1) + '</i>' + ER.gloss(d.list[i]) + '</p>';
    if (lv < d.list.length) s += '<button type="button" class="btn hint-more">' + (lv ? 'Another hint' : 'Show me a hint') + ' (' + (lv + 1) + ' of ' + d.list.length + ')</button>';
    else s += '<p class="hint-none">That is every hint for this step.</p>';
  }
  hintEl.innerHTML = s;
  hintEl.querySelector('.hint-x').addEventListener('click', closeHints);
  var more = hintEl.querySelector('.hint-more');
  if (more) more.addEventListener('click', function () {
    st.hintLv[d.k] = lv + 1; st.hints = (st.hints || 0) + 1; save(); ER.sfx.paper(); renderHints();
  });
}
ER.hintsUsed = function () { return T().hints || 0; };

function fmtLine(l) {
  if (typeof l === 'string') return l.charAt(0) === '<' ? l : '<p>' + l + '</p>';
  var s = '';
  if (l.note) s += '<p class="note">' + l.note + '</p>';
  if (l.q) s += '<p class="q">' + l.q + '</p>';
  if (l.a) s += (l.a.charAt(0) === '<' ? l.a : '<p>' + l.a + '</p>');
  return s;
}
/* An interview. o = {who, role, face, lines[], clue:{id,title,kind,cls}, done(fn)} */
ER.talk = function (o) {
  var i = 0, n = o.lines.length, seen = false, box = el('div', 'tk');
  box.innerHTML = '<div class="tk-face">' + (o.face || '') + '</div><div class="tk-body"><div class="tk-name"></div>' +
    '<div class="tk-role"></div><div class="tk-text"></div><div class="tk-nav"><span class="tk-count"></span>' +
    '<button type="button" class="btn tk-back">Back</button><button type="button" class="btn tk-next">Next</button></div></div>';
  var text = box.querySelector('.tk-text'), back = box.querySelector('.tk-back'), next = box.querySelector('.tk-next');
  box.querySelector('.tk-name').textContent = o.who; box.querySelector('.tk-role').textContent = o.role || '';
  function show() {
    text.innerHTML = ER.gloss(fmtLine(o.lines[i])); box.querySelector('.tk-count').textContent = (i + 1) + ' / ' + n;
    back.disabled = !i; next.textContent = i === n - 1 ? (o.last || 'Close') : 'Next';
    box.querySelector('.tk-body').scrollTop = 0;
    if (i === n - 1) seen = true;
  }
  back.addEventListener('click', function () { if (i) { i--; show(); ER.sfx.paper(); } });
  next.addEventListener('click', function () { if (i < n - 1) { i++; show(); ER.sfx.paper(); } else ER.close(); });
  show();
  ER.open('ov-talk', box, function () {
    if (seen && o.clue) ER.addClue(o.clue.id, o.clue.title, '<h4>' + o.clue.title + '</h4>' + o.lines.map(fmtLine).join(''), o.clue.cls || 'statement', o.clue.kind || 'Statement');
    if (o.done) o.done(seen);
  });
};
/* A document to read. o = {html, cls, clue:{id,title,kind}, done(fn)} */
ER.read = function (o) {
  var d = el('div', 'doc ' + (o.cls || 'typed'), ER.gloss(o.html));
  ER.sfx.paper();
  ER.open('ov-read', d, function () {
    if (o.clue) ER.addClue(o.clue.id, o.clue.title, o.html, o.cls || 'typed', o.clue.kind || 'Document');
    if (o.done) o.done();
  });
};

ER.toast = function (text) {
  var t = el('div', 'toast', text); D.body.appendChild(t);
  setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 3500);
};
ER.addClue = function (id, title, html, cls, kind, quiet) {
  var st = T(), i;
  title = String(title).replace(/&[a-z]+;/g, function (m) { return ENT[m] || m; });      /* the notebook lists titles as plain text */
  for (i = 0; i < st.clues.length; i++) if (st.clues[i].id === id) return false;
  st.clues.push({ id: id, t: title, h: html, c: cls || 'typed', k: kind || 'Document' }); save();
  if (!quiet) { ER.toast('In your notebook: ' + title); if (ER.track) ER.track.sting('clue'); }
  updateBadge(!quiet);
  return true;
};
ER.addWord = function (w, d) {
  var st = T(); w = String(w).toLowerCase();
  if (st.words[w]) return false;
  st.words[w] = d; save(); updateBadge(true); return true;
};
ER.wordAt = function (x, y, w, d) {
  var he = HEAD[String(w).toLowerCase()] || HEAD[String(w)];
  if (!d && he) d = he.en;
  var isNew = ER.addWord(w, d), t = el('div', 'wtag' + (isNew ? ' new' : ''), '<b></b><span></span><i></i>');
  t.children[0].textContent = String(w).toLowerCase(); t.children[1].textContent = d;
  t.children[2].textContent = S.ko && he ? he.ko : ''; t.children[2].style.display = S.ko && he && he.ko ? 'block' : 'none';
  ER.$$('.wtag').forEach(function (o) { o.parentNode.removeChild(o); });
  D.body.appendChild(t);
  var r = t.getBoundingClientRect(), L = Math.min(Math.max(10, x + 14), innerWidth - r.width - 10), Tp = y - r.height - 14;
  if (Tp < 56) Tp = y + 18;
  t.style.left = L + 'px'; t.style.top = Tp + 'px';
  setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 4700);
};

function openNotebook() {
  var st = T(), box = el('div', 'nb'), wn = Object.keys(st.words).length;
  box.innerHTML = '<div class="nb-tabs"><button type="button" data-t="c" class="on">Clues<i>' + st.clues.length + '</i></button>' +
    '<button type="button" data-t="w">Words<i>' + wn + '</i></button></div>';
  var list = el('div', 'nb-list'), view = el('div', 'nb-view'), words = el('div', 'nb-words');
  function clues() {
    box.appendChild(list); box.appendChild(view); if (words.parentNode) box.removeChild(words);
    list.innerHTML = '';
    if (!st.clues.length) { view.innerHTML = '<div class="nb-empty">Nothing yet. Look around.</div>'; return; }
    st.clues.forEach(function (c, i) {
      var b = el('button', '', '<small></small>'); b.type = 'button';
      b.firstChild.textContent = c.k; b.appendChild(D.createTextNode(c.t));
      b.addEventListener('click', function () { pick(i); }); list.appendChild(b);
    });
    pick(st.clues.length - 1);
  }
  function pick(i) {
    ER.$$('button', list).forEach(function (b, j) { b.classList.toggle('on', i === j); });
    view.innerHTML = ''; view.appendChild(el('div', 'doc ' + st.clues[i].c, ER.gloss(st.clues[i].h))); view.scrollTop = 0;
  }
  function wordsTab() {
    if (list.parentNode) box.removeChild(list); if (view.parentNode) box.removeChild(view); box.appendChild(words);
    var ks = Object.keys(st.words).sort();
    words.innerHTML = ks.length ? '' : '<div class="nb-empty">Click on things, and rest the mouse on dotted words. They are kept here.</div>';
    ks.forEach(function (k) {
      var d = el('div', '', '<b></b><span></span><i></i>'), he = HEAD[k];
      d.children[0].textContent = he ? he.h : k; d.children[1].textContent = st.words[k];
      d.children[2].textContent = S.ko && he ? he.ko : ''; words.appendChild(d);
    });
    var sw = el('button', 'nb-ko' + (S.ko ? ' on' : ''), 'KO'); sw.type = 'button'; sw.title = 'Korean meanings on / off';
    sw.addEventListener('click', function () { ER.ko(!S.ko); wordsTab(); });
    words.appendChild(sw);
  }
  ER.$$('.nb-tabs button', box).forEach(function (b) {
    b.addEventListener('click', function () {
      ER.$$('.nb-tabs button', box).forEach(function (o) { o.classList.toggle('on', o === b); });
      if (b.getAttribute('data-t') === 'c') clues(); else wordsTab();
      ER.sfx.paper();
    });
  });
  clues(); ER.sfx.paper();
  ER.open('ov-nb', box, null, { top: true });
}
ER.notebook = openNotebook;

/* ---------- dragging ---------- */
ER.drag = function (node, h) {
  node.addEventListener('pointerdown', function (e) {
    if (e.button) return;
    if (h.start && h.start(e) === false) return;
    e.preventDefault();
    try { node.setPointerCapture(e.pointerId); } catch (x) {}
    var moved = false, sx = e.clientX, sy = e.clientY;
    node.classList.add('on');
    function mv(ev) {
      if (!moved && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) > 5) moved = true;
      if (h.move) h.move(ev, moved);
    }
    function up(ev) {
      node.removeEventListener('pointermove', mv); node.removeEventListener('pointerup', up); node.removeEventListener('pointercancel', up);
      node.classList.remove('on');
      try { node.releasePointerCapture(ev.pointerId); } catch (x) {}
      if (h.end) h.end(ev, moved);
    }
    node.addEventListener('pointermove', mv); node.addEventListener('pointerup', up); node.addEventListener('pointercancel', up);
  });
};
/* Pick-and-place for HTML puzzles: drag an item onto a slot, or click the item and then the slot.
   o = {item:'.sel', slot:'.sel', home:node, change:fn, lock:fn->bool} */
ER.dnd = function (root, o) {
  var held = null;
  function hold(n) { if (held) held.classList.remove('held'); held = n; if (n) n.classList.add('held'); }
  function put(item, target) {
    if (target === o.home) o.home.appendChild(item);
    else {
      var old = target.querySelector(o.item);
      if (old && old !== item) o.home.appendChild(old);
      target.appendChild(item);
    }
    ER.sfx.click(); hold(null); if (o.change) o.change();
  }
  function targetAt(x, y) {
    var t = D.elementFromPoint(x, y); if (!t || !t.closest) return null;
    return t.closest(o.slot) || (o.home.contains(t) || t === o.home ? o.home : null);
  }
  root.addEventListener('pointerdown', function (e) {
    var item = e.target.closest ? e.target.closest(o.item) : null;
    if (!item || e.button || (o.lock && o.lock())) return;
    e.preventDefault();
    var r = item.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top, moved = false, sx = e.clientX, sy = e.clientY;
    function mv(ev) {
      if (!moved) {
        if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 6) return;
        moved = true; item.style.width = r.width + 'px'; item.classList.add('fly'); hold(null);
      }
      item.style.left = (ev.clientX - dx) + 'px'; item.style.top = (ev.clientY - dy) + 'px';
    }
    function up(ev) {
      D.removeEventListener('pointermove', mv); D.removeEventListener('pointerup', up); D.removeEventListener('pointercancel', up);
      if (moved) {
        item.classList.remove('fly'); item.style.left = item.style.top = item.style.width = '';
        var t = targetAt(ev.clientX, ev.clientY); if (t) put(item, t);
      } else hold(held === item ? null : item);
    }
    D.addEventListener('pointermove', mv); D.addEventListener('pointerup', up); D.addEventListener('pointercancel', up);
  });
  root.addEventListener('click', function (e) {
    if (!held || (o.lock && o.lock())) return;
    if (e.target.closest && e.target.closest(o.item)) return;
    var t = e.target.closest ? (e.target.closest(o.slot) || (o.home.contains(e.target) || e.target === o.home ? o.home : null)) : null;
    if (t) put(held, t);
  });
};

/* ---------- locks ---------- */
ER.check = function (name, cand) {
  var list = (ER.cfg.tags || {})[name] || [];
  return list.indexOf(tag(scope() + '.' + name, String(cand))) >= 0;
};
ER.exitOk = function (cands) {
  var x = ER.cfg.exit, i, w; if (!x) return null;
  for (i = 0; i < cands.length; i++) {
    w = x.w[tag(scope(), String(cands[i]))];
    if (w) return x.next + '-' + hex8((parseInt(w, 16) ^ pad(scope(), String(cands[i]))) >>> 0) + '.html';
  }
  return null;
};
/* Try the door. Returns false if none of the candidates is right; otherwise leaves the room.
   o = {delay: ms before leaving (1400), quiet: the room makes its own sound, wait: true = do not leave yet:
   the name of the next page is returned, and the room calls ER.leave(it) when it has finished talking} */
ER.exit = function (cands, o) {
  var file = ER.exitOk(cands); if (!file) return false;
  o = o || {};
  var st = T(); st.done = st.done || {}; st.done[ER.cfg.id] = 1; save();
  var sung = ER.music() && ER.track && ER.track.sting('solved', null, !!o.quiet);    /* the room's music answers in its own key ... */
  if (!sung && !o.quiet) ER.sfx.ok();                                  /* ... and without music, the plain three notes */
  if (o.wait) return file;
  setTimeout(function () { ER.leave(file); }, o.delay == null ? 1400 : o.delay);
  return true;
};
ER.leave = function (href) {
  ER.amb.stop(); ER.amb.hum(false);
  if (ER.track) ER.track.stop(0.9);
  fadeEl.classList.add('on');
  setTimeout(function () { location.href = href; }, 950);
};

/* ---------- start ---------- */
ER.init = function (cfg) {
  ER.cfg = cfg; load(); buildGloss();
  var st = T();
  if (!cfg.transient) st.at = { id: cfg.id, title: cfg.title, no: cfg.no || '', file: location.pathname.split('/').pop() };
  if (!st.t0) st.t0 = Date.now();
  save();
  if (window.CAST_SVG) { var c = el('div', 'cast-sprite', window.CAST_SVG); D.body.insertBefore(c, D.body.firstChild); }
  buildUi();
  /* The music is in a file of its own, fetched now and started at the player's first click (a browser allows no sound before that). */
  if (cfg.sound !== false && HOME && !ER.track && !D.getElementById('er-track')) {
    var sc = D.createElement('script'); sc.id = 'er-track'; sc.src = HOME + 'soundtrack.js'; D.head.appendChild(sc);
  }
  function kick() { if (ER.kicked) return; ER.kicked = true; if (ac() && ER.track) ER.track.start(); }
  function begin() { if (cfg.onBegin) cfg.onBegin(); }
  if (!cfg.intro) { D.addEventListener('pointerdown', kick); D.addEventListener('keydown', kick); begin(); return; }
  var tc = el('div', 'tc');
  tc.innerHTML = '<div class="tc-in"><div class="tc-theme"></div><div class="tc-room"></div><div class="tc-text"></div>' +
    '<button type="button" class="btn"></button></div>';
  tc.querySelector('.tc-theme').textContent = (cfg.storyTitle || '') + (cfg.no ? '  ·  ' + cfg.no : '');
  tc.querySelector('.tc-room').textContent = cfg.title;
  tc.querySelector('.tc-text').innerHTML = ER.gloss(cfg.intro.map(function (p) { return '<p>' + p + '</p>'; }).join(''));
  tc.querySelector('.btn').textContent = cfg.go || 'Go in';
  D.body.appendChild(tc);
  tc.querySelector('.btn').addEventListener('click', function () {
    kick(); tc.classList.add('off');
    setTimeout(function () { if (tc.parentNode) tc.parentNode.removeChild(tc); }, 950);
    begin();
  });
};
})();
