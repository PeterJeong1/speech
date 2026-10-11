/* The people of "A Smell of Vinegar", as busts of 200 x 260.
   FACE('novak' | 'shrike' | 'otis' | 'annika') gives the picture for an interview. */
window.CAST_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>' +

/* Dr Marta Novak: grey in her hair, round glasses, the laboratory's blue fleece, a pass on a red ribbon */
'<symbol id="ch-novak" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#1b2f3a"/><path d="M0 0h200v70H0z" fill="#22404f" opacity=".5"/>' +
'<path d="M6 260Q8 206 48 192L84 178H116L152 192Q192 206 194 260Z" fill="#27415e"/>' +
'<path d="M84 178L100 216L116 178Z" fill="#eef1f0"/><path d="M100 216V260" stroke="#172a40" stroke-width="3"/>' +
'<path d="M84 178L72 200L96 214M116 178L128 200L104 214" fill="none" stroke="#1c3048" stroke-width="5" stroke-linejoin="round"/>' +
'<path d="M88 184L97 238M112 184L103 238" stroke="#b3261c" stroke-width="3.2" fill="none"/><rect x="88" y="236" width="24" height="24" rx="2" fill="#f2f4ee"/><path d="M92 244h16M92 250h11" stroke="#27415e" stroke-width="2.4"/>' +
'<rect x="87" y="144" width="26" height="42" fill="#d6ae86"/><path d="M87 168q13 10 26 0v18h-26z" fill="#c29a73" opacity=".6"/>' +
'<ellipse cx="58" cy="112" rx="6" ry="10" fill="#d6ae86"/><ellipse cx="142" cy="112" rx="6" ry="10" fill="#d6ae86"/>' +
'<ellipse cx="100" cy="106" rx="41" ry="49" fill="#e4c19c"/>' +
'<path d="M55 120Q46 50 100 46Q154 50 145 120Q148 150 133 153Q143 112 127 82Q103 66 73 82Q57 112 67 153Q52 150 55 120Z" fill="#46464b"/>' +
'<path d="M96 48Q86 66 75 82M112 49Q120 62 127 80" stroke="#b9bcc2" stroke-width="6" fill="none" stroke-linecap="round"/>' +
'<path d="M72 96q10-6 20-1M108 95q10-5 20 1" stroke="#3a3530" stroke-width="3" fill="none" stroke-linecap="round"/>' +
'<circle cx="83" cy="111" r="14" fill="#fff" opacity=".16"/><circle cx="117" cy="111" r="14" fill="#fff" opacity=".16"/>' +
'<circle cx="83" cy="111" r="14" fill="none" stroke="#15171a" stroke-width="3"/><circle cx="117" cy="111" r="14" fill="none" stroke="#15171a" stroke-width="3"/><path d="M97 110q3-3 6 0M69 109l-10-3M131 109l10-3" stroke="#15171a" stroke-width="3" fill="none"/>' +
'<ellipse cx="83" cy="112" rx="5" ry="4" fill="#f7f1e6"/><ellipse cx="117" cy="112" rx="5" ry="4" fill="#f7f1e6"/><circle cx="84" cy="112" r="2.8" fill="#2b2a28"/><circle cx="118" cy="112" r="2.8" fill="#2b2a28"/>' +
'<path d="M100 114q-6 14 0 18q5 2 7-2" stroke="#b08a66" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
'<path d="M86 141q14 7 28 0" stroke="#8c4a3c" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M114 141q4-1 5-4" stroke="#8c4a3c" stroke-width="2" fill="none" stroke-linecap="round"/>' +
'</symbol>' +

/* Mrs Shrike: a red jacket, pearls, hair pulled back hard, one eyebrow higher than the other */
'<symbol id="ch-shrike" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#33161d"/><path d="M0 150h200v110H0z" fill="#3f2a1c" opacity=".7"/><path d="M0 150h200" stroke="#6b4a2a" stroke-width="3"/>' +
'<path d="M4 260Q8 204 50 190L86 176H114L150 190Q192 204 196 260Z" fill="#a32a2a"/>' +
'<path d="M86 176L100 232L114 176Z" fill="#f3efe4"/><path d="M86 176L70 206L100 232M114 176L130 206L100 232" fill="#8a2020"/>' +
'<g fill="#f4f1e8"><circle cx="86" cy="186" r="3.6"/><circle cx="92" cy="193" r="3.6"/><circle cx="100" cy="196" r="3.6"/><circle cx="108" cy="193" r="3.6"/><circle cx="114" cy="186" r="3.6"/></g>' +
'<rect x="88" y="140" width="24" height="44" fill="#e0c2a8"/><path d="M88 166q12 9 24 0v18h-24z" fill="#c9a98d" opacity=".6"/>' +
'<ellipse cx="60" cy="108" rx="5" ry="9" fill="#e0c2a8"/><ellipse cx="140" cy="108" rx="5" ry="9" fill="#e0c2a8"/><circle cx="60" cy="121" r="3.2" fill="#f4f1e8"/><circle cx="140" cy="121" r="3.2" fill="#f4f1e8"/>' +
'<path d="M61 96Q60 52 100 50Q140 52 139 96Q142 134 118 152Q100 160 82 152Q58 134 61 96Z" fill="#ead0b6"/>' +
'<path d="M59 100Q54 46 100 42Q146 46 141 100Q136 68 100 64Q64 68 59 100Z" fill="#b9ad98"/><ellipse cx="100" cy="34" rx="22" ry="15" fill="#b9ad98"/><path d="M82 32q18-10 36 0" stroke="#9c9078" stroke-width="2.4" fill="none"/>' +
'<path d="M70 92q11-3 21 2M109 86q11-7 22-1" stroke="#6b6253" stroke-width="3" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="82" cy="106" rx="6" ry="3.6" fill="#f7f1e6"/><ellipse cx="119" cy="104" rx="6" ry="3.6" fill="#f7f1e6"/><circle cx="83" cy="106" r="2.9" fill="#3b4a55"/><circle cx="120" cy="104" r="2.9" fill="#3b4a55"/>' +
'<path d="M76 102q6-3 13 0M113 100q6-3 13 0" stroke="#5a5247" stroke-width="2" fill="none"/>' +
'<path d="M101 104q-9 20-2 26q7 2 9-3" stroke="#b9977a" stroke-width="2.8" fill="none" stroke-linecap="round"/>' +
'<path d="M87 143q13-3 26 0" stroke="#8a3a3a" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
'<path d="M76 128q-3 8 2 15M124 128q3 8-2 15" stroke="#cdb096" stroke-width="1.8" fill="none"/>' +
'</symbol>' +

/* Otis Brice: hair that will not lie down, freckles, a hoodie with red paint on it */
'<symbol id="ch-otis" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#1c2a40"/><path d="M118 20l56 150h-112z" fill="#7a2a22" opacity=".55"/><path d="M134 20q-10-12-2-20M150 22q8-12 0-22" stroke="#c2452f" stroke-width="5" fill="none" opacity=".5" stroke-linecap="round"/>' +
'<path d="M10 260Q12 208 50 196L84 184H116L150 196Q188 208 190 260Z" fill="#6f7780"/>' +
'<path d="M70 190Q100 222 130 190L122 182Q100 204 78 182Z" fill="#59616a"/><path d="M92 204l-4 40M108 204l4 40" stroke="#e9eef0" stroke-width="2.6"/>' +
'<path d="M36 222q16-8 22 6q-4 14-20 8z" fill="#c2452f"/><circle cx="62" cy="244" r="4" fill="#c2452f"/>' +
'<rect x="88" y="150" width="24" height="40" fill="#e8c4a2"/><path d="M88 174q12 9 24 0v16h-24z" fill="#d2ab88" opacity=".6"/>' +
'<ellipse cx="55" cy="116" rx="9" ry="13" fill="#e8c4a2"/><ellipse cx="145" cy="116" rx="9" ry="13" fill="#e8c4a2"/><path d="M52 112q5 4 2 10M148 112q-5 4-2 10" stroke="#cfa482" stroke-width="2" fill="none"/>' +
'<ellipse cx="100" cy="112" rx="42" ry="46" fill="#f0cfae"/>' +
'<path d="M58 106Q52 60 100 58Q148 60 142 106Q134 80 118 78L112 86L104 74L96 86L86 76L74 86Q62 92 58 106Z" fill="#6b4226"/>' +
'<path d="M78 62l-6-16 14 10 2-18 12 16 8-18 6 20 14-12-4 18" fill="#6b4226"/>' +
'<path d="M70 98q10-9 21-3M109 95q11-6 21 3" stroke="#57351e" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="82" cy="113" rx="7" ry="6" fill="#f7f1e6"/><ellipse cx="118" cy="113" rx="7" ry="6" fill="#f7f1e6"/><circle cx="83" cy="114" r="3.6" fill="#3a2a1c"/><circle cx="119" cy="114" r="3.6" fill="#3a2a1c"/><circle cx="84" cy="112.500" r="1.100" fill="#fff"/><circle cx="120" cy="112.500" r="1.100" fill="#fff"/>' +
'<path d="M76 121q6 3 12 0M112 121q6 3 12 0" stroke="#d99a8a" stroke-width="2" fill="none"/>' +
'<path d="M100 118q-4 10 0 13q4 2 6-1" stroke="#c99a78" stroke-width="2.4" fill="none" stroke-linecap="round"/><circle cx="101" cy="130" r="5" fill="#d9644e" opacity=".5"/>' +
'<g fill="#b98562"><circle cx="72" cy="128" r="1.500"/><circle cx="78" cy="133" r="1.500"/><circle cx="84" cy="128" r="1.500"/><circle cx="116" cy="128" r="1.500"/><circle cx="122" cy="133" r="1.500"/><circle cx="128" cy="128" r="1.500"/></g>' +
'<path d="M88 146q12-6 24 0" stroke="#8c4a3c" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
'</symbol>' +

/* Annika Lindqvist: a long fair plait, her coat still on, not much sleep */
'<symbol id="ch-annika" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#cfd9df"/><path d="M0 0h70l-40 260H0z" fill="#fff6d0" opacity=".6"/><path d="M120 0h34l-40 260H80z" fill="#fff6d0" opacity=".35"/>' +
'<path d="M8 260Q10 206 50 194L84 182H116L150 194Q190 206 192 260Z" fill="#2c3550"/>' +
'<path d="M72 188Q100 214 128 188Q124 232 100 236Q76 232 72 188Z" fill="#d9a22b"/><path d="M78 202q22 12 44 0M78 214q22 12 44 0" stroke="#b38218" stroke-width="2.4" fill="none"/>' +
'<g fill="#1e2538"><circle cx="100" cy="246" r="4"/></g>' +
'<rect x="88" y="148" width="24" height="40" fill="#f0d2ba"/>' +
'<ellipse cx="60" cy="112" rx="5" ry="9" fill="#f0d2ba"/><ellipse cx="140" cy="112" rx="5" ry="9" fill="#f0d2ba"/>' +
'<ellipse cx="100" cy="108" rx="40" ry="47" fill="#f6dcc6"/>' +
'<path d="M58 112Q50 56 100 54Q150 56 142 112Q138 82 124 74Q100 64 76 74Q62 82 58 112Z" fill="#e2c275"/><path d="M100 56Q92 66 76 74M100 56Q112 66 124 74" stroke="#c9a654" stroke-width="2.4" fill="none"/>' +
'<path d="M136 92q16 12 12 34l-6 12q10 8 4 20l-8 10q8 8 2 20l-10 12q4 10-4 18" stroke="#e2c275" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
'<path d="M140 128l12 8M140 160l12 8M134 192l12 8" stroke="#c9a654" stroke-width="3" stroke-linecap="round"/><path d="M128 232l14 4" stroke="#b3261c" stroke-width="5" stroke-linecap="round"/>' +
'<path d="M72 98q10-3 20 0M108 98q10-3 20 0" stroke="#b8974e" stroke-width="2.8" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="83" cy="111" rx="6.5" ry="5" fill="#fbf7ee"/><ellipse cx="117" cy="111" rx="6.5" ry="5" fill="#fbf7ee"/><circle cx="83" cy="111.500" r="3.300" fill="#49657a"/><circle cx="117" cy="111.500" r="3.300" fill="#49657a"/><circle cx="84" cy="110.500" r="1" fill="#fff"/><circle cx="118" cy="110.500" r="1" fill="#fff"/>' +
'<path d="M76 119q7 3 14 0M110 119q7 3 14 0" stroke="#d9b8c0" stroke-width="2.2" fill="none"/>' +
'<path d="M100 114q-4 11 0 14q4 2 6-1" stroke="#d2b094" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
'<path d="M89 143q11 2 22 0" stroke="#a8584a" stroke-width="3" fill="none" stroke-linecap="round"/>' +
'</symbol>' +
'</defs></svg>';

window.FACE = function (who) {
  var bg = { novak: '#1b2f3a', shrike: '#33161d', otis: '#1c2a40', annika: '#cfd9df' }[who] || '#222';
  return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:' + bg + '"><use href="#ch-' + who + '"/></svg>';
};
