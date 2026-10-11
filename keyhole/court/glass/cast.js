/* The people of "A Quarter Past Four", as busts of 200 x 260 without a background, so that the same drawing can sit
   in a scene (behind a table, in the witness chair) and in the panel of an interview.
   FACE('usher') gives the bust on its own colour, for ER.talk and for the cross-examination. */
window.CAST_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>' +

/* Mr Makepeace, the usher: the only gown in the building */
'<symbol id="ch-usher" viewBox="0 0 200 260">' +
'<path d="M4 260Q6 204 44 190L82 176H118L156 190Q194 204 196 260Z" fill="#15161a"/>' +
'<path d="M66 184L100 260L134 184Z" fill="#6f747c"/><path d="M84 178L100 216L116 178Z" fill="#f3f1ea"/>' +
'<path d="M96 192h8l4 42-8 12-8-12z" fill="#1f4a37"/><path d="M95 190h10l-2 9h-6z" fill="#17382a"/>' +
'<path d="M68 184L52 260M132 184L148 260" stroke="#2d2f37" stroke-width="8" stroke-linecap="round"/>' +
'<rect x="88" y="146" width="24" height="38" fill="#cfa987"/>' +
'<ellipse cx="61" cy="108" rx="6" ry="11" fill="#d9b592"/><ellipse cx="139" cy="108" rx="6" ry="11" fill="#d9b592"/>' +
'<ellipse cx="100" cy="102" rx="38" ry="53" fill="#e3c2a0"/>' +
'<path d="M63 100q-6-26 8-40q-4 20-1 42zM137 100q6-26-8-40q4 20 1 42z" fill="#b9bcc2"/>' +
'<path d="M80 60q18-12 38-2" stroke="#f6e2cc" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/>' +
'<path d="M72 95q11-4 22 0M106 95q11-4 22 0" stroke="#8d9097" stroke-width="4.5" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="84" cy="110" rx="6.5" ry="4" fill="#f7f1e6"/><ellipse cx="116" cy="110" rx="6.5" ry="4" fill="#f7f1e6"/>' +
'<circle cx="85" cy="110" r="3" fill="#2b2a26"/><circle cx="117" cy="110" r="3" fill="#2b2a26"/>' +
'<path d="M76 106h16M108 106h16" stroke="#c9a583" stroke-width="3" stroke-linecap="round"/>' +
'<path d="M100 108q-9 24 0 29q6 2 9-3" stroke="#b08a66" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
'<path d="M87 149q11 3 25-4" stroke="#7a4a3a" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
'<path d="M72 128q3 10 9 14M128 128q-3 10-9 14" stroke="#c9a583" stroke-width="2" fill="none"/>' +
'<g transform="rotate(-8 160 236)"><rect x="128" y="212" width="62" height="52" rx="3" fill="#8a6a42"/><rect x="134" y="220" width="50" height="44" fill="#fbf8ec"/>' +
'<rect x="148" y="207" width="22" height="11" rx="2" fill="#c9a24a"/><path d="M140 232h38M140 241h30M140 250h36" stroke="#8f8873" stroke-width="2"/></g>' +
'</symbol>' +

/* Selin Demir, twenty: the grown-up, in a yellow raincoat */
'<symbol id="ch-selin" viewBox="0 0 200 260">' +
'<path d="M6 260Q8 206 46 192L80 178H120L154 192Q192 206 194 260Z" fill="#e8b923"/>' +
'<path d="M60 186q40 30 80 0l10 12q-50 34-100 0z" fill="#c99a12"/>' +
'<path d="M84 178L100 208L116 178Z" fill="#2c3a55"/><path d="M100 208V260" stroke="#c99a12" stroke-width="4"/>' +
'<g fill="#fff8d6"><circle cx="93" cy="226" r="3"/><circle cx="93" cy="246" r="3"/></g>' +
'<rect x="88" y="146" width="24" height="38" fill="#b28259"/>' +
'<circle cx="100" cy="34" r="22" fill="#2a1c16"/>' +
'<ellipse cx="59" cy="110" rx="6" ry="10" fill="#bb8a60"/><ellipse cx="141" cy="110" rx="6" ry="10" fill="#bb8a60"/>' +
'<circle cx="59" cy="122" r="2.6" fill="#dfe3e6"/><circle cx="141" cy="122" r="2.6" fill="#dfe3e6"/>' +
'<ellipse cx="100" cy="106" rx="40" ry="49" fill="#c99870"/>' +
'<path d="M58 108Q52 56 100 52Q148 56 142 108Q134 76 112 70Q84 82 66 76Q60 90 58 108Z" fill="#2a1c16"/>' +
'<path d="M60 96q-6 26 2 44M140 96q6 26-2 44" stroke="#2a1c16" stroke-width="4" fill="none" stroke-linecap="round"/>' +
'<path d="M71 99q11-7 23-3M106 96q12-4 23 3" stroke="#1d1410" stroke-width="4.4" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="84" cy="112" rx="7" ry="4.8" fill="#f7f1e6"/><ellipse cx="116" cy="112" rx="7" ry="4.8" fill="#f7f1e6"/>' +
'<circle cx="85" cy="112" r="3.4" fill="#22160f"/><circle cx="117" cy="112" r="3.4" fill="#22160f"/><circle cx="86" cy="111" r="1" fill="#fff"/><circle cx="118" cy="111" r="1" fill="#fff"/>' +
'<path d="M76 108q8-5 16 0M108 108q8-5 16 0" stroke="#1d1410" stroke-width="2.2" fill="none"/>' +
'<path d="M100 113q-6 14 0 18q5 2 7-2" stroke="#9a6c46" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
'<path d="M88 143h24" stroke="#7a3a34" stroke-width="3.6" stroke-linecap="round"/>' +
'</symbol>' +

/* Emre Demir, thirteen: a school blazer, and a great interest in the floor */
'<symbol id="ch-emre" viewBox="0 0 200 260">' +
'<path d="M14 260Q16 212 52 198L84 184H116L148 198Q184 212 186 260Z" fill="#24304d"/>' +
'<path d="M82 184L100 224L118 184Z" fill="#f3f1ea"/><path d="M82 184L74 204L96 214ZM118 184L126 204L104 214Z" fill="#e2dfd4"/>' +
'<path d="M95 200h10l4 34-8 12-8-12z" fill="#8f2947"/><path d="M93 212l14 6M92 224l16 6" stroke="#d9b25a" stroke-width="3"/>' +
'<path d="M68 196L60 260M132 196L140 260" stroke="#1a2338" stroke-width="6" stroke-linecap="round"/>' +
'<rect x="140" y="214" width="20" height="22" rx="3" fill="#d9b25a" opacity=".85"/>' +
'<rect x="90" y="152" width="20" height="36" fill="#b28259"/>' +
'<ellipse cx="60" cy="118" rx="8" ry="12" fill="#bb8a60"/><ellipse cx="140" cy="118" rx="8" ry="12" fill="#bb8a60"/>' +
'<ellipse cx="100" cy="114" rx="37" ry="44" fill="#c99870"/>' +
'<g fill="#1d1410"><circle cx="72" cy="80" r="15"/><circle cx="92" cy="68" r="17"/><circle cx="114" cy="68" r="16"/><circle cx="130" cy="82" r="14"/><circle cx="100" cy="80" r="16"/><circle cx="64" cy="96" r="9"/><circle cx="137" cy="97" r="8"/></g>' +
'<path d="M74 108q10-3 20 1M106 109q10-4 20-1" stroke="#1d1410" stroke-width="4" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="85" cy="121" rx="6.5" ry="4.4" fill="#f7f1e6"/><ellipse cx="115" cy="121" rx="6.5" ry="4.4" fill="#f7f1e6"/>' +
'<circle cx="85" cy="123" r="3.2" fill="#22160f"/><circle cx="115" cy="123" r="3.2" fill="#22160f"/>' +
'<path d="M77 117q8-3 16 0M107 117q8-3 16 0" stroke="#a87c56" stroke-width="3" fill="none" stroke-linecap="round"/>' +
'<path d="M100 122q-5 11 0 15q4 1 6-2" stroke="#9a6c46" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
'<path d="M90 147q10-3 20 0" stroke="#7a3a34" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
'</symbol>' +

/* Mr Stanley Thistlewood: tweed, a railway tie, and a chrysanthemum in his buttonhole */
'<symbol id="ch-stan" viewBox="0 0 200 260">' +
'<path d="M6 260Q8 206 46 192L82 178H118L154 192Q192 206 194 260Z" fill="#7a6442"/>' +
'<g stroke="#5f4d31" stroke-width="2" opacity=".8"><path d="M20 230l30-30M30 256l44-50M150 206l34 30M128 204l44 52M60 260l14-34M126 226l14 34"/></g>' +
'<path d="M82 178L100 220L118 178Z" fill="#f3f1ea"/>' +
'<path d="M95 194h10l4 40-9 14-9-14z" fill="#7b1f2a"/><path d="M94 191h12l-2 9h-8z" fill="#5d1620"/><path d="M96 214l9 4M95 226l11 4" stroke="#d9b25a" stroke-width="2.4"/>' +
'<path d="M82 178L62 214L92 238ZM118 178L138 214L108 238Z" fill="#8d7650"/>' +
'<g transform="translate(60 216)"><circle r="11" fill="#c8791f"/><g fill="#e8a53a"><circle cx="-5" cy="-4" r="4.5"/><circle cx="5" cy="-4" r="4.5"/><circle cx="-6" cy="4" r="4.5"/><circle cx="6" cy="4" r="4.5"/><circle r="4.5"/></g><path d="M2 10q4 10 0 18" stroke="#3f6a3a" stroke-width="3" fill="none"/></g>' +
'<rect x="87" y="146" width="26" height="38" fill="#d3a888"/>' +
'<ellipse cx="57" cy="110" rx="7" ry="12" fill="#e0b596"/><ellipse cx="143" cy="110" rx="7" ry="12" fill="#e0b596"/>' +
'<ellipse cx="100" cy="106" rx="43" ry="49" fill="#ecc7a8"/>' +
'<ellipse cx="74" cy="126" rx="9" ry="6" fill="#e3a88e" opacity=".55"/><ellipse cx="126" cy="126" rx="9" ry="6" fill="#e3a88e" opacity=".55"/>' +
'<path d="M57 100Q56 60 100 57Q144 60 143 100Q136 76 118 70Q100 66 82 70Q64 76 57 100Z" fill="#f1f1ee"/>' +
'<path d="M60 96q-4 10-2 20M140 96q4 10 2 20" stroke="#f1f1ee" stroke-width="6" fill="none" stroke-linecap="round"/>' +
'<path d="M68 99q13-9 26-2M106 97q13-7 26 2" stroke="#f1f1ee" stroke-width="7" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="84" cy="113" rx="6.5" ry="4.2" fill="#f7f1e6"/><ellipse cx="116" cy="113" rx="6.5" ry="4.2" fill="#f7f1e6"/>' +
'<circle cx="85" cy="113" r="3.2" fill="#3a4a5c"/><circle cx="117" cy="113" r="3.2" fill="#3a4a5c"/><circle cx="86" cy="112" r="1" fill="#fff"/><circle cx="118" cy="112" r="1" fill="#fff"/>' +
'<path d="M100 114q-8 16 0 21q6 2 9-2" stroke="#c08e6c" stroke-width="2.8" fill="none" stroke-linecap="round"/>' +
'<path d="M80 143q8-9 20-5q12-4 20 5q-10 6-20 2q-10 4-20-2z" fill="#f1f1ee"/>' +
'<path d="M90 151q10 3 20 0" stroke="#8a4a3a" stroke-width="3" fill="none" stroke-linecap="round"/>' +
'</symbol>' +

/* District Judge Ormerod: a grey suit, half-moon glasses and a sharp pencil. No wig */
'<symbol id="ch-judge" viewBox="0 0 200 260">' +
'<path d="M8 260Q10 208 48 194L82 180H118L152 194Q190 208 192 260Z" fill="#5d636e"/>' +
'<path d="M82 180L100 232L118 180Z" fill="#f4efe2"/><path d="M82 180L66 212L96 244ZM118 180L134 212L104 244Z" fill="#6c727e"/>' +
'<circle cx="100" cy="206" r="5" fill="#c9a24a"/><circle cx="100" cy="206" r="2.2" fill="#8f2947"/>' +
'<rect x="88" y="146" width="24" height="40" fill="#d6b08f"/>' +
'<path d="M52 122Q44 50 100 46Q156 50 148 122Q150 140 140 150Q146 112 134 86Q100 70 66 86Q54 112 60 150Q50 140 52 122Z" fill="#aeb2b8"/>' +
'<ellipse cx="100" cy="106" rx="39" ry="48" fill="#ebcdb2"/>' +
'<path d="M61 104Q58 62 100 60Q142 62 139 104Q132 82 100 76Q68 82 61 104Z" fill="#aeb2b8"/><path d="M70 84q30-14 60 0" stroke="#c3c7cc" stroke-width="4" fill="none" stroke-linecap="round"/>' +
'<path d="M72 98q11-5 22 0M106 94q11-8 22-1" stroke="#7d8189" stroke-width="4" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="84" cy="111" rx="6.5" ry="4.4" fill="#f7f1e6"/><ellipse cx="116" cy="111" rx="6.5" ry="4.4" fill="#f7f1e6"/>' +
'<circle cx="85" cy="111" r="3.2" fill="#3a3028"/><circle cx="117" cy="111" r="3.2" fill="#3a3028"/><circle cx="86" cy="110" r="1" fill="#fff"/><circle cx="118" cy="110" r="1" fill="#fff"/>' +
'<path d="M100 112q-6 15 0 19q5 2 8-2" stroke="#bf9373" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
'<g fill="none" stroke="#c9a24a" stroke-width="2.6"><path d="M72 121q12 14 24 0M104 121q12 14 24 0M96 122h8M72 121l-12-6M128 121l12-6"/></g>' +
'<path d="M88 145q12 5 24-1" stroke="#8a4a44" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
'<g transform="rotate(-24 150 226)"><rect x="146" y="196" width="8" height="58" fill="#e8b923"/><path d="M146 196l4-12 4 12z" fill="#e9c9a4"/><path d="M149 188l1-4 1 4z" fill="#22211c"/><rect x="146" y="248" width="8" height="8" fill="#d4577c"/></g>' +
'</symbol>' +

/* Ms Nair, solicitor: a wet coat, and a train that did not move */
'<symbol id="ch-nair" viewBox="0 0 200 260">' +
'<path d="M6 260Q8 206 46 192L82 178H118L154 192Q192 206 194 260Z" fill="#253a5a"/>' +
'<path d="M82 178L58 196L84 226ZM118 178L142 196L116 226Z" fill="#30496f"/><path d="M84 180L100 214L116 180Z" fill="#b83a5e"/>' +
'<path d="M100 214V260" stroke="#1b2c46" stroke-width="4"/><g fill="#c9a24a"><circle cx="108" cy="230" r="3.4"/><circle cx="108" cy="250" r="3.4"/></g>' +
'<rect x="88" y="146" width="24" height="38" fill="#9c6c48"/>' +
'<path d="M54 132Q44 54 100 48Q156 54 146 132Q146 150 136 158Q142 118 132 88Q100 72 68 88Q58 118 64 158Q54 150 54 132Z" fill="#17120f"/>' +
'<ellipse cx="100" cy="106" rx="39" ry="48" fill="#b98560"/>' +
'<path d="M61 106Q56 60 100 58Q144 60 139 106Q134 80 100 72Q76 92 61 106Z" fill="#17120f"/>' +
'<path d="M72 98q11-6 22-1M106 97q11-5 22 1" stroke="#17120f" stroke-width="4.2" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="84" cy="112" rx="6.5" ry="4.6" fill="#f7f1e6"/><ellipse cx="116" cy="112" rx="6.5" ry="4.6" fill="#f7f1e6"/>' +
'<circle cx="85" cy="112" r="3.3" fill="#1d130d"/><circle cx="117" cy="112" r="3.3" fill="#1d130d"/><circle cx="86" cy="111" r="1" fill="#fff"/><circle cx="118" cy="111" r="1" fill="#fff"/>' +
'<g fill="none" stroke="#22211c" stroke-width="3"><rect x="71" y="102" width="26" height="19" rx="4"/><rect x="103" y="102" width="26" height="19" rx="4"/><path d="M97 110h6M71 108l-11-4M129 108l11-4"/></g>' +
'<path d="M100 114q-6 14 0 18q5 2 7-2" stroke="#8a5e3c" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
'<path d="M86 141q14 10 28 0" stroke="#6a2f2a" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
'<g fill="#bcd3e6" opacity=".8"><path d="M40 208q-4 8 0 12q4-4 0-12zM160 216q-4 8 0 12q4-4 0-12zM70 76q-3 6 0 9q3-3 0-9z"/></g>' +
'</symbol>' +
'</defs></svg>';

window.FACE = function (id) {
  var BG = { usher: '#3a4a44', selin: '#3b3f52', emre: '#3b3f52', stan: '#4a4234', judge: '#243a5c', nair: '#3d4a52' };
  return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:' + (BG[id] || '#2a3038') + '"><use href="#ch-' + id + '"/></svg>';
};
