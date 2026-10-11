/* The people of "When the Tide Serves", as busts of 200 x 260.
   FACE('pargeter' | 'skerritt' | 'rudge' | 'prowse' | 'door' | 'stern' | 'nancy') gives the picture for an interview.
   'door' and 'stern' are the two Miss Coombeses: one face, one coat, one headscarf. Only what is behind them differs. */
(function () {
  function head(o) {
    var s = '';
    s += '<rect x="87" y="146" width="26" height="42" fill="' + o.skin + '"/><path d="M87 168q13 10 26 0v20h-26z" fill="' + o.shade + '" opacity=".55"/>';
    s += '<ellipse cx="' + (58 - (o.ear || 0)) + '" cy="112" rx="' + (6 + (o.ear || 0)) + '" ry="' + (10 + (o.ear || 0)) + '" fill="' + o.skin + '"/><ellipse cx="' + (142 + (o.ear || 0)) + '" cy="112" rx="' + (6 + (o.ear || 0)) + '" ry="' + (10 + (o.ear || 0)) + '" fill="' + o.skin + '"/>';
    s += '<ellipse cx="100" cy="' + (o.long ? 108 : 106) + '" rx="' + (o.wide || 41) + '" ry="' + (o.long ? 51 : 49) + '" fill="' + o.skin + '"/>';
    return s;
  }
  function eyes(o) {
    var e = o.eye || '#3a2a1c', w = o.open || 5, l = o.look || 0;
    return '<ellipse cx="83" cy="112" rx="6.5" ry="' + w + '" fill="#fbf7ee"/><ellipse cx="117" cy="112" rx="6.5" ry="' + w + '" fill="#fbf7ee"/>' +
      '<circle cx="' + (83 + l) + '" cy="112.500" r="3.400" fill="' + e + '"/><circle cx="' + (117 + l) + '" cy="112.500" r="3.400" fill="' + e + '"/>' +
      '<circle cx="' + (84 + l) + '" cy="111.300" r="1" fill="#fff"/><circle cx="' + (118 + l) + '" cy="111.300" r="1" fill="#fff"/>';
  }
  function nose(c) { return '<path d="M100 116q-5 12 0 16q5 2 7 -2" stroke="' + c + '" stroke-width="2.600" fill="none" stroke-linecap="round"/>'; }
  function lines(c) { return '<path d="M72 126q8 4 16 0M112 126q8 4 16 0M74 92q12 -4 24 0M102 92q12 -4 24 0M80 84q20 -5 40 0" stroke="' + c + '" stroke-width="1.600" fill="none" stroke-linecap="round"/><path d="M70 134q-4 10 3 20M130 134q4 10 -3 20" stroke="' + c + '" stroke-width="2" fill="none" stroke-linecap="round"/>'; }

  /* one young woman in a belted raincoat and a headscarf, drawn once and used twice */
  function coombes(look, mouth) {
    return '<path d="M4 260Q6 204 46 190L84 178H116L154 190Q194 204 196 260Z" fill="#b9a57a"/>' +
      '<path d="M84 178L62 196L88 230L100 204L112 230L138 196L116 178" fill="#c9b78c" stroke="#8f7c52" stroke-width="2.500" stroke-linejoin="round"/>' +
      '<path d="M100 204V260" stroke="#8f7c52" stroke-width="2.500"/><circle cx="92" cy="244" r="3.600" fill="#6b5a3a"/>' +
      '<rect x="87" y="146" width="26" height="42" fill="#f1d5bd"/><path d="M87 168q13 10 26 0v20h-26z" fill="#d6b294" opacity=".55"/>' +
      '<path d="M100 38Q44 40 49 112Q53 152 86 174H114Q147 152 151 112Q156 40 100 38Z" fill="#7d2f3a"/>' +
      '<ellipse cx="100" cy="108" rx="40" ry="49" fill="#f1d5bd"/>' +
      '<path d="M63 104q9 -32 37 -32t37 32q-12 -14 -37 -14t-37 14z" fill="#5a3a22"/>' +
      '<path d="M57 102Q56 46 100 44Q144 46 143 102Q128 66 100 66Q72 66 57 102Z" fill="#8a3542"/><path d="M70 62Q100 50 130 62" stroke="#9c4a56" stroke-width="2.500" fill="none" stroke-linecap="round"/>' +
      '<path d="M88 168h24l-4 12 10 20h-14l-4 -14 -4 14h-14l10 -20z" fill="#7d2f3a" stroke="#5c1f28" stroke-width="1.500" stroke-linejoin="round"/>' +
      '<path d="M72 98q9 -5 19 -2M109 96q10 -3 19 2" stroke="#5a3a22" stroke-width="2.800" fill="none" stroke-linecap="round"/>' +
      eyes({ eye: '#4a5f4a', open: 5.2, look: look }) + nose('#d6b294') + mouth;
  }

  var S = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>';

  /* Ms Pargeter, the purser: six weeks on this boat, and a white-topped cap that she takes seriously */
  S += '<symbol id="ch-pargeter" viewBox="0 0 200 260"><rect width="200" height="260" fill="#1f3a34"/><path d="M0 70h200M0 150h200" stroke="#17302a" stroke-width="5"/><circle cx="164" cy="44" r="26" fill="#0c1a1e" stroke="#b8923a" stroke-width="7"/><circle cx="164" cy="44" r="19" fill="#22363a"/>' +
    '<path d="M6 260Q8 206 48 192L84 178H116L152 192Q192 206 194 260Z" fill="#1d2f4a"/><path d="M84 178L100 224L116 178Z" fill="#f1ede2"/>' +
    '<path d="M84 178L66 206L98 236M116 178L134 206L102 236" fill="none" stroke="#14213a" stroke-width="5" stroke-linejoin="round"/>' +
    '<path d="M96 192h8l3 26 -7 10 -7 -10z" fill="#1f4a3d"/><g fill="#d8b150"><circle cx="78" cy="240" r="3.600"/><circle cx="122" cy="240" r="3.600"/></g>' +
    '<rect x="134" y="216" width="40" height="13" rx="2" fill="#d8b150"/><text x="154" y="226" text-anchor="middle" font-family="Oswald,sans-serif" font-size="7.500" letter-spacing=".8" fill="#14213a">PURSER</text>' +
    head({ skin: '#c99670', shade: '#a8774f' }) +
    '<path d="M58 106Q56 78 70 70Q62 90 66 110ZM142 106Q144 78 130 70Q138 90 134 110Z" fill="#1c1512"/>' +
    '<path d="M52 82Q50 46 100 44Q150 46 148 82Z" fill="#f1ede2"/><path d="M52 78h96v10H52z" fill="#1d2f4a"/><path d="M54 88Q100 104 146 88L150 96Q100 114 50 96Z" fill="#14213a"/>' +
    '<circle cx="100" cy="64" r="9" fill="#d8b150"/><path d="M95 64h10M100 59v10" stroke="#14213a" stroke-width="2"/>' +
    '<path d="M71 101q10 -4 20 0M108 96q11 -7 21 -1" stroke="#1c1512" stroke-width="3.200" fill="none" stroke-linecap="round"/>' +
    eyes({ eye: '#2a1a10', open: 4.4 }) + nose('#a8774f') +
    '<path d="M88 144q11 -2 23 0" stroke="#7d3a2e" stroke-width="3.200" fill="none" stroke-linecap="round"/></symbol>';

  /* Captain Skerritt: a white beard, a dark jersey, and no hurry */
  S += '<symbol id="ch-skerritt" viewBox="0 0 200 260"><rect width="200" height="260" fill="#0b1416"/><rect x="0" y="0" width="200" height="96" fill="#16262a"/><path d="M66 0v96M134 0v96" stroke="#0b1416" stroke-width="7"/>' +
    '<circle cx="34" cy="150" r="30" fill="#0c2a1c"/><circle cx="34" cy="150" r="30" fill="none" stroke="#3fae6a" stroke-width="2" opacity=".7"/><path d="M34 150L56 132" stroke="#7dffb0" stroke-width="2" opacity=".8"/>' +
    '<path d="M6 260Q8 206 48 192L84 178H116L152 192Q192 206 194 260Z" fill="#1a2a35"/><path d="M78 176q22 20 44 0v18q-22 14 -44 0z" fill="#24394a"/><path d="M80 186q20 12 40 0M80 194q20 12 40 0" stroke="#1a2a35" stroke-width="2" fill="none"/>' +
    head({ skin: '#dcb492', shade: '#b98f6e', ear: 1 }) +
    '<path d="M60 114Q62 164 100 168Q138 164 140 114Q132 138 100 138Q68 138 60 114Z" fill="#e2e4e4"/><path d="M84 136q16 -8 32 0q-16 6 -32 0z" fill="#f1f2f2"/>' +
    '<path d="M54 84Q52 48 100 46Q148 48 146 84Z" fill="#1a2a35"/><path d="M54 80h92v9H54z" fill="#0e161b"/><path d="M56 89Q100 103 144 89L148 97Q100 113 52 97Z" fill="#0e161b"/>' +
    '<path d="M92 66h16l-3 -10h-10z" fill="#d8b150"/><path d="M100 54v-6" stroke="#d8b150" stroke-width="3"/>' +
    '<path d="M70 102q11 -4 21 1M109 103q10 -5 21 -1" stroke="#c9ccce" stroke-width="4.500" fill="none" stroke-linecap="round"/>' +
    eyes({ eye: '#4a6a7a', open: 3.800 }) + nose('#b98f6e') +
    '<path d="M74 122q8 4 15 0M111 122q7 4 15 0" stroke="#b98f6e" stroke-width="1.800" fill="none"/>' +
    '<path d="M90 148q10 3 20 0" stroke="#8c5a4a" stroke-width="2.600" fill="none" stroke-linecap="round"/></symbol>';

  /* Dougie Rudge, eighty-eight: a flat cap, a white moustache, ears like handles, a red scarf */
  S += '<symbol id="ch-rudge" viewBox="0 0 200 260"><rect width="200" height="260" fill="#27363a"/><ellipse cx="150" cy="40" rx="90" ry="60" fill="#c9d6d8" opacity=".12"/><path d="M0 196h200M0 214h200" stroke="#0f1a1c" stroke-width="5"/><path d="M30 196v64M170 196v64" stroke="#0f1a1c" stroke-width="5"/>' +
    '<path d="M6 260Q8 206 48 192L84 178H116L152 192Q192 206 194 260Z" fill="#3a3d34"/>' +
    '<path d="M74 180q26 22 52 0l4 20q-30 20 -60 0z" fill="#7d2f2a"/><path d="M92 196l-6 44h16l4 -40z" fill="#7d2f2a"/><path d="M90 206h14M88 222h14" stroke="#5c1f1c" stroke-width="2"/>' +
    head({ skin: '#eccdb2', shade: '#cfa88a', ear: 3, long: 1, wide: 38 }) +
    '<path d="M50 90Q48 50 100 50Q150 50 152 84Q170 86 178 96Q140 88 96 92Q70 94 50 90Z" fill="#5a5a4a"/><path d="M50 88Q100 76 152 84" stroke="#4a4a3c" stroke-width="3" fill="none"/>' +
    '<path d="M62 112Q58 98 64 92Q62 104 66 114ZM138 112Q142 98 136 92Q138 104 134 114Z" fill="#e2e2de"/>' +
    '<path d="M68 102q11 -7 22 -1M110 101q11 -6 22 1" stroke="#ecece8" stroke-width="4.500" fill="none" stroke-linecap="round"/>' +
    eyes({ eye: '#5a7a8a', open: 3.600 }) + nose('#cfa88a') + lines('#cfa88a') +
    '<path d="M78 140q22 -12 44 0q-10 8 -22 2q-12 6 -22 -2z" fill="#f1f1ee"/>' +
    '<path d="M90 152q10 2 20 0" stroke="#8c5a4a" stroke-width="2.400" fill="none" stroke-linecap="round"/></symbol>';

  /* Lionel Prowse, "Keeper of the Lamp": a museum volunteer in a keeper\'s cap, lit from below by his own lantern */
  S += '<symbol id="ch-prowse" viewBox="0 0 200 260"><rect width="200" height="260" fill="#1c2c33"/><ellipse cx="100" cy="270" rx="150" ry="120" fill="#f3b05a" opacity=".26"/>' +
    '<path d="M6 260Q8 206 48 192L84 178H116L152 192Q192 206 194 260Z" fill="#b8922e"/><path d="M84 178L100 216L116 178Z" fill="#f1ede2"/>' +
    '<path d="M84 178L60 200L96 240M116 178L140 200L104 240" fill="none" stroke="#8f6f1e" stroke-width="5" stroke-linejoin="round"/><g fill="#3a2a10"><circle cx="100" cy="232" r="4"/><circle cx="100" cy="250" r="4"/></g>' +
    '<rect x="20" y="214" width="34" height="46" rx="3" fill="#2a2f33"/><rect x="25" y="220" width="24" height="34" fill="#ffd98a"/><path d="M37 220v34" stroke="#2a2f33" stroke-width="2"/><path d="M26 214q11 -18 22 0" fill="none" stroke="#2a2f33" stroke-width="4"/>' +
    head({ skin: '#f3d2b4', shade: '#d9ae8a', wide: 44 }) + '<ellipse cx="100" cy="140" rx="40" ry="20" fill="#ffc98a" opacity=".3"/>' +
    '<path d="M52 82Q48 44 100 42Q152 44 148 82Z" fill="#15223a"/><path d="M52 78h96v10H52z" fill="#0d1524"/><path d="M54 88Q100 102 146 88L150 96Q100 112 50 96Z" fill="#0d1524"/>' +
    '<path d="M88 66l12 -14 12 14 -12 8z" fill="#f2d674"/><circle cx="100" cy="63" r="3" fill="#15223a"/>' +
    '<path d="M70 98q10 -8 21 -3M109 95q11 -5 21 3" stroke="#8a5a2e" stroke-width="3.200" fill="none" stroke-linecap="round"/>' +
    eyes({ eye: '#5a4a2a', open: 6.200 }) +
    '<circle cx="83" cy="112" r="14" fill="#fff" opacity=".12"/><circle cx="117" cy="112" r="14" fill="#fff" opacity=".12"/><circle cx="83" cy="112" r="14" fill="none" stroke="#3a2a1c" stroke-width="2.600"/><circle cx="117" cy="112" r="14" fill="none" stroke="#3a2a1c" stroke-width="2.600"/><path d="M97 111q3 -2 6 0" stroke="#3a2a1c" stroke-width="2.600" fill="none"/>' +
    nose('#d9ae8a') + '<path d="M86 142q14 14 28 0q-14 4 -28 0z" fill="#7d2f28" stroke="#7d2f28" stroke-width="2.400" stroke-linejoin="round"/></symbol>';

  /* Miss Coombes by the saloon door: the warm light of the saloon on one side of her */
  S += '<symbol id="ch-door" viewBox="0 0 200 260"><rect width="200" height="260" fill="#2a3338"/><rect x="118" y="0" width="82" height="260" fill="#e9b060" opacity=".5"/><rect x="128" y="18" width="62" height="96" fill="#ffd98a" opacity=".55"/><path d="M118 0v260" stroke="#1a2024" stroke-width="7"/>' +
    coombes(0, '<path d="M88 144q12 5 24 -1" stroke="#9c4a44" stroke-width="3" fill="none" stroke-linecap="round"/>') +
    '<path d="M140 108Q150 150 132 178" stroke="#ffd98a" stroke-width="5" fill="none" opacity=".35"/></symbol>';

  /* Miss Coombes at the stern rail: fog, and the stern lamp behind her */
  S += '<symbol id="ch-stern" viewBox="0 0 200 260"><rect width="200" height="260" fill="#33454c"/><circle cx="44" cy="52" r="58" fill="#dfeef0" opacity=".2"/><circle cx="44" cy="52" r="26" fill="#f4fbfb" opacity=".5"/><circle cx="44" cy="52" r="9" fill="#fff"/>' +
    '<path d="M0 206h200M0 226h200" stroke="#18262b" stroke-width="5"/><path d="M40 206v54M160 206v54" stroke="#18262b" stroke-width="5"/>' +
    coombes(-2, '<path d="M90 145q10 2 20 0" stroke="#9c4a44" stroke-width="3" fill="none" stroke-linecap="round"/>') + '</symbol>';

  /* Mrs Nancy Coombes, ninety-seven, in a shawl, by lamplight */
  S += '<symbol id="ch-nancy" viewBox="0 0 200 260"><rect width="200" height="260" fill="#1a2630"/><circle cx="172" cy="60" r="70" fill="#ffc46a" opacity=".22"/><circle cx="172" cy="60" r="16" fill="#ffe9b0"/><path d="M172 0v44" stroke="#0e161b" stroke-width="4"/>' +
    '<g fill="#e9f0f6" opacity=".7"><circle cx="24" cy="30" r="1.600"/><circle cx="60" cy="16" r="1.200"/><circle cx="96" cy="26" r="1.400"/></g>' +
    '<path d="M2 260Q4 200 44 188L84 176H116L156 188Q196 200 198 260Z" fill="#4a5f6a"/><path d="M44 188L100 250L156 188L140 182L100 226L60 182Z" fill="#7d2f3a"/><path d="M60 182L100 226L140 182" stroke="#e9c46a" stroke-width="2" fill="none"/>' +
    '<path d="M24 224l20 -22M176 224l-20 -22" stroke="#3a4a54" stroke-width="5"/>' +
    head({ skin: '#ecd2bd', shade: '#cfae96', long: 1, wide: 37 }) + '<ellipse cx="126" cy="112" rx="14" ry="34" fill="#ffc98a" opacity=".3"/>' +
    '<path d="M62 104Q58 56 100 54Q142 56 138 104Q130 78 100 76Q70 78 62 104Z" fill="#f1f3f3"/><circle cx="100" cy="50" r="15" fill="#f1f3f3"/><path d="M74 78Q100 64 126 78" stroke="#d5dcdc" stroke-width="2" fill="none"/>' +
    '<path d="M72 102q10 -4 19 -1M109 101q9 -3 19 1" stroke="#c9cfcf" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    eyes({ eye: '#3a5a6a', open: 3.400 }) + nose('#cfae96') + lines('#cfae96') +
    '<path d="M70 118q6 -4 12 -1M118 117q6 -3 12 1" stroke="#cfae96" stroke-width="1.600" fill="none" stroke-linecap="round"/>' +
    '<path d="M88 146q12 6 24 0" stroke="#9c5a50" stroke-width="2.800" fill="none" stroke-linecap="round"/></symbol>';

  S += '</defs></svg>';
  window.CAST_SVG = S;
  window.FACE = function (who) {
    var bg = { pargeter: '#1f3a34', skerritt: '#0b1416', rudge: '#27363a', prowse: '#1c2c33', door: '#2a3338', stern: '#33454c', nancy: '#1a2630' }[who] || '#222';
    return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:' + bg + '"><use href="#ch-' + who + '"/></svg>';
  };
})();
