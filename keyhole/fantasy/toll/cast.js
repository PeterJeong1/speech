/* The people of "The Keeper Gives No Change" (one of them is a troll, and one is a cockerel), as busts of 200 x 260
   without a background, so that the same drawing can sit in a scene (in a hatch, behind a table) and in the panel
   of a talk. FACE('spandrel') gives the bust on its own colour, for ER.talk. */
(function () {
  /* Bugle: a small round cockerel. hood = in the leather hood that the knight made him; crow = telling everybody */
  function bugle(mode) {
    var s = '<path d="M26 58q-22-14-22-40q14 6 22 20q-2-18 8-30q8 16 4 34z" fill="#1f3a34"/>' +
      '<path d="M22 52q-14-18-8-36M30 48q-6-20 2-34" stroke="#3f6a5a" stroke-width="2" fill="none"/>' +
      '<ellipse cx="50" cy="70" rx="30" ry="25" fill="#b8552a"/><path d="M34 64q14 14 34 6q-8 20-28 14z" fill="#8f3d1c"/>' +
      '<path d="M44 94v11M58 94v11" stroke="#d8a23a" stroke-width="3.5" stroke-linecap="round"/><path d="M38 106h12M52 106h12" stroke="#d8a23a" stroke-width="3" stroke-linecap="round"/>';
    if (mode === 'crow') return s + '<path d="M60 58q-4-30 10-44q14 6 14 22q-4 20-24 22z" fill="#d9a03c"/>' +
      '<circle cx="78" cy="16" r="11" fill="#c9762e"/><path d="M66 12q-2-10 5-8q0-8 7-4q5-6 8 4z" fill="#c9281c"/><path d="M84 24q7 6 4 12q-7-2-8-10z" fill="#c9281c"/>' +
      '<path d="M86 8l12-7-7 11zM88 16l12 3-11 4z" fill="#e2b23a"/><circle cx="79" cy="14" r="2.300" fill="#1d1410"/>';
    s += '<path d="M62 56q0-22 14-26q12 4 10 22q-6 12-24 4z" fill="#d9a03c"/>';
    if (mode === 'hood') return s + '<path d="M64 36q2-18 14-18q12 0 12 16q0 6-4 8h-18q-4-2-4-6z" fill="#5a3a22"/><path d="M68 42h18" stroke="#3a2412" stroke-width="2"/>' +
      '<path d="M78 18q-2-8 4-10q0 6-1 10z" fill="#b3261c"/><path d="M90 32l8 3-8 3z" fill="#e2b23a"/>';
    return s + '<circle cx="78" cy="30" r="12" fill="#c9762e"/><path d="M68 20q2-10 8-6q2-8 8-2q6-4 6 6z" fill="#c9281c"/><path d="M86 36q4 8 0 12q-5-4-3-11z" fill="#c9281c"/>' +
      '<path d="M89 28l10 4-10 4z" fill="#e2b23a"/><circle cx="81" cy="28" r="2.400" fill="#1d1410"/><circle cx="81.800" cy="27.300" r=".800" fill="#fff"/>';
  }

  window.CAST_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>' +

    /* Spandrel, Keeper of Stickle Bridge: the size of a haystack and the colour of the bridge */
    '<symbol id="ch-spandrel" viewBox="0 0 200 260">' +
    '<path d="M-6 260Q-4 186 34 168L66 154H134L166 168Q204 186 206 260Z" fill="#4a2d3f"/>' +
    '<path d="M72 156L100 214L128 156Z" fill="#e9dfc6"/><path d="M72 156L100 214L84 260H50Z" fill="#5a3850"/><path d="M128 156L100 214L116 260H150Z" fill="#3d2434"/>' +
    '<circle cx="100" cy="230" r="6" fill="#d8b150"/><circle cx="100" cy="250" r="6" fill="#7fa7c9"/><circle cx="64" cy="228" r="5" fill="#c9553f"/><circle cx="138" cy="234" r="5.500" fill="#e9dfc6"/>' +
    '<g fill="#2a1a24"><circle cx="98.500" cy="230" r="1"/><circle cx="101.500" cy="230" r="1"/><circle cx="98.500" cy="250" r="1"/><circle cx="101.500" cy="250" r="1"/></g>' +
    '<path d="M40 92Q6 60 4 100Q10 124 44 116Z" fill="#7d8674"/><path d="M160 92Q194 60 196 100Q190 124 156 116Z" fill="#7d8674"/>' +
    '<path d="M34 96Q16 82 14 100Q18 112 36 108Z" fill="#69715f"/><path d="M166 96Q184 82 186 100Q182 112 164 108Z" fill="#69715f"/>' +
    '<path d="M38 96Q34 156 68 172Q100 186 132 172Q166 156 162 96Q160 30 100 28Q40 30 38 96Z" fill="#8f9785"/>' +
    '<path d="M162 96Q166 156 132 172Q118 178 104 180Q140 160 142 100Q142 50 112 30Q160 36 162 96Z" fill="#7b8372" opacity=".8"/>' +
    '<path d="M46 62Q60 24 100 24Q140 24 154 62Q140 44 126 52Q114 36 100 48Q86 34 74 50Q60 44 46 62Z" fill="#5e7a45"/>' +
    '<path d="M60 44q6-14 12-2M92 34q6-14 12 0M124 40q8-12 12 2" stroke="#7c9a58" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M52 128l8 10-4 12M146 120l-7 9 5 9" stroke="#5f6757" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    '<path d="M50 86Q72 68 94 82M106 82Q128 68 150 86" stroke="#4a5244" stroke-width="9" fill="none" stroke-linecap="round"/>' +
    '<ellipse cx="76" cy="100" rx="8" ry="6" fill="#efe9d6"/><ellipse cx="124" cy="100" rx="8" ry="6" fill="#efe9d6"/><circle cx="77" cy="100" r="3.600" fill="#262a1f"/><circle cx="125" cy="100" r="3.600" fill="#262a1f"/>' +
    '<circle cx="76" cy="101" r="15" fill="#fff" fill-opacity=".14" stroke="#d8b150" stroke-width="3"/><circle cx="124" cy="101" r="15" fill="#fff" fill-opacity=".14" stroke="#d8b150" stroke-width="3"/>' +
    '<path d="M91 99q9-7 18 0M61 99L42 92M139 99L158 92" stroke="#d8b150" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M100 96Q80 134 90 144Q100 152 110 144Q120 134 100 96Z" fill="#7d8674"/><path d="M92 142q3 3 6 0M102 142q3 3 6 0" stroke="#565e4e" stroke-width="2.200" fill="none" stroke-linecap="round"/>' +
    '<path d="M66 158Q100 168 134 158" stroke="#40473a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M74 160l5-13 6 14zM115 161l6-14 5 13z" fill="#efe6cf"/>' +
    '<path d="M158 78L190 10q10 16-2 40z" fill="#f4efe2"/><path d="M158 78L186 22" stroke="#b9b3a2" stroke-width="1.600"/>' +
    '</symbol>' +

    /* Mistress Hesper Tamsel: nine years in the toll-house, on a matter of principle */
    '<symbol id="ch-tamsel" viewBox="0 0 200 260">' +
    '<path d="M14 260Q18 206 52 192L82 180H118L148 192Q182 206 186 260Z" fill="#56705f"/>' +
    '<path d="M64 188L100 240L136 188Q100 206 64 188Z" fill="#6f8a77"/><path d="M100 240V260" stroke="#3f5546" stroke-width="3"/><circle cx="100" cy="226" r="6" fill="#d8b150"/>' +
    '<rect x="88" y="150" width="24" height="36" fill="#d6ab8a"/>' +
    '<ellipse cx="61" cy="112" rx="6" ry="9" fill="#dcb393"/><ellipse cx="139" cy="112" rx="6" ry="9" fill="#dcb393"/>' +
    '<ellipse cx="100" cy="110" rx="40" ry="46" fill="#e8c3a4"/>' +
    '<path d="M60 108q-2-16 8-26l2 26zM140 108q2-16-8-26l-2 26z" fill="#b9b9b2"/>' +
    '<path d="M56 100Q50 46 100 42Q150 46 144 100Q136 76 100 72Q64 76 56 100Z" fill="#f4f0e6"/>' +
    '<g fill="#fffdf6"><circle cx="62" cy="92" r="8"/><circle cx="72" cy="80" r="8"/><circle cx="86" cy="73" r="8"/><circle cx="100" cy="71" r="8"/><circle cx="114" cy="73" r="8"/><circle cx="128" cy="80" r="8"/><circle cx="138" cy="92" r="8"/></g>' +
    '<path d="M70 60q30-12 60 0" stroke="#d9d3c2" stroke-width="2.500" fill="none"/>' +
    '<path d="M74 102q10-6 20 0M106 102q10-6 20 0" stroke="#8a7f72" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<circle cx="84" cy="112" r="3.400" fill="#2b2620"/><circle cx="116" cy="112" r="3.400" fill="#2b2620"/>' +
    '<path d="M100 112q-5 14 1 18q4 1 6-2" stroke="#b98f70" stroke-width="2.400" fill="none" stroke-linecap="round"/>' +
    '<path d="M86 138q14 8 28-2" stroke="#8a4a3c" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<circle cx="72" cy="126" r="8" fill="#e08a7a" opacity=".3"/><circle cx="128" cy="126" r="8" fill="#e08a7a" opacity=".3"/>' +
    '<path d="M70 118l-6-3M130 118l6-3M72 132q4 6 10 8M128 132q-4 6-10 8" stroke="#c99a7c" stroke-width="1.800" fill="none" stroke-linecap="round"/>' +
    '<path d="M118 212h70v48h-70z" fill="#b3261c"/><path d="M118 224h70M118 236h70M118 248h70" stroke="#8f1d16" stroke-width="2"/><path d="M130 212v48M144 212v48M158 212v48M172 212v48" stroke="#c9453a" stroke-width="1.400"/>' +
    '<path d="M106 204L194 216" stroke="#e3cf9f" stroke-width="4.500" stroke-linecap="round"/><circle cx="105" cy="204" r="4.500" fill="#e3cf9f"/>' +
    '</symbol>' +

    /* Sir Osric Maundrel, knight errant: a great deal of armour, and no purse */
    '<symbol id="ch-osric" viewBox="0 0 200 260">' +
    '<path d="M-2 260Q2 200 42 184L76 172H124L158 184Q198 200 202 260Z" fill="#9aa3ad"/>' +
    '<ellipse cx="36" cy="212" rx="42" ry="30" fill="#b9c1ca"/><ellipse cx="164" cy="212" rx="42" ry="30" fill="#b9c1ca"/>' +
    '<path d="M4 206q32-22 64 0M132 206q32-22 64 0" stroke="#e6ebf0" stroke-width="3" fill="none"/>' +
    '<path d="M70 176Q100 204 130 176L134 198Q100 228 66 198Z" fill="#c9d0d8"/><path d="M66 198Q100 228 134 198" stroke="#7d858f" stroke-width="2.500" fill="none"/>' +
    '<path d="M100 226V260" stroke="#7d858f" stroke-width="3"/><g fill="#6f7781"><circle cx="84" cy="240" r="3"/><circle cx="116" cy="240" r="3"/></g>' +
    '<rect x="89" y="146" width="22" height="34" fill="#d9b796"/>' +
    '<ellipse cx="68" cy="100" rx="5" ry="10" fill="#dcba98"/><ellipse cx="132" cy="100" rx="5" ry="10" fill="#dcba98"/>' +
    '<path d="M70 96Q68 150 100 160Q132 150 130 96Q128 44 100 42Q72 44 70 96Z" fill="#ead0b0"/>' +
    '<path d="M70 86Q70 42 100 40Q130 42 130 86Q120 62 100 60Q80 62 70 86Z" fill="#b98a4a"/><path d="M90 62q10-8 20 0" stroke="#d0a465" stroke-width="2.500" fill="none"/>' +
    '<path d="M76 84q10-9 20-3M104 81q10-6 20 3" stroke="#9a7038" stroke-width="3.500" fill="none" stroke-linecap="round"/>' +
    '<path d="M78 96h16M106 96h16" stroke="#c9a583" stroke-width="3" stroke-linecap="round"/>' +
    '<circle cx="86" cy="100" r="3.200" fill="#3a4a5c"/><circle cx="114" cy="100" r="3.200" fill="#3a4a5c"/>' +
    '<path d="M100 98q-8 30 0 36q6 2 9-3" stroke="#bd9670" stroke-width="2.600" fill="none" stroke-linecap="round"/>' +
    '<path d="M100 138q-16-8-32 12q18 0 32-6q14 6 32 6q-16-20-32-12z" fill="#b98a4a"/>' +
    '<path d="M92 152q8 4 16 0" stroke="#8a5a44" stroke-width="2.400" fill="none" stroke-linecap="round"/>' +
    '</symbol>' +

    /* Jem Wickett, pedlar: everything is for sale, and nobody has a penny */
    '<symbol id="ch-wickett" viewBox="0 0 200 260">' +
    '<path d="M12 260Q16 206 52 192L82 180H118L148 192Q184 206 188 260Z" fill="#6b4f2e"/>' +
    '<path d="M56 190L150 262" stroke="#33230f" stroke-width="12"/><path d="M144 190L50 262" stroke="#33230f" stroke-width="12"/>' +
    '<path d="M78 178L100 212L122 178Q100 192 78 178Z" fill="#b3261c"/><g fill="#f6e9d4"><circle cx="92" cy="190" r="2"/><circle cx="104" cy="196" r="2"/><circle cx="110" cy="186" r="2"/></g>' +
    '<rect x="89" y="150" width="22" height="34" fill="#c89a72"/>' +
    '<ellipse cx="66" cy="104" rx="5" ry="9" fill="#cfa07a"/><ellipse cx="134" cy="104" rx="5" ry="9" fill="#cfa07a"/>' +
    '<path d="M68 98Q66 142 100 162Q134 142 132 98Q130 62 100 60Q70 62 68 98Z" fill="#dcae86"/>' +
    '<ellipse cx="100" cy="72" rx="74" ry="15" fill="#3f331f"/><path d="M62 72Q62 22 100 20Q138 22 138 72Z" fill="#54452b"/><path d="M62 62h76v10H62z" fill="#8a2a1c"/>' +
    '<path d="M132 60l14-30 6 4-12 30z" fill="#d8b150"/>' +
    '<path d="M74 96q10-8 20-2M106 94q10-6 20 2" stroke="#5a3f24" stroke-width="3.200" fill="none" stroke-linecap="round"/>' +
    '<circle cx="85" cy="104" r="3.400" fill="#23201a"/><circle cx="115" cy="104" r="3.400" fill="#23201a"/><circle cx="86" cy="103" r="1.200" fill="#fff"/><circle cx="116" cy="103" r="1.200" fill="#fff"/>' +
    '<path d="M72 106l-6-4M72 110l-7 1M128 106l6-4M128 110l7 1" stroke="#b98a64" stroke-width="1.600" stroke-linecap="round"/>' +
    '<path d="M100 102l-8 24h14" stroke="#b08660" stroke-width="2.600" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M80 134Q100 154 120 134Q100 142 80 134Z" fill="#fbf6ea"/><path d="M80 134Q100 154 120 134" stroke="#7a3a2a" stroke-width="2.600" fill="none" stroke-linecap="round"/>' +
    '<g fill="#8a6a4a" opacity=".6"><circle cx="82" cy="148" r="1.300"/><circle cx="90" cy="154" r="1.300"/><circle cx="100" cy="157" r="1.300"/><circle cx="110" cy="154" r="1.300"/><circle cx="118" cy="148" r="1.300"/><circle cx="95" cy="149" r="1.300"/><circle cx="106" cy="149" r="1.300"/></g>' +
    '</symbol>' +

    /* Bryony Thistledown, poultry-girl: ten hens at the gate, one now */
    '<symbol id="ch-bryony" viewBox="0 0 200 260">' +
    '<path d="M24 260Q28 212 58 198L84 186H116L142 198Q172 212 176 260Z" fill="#7a5a3a"/>' +
    '<path d="M80 200h40v60H80z" fill="#efe6cf"/><path d="M80 200L64 190M120 200L136 190" stroke="#efe6cf" stroke-width="7" stroke-linecap="round"/>' +
    '<rect x="89" y="152" width="22" height="38" fill="#dbb090"/>' +
    '<ellipse cx="62" cy="116" rx="5" ry="9" fill="#e0b596"/><ellipse cx="138" cy="116" rx="5" ry="9" fill="#e0b596"/>' +
    '<ellipse cx="100" cy="114" rx="38" ry="42" fill="#ecc7a8"/>' +
    '<path d="M64 126Q52 170 60 214M136 126Q148 170 140 214" stroke="#8a4b22" stroke-width="13" fill="none" stroke-linecap="round"/>' +
    '<path d="M57 146l12 6M55 164l12 6M55 182l12 6M56 200l12 5M143 146l-12 6M145 164l-12 6M145 182l-12 6M144 200l-12 5" stroke="#6b3716" stroke-width="2.400" stroke-linecap="round"/>' +
    '<path d="M54 214h13l-6 14zM133 214h13l-7 14z" fill="#3f6a8a"/>' +
    '<path d="M60 108Q54 58 100 56Q146 58 140 108Q130 82 100 80Q70 82 60 108Z" fill="#3f6a8a"/><path d="M66 78q34-14 68 0" stroke="#5f8aaa" stroke-width="2.500" fill="none"/>' +
    '<path d="M66 100q6-12 16-14M134 100q-6-12-16-14" stroke="#8a4b22" stroke-width="6" fill="none" stroke-linecap="round"/>' +
    '<path d="M76 104l16 4M124 104l-16 4" stroke="#6b3716" stroke-width="3.200" stroke-linecap="round"/>' +
    '<ellipse cx="85" cy="116" rx="5" ry="5.500" fill="#fbf6ea"/><ellipse cx="115" cy="116" rx="5" ry="5.500" fill="#fbf6ea"/><circle cx="86" cy="117" r="3.200" fill="#3a2a1a"/><circle cx="116" cy="117" r="3.200" fill="#3a2a1a"/>' +
    '<path d="M100 116q-4 10 0 13" stroke="#c49a7a" stroke-width="2.200" fill="none" stroke-linecap="round"/>' +
    '<path d="M90 142q10-5 20 0" stroke="#9a4a3c" stroke-width="2.800" fill="none" stroke-linecap="round"/>' +
    '<g fill="#b8805a" opacity=".7"><circle cx="78" cy="128" r="1.500"/><circle cx="84" cy="132" r="1.500"/><circle cx="72" cy="133" r="1.500"/><circle cx="122" cy="128" r="1.500"/><circle cx="116" cy="132" r="1.500"/><circle cx="128" cy="133" r="1.500"/><circle cx="100" cy="124" r="1.300"/></g>' +
    '</symbol>' +

    '<symbol id="ch-bugle-h" viewBox="0 0 100 110">' + bugle('hood') + '</symbol>' +
    '<symbol id="ch-bugle" viewBox="0 0 100 110">' + bugle('') + '</symbol>' +
    '<symbol id="ch-bugle-c" viewBox="0 0 100 110">' + bugle('crow') + '</symbol>' +
    '</defs></svg>';

  window.CAST = {
    spandrel: { id: 'ch-spandrel', who: 'Spandrel', role: 'Keeper of Stickle Bridge · a troll', bg: '#3a3a4a' },
    tamsel: { id: 'ch-tamsel', who: 'Mistress Tamsel', role: 'Nine years in the toll-house', bg: '#4a2a1e' },
    osric: { id: 'ch-osric', who: 'Sir Osric Maundrel', role: 'Knight errant · a fortnight in the toll-house', bg: '#3a2f3a' },
    wickett: { id: 'ch-wickett', who: 'Jem Wickett', role: 'Pedlar · five days in the toll-house', bg: '#3f3020' },
    bryony: { id: 'ch-bryony', who: 'Bryony Thistledown', role: 'Poultry-girl · three weeks in the toll-house', bg: '#3a3324' }
  };
  window.FACE = function (k, bg) {
    var c = window.CAST[k];
    return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:' + (bg || c.bg) + '"><use href="#' + c.id + '"/></svg>';
  };
})();
