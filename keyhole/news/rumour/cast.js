/* The people of "Says Who?", as busts of 200 x 260.
   FACE('priya' | 'theo' | 'jago' | 'nell' | 'adeleke' | 'corrigan') gives the picture for an interview. */
(function () {
  function head(o) {
    var s = '';
    s += '<rect x="87" y="144" width="26" height="44" fill="' + o.skin + '"/><path d="M87 168q13 10 26 0v20h-26z" fill="' + o.shade + '" opacity=".55"/>';
    s += '<ellipse cx="58" cy="112" rx="6" ry="10" fill="' + o.skin + '"/><ellipse cx="142" cy="112" rx="6" ry="10" fill="' + o.skin + '"/>';
    s += '<ellipse cx="100" cy="106" rx="41" ry="49" fill="' + o.skin + '"/>';
    return s;
  }
  function eyes(o) {
    var e = o.eye || '#3a2a1c', w = o.wide || 5;
    return '<ellipse cx="83" cy="112" rx="6.5" ry="' + w + '" fill="#fbf7ee"/><ellipse cx="117" cy="112" rx="6.5" ry="' + w + '" fill="#fbf7ee"/>' +
      '<circle cx="' + (83 + (o.look || 0)) + '" cy="112.500" r="3.400" fill="' + e + '"/><circle cx="' + (117 + (o.look || 0)) + '" cy="112.500" r="3.400" fill="' + e + '"/>' +
      '<circle cx="' + (84 + (o.look || 0)) + '" cy="111.300" r="1" fill="#fff"/><circle cx="' + (118 + (o.look || 0)) + '" cy="111.300" r="1" fill="#fff"/>';
  }
  function nose(c) { return '<path d="M100 116q-5 12 0 16q5 2 7 -2" stroke="' + c + '" stroke-width="2.600" fill="none" stroke-linecap="round"/>'; }
  var BLAZER = '<path d="M6 260Q8 206 48 192L84 178H116L152 192Q192 206 194 260Z" fill="#1f4a3a"/><path d="M84 178L100 222L116 178Z" fill="#f3f1e8"/>' +
    '<path d="M84 178L68 204L98 232M116 178L132 204L102 232" fill="none" stroke="#163a2d" stroke-width="5" stroke-linejoin="round"/>';
  function tie(dx) { return '<path d="M' + (95 + dx) + ' 190h10l3 44 -8 12 -8 -12z" fill="#d9a93a"/><path d="M' + (93 + dx) + ' 206l13 -6M' + (93 + dx) + ' 222l14 -6" stroke="#1f4a3a" stroke-width="3"/>'; }

  var S = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>';

  /* Priya Varma, the editor: long black hair, a pencil behind one ear, one eyebrow that has heard it all before */
  S += '<symbol id="ch-priya" viewBox="0 0 200 260"><rect width="200" height="260" fill="#2b3a34"/><path d="M0 60h200M0 120h200" stroke="#3a4c44" stroke-width="5"/><rect x="20" y="20" width="60" height="30" fill="#f6f1e4" opacity=".16"/>' +
    '<path d="M52 110Q40 40 100 38Q160 40 148 110Q158 170 150 214L128 222Q138 160 132 108L68 108Q62 160 72 222L50 214Q42 170 52 110Z" fill="#15110f"/>' +
    BLAZER + tie(0) + head({ skin: '#c68e5f', shade: '#a8733f' }) +
    '<path d="M57 104Q54 52 100 50Q146 52 143 104Q132 72 104 70Q88 82 62 84Q58 92 57 104Z" fill="#15110f"/>' +
    '<path d="M71 97q10 -4 20 0M108 92q11 -7 21 -1" stroke="#15110f" stroke-width="3.200" fill="none" stroke-linecap="round"/>' +
    eyes({ eye: '#2a1a10', wide: 4.4 }) + nose('#a8733f') +
    '<path d="M88 143q10 3 22 -2" stroke="#7d3a2e" stroke-width="3.200" fill="none" stroke-linecap="round"/>' +
    '<path d="M138 84l22 -38" stroke="#e9c93a" stroke-width="5" stroke-linecap="round"/><path d="M160 46l3 -6" stroke="#2a2420" stroke-width="5" stroke-linecap="round"/></symbol>';

  /* Theo Easton, her deputy: ginger hair that stands up, freckles, a lanyard, both eyes as wide as they will go */
  S += '<symbol id="ch-theo" viewBox="0 0 200 260"><rect width="200" height="260" fill="#3a2f26"/><path d="M20 30h70v90h-70zM110 44h70v70h-70z" fill="#f6f1e4" opacity=".14"/><path d="M40 30v90M130 44v70" stroke="#d8432a" stroke-width="3" opacity=".5"/>' +
    BLAZER + tie(5) + '<path d="M78 184L92 250M122 184L108 250" stroke="#d8432a" stroke-width="4" fill="none"/><rect x="84" y="244" width="32" height="16" fill="#fdfcf7"/>' +
    head({ skin: '#f0cfae', shade: '#d6ae86' }) +
    '<path d="M58 104Q52 58 100 56Q148 58 142 104Q134 82 120 80L112 88L104 76L96 88L86 78L74 88Q62 92 58 104Z" fill="#b4551f"/>' +
    '<path d="M76 62l-8 -20 15 12 1 -22 13 18 9 -22 7 24 15 -14 -4 22" fill="#b4551f"/>' +
    '<path d="M70 94q10 -9 21 -4M109 90q11 -5 21 4" stroke="#8a3f14" stroke-width="3.200" fill="none" stroke-linecap="round"/>' +
    eyes({ eye: '#3d6a52', wide: 6.6 }) + nose('#d6ae86') +
    '<g fill="#c98a5e"><circle cx="72" cy="128" r="1.600"/><circle cx="79" cy="133" r="1.600"/><circle cx="86" cy="127" r="1.600"/><circle cx="114" cy="127" r="1.600"/><circle cx="121" cy="133" r="1.600"/><circle cx="128" cy="128" r="1.600"/></g>' +
    '<path d="M88 142q12 10 24 0q-12 3 -24 0z" fill="#7d2f28" stroke="#7d2f28" stroke-width="2.400" stroke-linejoin="round"/></symbol>';

  /* Jago: Year 9, no tie, and enjoying himself */
  S += '<symbol id="ch-jago" viewBox="0 0 200 260"><rect width="200" height="260" fill="#27457a"/><path d="M0 0h200v260H0z" fill="none"/><path d="M66 0v260M134 0v260" stroke="#1b3157" stroke-width="4"/><rect x="88" y="60" width="24" height="8" rx="2" fill="#0e1a30" opacity=".6"/><rect x="20" y="60" width="24" height="8" rx="2" fill="#0e1a30" opacity=".6"/><rect x="156" y="60" width="24" height="8" rx="2" fill="#0e1a30" opacity=".6"/>' +
    '<path d="M6 260Q8 206 48 192L84 178H116L152 192Q192 206 194 260Z" fill="#f3f1e8"/><path d="M84 178L100 206L116 178Z" fill="#e3bf9c"/><path d="M84 178L74 200L100 206L126 200L116 178" fill="none" stroke="#c9c6ba" stroke-width="3" stroke-linejoin="round"/>' +
    '<path d="M132 214h26v24h-26z" fill="none" stroke="#c9c6ba" stroke-width="2.400"/><path d="M140 214q4 -10 12 -2l-2 8z" fill="#d9a93a"/>' +
    head({ skin: '#e3bf9c', shade: '#c79f7a' }) +
    '<path d="M58 106Q50 54 100 52Q150 54 142 106Q138 80 118 74Q94 70 70 82Q60 90 58 106Z" fill="#2a1f18"/><path d="M70 82q16 -18 44 -10" stroke="#3d2e24" stroke-width="3" fill="none"/>' +
    '<path d="M71 96q10 -6 20 -1M109 95q10 -5 20 1" stroke="#2a1f18" stroke-width="3.200" fill="none" stroke-linecap="round"/>' +
    eyes({ eye: '#3a2a1c', wide: 4.6, look: 1 }) + nose('#c79f7a') +
    '<path d="M84 139q16 14 32 0z" fill="#fbf7ee" stroke="#7d3a2e" stroke-width="2.600" stroke-linejoin="round"/></symbol>';

  /* Nell Proudfoot: Year 8, a fringe, round glasses, and an atlas held just under her nose */
  S += '<symbol id="ch-nell" viewBox="0 0 200 260"><rect width="200" height="260" fill="#6b4a2a"/><g fill="#3a2414"><rect x="0" y="0" width="200" height="8"/><rect x="0" y="92" width="200" height="8"/></g>' +
    '<g><rect x="6" y="12" width="14" height="80" fill="#a3382a"/><rect x="22" y="22" width="12" height="70" fill="#e9c46a"/><rect x="36" y="14" width="16" height="78" fill="#2f6a66"/><rect x="150" y="18" width="14" height="74" fill="#27457a"/><rect x="166" y="12" width="12" height="80" fill="#c9761a"/><rect x="180" y="24" width="14" height="68" fill="#7a4a9a"/></g>' +
    BLAZER + head({ skin: '#f3d9c4', shade: '#d9b89e' }) +
    '<path d="M56 124Q46 50 100 48Q154 50 144 124L134 126Q140 96 132 84Q100 96 68 84Q60 96 66 126Z" fill="#6b4a2a"/><path d="M62 92Q80 66 138 90Q120 62 100 62Q76 62 62 92Z" fill="#7d5a36"/>' +
    '<path d="M72 97q10 -5 19 -1M109 96q9 -4 19 1" stroke="#5a3d22" stroke-width="2.800" fill="none" stroke-linecap="round"/>' +
    eyes({ eye: '#4a6a8a', wide: 5.8 }) +
    '<circle cx="83" cy="112" r="15" fill="#fff" opacity=".14"/><circle cx="117" cy="112" r="15" fill="#fff" opacity=".14"/><circle cx="83" cy="112" r="15" fill="none" stroke="#a3382a" stroke-width="3"/><circle cx="117" cy="112" r="15" fill="none" stroke="#a3382a" stroke-width="3"/><path d="M98 111q2 -2 4 0M68 110l-9 -3M132 110l9 -3" stroke="#a3382a" stroke-width="3" fill="none"/>' +
    '<path d="M22 142L178 134L184 260H16Z" fill="#2f6a66"/><path d="M22 142L178 134" stroke="#e9c46a" stroke-width="4"/><text x="100" y="216" font-family="Cinzel,serif" font-weight="700" font-size="30" fill="#e9c46a" text-anchor="middle" transform="rotate(183 100 206)">ATLAS</text>' +
    '<ellipse cx="34" cy="150" rx="10" ry="13" fill="#f3d9c4"/><ellipse cx="166" cy="143" rx="10" ry="13" fill="#f3d9c4"/></symbol>';

  /* Ms Adeleke, the librarian: a plum cardigan, glasses on a chain, in no hurry */
  S += '<symbol id="ch-adeleke" viewBox="0 0 200 260"><rect width="200" height="260" fill="#e9dcc0"/><path d="M0 0h80l-50 260H0z" fill="#fff6d0" opacity=".7"/><path d="M130 0h36l-50 260H80z" fill="#fff6d0" opacity=".4"/>' +
    '<circle cx="100" cy="92" r="64" fill="#15110f"/>' +
    '<path d="M6 260Q8 206 48 192L84 178H116L152 192Q192 206 194 260Z" fill="#7a2f52"/><path d="M80 180L100 240L120 180Z" fill="#f1dfc8"/><path d="M80 180L72 260M120 180L128 260" stroke="#5a1f3c" stroke-width="5"/>' +
    '<g fill="#e9c46a"><circle cx="100" cy="214" r="3"/><circle cx="100" cy="230" r="3"/></g>' +
    head({ skin: '#8a5a3a', shade: '#6b4228' }) +
    '<path d="M60 98Q62 60 100 58Q138 60 140 98Q124 76 100 76Q76 76 60 98Z" fill="#15110f"/>' +
    '<path d="M72 96q10 -5 20 -1M108 95q10 -4 20 1" stroke="#15110f" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    eyes({ eye: '#2a1a10', wide: 4.2 }) + nose('#6b4228') +
    '<path d="M68 106h30v14q-15 8 -30 0zM102 106h30v14q-15 8 -30 0z" fill="#fff" opacity=".12" stroke="#c9a23a" stroke-width="2.600"/><path d="M98 110h4" stroke="#c9a23a" stroke-width="2.600"/>' +
    '<path d="M68 112q-14 30 -4 76M132 112q14 30 4 76" stroke="#c9a23a" stroke-width="1.600" fill="none" stroke-dasharray="3 3"/>' +
    '<path d="M87 142q13 7 26 0" stroke="#4a2018" stroke-width="3.200" fill="none" stroke-linecap="round"/></symbol>';

  /* Mr Corrigan: grey at the sides, eyebrows like hedges, a yellow bus-duty jacket over his shirt and tie, a red pen */
  S += '<symbol id="ch-corrigan" viewBox="0 0 200 260"><rect width="200" height="260" fill="#dfe6ea"/><g stroke="#c3ccd2" stroke-width="5"><path d="M0 30h200M0 62h200M0 94h200M0 126h200M0 158h200"/></g><path d="M0 0h200v170H0z" fill="#fff3c4" opacity=".3"/>' +
    '<path d="M6 260Q8 206 48 192L84 178H116L152 192Q192 206 194 260Z" fill="#f2d21f"/><path d="M82 178L100 236L118 178Z" fill="#dfe6ee"/><path d="M96 190h8l3 40 -7 10 -7 -10z" fill="#7d2a2a"/>' +
    '<path d="M82 178L70 260M118 178L130 260" stroke="#c9ced3" stroke-width="9"/><path d="M16 232h56M128 232h56" stroke="#c9ced3" stroke-width="10"/>' +
    '<path d="M146 206v30" stroke="#d8432a" stroke-width="6" stroke-linecap="round"/><path d="M146 202v6" stroke="#16202c" stroke-width="6" stroke-linecap="round"/>' +
    head({ skin: '#eccdb2', shade: '#d2ab8c' }) +
    '<path d="M57 118Q50 86 66 68Q62 92 68 122ZM143 118Q150 86 134 68Q138 92 132 122Z" fill="#b9bcc0"/><path d="M72 62Q100 50 128 62" stroke="#b9bcc0" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '<path d="M68 95q12 -9 24 -2M108 93q12 -7 24 2" stroke="#8f9499" stroke-width="5.500" fill="none" stroke-linecap="round"/>' +
    eyes({ eye: '#4a5a6a', wide: 4.2 }) + nose('#d2ab8c') +
    '<path d="M74 122q8 4 16 0M110 122q8 4 16 0" stroke="#d2ab8c" stroke-width="2" fill="none"/>' +
    '<path d="M86 144q14 5 28 -1" stroke="#8c4a3c" stroke-width="3.200" fill="none" stroke-linecap="round"/><path d="M72 132q-4 10 3 18M128 132q4 10 -3 18" stroke="#d2ab8c" stroke-width="2" fill="none"/></symbol>';

  S += '</defs></svg>';
  window.CAST_SVG = S;
  window.FACE = function (who) {
    var bg = { priya: '#2b3a34', theo: '#3a2f26', jago: '#27457a', nell: '#6b4a2a', adeleke: '#e9dcc0', corrigan: '#dfe6ea' }[who] || '#222';
    return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:' + bg + '"><use href="#ch-' + who + '"/></svg>';
  };
})();
