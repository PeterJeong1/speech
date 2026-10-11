/* The people of "Seven Down", drawn as busts of 200 x 260, and two things that do the talking for somebody
   who cannot be seen: the house telephone, and the gate of a lift. */
window.CAST = {
  quill:   { who: 'Mr Quill', role: 'Puzzles Editor, on the house telephone' },
  abbas:   { who: 'Miss Abbas', role: 'Night librarian' },
  fenwick: { who: 'Mr Fenwick', role: 'Head printer' },
  strand:  { who: 'Mr Strand', role: 'Foreman of the press hall' },
  voice:   { who: 'A voice in the lift shaft', role: 'Somewhere below your feet' },
  lovage:  { who: 'Mr Lovage', role: 'Lift attendant, Clarion House' },
  penhale: { who: 'Mrs Penhale', role: 'Editor of the Clarion' }
};
window.CAST_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>' +

/* the house telephone */
'<symbol id="ch-quill" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#1a1d1b"/><rect y="186" width="200" height="74" fill="#3a2a1c"/><rect y="186" width="200" height="6" fill="#5a422c"/>' +
'<ellipse cx="100" cy="196" rx="76" ry="10" fill="#000" opacity=".4"/>' +
'<path d="M44 190q0-58 56-58t56 58z" fill="#0c0c0d"/><path d="M52 186q2-46 48-46" fill="none" stroke="#3b3b40" stroke-width="5" stroke-linecap="round"/>' +
'<circle cx="100" cy="164" r="25" fill="#e9e6dc"/><circle cx="100" cy="164" r="9" fill="#0c0c0d"/>' +
'<g fill="#0c0c0d"><circle cx="100" cy="146" r="3.4"/><circle cx="113" cy="151" r="3.4"/><circle cx="118" cy="164" r="3.4"/><circle cx="113" cy="177" r="3.4"/><circle cx="100" cy="182" r="3.4"/><circle cx="87" cy="177" r="3.4"/><circle cx="82" cy="164" r="3.4"/><circle cx="87" cy="151" r="3.4"/></g>' +
'<path d="M80 132v-14h40v14" fill="none" stroke="#0c0c0d" stroke-width="9"/>' +
'<path d="M38 100q62-34 124 0l-8 22q-14-10-22-6l-6-12h-52l-6 12q-8-4-22 6z" fill="#0c0c0d"/><path d="M52 98q48-22 96 0" fill="none" stroke="#3b3b40" stroke-width="4" stroke-linecap="round"/>' +
'<path d="M150 190q30 6 26 34t-34 36" fill="none" stroke="#0c0c0d" stroke-width="5" stroke-dasharray="3 5"/>' +
'<g stroke="#f4e04d" stroke-width="5" stroke-linecap="round" fill="none"><path d="M30 78q-10-14-4-30M170 78q10-14 4-30M16 88q-16-22-6-48M184 88q16-22 6-48"/></g>' +
'</symbol>' +

/* Miss Abbas */
'<symbol id="ch-abbas" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#cdbf9c"/>' +
'<g fill="#b9a983" stroke="#8f8160" stroke-width="2"><rect x="-4" y="14" width="62" height="40"/><rect x="66" y="14" width="62" height="40"/><rect x="136" y="14" width="70" height="40"/><rect x="-4" y="62" width="62" height="40"/><rect x="136" y="62" width="70" height="40"/><rect x="-4" y="110" width="62" height="40"/><rect x="136" y="110" width="70" height="40"/></g>' +
'<g fill="#f3eedf"><rect x="14" y="26" width="26" height="9"/><rect x="84" y="26" width="26" height="9"/><rect x="156" y="26" width="26" height="9"/><rect x="14" y="74" width="26" height="9"/><rect x="156" y="74" width="26" height="9"/></g>' +
'<path d="M6 260Q8 208 46 194L82 180H118L154 194Q192 208 194 260Z" fill="#6b3550"/>' +
'<path d="M82 180L100 214L118 180Z" fill="#f3eedf"/><path d="M82 180L100 214" stroke="#52273d" stroke-width="5" fill="none"/><path d="M118 180L100 214" stroke="#52273d" stroke-width="5" fill="none"/>' +
'<g fill="#3d1c2c"><circle cx="100" cy="228" r="3.6"/><circle cx="100" cy="246" r="3.6"/></g>' +
'<rect x="87" y="144" width="26" height="44" fill="#a9744e"/><path d="M87 170q13 9 26 0v18h-26z" fill="#8f5f3e" opacity=".6"/>' +
'<ellipse cx="100" cy="106" rx="41" ry="49" fill="#bd8a60"/>' +
'<circle cx="100" cy="40" r="20" fill="#17130f"/><path d="M57 104Q52 56 100 52Q148 56 143 104Q134 74 100 72Q66 74 57 104Z" fill="#17130f"/><path d="M92 52q8-8 16 0" stroke="#3b332b" stroke-width="3" fill="none"/>' +
'<path d="M140 62L154 22" stroke="#f4e04d" stroke-width="5" stroke-linecap="round"/><path d="M154 22l3-9" stroke="#1c1b18" stroke-width="5" stroke-linecap="round"/>' +
'<path d="M72 97q10-6 21-1M107 96q11-5 21 1" stroke="#17130f" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
'<g fill="#f7f1e6"><ellipse cx="83" cy="112" rx="6.5" ry="4.6"/><ellipse cx="117" cy="112" rx="6.5" ry="4.6"/></g><circle cx="84" cy="112" r="3.2" fill="#1b1512"/><circle cx="118" cy="112" r="3.2" fill="#1b1512"/>' +
'<g fill="none" stroke="#c9a24a" stroke-width="3"><circle cx="83" cy="112" r="14"/><circle cx="117" cy="112" r="14"/><path d="M97 111h6M69 110l-12-5M131 110l12-5"/></g>' +
'<path d="M57 105q-8 40 4 74M143 105q8 40-4 74" stroke="#c9a24a" stroke-width="1.6" fill="none" stroke-dasharray="2 3"/>' +
'<path d="M100 116q-6 14 0 18q5 2 8-2" stroke="#8a5c3c" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
'<path d="M88 143q12 3 24 0" stroke="#6e2f2a" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
'</symbol>' +

/* Mr Fenwick */
'<symbol id="ch-fenwick" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#262b30"/>' +
'<g stroke="#11151a" stroke-width="3" fill="#3a424a"><path d="M-6 30h212v26H-6zM-6 68h212v26H-6zM-6 106h212v26H-6z"/></g><g stroke="#11151a" stroke-width="2"><path d="M30 30v26M66 30v26M102 30v26M138 30v26M174 30v26M48 68v26M84 68v26M120 68v26M156 68v26M30 106v26M66 106v26M138 106v26M174 106v26"/></g>' +
'<path d="M4 260Q6 208 44 194L80 180H120L156 194Q194 208 196 260Z" fill="#e6e2d6"/>' +
'<path d="M60 260V214q40 16 80 0v46z" fill="#16171a"/><path d="M60 214q40 16 80 0" stroke="#3b3d44" stroke-width="3" fill="none"/><path d="M72 208L62 178M128 208L138 178" stroke="#16171a" stroke-width="7" stroke-linecap="round"/>' +
'<path d="M96 230h30v18h-30z" fill="#26282d"/><path d="M104 230v-8M114 230v-11" stroke="#b9bfc6" stroke-width="3" stroke-linecap="round"/>' +
'<rect x="86" y="146" width="28" height="42" fill="#d8a384"/><path d="M86 172q14 10 28 0v16h-28z" fill="#bd8669" opacity=".6"/>' +
'<ellipse cx="100" cy="104" rx="43" ry="50" fill="#e3b092"/>' +
'<path d="M58 96Q60 60 100 56Q140 60 142 96Q132 74 100 72Q68 74 58 96Z" fill="#e3b092"/><path d="M70 62q30-14 60 0" stroke="#fff" stroke-width="5" opacity=".25" fill="none" stroke-linecap="round"/>' +
'<path d="M55 110Q50 90 60 76l4 34zM145 110Q150 90 140 76l-4 34z" fill="#c9cdd2"/>' +
'<g fill="none" stroke="#5a6068" stroke-width="3"><ellipse cx="82" cy="72" rx="13" ry="9"/><ellipse cx="118" cy="72" rx="13" ry="9"/><path d="M95 72h10M69 72l-10 8M131 72l10 8"/></g>' +
'<path d="M70 100q11-7 22-2M108 98q11-5 22 2" stroke="#8f959c" stroke-width="5" fill="none" stroke-linecap="round"/>' +
'<g fill="#f7f1e6"><ellipse cx="82" cy="113" rx="6.5" ry="4.4"/><ellipse cx="118" cy="113" rx="6.5" ry="4.4"/></g><circle cx="83" cy="113" r="3.2" fill="#2a3540"/><circle cx="119" cy="113" r="3.2" fill="#2a3540"/>' +
'<path d="M100 114q-8 16 0 21q6 2 9-2" stroke="#b07a5c" stroke-width="2.8" fill="none" stroke-linecap="round"/>' +
'<path d="M74 142q10-12 26-6q16-6 26 6q-12 8-26 2q-14 6-26-2z" fill="#c9cdd2"/>' +
'<path d="M90 150q10 4 20 0" stroke="#8a4a3c" stroke-width="3" fill="none" stroke-linecap="round"/>' +
'</symbol>' +

/* Mr Strand */
'<symbol id="ch-strand" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#0f1a2a"/>' +
'<rect x="-6" y="24" width="212" height="34" fill="#22364f"/><g fill="#0f1a2a"><circle cx="26" cy="41" r="6"/><circle cx="70" cy="41" r="6"/><circle cx="114" cy="41" r="6"/><circle cx="158" cy="41" r="6"/></g>' +
'<path d="M-6 96h212" stroke="#f4e04d" stroke-width="12" stroke-dasharray="18 14"/>' +
'<path d="M-4 260Q-2 200 40 188L78 176H122L160 188Q202 200 204 260Z" fill="#1f3a6a"/>' +
'<path d="M78 176L100 204L122 176Z" fill="#c9cdd2"/><path d="M100 204v56" stroke="#16294d" stroke-width="4"/><g fill="#c9a24a"><circle cx="100" cy="222" r="4"/><circle cx="100" cy="244" r="4"/></g>' +
'<path d="M70 190q30 60 60 0" fill="none" stroke="#b3261c" stroke-width="3"/><rect x="92" y="228" width="16" height="9" rx="3" fill="#c9cdd2" transform="rotate(-18 100 232)"/>' +
'<rect x="80" y="140" width="40" height="46" fill="#c98d6b"/><path d="M80 168q20 12 40 0v18H80z" fill="#a8704f" opacity=".6"/>' +
'<ellipse cx="100" cy="104" rx="48" ry="50" fill="#d9a07c"/>' +
'<path d="M50 84Q52 44 100 42Q148 44 150 84Q126 68 100 68Q74 68 50 84Z" fill="#3b4148"/><path d="M48 86q52-22 104 0l8 8q-60-20-120 0z" fill="#2a2f35"/>' +
'<path d="M66 100q13-8 26-3M108 97q13-5 26 3" stroke="#3b2a1e" stroke-width="6" fill="none" stroke-linecap="round"/>' +
'<g fill="#f7f1e6"><ellipse cx="80" cy="113" rx="6.5" ry="4.2"/><ellipse cx="120" cy="113" rx="6.5" ry="4.2"/></g><circle cx="81" cy="113" r="3.2" fill="#1b1512"/><circle cx="121" cy="113" r="3.2" fill="#1b1512"/>' +
'<path d="M100 114q-9 18 0 23q7 2 10-3" stroke="#a8704f" stroke-width="3" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="100" cy="150" rx="15" ry="9" fill="#6e2f2a"/><path d="M87 147h26" stroke="#f7f1e6" stroke-width="4"/>' +
'<path d="M56 130q6 26 44 30q38-4 44-30" fill="none" stroke="#b98464" stroke-width="3" opacity=".7"/>' +
'</symbol>' +

/* the gate of the lift */
'<symbol id="ch-voice" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#120d08"/><rect y="150" width="200" height="110" fill="#f4c46a" opacity=".5"/><rect y="186" width="200" height="74" fill="#f6d58a" opacity=".5"/>' +
'<rect y="140" width="200" height="12" fill="#6b4a22"/><rect y="142" width="200" height="3" fill="#c9a24a"/>' +
'<g stroke="#2a2118" stroke-width="5" fill="none"><path d="M0 0L40 40L0 80L40 120L0 160L40 200L0 240L20 260M40 0L0 40L40 80L0 120L40 160L0 200L40 240L20 260M40 0L80 40L40 80L80 120L40 160L80 200L40 240L60 260M80 0L40 40L80 80L40 120L80 160L40 200L80 240L60 260M80 0L120 40L80 80L120 120L80 160L120 200L80 240L100 260M120 0L80 40L120 80L80 120L120 160L80 200L120 240L100 260M120 0L160 40L120 80L160 120L120 160L160 200L120 240L140 260M160 0L120 40L160 80L120 120L160 160L120 200L160 240L140 260M160 0L200 40L160 80L200 120L160 160L200 200L160 240L180 260M200 0L160 40L200 80L160 120L200 160L160 200L200 240L180 260"/></g>' +
'<g stroke="#5a4326" stroke-width="2" fill="none" opacity=".8"><path d="M0 0L40 40L0 80L40 120L0 160L40 200L0 240M40 0L80 40L40 80L80 120L40 160L80 200L40 240M80 0L120 40L80 80L120 120L80 160L120 200L80 240M120 0L160 40L120 80L160 120L120 160L160 200L120 240M160 0L200 40L160 80L200 120L160 160L200 200L160 240"/></g>' +
'<g transform="rotate(-3 100 84)"><path d="M100 30v22" stroke="#d9d5c8" stroke-width="2"/><rect x="38" y="52" width="124" height="62" fill="#fbf8ee"/><text x="100" y="78" text-anchor="middle" font-family="Caveat,cursive" font-weight="700" font-size="24" fill="#2450a8" letter-spacing="1">OUT OF</text><text x="100" y="102" text-anchor="middle" font-family="Caveat,cursive" font-weight="700" font-size="24" fill="#2450a8" letter-spacing="1">ORDER</text></g>' +
'</symbol>' +

/* Mr Lovage */
'<symbol id="ch-lovage" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#5a3b1e"/><rect width="200" height="260" fill="#f4c46a" opacity=".18"/>' +
'<g stroke="#2a1b0c" stroke-width="4" fill="none" opacity=".6"><path d="M0 0L40 40L0 80L40 120L0 160M40 0L0 40L40 80L0 120L40 160M160 0L200 40L160 80L200 120L160 160M200 0L160 40L200 80L160 120L200 160"/></g>' +
'<path d="M6 260Q8 208 46 194L82 180H118L154 194Q192 208 194 260Z" fill="#6f7780"/>' +
'<path d="M82 180L100 206L118 180Z" fill="#f3eedf"/><path d="M82 180L96 232M118 180L104 232" stroke="#565d66" stroke-width="5" fill="none" stroke-linecap="round"/>' +
'<path d="M95 206h10l3 26l-8 10l-8-10z" fill="#1d2a52"/>' +
'<g fill="#e0b354"><circle cx="78" cy="236" r="4.5"/><circle cx="122" cy="236" r="4.5"/><circle cx="78" cy="254" r="4.5"/><circle cx="122" cy="254" r="4.5"/></g>' +
'<rect x="88" y="146" width="24" height="42" fill="#c99876"/><path d="M88 170q12 9 24 0v18H88z" fill="#ad7d5d" opacity=".6"/>' +
'<ellipse cx="100" cy="106" rx="38" ry="49" fill="#d7a886"/>' +
'<path d="M62 100Q58 82 64 74l4 30zM138 100Q142 82 136 74l-4 30z" fill="#b9bfc6"/>' +
'<path d="M58 70Q60 36 100 34Q140 36 142 70Q120 60 100 60Q80 60 58 70Z" fill="#565d66"/><path d="M52 72q48-16 96 0l10 8q-58-14-116 0z" fill="#3d434a"/>' +
'<rect x="86" y="42" width="28" height="13" rx="2" fill="#e0b354"/><text x="100" y="52.500" text-anchor="middle" font-family="Oswald,sans-serif" font-weight="600" font-size="9" letter-spacing="1.5" fill="#3a2a08">LIFT</text>' +
'<path d="M139 76L150 44" stroke="#2450a8" stroke-width="5" stroke-linecap="round"/><path d="M150 44l2-7" stroke="#1c1b18" stroke-width="5" stroke-linecap="round"/>' +
'<path d="M72 97q10-4 20 0M108 97q10-4 20 0" stroke="#8f959c" stroke-width="4" fill="none" stroke-linecap="round"/>' +
'<g fill="#f7f1e6"><ellipse cx="83" cy="111" rx="6" ry="4.2"/><ellipse cx="117" cy="111" rx="6" ry="4.2"/></g><circle cx="84" cy="111" r="3.1" fill="#3a4a5a"/><circle cx="118" cy="111" r="3.1" fill="#3a4a5a"/>' +
'<path d="M73 121q9 3 18 0M109 121q9 3 18 0" stroke="#ad7d5d" stroke-width="1.8" fill="none"/>' +
'<path d="M100 113q-6 16 0 20q5 2 8-2" stroke="#ad7d5d" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
'<path d="M87 145q13 6 26-1" stroke="#7a4a3c" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
'</symbol>' +

/* Mrs Penhale */
'<symbol id="ch-penhale" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#4a2e1c"/><g stroke="#2e1b0f" stroke-width="3" fill="none"><rect x="14" y="14" width="76" height="110"/><rect x="110" y="14" width="76" height="110"/><rect x="14" y="140" width="76" height="130"/><rect x="110" y="140" width="76" height="130"/></g>' +
'<path d="M6 260Q8 210 46 196L80 184H120L154 196Q192 210 194 260Z" fill="#1f4a3a"/>' +
'<path d="M80 184Q100 220 120 184Q100 196 80 184Z" fill="#d9b18f"/><path d="M80 184Q100 220 120 184" stroke="#163a2c" stroke-width="5" fill="none"/>' +
'<g fill="#f7f3ea" stroke="#c9c3b4" stroke-width="1"><circle cx="78" cy="192" r="4.5"/><circle cx="86" cy="200" r="4.5"/><circle cx="96" cy="205" r="4.5"/><circle cx="106" cy="204" r="4.5"/><circle cx="115" cy="199" r="4.5"/><circle cx="122" cy="191" r="4.5"/></g>' +
'<rect x="88" y="146" width="24" height="44" fill="#d9b18f"/><path d="M88 172q12 9 24 0v18H88z" fill="#bf9573" opacity=".6"/>' +
'<ellipse cx="100" cy="106" rx="40" ry="49" fill="#e6c2a2"/>' +
'<path d="M54 112Q44 52 100 46Q156 52 146 112Q142 80 122 70Q100 62 78 72Q58 82 54 112Z" fill="#d9dde2"/><path d="M70 62q30-18 62 2" stroke="#fff" stroke-width="5" fill="none" opacity=".6" stroke-linecap="round"/><path d="M54 112q-4 18 6 28M146 112q4 18-6 28" stroke="#d9dde2" stroke-width="9" fill="none" stroke-linecap="round"/>' +
'<circle cx="58" cy="132" r="4" fill="#f7f3ea"/><circle cx="142" cy="132" r="4" fill="#f7f3ea"/>' +
'<path d="M72 96q10-7 21-3M107 93q11-4 21 3" stroke="#7d848c" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
'<g fill="#f7f1e6"><ellipse cx="83" cy="110" rx="6.5" ry="4.4"/><ellipse cx="117" cy="110" rx="6.5" ry="4.4"/></g><circle cx="84" cy="110" r="3.2" fill="#2f5a4a"/><circle cx="118" cy="110" r="3.2" fill="#2f5a4a"/>' +
'<path d="M100 112q-6 15 0 19q5 2 8-2" stroke="#bf9573" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
'<path d="M88 144q12 4 24-1" stroke="#a8382f" stroke-width="4" fill="none" stroke-linecap="round"/>' +
'</symbol>' +
'</defs></svg>';

window.FACE = function (name) {
  var bg = { quill: '#1a1d1b', abbas: '#cdbf9c', fenwick: '#262b30', strand: '#0f1a2a', voice: '#120d08', lovage: '#5a3b1e', penhale: '#4a2e1c' }[name] || '#222';
  return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:' + bg + '"><use href="#ch-' + name + '"/></svg>';
};
