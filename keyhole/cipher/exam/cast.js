/* The one face of "Answer All Questions": everybody else in the story is known by what they write.
   A bust of 200 x 260, used in the last room only. */
window.CAST_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>' +
'<symbol id="ch-teacher" viewBox="0 0 200 260">' +
'<rect width="200" height="260" fill="#16241b"/>' +
'<path d="M132 0h68v260h-68z" fill="#ffe9a8" opacity=".16"/><path d="M132 0v260" stroke="#3d2916" stroke-width="6"/>' +
'<path d="M8 260Q10 206 46 192L82 178H118L154 192Q190 206 192 260Z" fill="#d9a22b"/>' +
'<path d="M80 178L100 222L120 178Z" fill="#f3eedf"/>' +
'<path d="M80 178L95 244M120 178L105 244" stroke="#a87a16" stroke-width="5" stroke-linecap="round" fill="none"/>' +
'<g fill="#a87a16"><circle cx="100" cy="232" r="3.5"/><circle cx="100" cy="248" r="3.5"/></g>' +
'<rect x="87" y="142" width="26" height="44" fill="#7a4d33"/>' +
'<path d="M87 168q13 10 26 0v18h-26z" fill="#6a4029" opacity=".6"/>' +
'<ellipse cx="57" cy="110" rx="6" ry="10" fill="#8a5a3c"/><ellipse cx="143" cy="110" rx="6" ry="10" fill="#8a5a3c"/>' +
'<circle cx="57" cy="124" r="3.4" fill="#f4e04d"/><circle cx="143" cy="124" r="3.4" fill="#f4e04d"/>' +
'<ellipse cx="100" cy="105" rx="42" ry="50" fill="#99653f"/>' +
'<path d="M62 126Q72 155 100 155Q128 155 138 126Q126 149 100 150Q74 149 62 126Z" fill="#7e5030" opacity=".45"/>' +
'<g fill="#1b1614"><circle cx="100" cy="28" r="31"/><circle cx="74" cy="40" r="21"/><circle cx="126" cy="40" r="21"/><circle cx="100" cy="46" r="24"/>' +
'<path d="M57 104Q54 58 100 54Q146 58 143 104Q130 76 100 74Q70 76 57 104Z"/></g>' +
'<path d="M61 80Q100 54 139 80" stroke="#c8281d" stroke-width="8" fill="none" stroke-linecap="round"/>' +
'<path d="M147 78L163 126" stroke="#f4e04d" stroke-width="6" stroke-linecap="round"/><path d="M163 126l4 10-9-5z" fill="#1b1614"/><path d="M147 78l-2-7" stroke="#e89a9a" stroke-width="6" stroke-linecap="round"/>' +
'<path d="M72 98q11-8 22-2M106 96q11-6 22 2" stroke="#1b1614" stroke-width="3.6" fill="none" stroke-linecap="round"/>' +
'<ellipse cx="84" cy="112" rx="6.5" ry="4.6" fill="#f7f1e6"/><ellipse cx="116" cy="112" rx="6.5" ry="4.6" fill="#f7f1e6"/>' +
'<circle cx="85" cy="112" r="3.2" fill="#1b1512"/><circle cx="117" cy="112" r="3.2" fill="#1b1512"/><circle cx="86" cy="111" r="1" fill="#fff"/><circle cx="118" cy="111" r="1" fill="#fff"/>' +
'<path d="M100 112q-7 15 0 19q5 2 8-2" stroke="#74482d" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
'<path d="M87 141q13 7 27-1" stroke="#5a2f22" stroke-width="3.4" fill="none" stroke-linecap="round"/>' +
'<path d="M26 228h148v32H26z" fill="#b08a5a"/><path d="M26 228h148" stroke="#86683f" stroke-width="5"/><path d="M26 228l-10-12h60l8 12zM174 228l10-12h-56l-8 12z" fill="#a17c4e"/>' +
'<rect x="60" y="236" width="80" height="20" fill="#fdfdf6"/><text x="100" y="251" text-anchor="middle" font-family="Oswald,sans-serif" font-weight="600" font-size="12" letter-spacing="2" fill="#c8281d">PAPER B</text>' +
'</symbol>' +
'</defs></svg>';

window.FACE = function () {
  return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:#16241b"><use href="#ch-teacher"/></svg>';
};
