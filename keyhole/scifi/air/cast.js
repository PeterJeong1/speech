/* The voices of "Seven Hours of Air". One bust each, 200 x 260, reused in scenes and in talk.
   Keel is not a person, so its bust is the thing it speaks through. */
window.CAST_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>' +

/* Keel: a wall unit with a ring of light */
'<symbol id="ch-keel" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#0b161f"/>' +
'<rect x="12" y="12" width="176" height="236" rx="12" fill="#1c2b38"/>' +
'<rect x="12" y="12" width="176" height="236" rx="12" fill="none" stroke="#34506a" stroke-width="2.5"/>' +
'<path d="M12 60h176M12 196h176" stroke="#132230" stroke-width="2"/>' +
'<g fill="#0b161f"><circle cx="26" cy="26" r="4"/><circle cx="174" cy="26" r="4"/><circle cx="26" cy="234" r="4"/><circle cx="174" cy="234" r="4"/></g>' +
'<text x="30" y="46" font-family="Orbitron,sans-serif" font-weight="800" font-size="15" letter-spacing="5" fill="#8fd9ef">KEEL</text>' +
'<rect x="150" y="34" width="22" height="9" rx="2" fill="#39e6ff"/>' +
'<circle cx="100" cy="128" r="60" fill="#070e15"/>' +
'<circle cx="100" cy="128" r="60" fill="none" stroke="#3b566d" stroke-width="4"/>' +
'<circle cx="100" cy="128" r="47" fill="none" stroke="#39e6ff" stroke-width="7" opacity=".28"/>' +
'<circle cx="100" cy="128" r="47" fill="none" stroke="#7ff0ff" stroke-width="2.6"/>' +
'<g fill="#27404f">' +
'<circle cx="100" cy="100" r="3"/><circle cx="86" cy="104" r="3"/><circle cx="114" cy="104" r="3"/><circle cx="76" cy="114" r="3"/><circle cx="124" cy="114" r="3"/>' +
'<circle cx="72" cy="128" r="3"/><circle cx="128" cy="128" r="3"/><circle cx="76" cy="142" r="3"/><circle cx="124" cy="142" r="3"/>' +
'<circle cx="86" cy="152" r="3"/><circle cx="114" cy="152" r="3"/><circle cx="100" cy="156" r="3"/>' +
'<circle cx="88" cy="118" r="3"/><circle cx="112" cy="118" r="3"/><circle cx="88" cy="138" r="3"/><circle cx="112" cy="138" r="3"/></g>' +
'<circle cx="100" cy="128" r="11" fill="#39e6ff"/><circle cx="100" cy="128" r="11" fill="none" stroke="#c9f8ff" stroke-width="2"/>' +
'<circle cx="96" cy="124" r="3.4" fill="#f2ffff"/>' +
'<g fill="#39e6ff"><rect x="44" y="216" width="7" height="12"/><rect x="56" y="210" width="7" height="18"/><rect x="68" y="204" width="7" height="24"/>' +
'<rect x="80" y="212" width="7" height="16"/><rect x="92" y="206" width="7" height="22"/><rect x="104" y="214" width="7" height="14"/>' +
'<rect x="116" y="208" width="7" height="20"/><rect x="128" y="204" width="7" height="24"/><rect x="140" y="212" width="7" height="16"/><rect x="152" y="218" width="7" height="10"/></g>' +
'</symbol>' +

/* Dr Wunmi Adeyemi, on a small screen, a long way down */
'<symbol id="ch-wren" viewBox="0 0 200 260">' +
'<path d="M6 260Q8 200 44 187L82 174H118L156 187Q192 200 194 260Z" fill="#e4e9ec"/>' +
'<path d="M44 187L70 200M156 187L130 200" stroke="#b9c4ca" stroke-width="5" stroke-linecap="round"/>' +
'<path d="M6 260Q8 222 22 204L40 260Z" fill="#e8892b"/><path d="M194 260Q192 222 178 204L160 260Z" fill="#e8892b"/>' +
'<ellipse cx="100" cy="184" rx="44" ry="15" fill="#8d9ea8"/><ellipse cx="100" cy="181" rx="35" ry="10" fill="#22313a"/>' +
'<rect x="118" y="214" width="56" height="22" rx="3" fill="#1c2b38"/>' +
'<text x="146" y="229" text-anchor="middle" font-family="Oswald,sans-serif" font-size="10.5" letter-spacing="1" fill="#d9f4ff">ADEYEMI</text>' +
'<rect x="87" y="140" width="26" height="42" fill="#7a4d33"/>' +
'<ellipse cx="57" cy="108" rx="6" ry="10" fill="#8a5a3c"/><ellipse cx="143" cy="108" rx="6" ry="10" fill="#8a5a3c"/>' +
'<ellipse cx="100" cy="103" rx="42" ry="50" fill="#99653f"/>' +
'<path d="M62 124Q72 153 100 153Q128 153 138 124Q126 147 100 148Q74 147 62 124Z" fill="#7e5030" opacity=".5"/>' +
'<g fill="#1b1614"><circle cx="66" cy="70" r="16"/><circle cx="82" cy="52" r="18"/><circle cx="104" cy="45" r="19"/><circle cx="125" cy="54" r="17"/><circle cx="138" cy="72" r="15"/>' +
'<circle cx="58" cy="90" r="11"/><circle cx="143" cy="91" r="10"/><path d="M58 96Q60 62 100 60Q140 62 142 96Q128 74 100 74Q72 74 58 96Z"/></g>' +
'<path d="M52 104Q48 30 100 28Q152 30 148 104" stroke="#cfd6da" stroke-width="7" fill="none" stroke-linecap="round"/>' +
'<rect x="40" y="94" width="18" height="34" rx="8" fill="#2b3a44"/><rect x="142" y="94" width="18" height="34" rx="8" fill="#2b3a44"/>' +
'<path d="M49 124Q52 156 84 152" stroke="#2b3a44" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="80" y="146" width="14" height="10" rx="4" fill="#11181d"/>' +
'<path d="M73 100q10-8 20-2M107 98q10-6 20 2" stroke="#1b1614" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="84" cy="113" rx="6" ry="4.2" fill="#f7f1e6"/><ellipse cx="116" cy="113" rx="6" ry="4.2" fill="#f7f1e6"/>' +
'<circle cx="85" cy="113" r="3" fill="#1b1512"/><circle cx="117" cy="113" r="3" fill="#1b1512"/>' +
'<path d="M100 113q-7 14 0 18q5 2 8-2" stroke="#74482d" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
'<path d="M88 141q12-5 24 0" stroke="#5a2f22" stroke-width="3.2" fill="none" stroke-linecap="round"/>' +
'<g stroke="#bff3ff" stroke-width="1" opacity=".1"><path d="M0 20h200M0 44h200M0 68h200M0 92h200M0 116h200M0 140h200M0 164h200M0 188h200M0 212h200M0 236h200"/></g>' +
'</symbol>' +
'</defs></svg>';

window.CAST = {
  keel: { id: 'ch-keel', who: 'Keel',             role: 'Station computer · Keeling Station', bg: '#0b161f' },
  wren: { id: 'ch-wren', who: 'Dr Wunmi Adeyemi',  role: 'Biologist · calling from the lander, on the ice', bg: '#123a44' }
};
window.FACE = function (k) {
  var c = window.CAST[k];
  return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:' + c.bg + '"><use href="#' + c.id + '"/></svg>';
};
