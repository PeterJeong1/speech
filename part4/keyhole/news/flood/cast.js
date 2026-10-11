/* The people of "Two Aunts", as busts of 200 x 260, each in the light of the room where you meet them.
   FACE('brannigan' | 'sato' | 'dilys' | 'lindley' | 'talkback') gives the picture for an interview.
   (Yasmin Haddad is a voice in a grey box until first light: 'talkback' is the box.) */
(function () {
  function head(o) {
    var s = '';
    s += '<rect x="87" y="144" width="26" height="44" fill="' + o.skin + '"/><path d="M87 166q13 11 26 0v22h-26z" fill="' + o.shade + '" opacity=".6"/>';
    s += '<ellipse cx="' + (o.ear ? 56 : 58) + '" cy="112" rx="' + (o.ear ? 8 : 6) + '" ry="' + (o.ear ? 13 : 10) + '" fill="' + o.skin + '"/><ellipse cx="' + (o.ear ? 144 : 142) + '" cy="112" rx="' + (o.ear ? 8 : 6) + '" ry="' + (o.ear ? 13 : 10) + '" fill="' + o.skin + '"/>';
    s += '<ellipse cx="100" cy="106" rx="41" ry="49" fill="' + o.skin + '"/>';
    if (o.glow) s += '<path d="M127 68Q150 106 126 146" fill="none" stroke="' + o.glow + '" stroke-width="7" stroke-linecap="round" opacity=".42"/>';
    return s;
  }
  function eyes(o) {
    var e = o.eye || '#3a2a1c', w = o.wide || 5, y = o.y || 112;
    return '<ellipse cx="83" cy="' + y + '" rx="6.5" ry="' + w + '" fill="#fbf7ee"/><ellipse cx="117" cy="' + y + '" rx="6.5" ry="' + w + '" fill="#fbf7ee"/>' +
      '<circle cx="' + (83 + (o.look || 0)) + '" cy="' + (y + 0.5) + '" r="3.400" fill="' + e + '"/><circle cx="' + (117 + (o.look || 0)) + '" cy="' + (y + 0.5) + '" r="3.400" fill="' + e + '"/>' +
      '<circle cx="' + (84 + (o.look || 0)) + '" cy="' + (y - 0.7) + '" r="1" fill="#fff"/><circle cx="' + (118 + (o.look || 0)) + '" cy="' + (y - 0.7) + '" r="1" fill="#fff"/>';
  }
  function nose(c) { return '<path d="M100 116q-5 12 0 16q5 2 7 -2" stroke="' + c + '" stroke-width="2.600" fill="none" stroke-linecap="round"/>'; }
  function body(fill) { return '<path d="M6 260Q8 206 48 192L84 178H116L152 192Q192 206 194 260Z" fill="' + fill + '"/>'; }

  var S = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>', i, k;

  /* Moira Brannigan, the news editor: a grey bob, red reading glasses half way down her nose, a pencil behind one ear,
     and the look of somebody who has heard "it's all over the internet" once too often. Lit by a desk lamp. */
  S += '<symbol id="fc-brannigan" viewBox="0 0 200 260"><rect width="200" height="260" fill="#1a232d"/>' +
    '<rect x="12" y="16" width="176" height="96" fill="#2a343f"/><g fill="#e9e2c9" opacity=".3"><rect x="22" y="26" width="30" height="22"/><rect x="58" y="24" width="30" height="24"/><rect x="134" y="28" width="28" height="20"/><rect x="24" y="58" width="28" height="22"/><rect x="146" y="56" width="30" height="24"/></g>' +
    '<path d="M200 0L96 260H200Z" fill="#ffb347" opacity=".1"/>' +
    '<path d="M55 118Q44 46 100 44Q156 46 145 118Q150 150 142 166L128 168Q136 140 132 108L68 108Q64 140 72 168L58 166Q50 150 55 118Z" fill="#9a9ea4"/>' +
    body('#3b4c60') + '<path d="M84 178L100 226L116 178Z" fill="#d9dee3"/><path d="M84 178L66 208L98 238M116 178L134 208L102 238" fill="none" stroke="#2a394a" stroke-width="5" stroke-linejoin="round"/>' +
    head({ skin: '#eccdb0', shade: '#cfa987', glow: '#ffb347' }) +
    '<path d="M58 106Q54 54 100 52Q146 54 142 106Q134 78 110 72Q92 86 64 86Q59 94 58 106Z" fill="#9a9ea4"/><path d="M64 86Q90 82 110 72" fill="none" stroke="#b9bcc0" stroke-width="2"/>' +
    '<path d="M72 98q10 -3 20 1M108 94q11 -7 21 0" stroke="#7d8187" stroke-width="3.200" fill="none" stroke-linecap="round"/>' +
    eyes({ eye: '#4a5a6a', wide: 4 }) + nose('#cfa987') +
    '<g fill="#fff" fill-opacity=".1" stroke="#a3271d" stroke-width="2.800"><rect x="70" y="118" width="26" height="15" rx="6"/><rect x="104" y="118" width="26" height="15" rx="6"/></g><path d="M96 124h8M70 123l-12 -6M130 123l12 -6" stroke="#a3271d" stroke-width="2.600" fill="none"/>' +
    '<path d="M88 148q12 3 24 -1" stroke="#8c4a3c" stroke-width="3.200" fill="none" stroke-linecap="round"/><path d="M74 138q-3 8 3 14M126 138q3 8 -3 14" stroke="#cfa987" stroke-width="2" fill="none"/>' +
    '<path d="M140 92l26 -40" stroke="#e9c93a" stroke-width="5" stroke-linecap="round"/><path d="M166 52l4 -7" stroke="#2a2420" stroke-width="5" stroke-linecap="round"/></symbol>';

  /* Danny Sato, the presenter: a quiff, headphones round his neck, a warm voice and a worried face */
  S += '<symbol id="fc-sato" viewBox="0 0 200 260"><rect width="200" height="260" fill="#26282c"/><g fill="#1b1d20">';
  for (i = 0; i < 5; i++) for (k = 0; k < 5; k++) S += '<path d="M' + (k * 40) + ' ' + (i * 40 + 40) + 'l20 -34l20 34z"/>';
  S += '</g><rect x="140" y="12" width="48" height="20" rx="3" fill="#3a1512"/><text x="164" y="26.500" font-family="Oswald,sans-serif" font-weight="600" font-size="11" text-anchor="middle" fill="#7d2a22" letter-spacing="1.500">ON AIR</text>' +
    body('#8a4433') + '<path d="M84 178Q100 200 116 178Z" fill="#e9e4d6"/><path d="M70 186Q100 214 130 186" fill="none" stroke="#6b3226" stroke-width="5"/>' +
    '<path d="M62 190Q100 232 138 190" fill="none" stroke="#17191c" stroke-width="9" stroke-linecap="round"/><rect x="50" y="176" width="20" height="34" rx="8" fill="#17191c"/><rect x="130" y="176" width="20" height="34" rx="8" fill="#17191c"/><rect x="54" y="182" width="12" height="22" rx="5" fill="#3a3f45"/><rect x="134" y="182" width="12" height="22" rx="5" fill="#3a3f45"/>' +
    head({ skin: '#e3c098', shade: '#c79f74', glow: '#ff6a5a' }) +
    '<path d="M58 106Q52 60 84 52Q112 36 136 58Q150 76 142 106Q138 84 122 76Q96 80 70 84Q60 92 58 106Z" fill="#17171b"/><path d="M84 52Q104 46 124 58" fill="none" stroke="#33333a" stroke-width="3"/>' +
    '<path d="M70 96q10 -8 21 -2M109 94q11 -6 21 2" stroke="#17171b" stroke-width="3.400" fill="none" stroke-linecap="round"/>' +
    eyes({ eye: '#2a1a10', wide: 6 }) + nose('#c79f74') +
    '<path d="M90 146q10 -5 20 0" stroke="#8c4a3c" stroke-width="3.200" fill="none" stroke-linecap="round"/><path d="M78 132q-2 6 2 10M122 132q2 6 -2 10" stroke="#c79f74" stroke-width="2" fill="none"/></symbol>';

  /* Dilys, on the telephones: a silver perm, a headset, pearls, and the calm of thirty years on the wards */
  S += '<symbol id="fc-dilys" viewBox="0 0 200 260"><rect width="200" height="260" fill="#e9dfc4"/><rect x="0" y="0" width="200" height="120" fill="#f1ead4"/>' +
    '<path d="M0 78q40 -18 80 -4t70 -10t50 6" fill="none" stroke="#a9d0ea" stroke-width="7"/><path d="M40 0v120M120 0v120M0 50h200" stroke="#4a6a86" stroke-width="1" opacity=".3"/><circle cx="150" cy="44" r="5" fill="#c9302a"/><path d="M150 44v-16" stroke="#3a3a3a" stroke-width="2"/><rect x="0" y="118" width="200" height="6" fill="#5a4028"/>' +
    '<g fill="#d9d6d2"><circle cx="62" cy="84" r="20"/><circle cx="80" cy="60" r="21"/><circle cx="104" cy="52" r="21"/><circle cx="126" cy="62" r="20"/><circle cx="140" cy="86" r="19"/><circle cx="56" cy="110" r="15"/><circle cx="144" cy="110" r="15"/></g>' +
    body('#8f7bb5') + '<path d="M82 178L100 216L118 178Z" fill="#f3efe6"/><path d="M82 178L74 260M118 178L126 260" stroke="#75629c" stroke-width="5"/>' +
    '<g fill="#f6f2ea" stroke="#c9c2b2" stroke-width=".8"><circle cx="84" cy="190" r="3.600"/><circle cx="91" cy="197" r="3.600"/><circle cx="100" cy="200" r="3.600"/><circle cx="109" cy="197" r="3.600"/><circle cx="116" cy="190" r="3.600"/></g>' +
    head({ skin: '#f1d5bd', shade: '#d9b598' }) +
    '<g fill="#d9d6d2"><circle cx="72" cy="74" r="13"/><circle cx="90" cy="64" r="13"/><circle cx="110" cy="64" r="13"/><circle cx="128" cy="74" r="13"/></g><g fill="none" stroke="#c2bfba" stroke-width="2"><path d="M66 74q6 -8 12 0M84 64q6 -8 12 0M104 64q6 -8 12 0M122 74q6 -8 12 0"/></g>' +
    '<path d="M72 98q10 -5 20 -1M108 97q10 -4 20 1" stroke="#b9b6b0" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    eyes({ eye: '#4a6a8a', wide: 4.6 }) + nose('#d9b598') +
    '<ellipse cx="74" cy="132" rx="9" ry="6" fill="#e9a79a" opacity=".5"/><ellipse cx="126" cy="132" rx="9" ry="6" fill="#e9a79a" opacity=".5"/>' +
    '<path d="M86 144q14 9 28 0" stroke="#c2526a" stroke-width="3.600" fill="none" stroke-linecap="round"/>' +
    '<path d="M56 100Q56 44 100 42Q144 44 144 100" fill="none" stroke="#17191c" stroke-width="5"/><rect x="46" y="96" width="14" height="28" rx="5" fill="#17191c"/><path d="M54 124Q56 152 84 152" fill="none" stroke="#17191c" stroke-width="3"/><ellipse cx="88" cy="152" rx="6" ry="4" fill="#17191c"/></symbol>';

  /* Mr Ronald Lindley, of 3 Brook Cottages: a flat cap, a white moustache, round glasses, and a jar held in both hands. First light. */
  S += '<symbol id="fc-lindley" viewBox="0 0 200 260"><rect width="200" height="260" fill="#c9d6e0"/><rect x="0" y="120" width="200" height="140" fill="#f2c9a8"/><rect x="0" y="80" width="200" height="60" fill="#e6d3c6" opacity=".8"/>' +
    '<path d="M0 214q50 -16 100 -6t100 -10v62H0z" fill="#8f9a8a"/><path d="M20 226h60M110 220h70" stroke="#c9d6e0" stroke-width="5" opacity=".7"/>' +
    body('#b9a888') + '<path d="M84 178L100 214L116 178Z" fill="#7a2f2f"/><path d="M84 178L64 204L96 240M116 178L136 204L104 240" fill="none" stroke="#9a8a6a" stroke-width="5" stroke-linejoin="round"/>' +
    '<path d="M78 176Q100 198 122 176L126 196Q100 214 74 196Z" fill="#7a2f2f"/><path d="M80 186q20 12 40 0" fill="none" stroke="#5a1f1f" stroke-width="2"/>' +
    head({ skin: '#efd2ba', shade: '#d6b094', ear: 1 }) +
    '<path d="M58 124Q52 108 60 96Q60 112 66 124ZM142 124Q148 108 140 96Q140 112 134 124Z" fill="#f1f1ee"/>' +
    '<path d="M54 86Q60 46 104 46Q148 48 148 84Q118 72 84 76Q62 80 44 92Q46 84 54 86Z" fill="#6b5a44"/><path d="M60 80Q100 62 146 78" fill="none" stroke="#54452f" stroke-width="2.400"/><path d="M96 46v26" stroke="#54452f" stroke-width="1.600"/>' +
    '<path d="M70 100q10 -5 20 -1M110 99q10 -4 20 1" stroke="#e6e6e2" stroke-width="4.200" fill="none" stroke-linecap="round"/>' +
    eyes({ eye: '#5a6a72', wide: 3.8, y: 113 }) + nose('#d6b094') +
    '<g fill="#fff" fill-opacity=".14" stroke="#3a3a3a" stroke-width="2.400"><circle cx="83" cy="113" r="14"/><circle cx="117" cy="113" r="14"/></g><path d="M97 112q3 -3 6 0M69 111l-11 -4M131 111l11 -4" stroke="#3a3a3a" stroke-width="2.400" fill="none"/>' +
    '<path d="M78 140Q90 132 100 138Q110 132 122 140Q112 150 100 144Q88 150 78 140Z" fill="#f1f1ee"/><path d="M90 152q10 4 20 0" stroke="#8c4a3c" stroke-width="2.800" fill="none" stroke-linecap="round"/>' +
    '<g transform="translate(100 226)"><rect x="-24" y="-14" width="48" height="48" rx="6" fill="#e58a1f"/><rect x="-24" y="-14" width="48" height="48" rx="6" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"/><rect x="-27" y="-24" width="54" height="13" rx="3" fill="#f3efe6"/><path d="M-27 -18h54" stroke="#c23b2c" stroke-width="3" stroke-dasharray="6 6"/><rect x="-16" y="0" width="32" height="20" fill="#fffdf5"/><path d="M-11 7h22M-11 13h14" stroke="#1a2a52" stroke-width="2"/></g>' +
    '<ellipse cx="68" cy="238" rx="14" ry="11" fill="#efd2ba"/><ellipse cx="132" cy="238" rx="14" ry="11" fill="#efd2ba"/></symbol>';

  /* the talkback box on the news desk: Yasmin Haddad, in the radio car, in the rain */
  S += '<symbol id="fc-talkback" viewBox="0 0 200 260"><rect width="200" height="260" fill="#141b23"/><rect x="0" y="206" width="200" height="54" fill="#3a2f26"/><path d="M0 206h200" stroke="#5a4a3a" stroke-width="3"/>' +
    '<rect x="26" y="58" width="148" height="152" rx="8" fill="#000" opacity=".3"/><rect x="22" y="52" width="148" height="152" rx="8" fill="#8a9198"/><rect x="22" y="52" width="148" height="152" rx="8" fill="none" stroke="#5c646c" stroke-width="3"/>' +
    '<rect x="36" y="66" width="120" height="84" rx="4" fill="#2a2f35"/><g fill="#0d1014">';
  for (i = 0; i < 5; i++) for (k = 0; k < 8; k++) S += '<circle cx="' + (47 + k * 14) + '" cy="' + (78 + i * 15) + '" r="3.600"/>';
  S += '</g><circle cx="52" cy="176" r="9" fill="#ff4b3e"/><circle cx="52" cy="176" r="14" fill="#ff4b3e" opacity=".3"/><circle cx="49" cy="173" r="3" fill="#fff" opacity=".7"/>' +
    '<rect x="76" y="164" width="34" height="24" rx="3" fill="#2a2f35"/><rect x="118" y="164" width="34" height="24" rx="3" fill="#2a2f35"/><text x="93" y="180" font-family="DM Mono,monospace" font-size="9" text-anchor="middle" fill="#c9ced3">TALK</text><text x="135" y="180" font-family="DM Mono,monospace" font-size="9" text-anchor="middle" fill="#c9ced3">CUT</text>' +
    '<g transform="rotate(-4 100 42)"><rect x="26" y="30" width="148" height="24" fill="#efe6c8"/><text x="100" y="47.500" font-family="Kalam,cursive" font-weight="700" font-size="14.500" text-anchor="middle" fill="#1a2a52" textLength="132" lengthAdjust="spacingAndGlyphs">YASMIN &#183; RADIO CAR</text></g>' +
    '<g stroke="#c6dcee" stroke-width="1.600" opacity=".35"><path d="M12 8l-4 22M40 2l-4 20M182 12l-4 22M164 30l-3 16M10 120l-3 18M188 100l-4 22M186 180l-3 16"/></g></symbol>';

  S += '</defs></svg>';
  window.CAST_SVG = S;
  window.FACE = function (who) {
    var bg = { brannigan: '#1a232d', sato: '#26282c', dilys: '#e9dfc4', lindley: '#c9d6e0', talkback: '#141b23' }[who] || '#222';
    return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:' + bg + '"><use href="#fc-' + who + '"/></svg>';
  };
})();
