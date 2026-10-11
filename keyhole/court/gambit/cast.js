/* The people of "Move Sixteen", as busts of 200 x 260 without a background, so that the same drawing can stand
   behind a table in a scene and sit in the panel of an interview.
   FACE('maeve') gives the bust on its own colour, for ER.talk, for the panel board and for the cross-examination. */
(function () {
  function face(y, o) {          /* y: the middle of the head. brows, eyes, nose, mouth */
    var s = '<path d="M72 ' + (y - 9) + 'q11-' + (o.arch || 5) + ' 22 0M106 ' + (y - 9) + 'q11-' + (o.arch || 5) + ' 22 0" stroke="' + o.brow + '" stroke-width="' + (o.bw || 4) + '" fill="none" stroke-linecap="round"/>';
    s += '<ellipse cx="84" cy="' + (y + 6) + '" rx="6.500" ry="4.400" fill="#f7f1e6"/><ellipse cx="116" cy="' + (y + 6) + '" rx="6.500" ry="4.400" fill="#f7f1e6"/>';
    s += '<circle cx="85" cy="' + (y + 6) + '" r="3.200" fill="' + o.eye + '"/><circle cx="117" cy="' + (y + 6) + '" r="3.200" fill="' + o.eye + '"/><circle cx="86" cy="' + (y + 5) + '" r="1" fill="#fff"/><circle cx="118" cy="' + (y + 5) + '" r="1" fill="#fff"/>';
    s += '<path d="M100 ' + (y + 7) + 'q-6 15 0 19q5 2 8-2" stroke="' + o.shade + '" stroke-width="2.600" fill="none" stroke-linecap="round"/>';
    s += '<path d="M' + (o.mouth || ('88 ' + (y + 39) + 'q12 5 24-1')) + '" stroke="' + (o.lip || '#8a4a44') + '" stroke-width="3.200" fill="none" stroke-linecap="round"/>';
    return s;
  }
  var GROWN = 'M6 260Q8 206 46 192L82 178H118L154 192Q192 206 194 260Z', CHILD = 'M16 260Q18 214 54 200L85 186H115L146 200Q182 214 184 260Z';
  var P = {};

  /* Maeve Loxley, twelve: two plaits, a green cardigan, and player number 14 */
  P.maeve = '<path d="' + CHILD + '" fill="#3f7d55"/><path d="M85 186L100 222L115 186Z" fill="#f6f2e6"/><path d="M85 186L76 204L97 216ZM115 186L124 204L103 216Z" fill="#e6e1d2"/>' +
    '<path d="M100 222V260" stroke="#2f6243" stroke-width="4"/><g fill="#e9d48a"><circle cx="107" cy="234" r="3"/><circle cx="107" cy="250" r="3"/></g>' +
    '<rect x="128" y="214" width="34" height="26" rx="3" fill="#fbf8ec"/><text x="145" y="233" text-anchor="middle" font-family="Oswald,sans-serif" font-weight="600" font-size="17" fill="#1d2a3a">14</text>' +
    '<path d="M62 120q-12 46-6 96q10 6 16-2q-4-44 2-86z" fill="#7a4a2a"/><path d="M138 120q12 46 6 96q-10 6-16-2q4-44-2-86z" fill="#7a4a2a"/>' +
    '<g stroke="#5f3a20" stroke-width="2.500"><path d="M56 150l14 6M56 172l15 6M58 194l14 5M130 156l14-6M129 178l15-6M128 199l14-5"/></g>' +
    '<g fill="#c8791f"><rect x="55" y="206" width="18" height="7" rx="2"/><rect x="127" y="206" width="18" height="7" rx="2"/></g>' +
    '<rect x="90" y="154" width="20" height="36" fill="#e2b896"/><ellipse cx="61" cy="118" rx="7" ry="11" fill="#e8c2a2"/><ellipse cx="139" cy="118" rx="7" ry="11" fill="#e8c2a2"/>' +
    '<ellipse cx="100" cy="114" rx="38" ry="45" fill="#f1cfb2"/>' +
    '<path d="M61 112Q56 66 100 64Q144 66 139 112Q134 86 100 82Q66 86 61 112Z" fill="#7a4a2a"/><path d="M100 66V84" stroke="#f1cfb2" stroke-width="2.500"/>' +
    '<g fill="#d39a78" opacity=".8"><circle cx="78" cy="131" r="1.600"/><circle cx="85" cy="135" r="1.600"/><circle cx="72" cy="136" r="1.400"/><circle cx="122" cy="131" r="1.600"/><circle cx="115" cy="135" r="1.600"/><circle cx="128" cy="136" r="1.400"/></g>' +
    face(114, { brow: '#5f3a20', eye: '#3b5a3a', shade: '#c59877', mouth: '90 151q10 2 20 0', lip: '#9a5348', arch: 3 });

  /* Tunde Oyelaran, fifteen, the top seed: a Castle Hill club top */
  P.tunde = '<path d="' + CHILD + '" fill="#7b1f2a"/><path d="M16 260Q18 214 54 200L64 196L58 260Z" fill="#e8b923"/><path d="M184 260Q182 214 146 200L136 196L142 260Z" fill="#e8b923"/>' +
    '<path d="M84 186Q100 206 116 186L122 196Q100 222 78 196Z" fill="#5d1620"/><path d="M92 198L100 232L108 198Q100 206 92 198Z" fill="#f6f2e6"/>' +
    '<text x="100" y="252" text-anchor="middle" font-family="Oswald,sans-serif" font-weight="600" font-size="13" fill="#f3d9a0" letter-spacing="2">CASTLE HILL</text>' +
    '<rect x="89" y="152" width="22" height="38" fill="#6a4630"/><ellipse cx="60" cy="116" rx="7" ry="12" fill="#77503a"/><ellipse cx="140" cy="116" rx="7" ry="12" fill="#77503a"/>' +
    '<ellipse cx="100" cy="112" rx="39" ry="47" fill="#855a40"/>' +
    '<path d="M60 104Q58 60 100 58Q142 60 140 104Q136 82 124 76Q100 70 76 76Q64 82 60 104Z" fill="#17120f"/>' +
    face(112, { brow: '#17120f', eye: '#1d130d', shade: '#5f3d2a', mouth: '88 150q12 -3 24 1', lip: '#4a2a22' });

  /* Mrs Enid Hargreave, Chief Arbiter: a navy blazer, a lanyard, and her reading glasses pushed up */
  P.hargreave = '<path d="' + GROWN + '" fill="#22344f"/><path d="M82 178L100 226L118 178Z" fill="#f3f1ea"/><path d="M82 178L64 212L96 240ZM118 178L136 212L104 240Z" fill="#2c4264"/>' +
    '<path d="M88 182Q100 240 112 182" stroke="#c9382a" stroke-width="4" fill="none"/><rect x="84" y="226" width="32" height="24" rx="3" fill="#fbf8ec"/><path d="M89 234h22M89 241h16" stroke="#22344f" stroke-width="2.500"/>' +
    '<rect x="88" y="146" width="24" height="38" fill="#d9b092"/><ellipse cx="59" cy="110" rx="6" ry="11" fill="#e0b99a"/><ellipse cx="141" cy="110" rx="6" ry="11" fill="#e0b99a"/>' +
    '<path d="M54 128Q46 54 100 50Q154 54 146 128Q146 142 138 146Q144 110 132 86Q100 72 68 86Q56 110 62 146Q54 142 54 128Z" fill="#b9bcc2"/>' +
    '<ellipse cx="100" cy="106" rx="39" ry="48" fill="#ecc9ad"/>' +
    '<path d="M61 104Q58 62 100 60Q142 62 139 104Q130 84 100 80Q70 84 61 104Z" fill="#b9bcc2"/>' +
    '<g fill="none" stroke="#3a3f4a" stroke-width="2.600"><path d="M70 70q10-9 24-4M106 66q14-5 24 4M94 67h12"/></g>' +
    face(106, { brow: '#8d9097', eye: '#3a4a5c', shade: '#c29878', mouth: '88 146h24' });

  /* Mr Desmond Pettifer, corridor steward: a yellow tabard over a brown cardigan, thirty-four years on the buses */
  P.pettifer = '<path d="' + GROWN + '" fill="#6b4e33"/><path d="M82 178L100 220L118 178Z" fill="#f3f1ea"/>' +
    '<path d="M95 194h10l4 38-9 14-9-14z" fill="#1f4a37"/><path d="M94 191h12l-2 9h-8z" fill="#17382a"/>' +
    '<path d="M44 194L76 180L92 260H30ZM156 194L124 180L108 260H170Z" fill="#e9d93a"/><path d="M36 232h54M110 232h54" stroke="#c9ccd0" stroke-width="7"/>' +
    '<rect x="112" y="204" width="46" height="16" rx="2" fill="#1c1d22"/><text x="135" y="216" text-anchor="middle" font-family="Oswald,sans-serif" font-weight="600" font-size="9" fill="#e9d93a" letter-spacing=".500">STEWARD</text>' +
    '<rect x="87" y="146" width="26" height="38" fill="#d3a888"/><ellipse cx="57" cy="110" rx="7" ry="12" fill="#e0b596"/><ellipse cx="143" cy="110" rx="7" ry="12" fill="#e0b596"/>' +
    '<ellipse cx="100" cy="104" rx="42" ry="50" fill="#eecbb0"/>' +
    '<path d="M60 102q-8-22 4-40q-2 20 2 44zM140 102q8-22-4-40q2 20-2 44z" fill="#f1f1ee"/><path d="M80 60q20-10 40 0" stroke="#f9e6d4" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>' +
    '<ellipse cx="74" cy="126" rx="9" ry="6" fill="#e3a88e" opacity=".5"/><ellipse cx="126" cy="126" rx="9" ry="6" fill="#e3a88e" opacity=".5"/>' +
    face(104, { brow: '#f1f1ee', bw: 6, eye: '#3a4a5c', shade: '#c08e6c', mouth: '90 150q10 3 20 0', arch: 7 }) +
    '<path d="M78 140q10-9 22-4q12-5 22 4q-10 7-22 3q-12 4-22-3z" fill="#f1f1ee"/>';

  /* Dr Shirin Rahman, Chair of the Appeals Panel: a plum cardigan, glasses on a chain, and a tin of peppermints */
  P.rahman = '<path d="' + GROWN + '" fill="#6a2f52"/><path d="M82 178L100 214L118 178Z" fill="#f0e6d2"/><path d="M82 178L70 206L98 226ZM118 178L130 206L102 226Z" fill="#7d3a62"/>' +
    '<g fill="#e7c477"><circle cx="100" cy="230" r="3.400"/><circle cx="100" cy="248" r="3.400"/></g>' +
    '<rect x="88" y="146" width="24" height="38" fill="#a8744e"/><ellipse cx="59" cy="110" rx="6" ry="11" fill="#b17d56"/><ellipse cx="141" cy="110" rx="6" ry="11" fill="#b17d56"/>' +
    '<circle cx="100" cy="42" r="20" fill="#4a4648"/>' +
    '<ellipse cx="100" cy="106" rx="39" ry="48" fill="#c08a62"/>' +
    '<path d="M61 106Q56 58 100 56Q144 58 139 106Q134 80 100 74Q66 80 61 106Z" fill="#4a4648"/><path d="M74 70q14-10 30-8" stroke="#c9ccd0" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    face(106, { brow: '#3a3638', eye: '#22160f', shade: '#96643f', mouth: '88 145q12 6 24 0', lip: '#7a3a34' }) +
    '<g fill="none" stroke="#e7c477" stroke-width="2.600"><rect x="71" y="102" width="26" height="18" rx="6"/><rect x="103" y="102" width="26" height="18" rx="6"/><path d="M97 110h6"/><path d="M71 110q-14 20-6 62M129 110q14 20 6 62" stroke-width="1.600"/></g>';

  /* Mr Leonard Quayle: five days of English at Upper Brindlow School, and the Under-9s on the seventh */
  P.quayle = '<path d="' + GROWN + '" fill="#7a6a48"/><g stroke="#63553a" stroke-width="2" opacity=".8"><path d="M22 232l28-30M34 258l40-48M150 208l32 30M128 206l42 52"/></g>' +
    '<path d="M82 178L100 222L118 178Z" fill="#cfd9e6"/><path d="M82 178L62 214L92 238ZM118 178L138 214L108 238Z" fill="#8a7a56"/>' +
    '<path d="M95 196h10l3 34-8 12-8-12z" fill="#8f2947"/>' +
    '<rect x="88" y="146" width="24" height="38" fill="#dcb090"/><ellipse cx="58" cy="110" rx="7" ry="12" fill="#e6bb9c"/><ellipse cx="142" cy="110" rx="7" ry="12" fill="#e6bb9c"/>' +
    '<ellipse cx="100" cy="106" rx="40" ry="49" fill="#f0cdb0"/>' +
    '<path d="M60 102Q56 56 100 54Q146 56 140 102Q136 78 112 72Q84 68 66 80Q62 90 60 102Z" fill="#b5672c"/>' +
    '<path d="M62 118Q62 160 100 162Q138 160 138 118Q134 144 118 148Q100 140 82 148Q66 144 62 118Z" fill="#b5672c"/>' +
    face(106, { brow: '#8f4e1f', eye: '#3b5a3a', shade: '#c59877', mouth: '90 146q10 4 20 0', lip: '#7a3a2a' }) +
    '<g transform="rotate(-18 146 92)"><rect x="126" y="89" width="46" height="6" fill="#e8b923"/><path d="M172 89l9 3-9 3z" fill="#e9c9a4"/><rect x="122" y="89" width="6" height="6" fill="#d4577c"/></g>';

  /* Mr Tom Loxley, of the bookstall: no relation. He has checked */
  P.loxley = '<path d="' + GROWN + '" fill="#263a55"/><path d="M70 184Q100 204 130 184L136 198Q100 222 64 198Z" fill="#1c2c42"/>' +
    '<g stroke="#31496a" stroke-width="3" opacity=".8"><path d="M30 220h140M24 240h152"/></g>' +
    '<rect x="87" y="146" width="26" height="40" fill="#d7ad8c"/><ellipse cx="57" cy="110" rx="7" ry="12" fill="#e2b999"/><ellipse cx="143" cy="110" rx="7" ry="12" fill="#e2b999"/>' +
    '<ellipse cx="100" cy="104" rx="42" ry="50" fill="#efcaae"/>' +
    '<path d="M60 100q-6-18 2-34q0 18 4 36zM140 100q6-18-2-34q0 18-4 36z" fill="#8d9097"/><path d="M82 58q18-8 36 0" stroke="#f9e6d4" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>' +
    '<path d="M60 116Q58 168 100 172Q142 168 140 116Q136 146 120 150Q100 140 80 150Q64 146 60 116Z" fill="#9a9da3"/>' +
    face(104, { brow: '#6b6e75', eye: '#2b2a26', shade: '#c29878', mouth: '90 147q10 5 20 0', lip: '#6a3a30' }) +
    '<g fill="none" stroke="#1c1d22" stroke-width="3.400"><circle cx="84" cy="110" r="12"/><circle cx="116" cy="110" r="12"/><path d="M96 109h8M72 108l-12-4M128 108l12-4"/></g>';

  /* Miss Joan Ferrars, results desk: she coaches Castle Hill, and says so before anybody asks */
  P.ferrars = '<path d="' + GROWN + '" fill="#7b1f2a"/><path d="M6 260Q8 206 46 192L58 188L50 260Z" fill="#e8b923"/><path d="M194 260Q192 206 154 192L142 188L150 260Z" fill="#e8b923"/>' +
    '<path d="M82 178L100 216L118 178Z" fill="#f6f2e6"/><path d="M100 216V260" stroke="#5d1620" stroke-width="4"/><path d="M96 220h8v14h-8z" fill="#c9ccd0"/>' +
    '<rect x="88" y="146" width="24" height="38" fill="#b98a62"/><ellipse cx="59" cy="110" rx="6" ry="11" fill="#c2946b"/><ellipse cx="141" cy="110" rx="6" ry="11" fill="#c2946b"/>' +
    '<path d="M134 70q30 4 26 50q-4 26-16 30q8-34-4-62z" fill="#2a1c16"/>' +
    '<ellipse cx="100" cy="106" rx="39" ry="48" fill="#cfa078"/>' +
    '<path d="M61 106Q56 58 100 56Q144 58 139 106Q132 76 100 72Q68 76 61 106Z" fill="#2a1c16"/>' +
    face(106, { brow: '#1d1410', eye: '#22160f', shade: '#a2764f', mouth: '88 146q12 2 24-2', lip: '#7a3a34' });

  /* Dr Abi Oyelaran: in charge of the tea urn, and the mother of the top seed */
  P.oyelaran = '<path d="' + GROWN + '" fill="#2f6a6a"/><path d="M82 178L100 212L118 178Z" fill="#f0e6d2"/>' +
    '<path d="M70 200h60l8 60H62z" fill="#f6f2e6"/><path d="M70 200Q100 176 130 200" stroke="#f6f2e6" stroke-width="5" fill="none"/><path d="M84 226h32v20H84z" fill="none" stroke="#c9ccd0" stroke-width="2.500"/>' +
    '<rect x="88" y="146" width="24" height="38" fill="#5f3d2a"/><ellipse cx="59" cy="110" rx="6" ry="11" fill="#6a4630"/><ellipse cx="141" cy="110" rx="6" ry="11" fill="#6a4630"/>' +
    '<g fill="#e7c477"><circle cx="59" cy="126" r="4"/><circle cx="141" cy="126" r="4"/></g>' +
    '<ellipse cx="100" cy="106" rx="39" ry="48" fill="#7a5038"/>' +
    '<g fill="#17120f"><circle cx="70" cy="74" r="16"/><circle cx="90" cy="60" r="18"/><circle cx="112" cy="60" r="18"/><circle cx="131" cy="74" r="16"/><circle cx="100" cy="72" r="18"/><circle cx="62" cy="92" r="9"/><circle cx="138" cy="92" r="9"/></g>' +
    face(106, { brow: '#17120f', eye: '#1d130d', shade: '#54341f', mouth: '86 144q14 9 28 0', lip: '#4a241c' });

  var s = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>', k;
  for (k in P) s += '<symbol id="ch-' + k + '" viewBox="0 0 200 260">' + P[k] + '</symbol>';
  window.CAST_SVG = s + '</defs></svg>';
  var BG = { maeve: '#39493f', tunde: '#40323a', hargreave: '#33405a', pettifer: '#4a4234', rahman: '#3d3046', quayle: '#3f4634', loxley: '#2f3a4a', ferrars: '#463238', oyelaran: '#2c4444' };
  window.FACE = function (id) {
    return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:' + (BG[id] || '#2a3038') + '"><use href="#ch-' + id + '"/></svg>';
  };
})();
