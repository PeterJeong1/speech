/* The Understudy - what the five rooms of the story share: a few sounds, small helpers, the people as they stand
   about in the scenes, and the papers (each is read in one room and wanted again in another).
   Loaded after engine.js. Nothing in here knows an answer. */
window.US = (function () {
  'use strict';
  var X = {};
  var T = function (o) { try { ER.tone(o); } catch (e) {} }, B = function (o) { try { ER.burst(o); } catch (e) {} };

  /* ---------- sounds (through the engine, so that the sound button switches them) ---------- */
  X.sfx = {
    pencil: function () { B({ type: 'bandpass', f: 2200, q: 1.4, dur: 0.11, peak: 0.06, a: 0.02 }); },
    sw: function () { T({ f: 190, f2: 120, dur: 0.05, peak: 0.25 }); B({ dur: 0.02, f: 2600, q: 3, peak: 0.16 }); },      /* a switch on the prompt desk */
    key: function () { B({ dur: 0.016, f: 3400, q: 5, peak: 0.09 }); },                                                   /* a key on the lighting desk */
    pin: function () { T({ f: 300, f2: 170, dur: 0.06, peak: 0.16 }); B({ dur: 0.025, f: 2600, q: 3, peak: 0.1 }); },
    silk: function () { B({ type: 'highpass', f: 2800, dur: 0.5, peak: 0.05, a: 0.12 }); },
    thud: function () { T({ f: 96, f2: 52, dur: 0.2, peak: 0.4 }); B({ type: 'lowpass', f: 700, dur: 0.07, peak: 0.18 }); },
    rise: function () { B({ type: 'bandpass', f: 260, f2: 620, q: 0.7, dur: 2.6, peak: 0.1, a: 0.9 }); }                   /* a heavy curtain going up */
  };
  /* A door opens. The music answers in the room's own key, as it does after ER.exit; without music, three plain notes. */
  X.solved = function (quiet) {
    var sung = false;
    try { sung = !!(ER.music && ER.music() && ER.track && ER.track.sting('solved', null, !!quiet)); } catch (e) {}
    if (!sung && !quiet) ER.sfx.ok();
  };

  /* ---------- small helpers ---------- */
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
  /* words that a paper or a person has just taught go into the notebook */
  X.words = function (list) {
    var G = window.GLOSS || [];
    list.forEach(function (w) { for (var i = 0; i < G.length; i++) if (G[i][0] === w) { ER.addWord(G[i][0], G[i][1]); break; } });
  };
  X.mins = function () {
    var st = ER.state(), end = ER.flag('tEnd') || Date.now();
    if (st.fin && st.fin.secs) return Math.max(1, Math.round(st.fin.secs / 60));
    return Math.max(1, Math.round((end - (st.t0 || end)) / 60000));
  };
  X.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };

  /* wheels: a number set one figure at a time.  o = {label, n: how many wheels, start: [..], unit, cls, change: fn} */
  X.wheels = function (box, o) {
    var at = (o.start || []).slice(), s = o.label ? '<small>' + o.label + '</small>' : '', off = false, i;
    for (i = 0; i < o.n; i++) {
      if (at[i] == null) at[i] = 0;
      s += '<span class="wl"><button type="button" data-j="' + i + '" data-d="1" title="up">&#9650;</button><b></b><button type="button" data-j="' + i + '" data-d="-1" title="down">&#9660;</button></span>';
    }
    if (o.unit) s += '<i>' + o.unit + '</i>';
    var n = ER.el('span', 'wls ' + (o.cls || ''), s), cells = ER.$$('b', n);
    function draw() { cells.forEach(function (c, j) { c.textContent = at[j]; }); }
    n.addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null, j;
      if (!b || off) return;
      j = +b.getAttribute('data-j');
      at[j] = (at[j] + (+b.getAttribute('data-d')) + 10) % 10;
      X.sfx.key(); draw(); if (o.change) o.change();
    });
    box.appendChild(n); draw();
    return { node: n, get: function () { return String(+at.join('')); }, at: function () { return at.slice(); }, lock: function (on) { off = !!on; n.classList.toggle('off', off); } };
  };

  /* ---------- the people, standing (origin at the feet; about 300 tall) ---------- */
  var SH = '<ellipse cx="0" cy="2" rx="62" ry="8" fill="#000" opacity=".4"/>';
  var FIG = {
    tindall: function (o) {
      return SH + '<path d="M-21 0l2 -116h19V0zM2 0v-116h19l2 116z" fill="#16171c"/><path d="M-26 0h26v8h-29zM2 0h26v8h-23z" fill="#0b0b0e"/>' +
        '<path d="M-36 -98q-8 -118 36 -128t38 128z" fill="#22242c"/>' +
        '<path d="M-26 -204q-20 38 -6 80" stroke="#1c1e25" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="-31" cy="-122" r="7.500" fill="#d9b08c"/>' +
        (o && o.book ? '<path d="M26 -204q26 26 2 62" stroke="#22242c" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M-10 -168l56 -10 8 46 -56 10z" fill="#f1ecdf" stroke="#0b0b0e" stroke-width="3"/><path d="M18 -173l8 46" stroke="#9a927a" stroke-width="1.500"/>' :
          '<path d="M26 -204q22 36 6 80" stroke="#22242c" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="33" cy="-122" r="7.500" fill="#d9b08c"/>') +
        '<rect x="-5" y="-244" width="13" height="16" fill="#c99a78"/><circle cx="2" cy="-262" r="22" fill="#d9b08c"/>' +
        '<path d="M-21 -262q-3 -28 23 -29t24 27q-1 16 -5 24q-2 -28 -19 -32t-23 10z" fill="#1c1410"/>' +
        '<path d="M-19 -268q21 -32 43 0" stroke="#4a4d57" stroke-width="3.500" fill="none"/><rect x="20" y="-272" width="8" height="15" rx="3" fill="#2a2c33"/><path d="M24 -258q-4 13 -15 13" stroke="#2a2c33" stroke-width="2.400" fill="none"/>' +
        '<path d="M11 -285l9 -20" stroke="#e3a92b" stroke-width="3.200" stroke-linecap="round"/><path d="M4 -287l4 -22" stroke="#4f7fe0" stroke-width="3.200" stroke-linecap="round"/><path d="M-3 -287l-3 -21" stroke="#f1ede2" stroke-width="3.200" stroke-linecap="round"/>' +
        '<path d="M-8 -262h7M6 -262h7" stroke="#2a1a12" stroke-width="2.400"/><path d="M-3 -250h9" stroke="#7a3f30" stroke-width="2.200"/>';
    },
    mossop: function () {
      return SH + '<path d="M-18 0v-96h15V0zM5 0v-96h15V0z" fill="#2b2b30"/><path d="M-25 0h25v9h-29zM1 0h25v9h-22z" fill="#17120d"/>' +
        '<path d="M-44 -78q-12 -150 44 -166t48 166z" fill="#7a5632"/><path d="M2 -236v158" stroke="#5a3d20" stroke-width="3"/>' +
        '<rect x="14" y="-198" width="18" height="20" fill="none" stroke="#5a3d20" stroke-width="2"/><path d="M20 -198v-12" stroke="#e3a92b" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M-36 -208q-14 42 30 54" stroke="#6b4a2a" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M38 -208q14 42 -30 50" stroke="#7a5632" stroke-width="16" fill="none" stroke-linecap="round"/>' +
        '<path d="M-10 -242l12 14 12 -14z" fill="#e9e2cf"/><rect x="-5" y="-256" width="14" height="16" fill="#c98f76"/><circle cx="2" cy="-272" r="23" fill="#d9a184"/>' +
        '<path d="M-21 -270q-4 12 2 20M25 -270q4 12 -2 20" stroke="#eceff1" stroke-width="6" fill="none" stroke-linecap="round"/>' +
        '<path d="M-24 -282q4 -22 28 -22t26 18q-10 -6 -28 -5t-26 9z" fill="#4a4034"/><path d="M-24 -282q-12 2 -16 8l24 -3z" fill="#3a3229"/>' +
        '<path d="M-10 -262q12 -9 24 0q-12 7 -24 0z" fill="#f4f6f7"/><path d="M-8 -274h6M8 -274h6" stroke="#2a1a12" stroke-width="2.400"/><path d="M-11 -280l9 2M17 -280l-9 2" stroke="#eceff1" stroke-width="2.600"/>';
    },
    crane: function () {
      return SH + '<path d="M-17 0v-124h14V0zM5 0v-124h14V0z" fill="#1c2742"/><path d="M-5 0v-124M17 0v-124" stroke="#b3271f" stroke-width="2"/><path d="M-23 0h23v8h-26zM3 0h23v8h-21z" fill="#0b0b0e"/>' +
        '<path d="M-38 -116q-10 -120 38 -130t42 130z" fill="#b3271f"/><path d="M2 -240v124" stroke="#e6c873" stroke-width="2.500"/>' +
        '<g fill="#e6c873"><circle cx="-8" cy="-214" r="3"/><circle cx="-8" cy="-190" r="3"/><circle cx="-8" cy="-166" r="3"/><circle cx="-8" cy="-142" r="3"/></g><path d="M-36 -122q38 12 78 0" stroke="#e6c873" stroke-width="4" fill="none"/>' +
        '<path d="M-30 -226q-18 44 -8 92" stroke="#a3221b" stroke-width="15" fill="none" stroke-linecap="round"/><circle cx="-38" cy="-128" r="8" fill="#e2bd9c"/>' +
        '<path d="M32 -226q24 30 -8 52" stroke="#b3271f" stroke-width="15" fill="none" stroke-linecap="round"/><circle cx="22" cy="-172" r="8" fill="#e2bd9c"/>' +
        '<rect x="-9" y="-252" width="22" height="12" fill="#e6c873"/><rect x="-4" y="-266" width="13" height="16" fill="#d9b393"/><ellipse cx="2" cy="-284" rx="20" ry="24" fill="#e2bd9c"/>' +
        '<path d="M-18 -290q0 -22 20 -22t20 22q-8 -12 -20 -12t-20 12z" fill="#b9bec4"/>' +
        '<path d="M-6 -272l6 2 6 -2" stroke="#8d9299" stroke-width="2.600" fill="none"/><path d="M-9 -288h7M6 -288h7" stroke="#2a1a12" stroke-width="2.200"/><path d="M-10 -295l8 -3M6 -298l8 3" stroke="#8d9299" stroke-width="2"/>';
    },
    okeke: function () {
      return SH + '<path d="M-13 0v-70h10V0zM4 0v-70h10V0z" fill="#17171b"/><path d="M-18 0h18v7h-21zM2 0h18v7h-17z" fill="#0b0b0e"/>' +
        '<path d="M-40 -64q6 -150 40 -160t42 160z" fill="#1c1c22"/><path d="M-22 -64q2 -70 22 -74t24 74z" fill="#f4f1e8"/><path d="M-14 -138h30v-52h-30z" fill="#f4f1e8"/>' +
        '<path d="M-14 -190l-10 -24M16 -190l10 -24" stroke="#f4f1e8" stroke-width="5"/>' +
        '<path d="M-28 -212q-16 40 -6 84" stroke="#1c1c22" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="-35" cy="-124" r="7" fill="#6b4423"/>' +
        '<path d="M30 -212q16 40 6 84" stroke="#1c1c22" stroke-width="13" fill="none" stroke-linecap="round"/><circle cx="37" cy="-124" r="7" fill="#6b4423"/>' +
        '<path d="M-12 -226q14 10 28 0l3 9q-17 9 -34 0z" fill="#f4f1e8"/><rect x="-4" y="-242" width="12" height="16" fill="#5a3a1f"/><circle cx="2" cy="-258" r="21" fill="#6b4423"/>' +
        '<path d="M-19 -260q0 -24 21 -24t21 24q-9 -12 -21 -12t-21 12z" fill="#15100c"/><circle cx="2" cy="-284" r="9" fill="#15100c"/><path d="M-14 -279q16 -14 32 0q-16 -5 -32 0z" fill="#f4f1e8"/>' +
        '<path d="M-8 -258h6M7 -258h6" stroke="#15100c" stroke-width="2.400"/><path d="M-3 -247h9" stroke="#3a1f12" stroke-width="2.200"/>';
    },
    greaves: function () {
      return SH + '<path d="M-12 0v-42h9V0zM4 0v-42h9V0z" fill="#b98f7a"/><path d="M-17 0h17v7h-20zM2 0h17v7h-16z" fill="#2a2228"/><path d="M-34 -40q4 -70 34 -74t36 74z" fill="#6f6a72"/>' +
        '<path d="M-40 -84q-8 -130 40 -140t44 140z" fill="#8f7fb5"/><path d="M2 -220v136" stroke="#6f6197" stroke-width="2.500"/>' +
        '<path d="M-14 -222q-6 50 -2 96M18 -222q6 50 2 96" stroke="#f0d24a" stroke-width="5" fill="none"/>' +
        '<path d="M-32 -208q-16 50 26 70" stroke="#8576ac" stroke-width="14" fill="none" stroke-linecap="round"/><path d="M34 -208q16 50 -26 70" stroke="#8f7fb5" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="1" cy="-136" r="9" fill="#e2b999"/>' +
        '<path d="M2 -224v40" stroke="#7d1f24" stroke-width="2"/><circle cx="2" cy="-178" r="8" fill="#c9ced3" stroke="#555a63" stroke-width="2"/>' +
        '<rect x="-4" y="-240" width="13" height="16" fill="#d3a686"/><circle cx="2" cy="-256" r="22" fill="#e2b999"/>' +
        '<path d="M-20 -258q0 -24 22 -24t22 24q-9 -11 -22 -11t-22 11z" fill="#a9adb3"/><circle cx="2" cy="-284" r="10" fill="#a9adb3"/>' +
        '<g fill="none" stroke="#555a63" stroke-width="2"><circle cx="-6" cy="-256" r="6.500"/><circle cx="11" cy="-256" r="6.500"/><path d="M0.500 -256h4"/></g><path d="M-3 -244h9" stroke="#7a4a3c" stroke-width="2.200"/>';
    },
    lascelles: function () {
      return SH + '<path d="M-52 0q-4 -210 52 -236t58 236z" fill="#6a2a4a"/><path d="M2 -150V0" stroke="#4d1c35" stroke-width="3"/>' +
        '<path d="M-24 -230q26 40 26 80M30 -230q-28 40 -28 80" stroke="#8f4468" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M-44 -140q46 14 92 0" stroke="#4d1c35" stroke-width="7" fill="none"/>' +
        '<path d="M-36 -212q-18 50 -6 100" stroke="#5e2441" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="-42" cy="-108" r="8" fill="#ecc7a8"/>' +
        '<path d="M38 -212q20 34 -16 52" stroke="#6a2a4a" stroke-width="16" fill="none" stroke-linecap="round"/><circle cx="20" cy="-164" r="8" fill="#ecc7a8"/>' +
        '<path d="M-6 -254h16v24l-8 8 -8 -8z" fill="#e2b999"/><circle cx="2" cy="-272" r="22" fill="#ecc7a8"/>' +
        '<path d="M-20 -274q-2 -26 22 -27t23 27q-9 -12 -23 -12t-22 12z" fill="#e6e9ee"/><ellipse cx="2" cy="-300" rx="14" ry="10" fill="#e6e9ee"/><path d="M-6 -304q8 -6 16 0" stroke="#b9bec9" stroke-width="2" fill="none"/>' +
        '<circle cx="-19" cy="-264" r="2.600" fill="#f7f4ea"/><circle cx="23" cy="-264" r="2.600" fill="#f7f4ea"/>' +
        '<path d="M-8 -274h7M7 -274h7" stroke="#2a1a22" stroke-width="2.400"/><path d="M-10 -281q5 -4 9 -1M6 -282q5 -3 9 1" stroke="#5a4a52" stroke-width="2" fill="none"/><path d="M-3 -260q5 3 10 0" stroke="#a3221b" stroke-width="2.800" fill="none"/>';
    },
    ashdown: function () {
      return SH + '<path d="M-17 0v-110h14V0zM5 0v-110h14V0z" fill="#17171b"/><path d="M-23 0h23v8h-26zM3 0h23v8h-21z" fill="#0b0b0e"/>' +
        '<path d="M-40 -100q-8 -126 40 -136t44 136z" fill="#1c1c22"/><path d="M-10 -228l12 80 12 -80z" fill="#f4f1e8"/><path d="M-7 -230l9 6 9 -6v12l-9 -6 -9 6z" fill="#f4f1e8"/>' +
        '<path d="M-32 -218q-30 30 -40 76" stroke="#1c1c22" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="-73" cy="-138" r="8" fill="#e8c4a2"/>' +
        '<path d="M34 -218q30 30 40 76" stroke="#1c1c22" stroke-width="14" fill="none" stroke-linecap="round"/><circle cx="75" cy="-138" r="8" fill="#e8c4a2"/>' +
        '<rect x="-4" y="-250" width="13" height="16" fill="#d9b08c"/><circle cx="2" cy="-266" r="22" fill="#e8c4a2"/>' +
        '<path d="M-20 -270q-2 -26 22 -26t22 26q-10 -14 -22 -12t-22 12z" fill="#c9a24a"/><path d="M-16 -283q18 -8 36 0v9q-18 -6 -36 0z" fill="#101014"/>' +
        '<circle cx="-6" cy="-266" r="2.200" fill="#2a1a12"/><circle cx="10" cy="-266" r="2.200" fill="#2a1a12"/><path d="M-4 -255q6 5 12 0" stroke="#7a3f30" stroke-width="2.200" fill="none"/>';
    }
  };
  X.fig = function (who, o) { return FIG[who] ? FIG[who](o) : ''; };
  /* put the standing figures into every <g data-fig="who"> of a scene */
  X.figs = function () {
    ER.$$('[data-fig]').forEach(function (g) { g.innerHTML = X.fig(g.getAttribute('data-fig'), { book: g.getAttribute('data-book') === '1' }); });
  };

  /* ---------- the papers ---------- */
  X.DOC = {
    call: '<h4><small>THE JACKDAW THEATRE &middot; THORNSEA</small>Call sheet</h4>' +
      '<p class="sub">THE GENTLEMAN ON THE TERRACE &middot; a comedy in two acts &middot; first night, Thursday</p>' +
      '<p class="big">Curtain up 7.30</p>' +
      '<p>BEGINNERS are called to the stage five minutes before the curtain goes up. THE FIVE is called five minutes before beginners, THE QUARTER a quarter of an hour before beginners, and THE HALF half an hour before beginners. So no call comes at the time that its name says. Do not argue with it.</p>' +
      '<table><tr><td>Miss Verity Lascelles</td><td>the Countess</td><td>dressing room 1</td></tr>' +
      '<tr><td>Mr Hugo Crane</td><td>the Colonel</td><td>dressing room 2</td></tr>' +
      '<tr><td>Mr Felix Ashdown</td><td>the Gentleman</td><td>dressing room 2 <i>(Mr Crane asks me to write that he is not pleased)</i></td></tr>' +
      '<tr><td>Miss Nneka Okeke</td><td>the Maid; understudy to Miss Lascelles</td><td>dressing room 3</td></tr></table>' +
      '<p class="crew">Stage manager, on the book: J. Tindall &middot; Props and scene changes: A. Mossop &middot; Dresser: Mrs Greaves &middot; Lights: S. Ibrahim &middot; Front of house: Mr Pellow</p>' +
      '<h5>My rules. They are not new.</h5>' +
      '<ol><li>If you are in a scene, you are on the stage.</li>' +
      '<li>If you are not in a scene but you are in the next one, you are in the wings, ready. I call you one whole scene early. I do not run after actors.</li>' +
      '<li>If you are in neither, you are upstairs. The wings of the Jackdaw are one metre wide. They are not a waiting room.</li>' +
      '<li>An understudy learns by watching. Whenever Miss Lascelles is on the stage and Miss Okeke is not, Miss Okeke watches her from the wings. From the far side: nobody stands in my corner.</li>' +
      '<li>Mrs Greaves comes down with the blue velvet in the first dark, crosses the stage, and waits on the prompt side for Miss Lascelles&rsquo;s quick change. She stays there until the interval. At the Jackdaw the only way from one wing to the other is across the stage.</li>' +
      '<li>Mr Mossop is in the wings, at his table, in every scene. In the darks he is on the stage, changing it.</li></ol>' +
      '<p class="sig">J. Tindall</p>',
    run: '<h4>Running order <small>ACT ONE</small></h4>' +
      '<p class="sub">Times from the last dress rehearsal. They will be the same tonight. I shall see to it. J.T.</p>' +
      '<p class="t">7.30 &middot; CURTAIN UP</p>' +
      '<p><b>SCENE 1 &middot; The drawing room, morning &middot; 14 minutes</b><br>The Countess at breakfast. The Maid brings a telegram, and goes. The Colonel comes in at 6.00 and stays.</p>' +
      '<p class="dk">the first dark: the breakfast things go</p>' +
      '<p><b>SCENE 2 &middot; The same, that evening &middot; 14 minutes</b><br>The Countess and the Colonel. Nobody else.</p>' +
      '<p class="dk">the second dark: the drawing room becomes the terrace</p>' +
      '<p><b>SCENE 3 &middot; The terrace, midnight &middot; 11 minutes</b><br>The Gentleman is on the balustrade when the lights come up. The Countess comes out to him at 1.10. Nobody else.</p>' +
      '<p class="dk">the third dark</p>' +
      '<p><b>SCENE 4 &middot; The terrace, next morning &middot; 11 minutes</b><br>All four: the Countess, the Gentleman, the Maid with the coffee, and the Colonel, who has slept through everything.</p>' +
      '<p class="t">8.21 &middot; CURTAIN DOWN &middot; INTERVAL, 20 minutes</p>' +
      '<p><b>ACT TWO &middot; The ballroom.</b> The Countess wears THE NECKLACE.</p>' +
      '<p class="foot">A time such as 6.00 or 1.10 is minutes and seconds, counted from the moment when the lights come up on that scene. 1.10 is one minute and ten seconds.</p>',
    key: '<h4>The book</h4>' +
      '<p>The play is on the right-hand pages. What everybody does is on the left, in pencil.</p>' +
      '<p><b>LEFT and RIGHT</b> are always the actor&rsquo;s own, as he stands facing the audience. Stage left (L) is the prompt side: my side. Stage right (R) is the far side. Its old name is OP, for &ldquo;opposite prompt&rdquo;.</p>' +
      '<p><b>UP and DOWN.</b> Upstage (U) is away from the audience, towards the back wall. Downstage (D) is towards the audience. C is the centre. So DL is downstage left: the corner by my desk.</p>' +
      '<p><b>X</b> means &ldquo;crosses to&rdquo;. ABOVE the sofa means upstage of it. BELOW the sofa means downstage of it.</p>' +
      '<p><b>LX</b> is a cue for the lights. I say &ldquo;stand by&rdquo;, and then &ldquo;go&rdquo;. Samir presses his button on &ldquo;go&rdquo;, and not before.</p>' +
      '<p><b>P</b> in the margin means that I had to give an actor the line.</p>' +
      '<p class="pen">Act One: no P anywhere.<br>Act Two, the Countess&rsquo;s long speech: P P (Tue) &middot; P P P P P (Wed)</p>',
    slip: '<h4>Valuables</h4>' +
      '<p>One necklace: nine emeralds on a gold chain, with a gold clasp in the shape of a swan. The property of Miss V. Lascelles.</p>' +
      '<p><b>At the half.</b> Out of the safe. Looked at by both of us, and laid in outline 9 on the props table.<br><span class="hand">V. Lascelles &middot; R. Pellow</span></p>' +
      '<p><b>At beginners.</b> Table check: every outline right. Case opened: gold swan.<br><span class="hand">A. Mossop &middot; J. Tindall</span></p>' +
      '<p><b>8.22.</b> Case opened, to give to Mrs Greaves for Act Two. BRASS HOOK.<br><span class="hand">A.M.</span></p>',
    cues: '<h4>LX cues <small>THE GENTLEMAN ON THE TERRACE &middot; ACT ONE &middot; S. Ibrahim</small></h4>' +
      '<table><tr><th>Cue</th><th>Starts</th><th>What the lights do</th><th>Time</th></tr>' +
      '<tr><td>1</td><td>on her &ldquo;go&rdquo;</td><td>The lights in the house go down. The curtain is still shut.</td><td>6 s</td></tr>' +
      '<tr><td>2</td><td>on her &ldquo;go&rdquo;</td><td>Curtain up. Scene 1: morning sun in the drawing room.</td><td>5 s</td></tr>' +
      '<tr><td>6</td><td>on her &ldquo;go&rdquo;</td><td>The Colonel opens the shutters: brighter.</td><td>2 s</td></tr>' +
      '<tr><td>9</td><td>on her &ldquo;go&rdquo;</td><td>End of Scene 1. BLACKOUT.</td><td>3 s</td></tr>' +
      '<tr class="auto"><td>10</td><td>by itself</td><td>Scene 2: evening, the lamps are lit. Starts 8 seconds after cue 9 is complete.</td><td>4 s</td></tr>' +
      '<tr><td>14</td><td>on her &ldquo;go&rdquo;</td><td>Sunset: the room goes down to a deep red. Not a blackout: you can still see the Colonel.</td><td>40 s</td></tr>' +
      '<tr><td>21</td><td>on her &ldquo;go&rdquo;</td><td>End of Scene 2. BLACKOUT.</td><td>4 s</td></tr>' +
      '<tr class="cut"><td>21.5</td><td>by itself</td><td>The moon comes up early, in the dark.</td><td>10 s</td></tr>' +
      '<tr class="auto"><td>22</td><td>by itself</td><td>Scene 3: the terrace by moonlight. Starts 25 seconds after the &ldquo;go&rdquo; of cue 21.</td><td>6 s</td></tr>' +
      '<tr><td>26</td><td>on her &ldquo;go&rdquo;</td><td>The Gentleman lights his lantern.</td><td>1 s</td></tr>' +
      '<tr><td>30</td><td>on her &ldquo;go&rdquo;</td><td>End of Scene 3. BLACKOUT.</td><td>2 s</td></tr>' +
      '<tr class="auto"><td>31</td><td>by itself</td><td>Scene 4: morning on the terrace. Starts 8 seconds after the &ldquo;go&rdquo; of cue 30.</td><td>5 s</td></tr>' +
      '<tr><td>38</td><td>on her &ldquo;go&rdquo;</td><td>End of Act One: down to half as the curtain comes down, then the working light. No blackout.</td><td>10 s</td></tr></table>' +
      '<p class="note">TIME is how long the lights take to change. A blackout is not black until its TIME is up.</p>' +
      '<p class="note">The stage is dark from then until the next cue STARTS. As soon as a cue starts, there is light.</p>' +
      '<p class="note">A blackout at the Jackdaw is everything: the stage, and the blue lamp over the props table (slider 48).</p>' +
      '<p class="note">A cue with a point in its number was put in later. 21.5 was CUT on Wednesday. It does nothing.</p>',
    plist: '<h4>The table <small>A. Mossop</small></h4>' +
      '<p class="rule">Every prop has a number and a painted outline. If it is not on the stage, it is in its outline.</p>' +
      '<p class="rule">L is this side. R is the far side. What goes off R stays over there, on the shelf, until the night is over: I cannot fetch it.</p>' +
      '<p class="rule">Nobody but me puts a thing down on this table. (One exception: see 5.)</p>' +
      '<ol><li><b>Hand bell</b> Scene 1. I bring it off myself in the first dark.</li>' +
      '<li><b>Breakfast tray</b> Scene 1. On with the Maid. I bring it off in the first dark.</li>' +
      '<li><b>Salver and telegram</b> Scene 1. The Maid takes it on, and goes off R with it.</li>' +
      '<li><b>Newspaper</b> Scenes 1 and 2. The Colonel leaves it on the sofa. Off R with the sofa, in the second dark.</li>' +
      '<li><b>Fan</b> Scene 2. The Countess brings it off L and gives it to Mrs Greaves at the chair. Mrs Greaves lays it in its outline when the quick change is done.</li>' +
      '<li><b>Paper knife</b> On the desk from the half. Off R with the desk, in the second dark.</li>' +
      '<li><b>Decanter and two glasses</b> Scene 2, on the desk. Off R with the desk, in the second dark.</li>' +
      '<li><b>Telescope</b> Scene 4. I set it on the balustrade in the third dark. It stays on the stage until I change the stage at the interval.</li>' +
      '<li><b>Necklace, in its case</b> Act Two. Mrs Greaves takes it upstairs at the interval.</li>' +
      '<li><b>Long gloves</b> Act Two. They go up with the necklace.</li>' +
      '<li><b>Parasol</b> Scene 4. I set it on the bench in the third dark. It stays on the stage until I change the stage at the interval.</li>' +
      '<li><b>Dance card and pencil</b> Act Two. The Maid.</li>' +
      '<li><b>Mask</b> Act Two. The Gentleman.</li>' +
      '<li><b>Champagne bucket</b> Act Two. I set it on the stage at the interval.</li>' +
      '<li><b>Opera glasses</b> Act Two. The Colonel.</li></ol>' +
      '<p class="pen">8.22. NOTHING on this table or on the stage is to be moved until I say so. J. Tindall</p>',
    qc: '<h4>Quick changes <small>Mrs Greaves</small></h4>' +
      '<p><b>No. 1.</b> Miss L., the end of Scene 2. Out of the grey silk, into the blue velvet. Prompt side, at the chair behind the props table: four steps from the stage.</p>' +
      '<p>The watch starts when the blue lamp goes out. It stops when she leaves my hands and I say &ldquo;gone&rdquo;.</p>' +
      '<table><tr><th></th><th>at the chair</th><th>&ldquo;gone&rdquo;</th><th></th></tr>' +
      '<tr><td>Mon, the technical</td><td>on 3</td><td>1.31</td><td>hooks stiff. Oiled them.</td></tr>' +
      '<tr><td>Tue, dress rehearsal</td><td>on 3</td><td>1.16</td><td></td></tr>' +
      '<tr><td>Wed, dress rehearsal</td><td>on 3</td><td>1.15</td><td>as good as it gets</td></tr>' +
      '<tr><td>Thu, FIRST NIGHT</td><td>on 15</td><td>1.27</td><td></td></tr></table>' +
      '<p>The work itself is 72 seconds now: on Wednesday, and tonight the same. I count it as I do it.</p>' +
      '<p>Wed night. Sewed a pocket into the grey silk, left side, as Madam wished.</p>' +
      '<p>Scenes 1 and 2: the grey silk. Scenes 3 and 4: the blue velvet. Act Two: the ball gown, the long gloves, the necklace.</p>',
    page: '<h4>Act One &middot; Scene 2 <small>the last page</small></h4><div class="two"><div class="mv">' +
      '<p><i>1</i>COL. X to C.</p><p><i>2</i>COUNTESS rises from sofa, X UL, above desk.</p><p><i>3</i>COL. X DR, below sofa.</p>' +
      '<p><i>4</i>COUNTESS X DL, to window.</p><p><i>5</i>COL. X UR, to door. Turns.</p><p><i>6</i>COUNTESS opens fan.</p>' +
      '<p class="lx">LX 21 &middot; GO &middot; BLACKOUT</p><p><i>7</i>Exit COUNTESS, L (quick change). Exit COL., R.</p>' +
      '<p class="nx">Scene 3. In the dark, GENTLEMAN climbs on to the balustrade from R.</p></div><div class="txt">' +
      '<p><b>COLONEL.</b> <sup>1</sup> Nobody has climbed up to that terrace since 1892, Countess. And he fell off.</p>' +
      '<p><b>COUNTESS.</b> <sup>2</sup> How very careless of him.</p>' +
      '<p><b>COLONEL.</b> <sup>3</sup> I shall sit up all night with my telescope.</p>' +
      '<p><b>COUNTESS.</b> <sup>4</sup> You will be asleep by eleven, Colonel. You always are.</p>' +
      '<p><b>COLONEL.</b> <sup>5</sup> Madam, I have never slept on duty in my life.</p>' +
      '<p><b>COUNTESS.</b> <sup>6</sup> Then we shall see what midnight brings.</p></div></div>'
  };
  /* id: [title in the notebook, what kind of paper, class] */
  X.PAPER = {
    call: ['The call sheet', 'Pinned up in the prompt corner', 'call'],
    run: ['The running order', 'Ms Tindall’s, for Act One', 'run'],
    key: ['How the book is written', 'Inside the cover of the prompt book', 'bookkey'],
    slip: ['The valuables slip', 'Under the corner of the case', 'slip'],
    cues: ['Samir’s cue sheet', 'The lighting box', 'cues'],
    plist: ['Mr Mossop’s list', 'On the wall by the props table', 'plist'],
    qc: ['Mrs Greaves’s book', 'Quick changes', 'qc'],
    page: ['Scene 2, the last page', 'The prompt book', 'bookpage']
  };
  /* put a paper in the notebook (quietly, when a later room only makes sure that it is there) */
  X.file = function (id, quiet) { var p = X.PAPER[id]; return ER.addClue(id, p[0], X.DOC[id], p[2], p[1], quiet); };
  /* read a paper; it files itself when it is closed */
  X.read = function (id, done) { var p = X.PAPER[id]; ER.read({ html: X.DOC[id], cls: p[2], clue: { id: id, title: p[0], kind: p[1] }, done: done }); };
  return X;
})();
