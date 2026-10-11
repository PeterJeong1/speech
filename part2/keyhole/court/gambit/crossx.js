/* CROSSX - cross-examination, the mechanism of The Verdict. Needs engine.js; its look is in crossx.css.
   This is the copy that belongs to "Move Sixteen". It is the widget of court/glass, with two small additions and nothing
   taken away: the few words that said "court", "judge" and "pencil" can now be set (o.words), because this hearing is a
   committee in a corridor, and the sounds can be handed in (o.sfx). Everything else is as it was written.

   A witness's evidence lies on the table as a row of statement cards. Any card can be PRESSED (asked about), and any
   card can be CHALLENGED by putting an exhibit, or another of the witness's own statements, beside it. A challenge that
   does not bite is answered by whoever is in the chair, in character, and costs a little patience. It never costs the
   game: when the patience is gone the room tells its own story, and it is given back.

   The script knows no answers. Whether a challenge bites is asked of the room, which asks ER.check (hashes from case.json).

   CX.open({
     key:     'x',                       progress is kept under ER.flag('cx-' + key): a reload loses nothing
     witness: {name, role, face},        face: an <svg> string (a bust)
     judge:   {name, face},
     pencils: 4,                         how much patience there is
     total:   5,                         how many challenges there are to win
     cards:   [{id, tab, text, from, hidden, press: [{q, a, j, gives}]}]
     papers:  [{id, tab, name, look}]    exhibits. look(): show it (the room opens it on the top layer)
     bites:   function (cardId, withId)  -> true if putting withId beside cardId is a contradiction
     won:     {cardId: {lines: [['you' | 'wit' | 'judge' | 'note', text], ...], note, swap, gives: [ids], clue: {id, title}}}
     refuse:  function (cardId, withId)  -> what the chair says to a challenge that does not bite
     idle:    'what the note of the hearing says before anything has been asked'
     words:   {today: 'said in court today', patience: 'The court&rsquo;s<br>patience', cost: 'The judge lays down a pencil.', kind: 'Said in court'}
     sfx:     {card: fn, win: fn, lose: fn}
     onWin(n, total, cardId, withId), onPencil(left), onOut(), done(pairs)
   })
   CX.close() shuts it; CX.isOpen(). */
window.CX = (function () {
  'use strict';
  var X = {}, live = null;
  var EYE = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="8.500" cy="8.500" r="5.500"/><path d="M12.700 12.700L18 18"/></svg>';

  X.isOpen = function () { return !!live; };
  X.close = function () { if (live) ER.closeAll(); };

  X.open = function (o) {
    var el = ER.el, FK = 'cx-' + (o.key || 'x'), W = o.words || {};
    var st = ER.flag(FK) || {}, cards = {}, order = [], cur = null, picking = false, busy = false, box = el('div', 'cx');
    st.open = st.open || {}; st.asked = st.asked || {}; st.won = st.won || []; st.swap = st.swap || {};
    if (st.pens == null) st.pens = o.pencils || 4;
    function keep() { ER.flag(FK, st); }
    function snd(n) { try { if (o.sfx && o.sfx[n]) o.sfx[n](); else ER.sfx.paper(); } catch (e) {} }

    /* the cards as they stand now: swaps that were won before are made again */
    o.cards.forEach(function (c) { var k = {}, p; for (p in c) k[p] = c[p]; k.from0 = c.from; cards[c.id] = k; order.push(c.id); });
    function swap(w) {
      var c = cards[w.of]; if (!c) return;
      delete cards[w.of]; c.id = w.id; c.tab = w.tab || c.tab; c.text = w.text; c.from = w.from || c.from; c.said = true; c.press = w.press || [];
      cards[w.id] = c; order[order.indexOf(w.of)] = w.id; st.open[w.id] = 1;
    }
    function wonCard(id) { return st.won.some(function (p) { return p.split('>')[0] === id; }); }
    st.won.forEach(function (p) { var w = o.won[p.split('>')[0]]; if (w && w.swap && cards[w.swap.of]) swap(w.swap); });
    function shown(c) { return !c.hidden || st.open[c.id]; }

    box.innerHTML =
      '<div class="cx-top"><div class="cx-judge"><div class="cx-jface">' + (o.judge.face || '') + '</div><div class="cx-jbody">' +
        '<div class="cx-jname"><span></span><span class="cx-pens"></span></div><p class="cx-jsay"></p></div></div>' +
        '<div class="cx-score"><small>He has given way on</small><b></b><span></span></div></div>' +
      '<div class="cx-mid"><div class="cx-wit"><div class="cx-wface">' + (o.witness.face || '') + '</div><div class="cx-wname"></div><div class="cx-wrole"></div></div>' +
        '<div class="cx-card"><div class="cx-cfrom"><span></span><span></span></div><p class="cx-ctext"></p><div class="cx-cnote"></div>' +
          '<div class="cx-btns"><button type="button" class="btn cx-press"></button><button type="button" class="btn cx-chal"></button></div></div>' +
        '<div class="cx-talk"><h6>The note of the hearing</h6><div class="cx-lines"></div><button type="button" class="btn cx-go">Go on</button></div></div>' +
      '<div class="cx-row"></div>' +
      '<div class="cx-papers"><span class="cx-plabel">Your papers</span></div>';
    var jsay = box.querySelector('.cx-jsay'), lines = box.querySelector('.cx-lines'), row = box.querySelector('.cx-row'), go = box.querySelector('.cx-go'),
      bPress = box.querySelector('.cx-press'), bChal = box.querySelector('.cx-chal'), papers = box.querySelector('.cx-papers'), mode = el('span', 'cx-mode');
    box.querySelector('.cx-jname span').textContent = o.judge.name;
    box.querySelector('.cx-wname').textContent = o.witness.name; box.querySelector('.cx-wrole').textContent = o.witness.role || '';

    function judge(t) { jsay.innerHTML = ER.gloss(t || ''); jsay.classList.remove('hit'); void jsay.offsetWidth; jsay.classList.add('hit'); }
    function pens() {
      var s = '<small>' + (W.patience || 'The court&rsquo;s<br>patience') + '</small>', i;
      for (i = 0; i < (o.pencils || 4); i++) s += '<i' + (i < st.pens ? '' : ' class="down"') + '></i>';
      box.querySelector('.cx-pens').innerHTML = s; box.setAttribute('data-pens', st.pens);
    }
    function score() {
      var n = st.won.length, s = '', i;
      box.querySelector('.cx-score b').textContent = n + ' / ' + o.total;
      for (i = 0; i < o.total; i++) s += '<u' + (i < n ? ' class="on"' : '') + '></u>';
      box.querySelector('.cx-score span').innerHTML = s; box.setAttribute('data-won', n);
    }
    function who(k) { return k === 'you' ? 'You' : k === 'wit' ? o.witness.name : k === 'judge' ? o.judge.name : ''; }
    function say(list) {          /* put lines on the note of the hearing, all at once */
      lines.innerHTML = list.map(function (l) { return '<p class="' + l[0] + '">' + (who(l[0]) ? '<b>' + who(l[0]) + '</b>' : '') + ER.gloss(l[1]) + '</p>'; }).join('');
      lines.scrollTop = 0;
    }
    function seq(list, done) {    /* ... or a click at a time, with everything else held still */
      var i = 0, acc = [];
      busy = true; box.classList.add('busy'); go.classList.add('on');
      function step() {
        acc.push(list[i]); if (acc.length > 2) acc.shift();
        say(acc); lines.scrollTop = lines.scrollHeight; ER.sfx.paper();
        i++; go.textContent = i < list.length ? 'Go on' : 'Write it down';
      }
      go.onclick = function () {
        if (i < list.length) { step(); return; }
        go.classList.remove('on'); go.onclick = null; busy = false; box.classList.remove('busy'); done();
      };
      step();
    }

    function drawRow() {
      row.innerHTML = '';
      order.forEach(function (id) {
        var c = cards[id], b;
        if (!shown(c)) return;
        b = el('button', 'cx-s' + (c.said || c.hidden ? ' said' : '') + (id === cur ? ' cur' : '') + (wonCard(id) ? ' won' : '') + (c.fresh ? ' new' : ''), '<small></small>');
        b.type = 'button'; b.setAttribute('data-id', id);
        b.firstChild.textContent = c.said || c.hidden ? 'SAID TODAY' : 'STATEMENT';
        b.appendChild(document.createTextNode(c.tab));
        b.addEventListener('click', function () { if (busy) return; if (picking && id !== cur) { tryIt(id); return; } select(id); });
        row.appendChild(b);
      });
    }
    function drawCard() {
      var c = cards[cur], left = c ? (c.press || []).length - (st.asked[c.id] || 0) : 0, w = c && wonCard(c.id) ? o.won[c.id] : null;
      box.setAttribute('data-cur', cur || '');
      box.querySelector('.cx-cfrom').children[0].textContent = c ? c.from || '' : '';
      box.querySelector('.cx-cfrom').children[1].textContent = c && (c.said || c.hidden) ? (W.today || 'said in court today') : '';
      box.querySelector('.cx-ctext').innerHTML = c ? ER.gloss('&ldquo;' + c.text + '&rdquo;') : '';
      box.querySelector('.cx-cnote').textContent = w ? w.note || 'He has given way on this.' : '';
      bPress.textContent = left > 0 ? 'Ask him more about this' : 'Nothing more to ask'; bPress.disabled = !c || left <= 0;
      bChal.textContent = picking ? 'Never mind' : 'Put something to him'; bChal.classList.toggle('on', picking); bChal.disabled = !c || !!w;
    }
    function setPick(on) {
      picking = !!on; box.classList.toggle('pick', picking);
      mode.textContent = picking ? 'Now choose what to put beside it: one of your papers, or another of his own cards.' : '';
      drawCard();
    }
    function select(id) {
      if (cards[id]) cards[id].fresh = false;
      cur = id; st.cur = id; keep(); setPick(false); drawRow(); snd('card');
    }
    function reveal(id) {
      if (!cards[id] || st.open[id]) return false;
      st.open[id] = 1; cards[id].fresh = true; return true;
    }

    /* press: the next question about this card */
    bPress.addEventListener('click', function () {
      var c = cards[cur], n, p, got;
      if (busy || !c) return;
      n = st.asked[c.id] || 0; p = (c.press || [])[n]; if (!p) return;
      st.asked[c.id] = n + 1;
      got = p.gives ? reveal(p.gives) : false;
      keep(); setPick(false);
      say([['you', p.q], ['wit', p.a]].concat(got ? [['note', 'That is new. It goes on a card of its own, at the end of the row.']] : []));
      judge(p.j || '');
      ER.sfx.paper(); drawRow(); drawCard();
    });
    bChal.addEventListener('click', function () { if (busy || !cards[cur]) return; setPick(!picking); });

    /* challenge: put a paper, or another card, beside the card in your hand */
    function tryIt(withId) {
      var c = cards[cur], pair, w;
      if (busy || !c || !picking) return;
      pair = c.id + '>' + withId; setPick(false);
      if (o.bites(c.id, withId)) {
        if (st.won.indexOf(pair) >= 0) return;
        w = o.won[c.id] || { lines: [] };
        st.won.push(pair); keep(); score(); judge('');
        seq(w.lines, function () {
          if (w.swap && cards[w.swap.of]) { swap(w.swap); cards[w.swap.id].fresh = true; }
          (w.gives || []).forEach(reveal);
          keep();
          if (w.clue) ER.addClue(w.clue.id, w.clue.title, '<h4>' + w.clue.title + '</h4>' + w.lines.map(function (l) {
            return '<p' + (l[0] === 'judge' ? ' class="j"' : '') + '>' + (who(l[0]) ? '<b>' + who(l[0]) + '</b>' : '') + l[1] + '</p>'; }).join(''), 'said', W.kind || 'Said in court');
          snd('win'); drawRow(); drawCard();
          if (o.onWin) o.onWin(st.won.length, o.total, c.id, withId);
          if (st.won.length >= o.total && o.done) o.done(st.won.slice().sort());
        });
        return;
      }
      st.pens = Math.max(0, st.pens - 1); st.laid = (st.laid || 0) + 1; keep(); pens(); snd('lose');
      judge(o.refuse ? o.refuse(c.id, withId) : 'I do not see the contradiction.');
      say([['note', W.cost || 'The judge lays down a pencil.']]);
      if (o.onPencil) o.onPencil(st.pens);
      if (st.pens <= 0) {          /* the last of the patience: everything is held still while the room tells its story */
        st.pens = o.pencils || 4; st.outs = (st.outs || 0) + 1; keep();
        if (o.onOut) { busy = true; box.classList.add('busy'); o.onOut(); } else pens();
      }
    }

    (o.papers || []).forEach(function (p) {
      var chip = el('div', 'cx-p', '<span><b></b></span><button type="button" title="Look at it">' + EYE + '</button>');
      chip.setAttribute('data-id', p.id);
      chip.querySelector('b').textContent = p.tab; chip.querySelector('span').appendChild(document.createTextNode(p.name));
      chip.querySelector('span').addEventListener('click', function () {
        if (busy) return;
        if (picking) { tryIt(p.id); return; }
        mode.textContent = 'First choose one of his cards and press "Put something to him". The glass is for looking.';
      });
      chip.querySelector('button').addEventListener('click', function (e) { e.stopPropagation(); if (!busy && p.look) p.look(); });
      papers.appendChild(chip);
    });
    papers.appendChild(mode);

    pens(); score();
    cur = st.cur && cards[st.cur] && shown(cards[st.cur]) ? st.cur : order.filter(function (id) { return shown(cards[id]); })[0];
    drawRow(); drawCard();
    say([['idle', o.idle || 'Choose one of his cards. Ask him more about it, or put something beside it.']]);
    judge(o.hello || '');
    live = box;
    ER.open('ov-lock ov-cx', box, function () { live = null; if (o.onClose) o.onClose(); });
    return { box: box, state: st };
  };
  return X;
})();
