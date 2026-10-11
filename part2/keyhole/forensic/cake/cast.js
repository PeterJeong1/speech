/* The people of "Warm in the Middle", as busts of 200 x 260.
   FACE('novak' | 'whitlow' | 'chika' | 'arthur') gives the picture for an interview. */
window.CAST_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>' +

/* Dr Marta Novak: grey in her hair, round glasses, a raincoat over the laboratory's blue fleece, a pass on a red ribbon */
'<symbol id="ch-novak" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#2a1d30"/><path d="M0 0h200v80H0z" fill="#3a2742" opacity=".6"/><circle cx="160" cy="40" r="46" fill="#f2c9a0" opacity=".12"/>' +
'<path d="M2 260Q4 204 46 190L84 178H116L154 190Q196 204 198 260Z" fill="#4a5560"/>' +
'<path d="M70 184L100 236L130 184L116 178H84Z" fill="#27415e"/><path d="M84 178L100 216L116 178Z" fill="#eef1f0"/>' +
'<path d="M84 178L62 206L92 250M116 178L138 206L108 250" fill="none" stroke="#39434d" stroke-width="7" stroke-linejoin="round"/>' +
'<path d="M88 184L97 238M112 184L103 238" stroke="#b3261c" stroke-width="3.200" fill="none"/><rect x="88" y="236" width="24" height="24" rx="2" fill="#f2f4ee"/><path d="M92 244h16M92 250h11" stroke="#27415e" stroke-width="2.400"/>' +
'<rect x="87" y="144" width="26" height="42" fill="#d6ae86"/><path d="M87 168q13 10 26 0v18h-26z" fill="#c29a73" opacity=".6"/>' +
'<ellipse cx="58" cy="112" rx="6" ry="10" fill="#d6ae86"/><ellipse cx="142" cy="112" rx="6" ry="10" fill="#d6ae86"/>' +
'<ellipse cx="100" cy="106" rx="41" ry="49" fill="#e4c19c"/>' +
'<path d="M55 120Q46 50 100 46Q154 50 145 120Q148 150 133 153Q143 112 127 82Q103 66 73 82Q57 112 67 153Q52 150 55 120Z" fill="#46464b"/>' +
'<path d="M96 48Q86 66 75 82M112 49Q120 62 127 80" stroke="#b9bcc2" stroke-width="6" fill="none" stroke-linecap="round"/>' +
'<path d="M72 96q10-6 20-1M108 95q10-5 20 1" stroke="#3a3530" stroke-width="3" fill="none" stroke-linecap="round"/>' +
'<circle cx="83" cy="111" r="14" fill="#fff" opacity=".16"/><circle cx="117" cy="111" r="14" fill="#fff" opacity=".16"/>' +
'<circle cx="83" cy="111" r="14" fill="none" stroke="#15171a" stroke-width="3"/><circle cx="117" cy="111" r="14" fill="none" stroke="#15171a" stroke-width="3"/><path d="M97 110q3-3 6 0M69 109l-10-3M131 109l10-3" stroke="#15171a" stroke-width="3" fill="none"/>' +
'<ellipse cx="83" cy="112" rx="5" ry="4" fill="#f7f1e6"/><ellipse cx="117" cy="112" rx="5" ry="4" fill="#f7f1e6"/><circle cx="84" cy="112" r="2.800" fill="#2b2a28"/><circle cx="118" cy="112" r="2.800" fill="#2b2a28"/>' +
'<path d="M100 114q-6 14 0 18q5 2 7-2" stroke="#b08a66" stroke-width="2.600" fill="none" stroke-linecap="round"/>' +
'<path d="M86 141q14 7 28 0" stroke="#8c4a3c" stroke-width="3.200" fill="none" stroke-linecap="round"/><path d="M114 141q4-1 5-4" stroke="#8c4a3c" stroke-width="2" fill="none" stroke-linecap="round"/>' +
'</symbol>' +

/* Mr Graham Whitlow: a big tired face, flour in his eyebrows, a pyjama jacket under his coat */
'<symbol id="ch-whitlow" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#3a2433"/><path d="M0 150h200v110H0z" fill="#2a1826" opacity=".8"/><path d="M0 150h200" stroke="#e9dcc0" stroke-width="3" opacity=".6"/>' +
'<path d="M-6 260Q-2 198 44 184L82 172H118L156 184Q202 198 206 260Z" fill="#6b4a32"/>' +
'<path d="M74 176L100 260L126 176L116 170H84Z" fill="#dfe8f2"/><path d="M86 180L96 258M100 178V260M114 180L104 258" stroke="#7f9cc4" stroke-width="2.800" fill="none"/>' +
'<path d="M82 172L100 204L118 172L112 164H88Z" fill="#dfe8f2" stroke="#7f9cc4" stroke-width="2.400" stroke-linejoin="round"/>' +
'<path d="M80 174L56 212L84 258M120 174L144 212L116 258" fill="none" stroke="#4f3522" stroke-width="8" stroke-linejoin="round"/>' +
'<rect x="84" y="140" width="32" height="40" fill="#d9b08c"/><path d="M84 162q16 12 32 0v18h-32z" fill="#c59b76" opacity=".6"/>' +
'<ellipse cx="50" cy="106" rx="8" ry="13" fill="#e0b894"/><ellipse cx="150" cy="106" rx="8" ry="13" fill="#e0b894"/>' +
'<path d="M52 98Q50 40 100 38Q150 40 148 98Q152 140 124 158Q100 168 76 158Q48 140 52 98Z" fill="#e8c4a2"/>' +
'<path d="M52 104Q44 78 56 62Q58 84 60 108ZM148 104Q156 78 144 62Q142 84 140 108Z" fill="#eceae6"/><path d="M70 46q30 -12 60 0" stroke="#f1d6ba" stroke-width="5" fill="none" opacity=".7" stroke-linecap="round"/>' +
'<path d="M64 92q12 -8 26 -3M110 89q14 -5 26 3" stroke="#f8f6f1" stroke-width="6" fill="none" stroke-linecap="round"/><circle cx="72" cy="86" r="2" fill="#f8f6f1"/><circle cx="132" cy="84" r="1.600" fill="#f8f6f1"/>' +
'<ellipse cx="78" cy="106" rx="7" ry="5" fill="#f7f1e6"/><ellipse cx="122" cy="106" rx="7" ry="5" fill="#f7f1e6"/><circle cx="79" cy="107" r="3.400" fill="#4a3a2a"/><circle cx="123" cy="107" r="3.400" fill="#4a3a2a"/>' +
'<path d="M68 116q10 6 20 1M112 117q10 5 20 -1" stroke="#c99a78" stroke-width="2.200" fill="none"/>' +
'<path d="M100 104q-9 22 -2 28q8 3 11 -3" stroke="#c39a76" stroke-width="3" fill="none" stroke-linecap="round"/>' +
'<path d="M72 142Q100 126 128 142Q114 152 100 147Q86 152 72 142Z" fill="#b9b4aa"/><path d="M90 153q10 4 20 0" stroke="#8c4a3c" stroke-width="2.600" fill="none" stroke-linecap="round"/>' +
'</symbol>' +

/* Chika Abara: nineteen, her coat still on, her hair tied up, not going to cry in front of anybody */
'<symbol id="ch-chika" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#1d2a3a"/><path d="M0 0h74v260H0z" fill="#0f1826" opacity=".7"/><path d="M74 0v260" stroke="#e9dcc0" stroke-width="5" opacity=".5"/><circle cx="34" cy="70" r="30" fill="#ffd98a" opacity=".2"/><circle cx="34" cy="70" r="5" fill="#ffe9b0" opacity=".8"/>' +
'<path d="M10 260Q12 206 50 194L84 182H116L150 194Q188 206 190 260Z" fill="#d9a441"/>' +
'<path d="M70 190Q100 214 130 190L124 220Q100 236 76 220Z" fill="#3f6e68"/><path d="M78 204q22 12 44 0" stroke="#2f5550" stroke-width="2.400" fill="none"/>' +
'<path d="M100 232V260" stroke="#b5832a" stroke-width="3"/><circle cx="108" cy="248" r="4" fill="#8a611c"/>' +
'<rect x="88" y="150" width="24" height="40" fill="#6e4228"/><path d="M88 172q12 9 24 0v16h-24z" fill="#5c3620" opacity=".6"/>' +
'<ellipse cx="60" cy="114" rx="5" ry="9" fill="#70432a"/><ellipse cx="140" cy="114" rx="5" ry="9" fill="#70432a"/><circle cx="60" cy="126" r="3.200" fill="#f0c95a"/><circle cx="140" cy="126" r="3.200" fill="#f0c95a"/>' +
'<ellipse cx="100" cy="110" rx="40" ry="46" fill="#7a4a2e"/>' +
'<ellipse cx="100" cy="40" rx="32" ry="28" fill="#1c1410"/><path d="M60 108Q54 60 100 58Q146 60 140 108Q134 78 100 74Q66 78 60 108Z" fill="#1c1410"/><path d="M78 62q22 -10 44 0" stroke="#d9a441" stroke-width="6" fill="none" stroke-linecap="round"/>' +
'<path d="M72 100q10 -5 20 -1M108 99q10 -4 20 1" stroke="#150f0b" stroke-width="3" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="83" cy="113" rx="7" ry="5.500" fill="#f7f1e6"/><ellipse cx="117" cy="113" rx="7" ry="5.500" fill="#f7f1e6"/><circle cx="84" cy="114" r="3.600" fill="#1f140c"/><circle cx="118" cy="114" r="3.600" fill="#1f140c"/><circle cx="85" cy="112.500" r="1.100" fill="#fff"/><circle cx="119" cy="112.500" r="1.100" fill="#fff"/>' +
'<path d="M100 116q-5 12 0 15q5 2 7 -1" stroke="#5c3620" stroke-width="2.600" fill="none" stroke-linecap="round"/>' +
'<path d="M88 146q12 -2 24 0" stroke="#4a2418" stroke-width="3.200" fill="none" stroke-linecap="round"/><path d="M92 150q8 3 16 0" stroke="#8a4a3a" stroke-width="2" fill="none" opacity=".6"/>' +
'</symbol>' +

/* Arthur Whitlow: eighty-six, a tartan dressing gown, his glasses pushed up where he cannot find them */
'<symbol id="ch-arthur" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#e9cfc0"/><path d="M0 0h200v120H0z" fill="#f6dfc8"/><path d="M0 120h200v140H0z" fill="#b5694a" opacity=".55"/><g stroke="#8a4a34" stroke-width="2" opacity=".5"><path d="M0 150h200M0 180h200M0 210h200M0 240h200M30 120v30M90 120v30M150 120v30M60 150v30M120 150v30M180 150v30M30 180v30M90 180v30M150 180v30"/></g>' +
'<path d="M18 260Q20 212 54 200L86 188H114L146 200Q180 212 182 260Z" fill="#9c2b2b"/>' +
'<g stroke="#1f3a2a" stroke-width="5" opacity=".7" fill="none"><path d="M30 226h140M44 206v54M156 206v54"/></g><g stroke="#e9c93a" stroke-width="1.800" opacity=".85" fill="none"><path d="M24 244h152M70 196v64M130 196v64"/></g>' +
'<path d="M80 192L100 240L120 192L114 186H86Z" fill="#dfe8f2"/><path d="M92 196L98 236M108 196L102 236" stroke="#7f9cc4" stroke-width="2.400"/>' +
'<path d="M84 188L66 216L96 256M116 188L134 216L104 256" fill="none" stroke="#7d1f1f" stroke-width="8" stroke-linejoin="round"/>' +
'<rect x="90" y="158" width="20" height="36" fill="#dcc0a6"/><path d="M92 170l8 22 8 -22" stroke="#c9a98d" stroke-width="2" fill="none"/>' +
'<ellipse cx="62" cy="120" rx="6" ry="11" fill="#e4c8ae"/><ellipse cx="138" cy="120" rx="6" ry="11" fill="#e4c8ae"/>' +
'<path d="M64 108Q62 62 100 60Q138 62 136 108Q140 146 118 162Q100 170 82 162Q60 146 64 108Z" fill="#ecd0b6"/>' +
'<path d="M64 112Q56 90 68 72Q68 92 70 114ZM136 112Q144 90 132 72Q132 92 130 114Z" fill="#f6f4f0"/><path d="M84 62q6 -12 14 -4q6 -10 14 2q8 -6 8 6" stroke="#f6f4f0" stroke-width="5" fill="none" stroke-linecap="round"/>' +
'<circle cx="84" cy="80" r="12" fill="#fff" fill-opacity=".3" stroke="#3a3530" stroke-width="2.600"/><circle cx="116" cy="80" r="12" fill="#fff" fill-opacity=".3" stroke="#3a3530" stroke-width="2.600"/><path d="M96 80h8M72 80l-8 6M128 80l8 6" stroke="#3a3530" stroke-width="2.600" fill="none"/>' +
'<path d="M74 106q10 -5 20 -1M106 105q10 -4 20 1" stroke="#d9d4cc" stroke-width="3.600" fill="none" stroke-linecap="round"/>' +
'<path d="M76 118q8 -5 16 0M108 118q8 -5 16 0" stroke="#3a3530" stroke-width="2.600" fill="none" stroke-linecap="round"/><path d="M74 124q10 5 20 0M106 124q10 5 20 0" stroke="#cfae94" stroke-width="2" fill="none"/>' +
'<path d="M100 114q-7 18 -1 24q7 3 10 -3" stroke="#c39a80" stroke-width="2.800" fill="none" stroke-linecap="round"/>' +
'<path d="M86 150q14 6 28 0" stroke="#9c5a4a" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M72 132q-3 10 3 18M128 132q3 10 -3 18" stroke="#d2b49a" stroke-width="2" fill="none"/>' +
'</symbol>' +
'</defs></svg>';

window.FACE = function (who) {
  var bg = { novak: '#2a1d30', whitlow: '#3a2433', chika: '#1d2a3a', arthur: '#e9cfc0' }[who] || '#222';
  return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:' + bg + '"><use href="#ch-' + who + '"/></svg>';
};
