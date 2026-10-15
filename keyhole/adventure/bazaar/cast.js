/* The people of "The Third Arch After the Fountain", as busts of 200 x 260, drawn from a short list of features each.
   FACE('hob' | 'nim' | 'veck' | 'brill' | 'neva' | 'dabb' | 'tansy' | 'zeb' | 'mungo' | 'laurent' | 'solheim' | 'holt' | 'jory') */
window.FACE = (function () {
  var P = {
    /* Hob Trundle, porter at the Salt Gate: a straw hat, a moustache, and a waistcoat with thirty years of other people's luggage on it */
    hob: { bg: '#d9b77e', skin: '#b07a4e', coat: '#6b4a2a', shirt: '#eadfc4', hair: '#4a3626', top: 'straw', face: ['tache', 'smile'] },
    /* Nim, money-changer: bald, a green eyeshade, small round glasses, and no expression that could be given a price */
    nim: { bg: '#8a2f22', skin: '#c99a6e', coat: '#2c3a34', shirt: '#eadfc4', hair: '#8f8f8f', top: 'shade', face: ['glasses', 'flat'] },
    /* Mistress Veck, scale-maker: grey hair in a knot, spectacles pushed up into it, a leather apron */
    veck: { bg: '#3a2c1c', skin: '#b98558', coat: '#5a4030', shirt: '#cfc3a4', hair: '#9b9b98', top: 'bun', face: ['loupe', 'flat', 'lines'], extra: 'apron' },
    /* Mr Brill, of Vecks Old Shop: a red waistcoat, a moustache with points, and the smile of a man with something to sell you */
    brill: { bg: '#a8322a', skin: '#e2bc94', coat: '#b8322a', shirt: '#fbf3d9', hair: '#1f1a16', top: 'slick', face: ['curl', 'grin'] },
    /* Neva, bird-woman: a long plait, and a finch that has decided her shoulder is a branch */
    neva: { bg: '#7fa9b8', skin: '#8a5a36', coat: '#3f7a5a', shirt: '#e9dfc4', hair: '#1c1410', top: 'plait', face: ['smile'], extra: 'finch' },
    /* Dabb, lemon-seller: a wide straw hat and a yellow apron */
    dabb: { bg: '#e6cf74', skin: '#c99a6e', coat: '#e2b521', shirt: '#f6f0da', hair: '#5a4426', top: 'straw', face: ['grin'] },
    /* Tansy, dyer: a blue headscarf, and hands that have not been skin-coloured for years */
    tansy: { bg: '#2f5fa8', skin: '#6b4423', coat: '#22407a', shirt: '#b8322a', hair: '#2f5fa8', top: 'scarf', face: ['smile', 'lines'] },
    /* Zeb, barber: no hair of his own, a great deal of beard, a striped apron */
    zeb: { bg: '#cfd9d6', skin: '#b98558', coat: '#f1ecdf', shirt: '#f1ecdf', hair: '#2a2420', top: 'bald', face: ['beard', 'smile'], extra: 'stripes' },
    /* Mungo, tinker: a flat cap, and spectacles that he has mended himself */
    mungo: { bg: '#8a7a5a', skin: '#e2bc94', coat: '#4a4a56', shirt: '#b89a72', hair: '#8f8f8f', top: 'cap', face: ['glasses', 'flat', 'lines'] },
    /* Odile Laurent, pathfinder of the Blue Caravan: a wide travelling hat, a blue sash, and a yellow umbrella */
    laurent: { bg: '#e9d9a8', skin: '#e8c4a2', coat: '#3a3a44', shirt: '#2f5fa8', hair: '#6b3a1e', top: 'brim', face: ['smile'], extra: 'umbrella' },
    /* Master Astrid Solheim, of the Solheim caravan: a red coat, pale hair cut short, a face the colour of the salt wind */
    solheim: { bg: '#f1ead8', skin: '#d9a888', coat: '#a8322a', shirt: '#eadfc4', hair: '#e2d6b0', top: 'crop', face: ['flat', 'lines'] },
    /* Yardmaster Holt: grey, a pencil behind one ear, and a ledger that is never shut */
    holt: { bg: '#b9c4c9', skin: '#8a5a36', coat: '#2f4a6b', shirt: '#eadfc4', hair: '#b5b5b0', top: 'crop', face: ['flat', 'pencil'] },
    /* Jory, the money-changer's runner: ten years old, one tooth short, and faster than you */
    jory: { bg: '#d9b77e', skin: '#b07a4e', coat: '#c96a2b', shirt: '#eadfc4', hair: '#2a1c12', top: 'tuft', face: ['grin', 'gap'], small: 1 }
  };
  function has(p, k) { return p.face.indexOf(k) >= 0; }
  return function (who) {
    var p = P[who] || P.hob, s = '', sk = p.skin, dk = 'rgba(40,20,10,.45)';
    s += '<rect width="200" height="260" fill="' + p.bg + '"/><circle cx="150" cy="54" r="76" fill="#fff" opacity=".1"/>';
    if (p.extra === 'umbrella') s += '<path d="M168 260L176 40" stroke="#6b4a2a" stroke-width="5" stroke-linecap="round"/><path d="M160 60q14 -50 20 -4l-6 150q-6 6 -12 0z" fill="#e8b81f"/><path d="M170 46v170" stroke="#b98c10" stroke-width="2"/>';
    if (p.top === 'plait') s += '<path d="M132 120q26 30 14 110" stroke="' + p.hair + '" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M138 150l12 6M142 180l12 4M144 206l10 2" stroke="#3a2a1c" stroke-width="2"/>';
    if (p.top === 'scarf') s += '<path d="M48 110Q40 40 100 36Q160 40 152 110Q158 170 136 196H64Q42 170 48 110Z" fill="' + p.hair + '"/>';
    s += '<g' + (p.small ? ' transform="translate(12 30) scale(.88)"' : '') + '>';
    s += '<path d="M2 260Q4 204 44 190L84 174H116L156 190Q196 204 198 260Z" fill="' + p.coat + '"/><path d="M82 174L100 210L118 174Z" fill="' + p.shirt + '"/>';
    if (p.extra === 'apron') s += '<path d="M62 200h76v60H62z" fill="#7a5632"/><path d="M62 200l22 -26M138 200l-22 -26" stroke="#7a5632" stroke-width="6"/><rect x="92" y="216" width="30" height="20" fill="#5a3f22"/>';
    if (p.extra === 'stripes') s += '<path d="M60 196h80v64H60z" fill="#f6f3ea"/><path d="M70 196v64M86 196v64M102 196v64M118 196v64M134 196v64" stroke="#b8322a" stroke-width="5"/>';
    if (who === 'laurent') s += '<path d="M30 214q70 26 140 0v14q-70 26 -140 0z" fill="#2f5fa8"/>';
    if (who === 'brill') s += '<circle cx="100" cy="222" r="4" fill="#e8b81f"/><circle cx="100" cy="242" r="4" fill="#e8b81f"/>';
    s += '<rect x="87" y="142" width="26" height="40" fill="' + sk + '"/><path d="M87 164q13 10 26 0v18h-26z" fill="' + dk + '" opacity=".35"/>';
    s += '<ellipse cx="59" cy="112" rx="6" ry="10" fill="' + sk + '"/><ellipse cx="141" cy="112" rx="6" ry="10" fill="' + sk + '"/>';
    s += '<path d="M61 98Q60 60 100 58Q140 60 139 98Q142 134 119 152Q100 160 81 152Q58 134 61 98Z" fill="' + sk + '"/>';
    /* hair and hats */
    if (p.top === 'bun' || p.top === 'slick' || p.top === 'crop' || p.top === 'tuft' || p.top === 'plait' || p.top === 'brim' || p.top === 'cap' || p.top === 'straw')
      s += '<path d="M57 102Q50 50 100 46Q150 50 143 102Q137 ' + (p.top === 'crop' || p.top === 'tuft' ? 80 : 72) + ' 100 ' + (p.top === 'slick' ? 66 : 72) + 'Q63 ' + (p.top === 'crop' || p.top === 'tuft' ? 80 : 72) + ' 57 102Z" fill="' + p.hair + '"/>';
    if (p.top === 'bun') s += '<circle cx="100" cy="42" r="14" fill="' + p.hair + '"/>';
    if (p.top === 'tuft') s += '<path d="M84 50l4 -16 8 14 6 -18 6 18 8 -12 2 16z" fill="' + p.hair + '"/>';
    if (p.top === 'slick') s += '<path d="M70 58q30 -14 62 2" stroke="#4a4038" stroke-width="2" fill="none"/>';
    if (p.top === 'bald' || p.top === 'shade') s += '<path d="M58 104q-2 -14 4 -22l4 26zM142 104q2 -14 -4 -22l-4 26z" fill="' + p.hair + '"/>';
    if (p.top === 'shade') s += '<path d="M56 84q44 -22 88 0l10 14q-54 -18 -108 0z" fill="#3f7a5a"/><path d="M58 82q42 -30 84 0" stroke="#22201c" stroke-width="5" fill="none"/>';
    if (p.top === 'straw') s += '<ellipse cx="100" cy="70" rx="84" ry="15" fill="#d9b05a"/><path d="M64 68q0 -40 36 -40t36 40z" fill="#e6c373"/><path d="M64 64q36 10 72 0" stroke="#8a2f22" stroke-width="5" fill="none"/><path d="M30 70q70 16 140 0" stroke="#b08c3a" stroke-width="2" fill="none"/>';
    if (p.top === 'cap') s += '<path d="M58 80q4 -34 42 -34t42 34z" fill="#3a3a44"/><path d="M52 80q24 -10 60 -6l-8 12q-30 -6 -52 4z" fill="#2a2a32"/>';
    if (p.top === 'brim') s += '<ellipse cx="100" cy="72" rx="78" ry="12" fill="#3a3a44"/><path d="M66 70q2 -36 34 -36t34 36z" fill="#4a4a56"/><path d="M66 66q34 8 68 0" stroke="#2f5fa8" stroke-width="5" fill="none"/>';
    if (p.top === 'scarf') s += '<path d="M56 108Q50 52 100 48Q150 52 144 108Q140 76 100 72Q60 76 56 108Z" fill="' + p.hair + '"/><path d="M60 78q40 -14 80 0" stroke="#1c2f5a" stroke-width="2" fill="none"/>';
    /* the face */
    s += '<path d="M70 103q10 -6 21 -2M109 101q11 -4 21 2" stroke="' + (p.top === 'scarf' || p.top === 'bald' || p.top === 'shade' ? '#3a2a1c' : p.hair) + '" stroke-width="3.200" fill="none" stroke-linecap="round"/>';
    s += '<ellipse cx="82" cy="114" rx="6" ry="4.200" fill="#f7f1e6"/><ellipse cx="118" cy="114" rx="6" ry="4.200" fill="#f7f1e6"/><circle cx="83" cy="114" r="3" fill="#2a1a12"/><circle cx="119" cy="114" r="3" fill="#2a1a12"/>';
    s += '<path d="M101 114q-7 16 -2 21q7 2 9 -3" stroke="' + dk + '" stroke-width="2.800" fill="none" stroke-linecap="round"/>';
    if (has(p, 'lines')) s += '<path d="M68 120q5 4 10 3M122 123q5 1 10 -3M77 131q-3 8 2 14M123 131q3 8 -2 14" stroke="' + dk + '" stroke-width="1.700" fill="none"/>';
    if (has(p, 'beard')) s += '<path d="M62 120q-2 60 38 66q40 -6 38 -66q-8 26 -38 22q-30 4 -38 -22z" fill="' + p.hair + '"/>';
    if (has(p, 'grin')) s += '<path d="M83 139q17 14 35 -1q-17 4 -35 1z" fill="#f7f1e6" stroke="#7a3f30" stroke-width="2.400" stroke-linejoin="round"/>';
    else if (has(p, 'smile')) s += '<path d="M86 141q14 9 28 0" stroke="#7a3f30" stroke-width="3" fill="none" stroke-linecap="round"/>';
    else s += '<path d="M87 143h26" stroke="#7a3f30" stroke-width="3" stroke-linecap="round"/>';
    if (has(p, 'gap')) s += '<rect x="97" y="140" width="5" height="5" fill="#5a2a22"/>';
    if (has(p, 'tache')) s += '<path d="M80 136q10 -8 20 -2q10 -6 20 2q-10 4 -20 0q-10 4 -20 0z" fill="' + p.hair + '"/>';
    if (has(p, 'curl')) s += '<path d="M100 134q-14 -6 -24 2q-6 4 -10 -4M100 134q14 -6 24 2q6 4 10 -4" stroke="' + p.hair + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
    if (has(p, 'glasses')) s += '<g fill="none" stroke="#4a4a56" stroke-width="2.400"><circle cx="82" cy="114" r="11.500"/><circle cx="118" cy="114" r="11.500"/><path d="M93.500 113h13M70.500 112l-10 -3M129.500 112l10 -3"/></g>';
    if (has(p, 'loupe')) s += '<g fill="#cfe1e6" fill-opacity=".5" stroke="#6b5326" stroke-width="2.400"><circle cx="84" cy="70" r="10"/><circle cx="116" cy="70" r="10"/><path d="M94 70h12" fill="none"/></g>';
    if (has(p, 'pencil')) s += '<path d="M144 96l14 -30" stroke="#e8b017" stroke-width="4" stroke-linecap="round"/><path d="M158 66l3 -6" stroke="#22201c" stroke-width="4" stroke-linecap="round"/>';
    s += '</g>';
    if (p.extra === 'finch') s += '<g transform="translate(36 176)"><ellipse cx="0" cy="0" rx="13" ry="10" fill="#e2b521"/><circle cx="-9" cy="-9" r="7" fill="#e2b521"/><path d="M-16 -9l-8 2 8 3z" fill="#c8402c"/><circle cx="-11" cy="-10" r="1.500" fill="#22201c"/><path d="M8 2l14 8" stroke="#b08c10" stroke-width="5" stroke-linecap="round"/></g>';
    return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:' + p.bg + '">' + s + '</svg>';
  };
})();
