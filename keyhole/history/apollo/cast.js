/* The three people nearest to you in "Lots and Lots of People". All three are invented.
   Busts of 200 x 260. The real people of the story are never drawn: they are voices on a speaker. */
window.CAST_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>' +
/* Hank Voss: short-sleeved white shirt, narrow tie, a headset he never takes off */
'<symbol id="ch-voss" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#1d2a27"/><rect x="0" y="0" width="200" height="74" fill="#16201e"/>' +
'<g fill="#f2b23a" opacity=".5"><rect x="14" y="20" width="26" height="8"/><rect x="48" y="20" width="14" height="8"/><rect x="150" y="34" width="34" height="8"/></g>' +
'<path d="M6 260Q8 206 46 192L80 180H120L154 192Q192 206 194 260Z" fill="#f4f1e8"/>' +
'<path d="M80 180L100 204L120 180L112 176H88Z" fill="#e2ded2"/>' +
'<path d="M96 200h8l5 46-9 12-9-12z" fill="#1c1d21"/><path d="M95 198h10l-2 9h-6z" fill="#2a2c33"/>' +
'<rect x="130" y="212" width="34" height="30" fill="#e6e2d6" stroke="#c9c4b4"/><path d="M137 206v14M145 204v16M153 206v14" stroke="#1d2a52" stroke-width="3.5" stroke-linecap="round"/><path d="M153 206v5" stroke="#b3261c" stroke-width="3.5" stroke-linecap="round"/>' +
'<rect x="88" y="146" width="24" height="40" fill="#d9ad8c"/><path d="M88 170q12 9 24 0v16H88z" fill="#c2957a" opacity=".6"/>' +
'<ellipse cx="59" cy="110" rx="6" ry="10" fill="#d09f80"/><ellipse cx="141" cy="110" rx="6" ry="10" fill="#d09f80"/>' +
'<path d="M60 96Q60 58 100 56Q140 58 140 96L139 122Q136 150 100 156Q64 150 61 122Z" fill="#e3b796"/>' +
'<path d="M60 92Q58 54 100 50Q142 54 140 92Q134 70 100 68Q66 70 60 92Z" fill="#8f9291"/><path d="M64 78q36-16 72 0" stroke="#a9acab" stroke-width="3" fill="none"/>' +
'<path d="M52 104Q50 40 100 38Q150 40 148 104" stroke="#111315" stroke-width="6" fill="none"/><rect x="44" y="96" width="14" height="28" rx="5" fill="#111315"/>' +
'<path d="M52 122Q52 146 82 150" stroke="#111315" stroke-width="3.5" fill="none"/><rect x="80" y="145" width="12" height="8" rx="3" fill="#111315"/>' +
'<g fill="none" stroke="#141518" stroke-width="3.6"><rect x="68" y="100" width="27" height="19" rx="4"/><rect x="105" y="100" width="27" height="19" rx="4"/><path d="M95 108h10M68 106l-8-3M132 106l8-3"/></g>' +
'<circle cx="82" cy="110" r="2.8" fill="#1b1512"/><circle cx="118" cy="110" r="2.8" fill="#1b1512"/>' +
'<path d="M72 96h20M108 96h20" stroke="#6f7170" stroke-width="3.4" stroke-linecap="round"/>' +
'<path d="M100 112q-5 14 0 18q4 2 7-1" stroke="#b9876a" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
'<path d="M86 140h28" stroke="#8a4a3a" stroke-width="3.2" stroke-linecap="round"/><path d="M70 132q4 6 0 12M130 132q-4 6 0 12" stroke="#c2957a" stroke-width="2" fill="none"/>' +
'</symbol>' +
/* Marian Halloran: a pencil behind each ear, glasses on a chain, a slide rule */
'<symbol id="ch-halloran" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#33291f"/><rect x="118" y="0" width="82" height="150" fill="#16223a"/><path d="M118 0v150h82" stroke="#5a4630" stroke-width="7" fill="none"/>' +
'<g fill="#ffe9a8" opacity=".7"><circle cx="140" cy="118" r="2"/><circle cx="158" cy="126" r="2"/><circle cx="176" cy="116" r="2"/><circle cx="186" cy="130" r="1.6"/></g>' +
'<path d="M8 260Q10 208 46 194L80 182H120L154 194Q190 208 192 260Z" fill="#5c7186"/>' +
'<path d="M80 182L100 232L120 182Z" fill="#f7f3ea"/><path d="M80 182L96 250M120 182L104 250" stroke="#46586b" stroke-width="6" stroke-linecap="round" fill="none"/>' +
'<g fill="#3f5062"><circle cx="100" cy="240" r="3.5"/><circle cx="100" cy="254" r="3.5"/></g>' +
'<circle cx="100" cy="196" r="6" fill="#c9a23a"/><circle cx="100" cy="196" r="2.6" fill="#8c2f24"/>' +
'<rect x="88" y="146" width="24" height="42" fill="#e2bfa2"/><path d="M88 172q12 9 24 0v16H88z" fill="#cba58a" opacity=".6"/>' +
'<circle cx="100" cy="42" r="22" fill="#b9bcc0"/><circle cx="100" cy="42" r="12" fill="none" stroke="#9ea2a7" stroke-width="2.5"/>' +
'<path d="M60 100Q58 58 100 56Q142 58 140 100L139 124Q134 152 100 158Q66 152 61 124Z" fill="#ecc9ac"/>' +
'<path d="M58 104Q52 52 100 50Q148 52 142 104Q138 76 100 70Q62 76 58 104Z" fill="#c4c7ca"/><path d="M66 78q34-14 68 0" stroke="#d9dbdd" stroke-width="3" fill="none"/>' +
'<ellipse cx="58" cy="112" rx="5" ry="9" fill="#dcb497"/><ellipse cx="142" cy="112" rx="5" ry="9" fill="#dcb497"/>' +
'<path d="M46 86L70 104" stroke="#d9a22b" stroke-width="5" stroke-linecap="round"/><path d="M46 86l-5-4" stroke="#33291f" stroke-width="5" stroke-linecap="round"/>' +
'<path d="M154 86L130 104" stroke="#b3261c" stroke-width="5" stroke-linecap="round"/><path d="M154 86l5-4" stroke="#33291f" stroke-width="5" stroke-linecap="round"/>' +
'<g fill="#f7f3ea" fill-opacity=".25" stroke="#2a1c16" stroke-width="3.4"><path d="M66 104q14-8 28 0v12q-14 9-28 0z"/><path d="M106 104q14-8 28 0v12q-14 9-28 0z"/></g>' +
'<path d="M94 108h12M66 106l-6-6M134 106l6-6" stroke="#2a1c16" stroke-width="3.4" fill="none"/>' +
'<path d="M62 118q-10 40 14 62M138 118q10 40-14 62" stroke="#c9a23a" stroke-width="1.6" fill="none" stroke-dasharray="2 3"/>' +
'<circle cx="80" cy="111" r="2.8" fill="#1b1512"/><circle cx="120" cy="111" r="2.8" fill="#1b1512"/>' +
'<path d="M100 114q-5 13 0 17q4 2 6-1" stroke="#c39a7e" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
'<path d="M88 142q12 4 24-1" stroke="#9a4a40" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
'<g transform="rotate(-8 100 236)"><rect x="18" y="226" width="164" height="22" rx="2" fill="#f7f3ea" stroke="#8c8674" stroke-width="2"/><path d="M18 237h164" stroke="#8c8674" stroke-width="1.5"/>' +
'<g stroke="#22231e" stroke-width="1.4"><path d="M30 228v6M42 228v4M54 228v6M66 228v4M78 228v6M90 228v4M102 228v6M114 228v4M126 228v6M138 228v4M150 228v6M162 228v4M30 240v6M48 240v4M66 240v6M84 240v4M102 240v6M120 240v4M138 240v6M156 240v4"/></g>' +
'<rect x="104" y="222" width="20" height="30" rx="2" fill="#dff3ff" fill-opacity=".45" stroke="#22231e" stroke-width="2"/><path d="M114 222v30" stroke="#b3261c" stroke-width="1.5"/></g>' +
'</symbol>' +
/* Luis Pereira: a blue work coat, a moustache, and a roll of grey tape */
'<symbol id="ch-pereira" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#27333c"/>' +
'<g fill="none" stroke="#3d4d59" stroke-width="3"><circle cx="30" cy="36" r="5"/><circle cx="62" cy="36" r="5"/><circle cx="94" cy="36" r="5"/><circle cx="126" cy="36" r="5"/><circle cx="158" cy="36" r="5"/><circle cx="30" cy="70" r="5"/><circle cx="158" cy="70" r="5"/><circle cx="184" cy="54" r="5"/></g>' +
'<path d="M18 30l10 34M28 30L18 64" stroke="#8a949b" stroke-width="5" stroke-linecap="round"/><path d="M166 28v40" stroke="#c9a23a" stroke-width="7" stroke-linecap="round"/><path d="M166 68v14" stroke="#8a949b" stroke-width="4"/>' +
'<path d="M6 260Q8 206 46 192L80 180H120L154 192Q192 206 194 260Z" fill="#2f5b8f"/>' +
'<path d="M80 180L100 216L120 180Z" fill="#e9e6da"/><path d="M80 180L92 226L100 216L108 226L120 180" fill="none" stroke="#244a76" stroke-width="7" stroke-linejoin="round"/>' +
'<rect x="124" y="214" width="36" height="28" fill="#2a5282" stroke="#1f3f66" stroke-width="2"/><path d="M132 208v12" stroke="#f2b23a" stroke-width="4" stroke-linecap="round"/>' +
'<rect x="88" y="146" width="24" height="40" fill="#b9825c"/><path d="M88 170q12 9 24 0v16H88z" fill="#a06d4a" opacity=".6"/>' +
'<ellipse cx="59" cy="110" rx="6" ry="10" fill="#ad7650"/><ellipse cx="141" cy="110" rx="6" ry="10" fill="#ad7650"/>' +
'<path d="M60 98Q60 58 100 56Q140 58 140 98L139 122Q136 152 100 158Q64 152 61 122Z" fill="#c48e66"/>' +
'<path d="M58 100Q52 46 102 46Q150 48 142 100Q136 74 112 68Q84 78 66 72Q60 82 58 100Z" fill="#17120f"/>' +
'<path d="M70 98q11-7 22-2M108 96q11-5 22 2" stroke="#17120f" stroke-width="4.4" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="82" cy="111" rx="6" ry="4.4" fill="#f7f1e6"/><ellipse cx="118" cy="111" rx="6" ry="4.4" fill="#f7f1e6"/><circle cx="83" cy="111" r="3.1" fill="#1b1512"/><circle cx="119" cy="111" r="3.1" fill="#1b1512"/>' +
'<path d="M100 112q-6 15 0 19q5 2 8-2" stroke="#9a6a48" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
'<path d="M80 139q10-9 20-3q10-6 20 3q-10 5-20 1q-10 4-20-1z" fill="#17120f"/>' +
'<path d="M90 147q10 5 20 0" stroke="#7a3f30" stroke-width="3" fill="none" stroke-linecap="round"/>' +
'<g transform="translate(40 232)"><ellipse cx="0" cy="0" rx="27" ry="20" fill="#9aa0a2"/><ellipse cx="0" cy="0" rx="27" ry="20" fill="none" stroke="#6c7274" stroke-width="2.5"/><ellipse cx="0" cy="0" rx="13" ry="9" fill="#c9a987"/><ellipse cx="0" cy="0" rx="10" ry="6.5" fill="#2f5b8f"/><path d="M22 -12l18 -8l4 9l-18 8z" fill="#aab0b2" stroke="#6c7274" stroke-width="2"/></g>' +
'</symbol>' +
'</defs></svg>';

window.FACE = function (who) {
  var bg = { voss: '#1d2a27', halloran: '#33291f', pereira: '#27333c' }[who] || '#222';
  return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:' + bg + '"><use href="#ch-' + who + '"/></svg>';
};
