/* A Quarter Past Four - small helpers that every room of the story shares. Loaded after engine.js.
   Nothing in here knows an answer. */
window.GLASS = (function () {
  'use strict';
  var X = {}, D = document;
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so the sound button switches them).
     Nothing here is a bang: an English court has no gavel, and this story must not sound as if it had one. ---------- */
  X.sfx = {
    stamp: function () { B({ type: 'lowpass', f: 620, dur: 0.1, peak: 0.26, a: 0.008 }); B({ type: 'highpass', f: 3000, dur: 0.14, peak: 0.05, a: 0.03, when: 0.05 }); },   /* rubber on paper */
    pencil: function () { B({ type: 'highpass', f: 3600, dur: 0.22, peak: 0.07, a: 0.04 }); },
    lay: function () { B({ dur: 0.03, f: 2600, q: 3, peak: 0.13 }); B({ dur: 0.03, f: 2000, q: 3, peak: 0.08, when: 0.07 }); },      /* a pencil laid on a desk */
    tape: function () { B({ type: 'highpass', f: 2200, f2: 5200, dur: 0.16, peak: 0.1, a: 0.02 }); },
    card: function () { B({ type: 'highpass', f: 1800, dur: 0.08, peak: 0.12, a: 0.01 }); },
    buzz: function () { [0, 0.34].forEach(function (w) { T({ type: 'sawtooth', f: 150, dur: 0.2, peak: 0.05, when: w }); B({ type: 'lowpass', f: 400, dur: 0.2, peak: 0.09, when: w }); }); },   /* a phone on silent */
    sent: function () { T({ f: 880, f2: 1320, dur: 0.16, peak: 0.05 }); },
    beam: function () { T({ f: 392, dur: 0.7, peak: 0.04, a: 0.12 }); T({ f: 588, dur: 0.7, peak: 0.025, a: 0.12, when: 0.1 }); },      /* the scales coming to rest */
    hm: function () { T({ type: 'triangle', f: 196, f2: 174, dur: 0.22, peak: 0.07, a: 0.05 }); }                                        /* a small doubtful sound, for a wrong try */
  };

  /* A door opens. The music answers in the room's own key, as it does after ER.exit (these rooms leave through
     ER.exitOk and ER.leave, because something is always said between the lock and the door); without music, three plain notes. */
  X.solved = function (quiet) {
    var sung = false;
    try { sung = !!(ER.music && ER.music() && ER.track && ER.track.sting('solved', null, !!quiet)); } catch (e) {}
    if (!sung && !quiet) ER.sfx.ok();
  };
  /* mark this room as done in the saved game (ER.exit does it; a room that uses ER.exitOk does it here) */
  X.done = function (id) { var st = ER.state(); st.done = st.done || {}; st.done[id] = 1; ER.persist(true); };

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
  /* the court's own words go into the notebook when they are first needed */
  X.learn = function (list) {
    var G = window.GLOSS || [];
    list.forEach(function (w) {
      for (var i = 0; i < G.length; i++) if (G[i][0].toLowerCase() === w.toLowerCase()) { ER.addWord(G[i][0], G[i][1]); return; }
    });
  };
  X.bump = function (flag) { var n = (ER.flag(flag) || 0) + 1; ER.flag(flag, n); return n; };

  /* Pick-and-place where one place may hold several things (the pans of a pair of scales): drag a thing onto a
     place, or click the thing and then the place. o = {item, zone, home, into, change(item, zone), lock(item)} */
  X.place = function (root, o) {
    var held = null;
    function hold(n) { if (held) held.classList.remove('held'); held = n; if (n) n.classList.add('held'); }
    function put(item, t) {
      var box = t === o.home ? o.home : ((o.into && t.querySelector(o.into)) || t);
      box.appendChild(item); ER.sfx.click(); hold(null); if (o.change) o.change(item, t);
    }
    function zoneOf(t) { return t && t.closest ? (t.closest(o.zone) || (o.home.contains(t) || t === o.home ? o.home : null)) : null; }
    root.addEventListener('pointerdown', function (e) {
      var item = e.target.closest ? e.target.closest(o.item) : null;
      if (!item || e.button || (o.lock && o.lock(item))) return;
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
          var t = zoneOf(D.elementFromPoint(ev.clientX, ev.clientY)); if (t) put(item, t);
        } else hold(held === item ? null : item);
      }
      D.addEventListener('pointermove', mv); D.addEventListener('pointerup', up); D.addEventListener('pointercancel', up);
    });
    root.addEventListener('click', function (e) {
      if (!held || (o.lock && o.lock(held))) return;
      if (e.target.closest && e.target.closest(o.item)) return;
      var t = zoneOf(e.target); if (t) put(held, t);
    });
  };

  /* minutes played, for the last page */
  X.minutes = function () {
    var st = ER.state(), secs = st.fin && st.fin.secs ? st.fin.secs : (st.secs || 0);
    return Math.max(1, Math.round(secs / 60));
  };
  return X;
})();
