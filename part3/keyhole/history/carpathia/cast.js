/* The three people nearest to you in "Come at Once". All three are invented.
   Busts of 200 x 260. The real people of the story are never drawn close: they are backs, and voices. */
window.CAST_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>' +
/* Sinclair, quartermaster: a blue jersey, a grey beard, a lantern */
'<symbol id="cp-sinclair" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#111a24"/><g fill="#e9e2c8"><circle cx="24" cy="22" r="1.4"/><circle cx="58" cy="44" r="1"/><circle cx="150" cy="18" r="1.5"/><circle cx="178" cy="52" r="1"/><circle cx="122" cy="38" r="1"/><circle cx="34" cy="78" r="1"/></g>' +
'<path d="M4 260Q6 204 44 190L80 178H120L156 190Q194 204 196 260Z" fill="#1b2740"/>' +
'<path d="M76 180Q100 198 124 180L128 196Q100 216 72 196Z" fill="#253556"/><path d="M74 190q26 18 52 0M72 200q28 18 56 0" stroke="#16203a" stroke-width="2.5" fill="none"/>' +
'<path d="M20 260q0-40 26-62M180 260q0-40-26-62" stroke="#111a2c" stroke-width="5" fill="none"/>' +
'<rect x="88" y="150" width="24" height="36" fill="#c18d68"/>' +
'<ellipse cx="59" cy="112" rx="6" ry="10" fill="#b98562"/><ellipse cx="141" cy="112" rx="6" ry="10" fill="#b98562"/>' +
'<path d="M60 98Q60 60 100 58Q140 60 140 98L139 124Q136 152 100 158Q64 152 61 124Z" fill="#cf9c76"/>' +
'<path d="M60 118Q62 160 100 172Q138 160 140 118Q134 142 100 144Q66 142 60 118Z" fill="#c9ccd0"/><path d="M72 140q28 20 56 0M70 150q30 18 60 0" stroke="#aeb2b7" stroke-width="2.4" fill="none"/>' +
'<path d="M84 134q16-9 32 0q-6 8-16 8t-16-8z" fill="#d9dbde"/><path d="M90 142h20" stroke="#8a5a48" stroke-width="2.6" stroke-linecap="round"/>' +
'<path d="M56 94Q54 62 100 60Q146 62 144 94L140 86Q100 74 60 86Z" fill="#141c30"/><path d="M52 92Q100 70 148 92L146 100Q100 82 54 100Z" fill="#0c1220"/><path d="M58 76Q60 40 100 38Q140 40 142 76Q100 62 58 76Z" fill="#1b2740"/>' +
'<rect x="90" y="56" width="20" height="13" rx="2" fill="#c9a23a"/><path d="M94 62h12" stroke="#7d6420" stroke-width="2"/>' +
'<path d="M70 104q12-6 22-1M108 103q10-5 22 1" stroke="#d9dbde" stroke-width="4.2" fill="none" stroke-linecap="round"/>' +
'<path d="M74 113q8-4 16 0M110 113q8-4 16 0" stroke="#3a2a1e" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="82" cy="114" r="2.5" fill="#1b1512"/><circle cx="118" cy="114" r="2.5" fill="#1b1512"/>' +
'<path d="M68 118l-6 3M132 118l6 3M68 122l-5 5M132 122l5 5" stroke="#a87a58" stroke-width="1.6"/>' +
'<path d="M100 114q-6 14 0 19q5 2 8-2" stroke="#a87a58" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
'<g transform="translate(34 214)"><path d="M-10 -34q10-14 20 0" stroke="#c9a23a" stroke-width="3" fill="none"/><rect x="-14" y="-32" width="28" height="7" rx="2" fill="#a8842e"/><rect x="-12" y="-25" width="24" height="34" rx="3" fill="#ffe7a0"/><rect x="-12" y="-25" width="24" height="34" rx="3" fill="none" stroke="#a8842e" stroke-width="2.5"/><path d="M-4 -25v34M4 -25v34" stroke="#a8842e" stroke-width="1.5"/><ellipse cx="0" cy="-4" rx="5" ry="9" fill="#ffb23a"/><rect x="-15" y="9" width="30" height="8" rx="2" fill="#a8842e"/><circle cx="0" cy="-8" r="34" fill="#ffd97a" opacity=".13"/></g>' +
'</symbol>' +
/* Mr Rudd, a junior engineer: a boiler suit, oil to the elbows, chalk behind one ear */
'<symbol id="cp-rudd" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#1a1716"/><rect x="0" y="0" width="54" height="260" fill="#3a1d10"/><rect x="0" y="0" width="30" height="260" fill="#6b2d12" opacity=".7"/>' +
'<g stroke="#4a4440" stroke-width="5" fill="none"><path d="M120 0v60h80M150 0v34h50"/></g><circle cx="164" cy="92" r="22" fill="#d9d2bd"/><circle cx="164" cy="92" r="22" fill="none" stroke="#b08a35" stroke-width="5"/><path d="M164 92l12-13" stroke="#8c2f24" stroke-width="3" stroke-linecap="round"/><circle cx="164" cy="92" r="3" fill="#22231e"/>' +
'<path d="M6 260Q8 206 46 192L80 180H120L154 192Q192 206 194 260Z" fill="#3f4d5b"/>' +
'<path d="M80 180L100 220L120 180Z" fill="#b98a66"/><path d="M80 180L88 232L100 220L112 232L120 180" fill="none" stroke="#33404c" stroke-width="8" stroke-linejoin="round"/>' +
'<path d="M74 184Q100 204 126 184L122 198Q100 212 78 198Z" fill="#8c2f24"/><path d="M96 204l-6 22M104 204l8 20" stroke="#7a271e" stroke-width="7" stroke-linecap="round"/>' +
'<circle cx="100" cy="240" r="4" fill="#2a343e"/><rect x="128" y="214" width="34" height="28" fill="#394653" stroke="#2a343e" stroke-width="2"/>' +
'<rect x="88" y="148" width="24" height="38" fill="#c7906a"/><path d="M88 172q12 9 24 0v14H88z" fill="#ad7954" opacity=".6"/>' +
'<ellipse cx="59" cy="110" rx="6" ry="10" fill="#bb835e"/><ellipse cx="141" cy="110" rx="6" ry="10" fill="#bb835e"/>' +
'<path d="M60 98Q60 58 100 56Q140 58 140 98L139 122Q136 152 100 158Q64 152 61 122Z" fill="#d39f78"/>' +
'<path d="M56 100Q50 48 96 44Q150 42 144 100Q138 72 118 66Q96 80 70 70Q60 82 56 100Z" fill="#2a1c14"/><path d="M70 60q14-14 34-8M100 50q22-6 34 12" stroke="#3d2a1e" stroke-width="3" fill="none"/>' +
'<path d="M150 82L134 104" stroke="#f4f1e8" stroke-width="5" stroke-linecap="round"/>' +
'<path d="M70 98q11-6 22-2M108 96q11-4 22 2" stroke="#2a1c14" stroke-width="4" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="82" cy="110" rx="6" ry="4.4" fill="#f7f1e6"/><ellipse cx="118" cy="110" rx="6" ry="4.4" fill="#f7f1e6"/><circle cx="83" cy="110" r="3" fill="#1b1512"/><circle cx="119" cy="110" r="3" fill="#1b1512"/>' +
'<path d="M100 112q-6 15 0 19q5 2 8-2" stroke="#a87650" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
'<path d="M86 141q14 9 30-2" stroke="#7a3f30" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
'<g fill="#1d1a18" opacity=".55"><path d="M64 120q10 2 14 12q-10 2-14-12z"/><path d="M118 76q12-2 18 8q-12 4-18-8z"/><ellipse cx="126" cy="134" rx="7" ry="4"/></g>' +
'</symbol>' +
/* Mrs Latham, stewardess: a black dress, a white cap, a blanket over one arm */
'<symbol id="cp-latham" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#efe6d0"/><rect x="0" y="0" width="200" height="12" fill="#c9a23a" opacity=".7"/><path d="M0 34h200" stroke="#c9a23a" stroke-width="2" opacity=".7"/>' +
'<circle cx="34" cy="92" r="20" fill="#16202c"/><circle cx="34" cy="92" r="20" fill="none" stroke="#b08a35" stroke-width="6"/><circle cx="34" cy="92" r="26" fill="none" stroke="#8a6a26" stroke-width="2"/>' +
'<path d="M8 260Q10 208 46 194L80 182H120L154 194Q190 208 192 260Z" fill="#191a1f"/>' +
'<path d="M74 184Q100 206 126 184L130 196Q100 220 70 196Z" fill="#f7f4ec"/><circle cx="100" cy="204" r="6" fill="#c9a23a"/><circle cx="100" cy="204" r="2.5" fill="#191a1f"/>' +
'<path d="M70 210h60l10 50H60z" fill="#f7f4ec"/><path d="M70 210h60" stroke="#d9d4c6" stroke-width="2"/><path d="M82 210v50M118 210v50" stroke="#e6e1d3" stroke-width="2"/>' +
'<rect x="88" y="148" width="24" height="40" fill="#e6c2a4"/><path d="M88 172q12 9 24 0v16H88z" fill="#cfa98b" opacity=".6"/>' +
'<circle cx="100" cy="46" r="20" fill="#8f7d6c"/><circle cx="100" cy="46" r="11" fill="none" stroke="#7a6958" stroke-width="2.5"/>' +
'<path d="M60 102Q58 60 100 58Q142 60 140 102L139 126Q134 154 100 160Q66 154 61 126Z" fill="#efcdb0"/>' +
'<path d="M58 106Q52 54 100 52Q148 54 142 106Q138 78 100 72Q62 78 58 106Z" fill="#9c8a78"/><path d="M66 82q34-14 68 0" stroke="#b4a391" stroke-width="3" fill="none"/>' +
'<path d="M70 62Q100 40 130 62Q100 54 70 62Z" fill="#f7f4ec"/><path d="M66 66Q100 48 134 66" stroke="#f7f4ec" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M72 58q28-14 56 0" stroke="#d9d4c6" stroke-width="1.6" fill="none"/>' +
'<ellipse cx="58" cy="114" rx="5" ry="9" fill="#dfb89a"/><ellipse cx="142" cy="114" rx="5" ry="9" fill="#dfb89a"/>' +
'<path d="M70 100q11-5 22-1M108 99q11-4 22 1" stroke="#6b5a4a" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="82" cy="112" rx="5.6" ry="4" fill="#f9f4ea"/><ellipse cx="118" cy="112" rx="5.6" ry="4" fill="#f9f4ea"/><circle cx="82" cy="112" r="2.9" fill="#1b1512"/><circle cx="118" cy="112" r="2.9" fill="#1b1512"/>' +
'<path d="M100 114q-5 13 0 17q4 2 6-1" stroke="#c9a084" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
'<path d="M88 144q12 3 24 0" stroke="#9a4a40" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M72 134q3 5 0 10M128 134q-3 5 0 10" stroke="#d3ac8e" stroke-width="1.8" fill="none"/>' +
'<g transform="rotate(-6 150 232)"><rect x="118" y="212" width="78" height="44" rx="6" fill="#a9a59a"/><rect x="118" y="212" width="78" height="14" rx="6" fill="#bdb9ad"/><path d="M118 234h78M118 242h78" stroke="#8c2f24" stroke-width="4"/><path d="M118 226h78" stroke="#8f8b80" stroke-width="1.5"/></g>' +
'</symbol>' +
'</defs></svg>';

window.FACE = function (who) {
  var bg = { sinclair: '#111a24', rudd: '#1a1716', latham: '#efe6d0' }[who] || '#222';
  return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:' + bg + '"><use href="#cp-' + who + '"/></svg>';
};
