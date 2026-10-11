/* The people of "The Eleventh Hour" (one of them is a jackdaw), as busts of 200 x 260 without a background, so that the
   same drawing can sit in a scene and in the panel of a talk. FACE('quillon') gives the bust on its own colour. */
(function () {
  /* Byword: a jackdaw. Black, with a grey nape and a pale eye, as jackdaws have. open = saying something */
  function daw(open) {
    return '<path d="M58 150q-34 30-52 78q30-8 54-40z" fill="#15161c"/>' +
      '<ellipse cx="96" cy="150" rx="56" ry="68" fill="#1d1f27"/><path d="M62 122q-18 44 6 86q26 22 56 6q-44-22-40-92z" fill="#2a2d38"/>' +
      '<path d="M76 196q20 14 44 4M70 176q24 16 52 6" stroke="#3a3e4c" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M84 214v30M112 214v30" stroke="#3a3530" stroke-width="6" stroke-linecap="round"/><path d="M70 246h28M98 246h28" stroke="#3a3530" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M64 96q0-44 42-46q40 2 44 40q2 30-26 44q-40 10-60-38z" fill="#8a909c"/>' +
      '<path d="M88 52q28-12 52 12q14 20 8 38q-30-26-64-22q-4-16 4-28z" fill="#1a1c23"/>' +
      (open ? '<path d="M144 78l44-8-40 16z" fill="#2a2d38"/><path d="M146 90l36 12-38 0z" fill="#22242c"/><path d="M148 86l26 4-26 2z" fill="#a8483a"/>'
        : '<path d="M144 78l46 10-44 10z" fill="#2a2d38"/><path d="M146 88h40" stroke="#14151a" stroke-width="2"/>') +
      '<circle cx="124" cy="80" r="11" fill="#e9eef6"/><circle cx="126" cy="80" r="5" fill="#101116"/><circle cx="128" cy="78" r="1.600" fill="#fff"/>';
  }

  window.CAST_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>' +

    /* Mistress Winifred Quillon, Clock-Warden: forty-one years, and an apron with one deep pocket */
    '<symbol id="ch-quillon" viewBox="0 0 200 260">' +
    '<path d="M10 260Q14 204 50 190L82 178H118L150 190Q186 204 190 260Z" fill="#4a3a6e"/>' +
    '<path d="M60 186Q100 214 140 186L150 260H50Z" fill="#5d4a88"/><path d="M70 206h60v54H70z" fill="#e9e0c9"/><path d="M70 206h60" stroke="#b9ad8f" stroke-width="3"/>' +
    '<path d="M84 224h34v30H84z" fill="#d9cfb4"/><path d="M84 224h34" stroke="#a89c7c" stroke-width="2.500"/>' +
    '<rect x="89" y="150" width="22" height="34" fill="#d3ad8f"/>' +
    '<ellipse cx="62" cy="110" rx="6" ry="9" fill="#d9b497"/><ellipse cx="138" cy="110" rx="6" ry="9" fill="#d9b497"/>' +
    '<path d="M62 104Q60 156 100 162Q140 156 138 104Q136 56 100 54Q64 56 62 104Z" fill="#e6c4a6"/>' +
    '<path d="M60 100Q52 50 100 44Q148 50 140 100Q130 70 100 68Q70 70 60 100Z" fill="#c9cbd2"/><circle cx="100" cy="36" r="19" fill="#b9bcc6"/><path d="M86 30q14-10 28 0" stroke="#9a9eaa" stroke-width="2.500" fill="none"/>' +
    '<path d="M100 24L104 8" stroke="#5d4a88" stroke-width="3" stroke-linecap="round"/><circle cx="104" cy="7" r="3.500" fill="#d8b150"/>' +
    '<path d="M72 98q10-7 20-1M108 97q10-6 20 1" stroke="#8a8490" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<circle cx="83" cy="110" r="3.300" fill="#2b2636"/><circle cx="117" cy="110" r="3.300" fill="#2b2636"/>' +
    '<rect x="70" y="100" width="26" height="19" rx="6" fill="#fff" fill-opacity=".14" stroke="#d8b150" stroke-width="2.600"/><rect x="104" y="100" width="26" height="19" rx="6" fill="#fff" fill-opacity=".14" stroke="#d8b150" stroke-width="2.600"/>' +
    '<path d="M96 108h8M130 108q10 20 6 60" stroke="#d8b150" stroke-width="2.200" fill="none" stroke-linecap="round"/>' +
    '<path d="M100 112q-5 16 1 20q4 1 6-2" stroke="#b98f70" stroke-width="2.400" fill="none" stroke-linecap="round"/>' +
    '<path d="M88 143q12 3 24-1" stroke="#8a4a3c" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M70 122l-6-2M130 122l6-2M74 134q4 6 10 7M126 134q-4 6-10 7" stroke="#c99a7c" stroke-width="1.800" fill="none" stroke-linecap="round"/>' +
    '</symbol>' +

    /* Mr Ambrose Sable, Mayor of Gilderby: a chain, a watch, and a speech that is getting longer */
    '<symbol id="ch-sable" viewBox="0 0 200 260">' +
    '<path d="M-4 260Q0 200 44 184L80 172H120L156 184Q200 200 204 260Z" fill="#7a2230"/>' +
    '<path d="M76 174L100 214L124 174Z" fill="#f4efe2"/><path d="M92 190h16l-4 18h-8z" fill="#2a2433"/>' +
    '<path d="M40 196Q100 262 160 196" stroke="#d8b150" stroke-width="7" fill="none"/><circle cx="100" cy="236" r="13" fill="#e2c56f" stroke="#8a6a26" stroke-width="3"/><path d="M100 228v9l5 4" stroke="#6a4e12" stroke-width="2.200" fill="none"/>' +
    '<g fill="#c9a23c"><circle cx="52" cy="210" r="5"/><circle cx="70" cy="224" r="5"/><circle cx="130" cy="224" r="5"/><circle cx="148" cy="210" r="5"/></g>' +
    '<rect x="88" y="150" width="24" height="30" fill="#e0b99a"/>' +
    '<ellipse cx="56" cy="112" rx="6" ry="10" fill="#e3bc9d"/><ellipse cx="144" cy="112" rx="6" ry="10" fill="#e3bc9d"/>' +
    '<ellipse cx="100" cy="112" rx="45" ry="48" fill="#efcdb0"/>' +
    '<path d="M56 96q-8 34 6 56q8-18 6-50zM144 96q8 34-6 56q-8-18-6-50z" fill="#b9b3ac"/>' +
    '<ellipse cx="100" cy="64" rx="62" ry="10" fill="#17151c"/><path d="M62 64V20Q100 10 138 20V64Z" fill="#221f29"/><path d="M62 52h76v10H62z" fill="#7a2230"/>' +
    '<path d="M70 96q12-9 24-2M106 94q12-7 24 2" stroke="#8f8983" stroke-width="5" fill="none" stroke-linecap="round"/>' +
    '<circle cx="84" cy="110" r="3.400" fill="#2a2420"/><circle cx="116" cy="110" r="3.400" fill="#2a2420"/>' +
    '<path d="M100 108q-9 20-2 26q8 4 12-2" stroke="#c99878" stroke-width="2.800" fill="none" stroke-linecap="round"/>' +
    '<path d="M100 140q-20-8-34 6q18 6 34-2q16 8 34 2q-14-14-34-6z" fill="#b9b3ac"/><path d="M90 152q10 5 20 0" stroke="#8a4a3c" stroke-width="2.600" fill="none" stroke-linecap="round"/>' +
    '<circle cx="70" cy="126" r="9" fill="#e08a7a" opacity=".32"/><circle cx="130" cy="126" r="9" fill="#e08a7a" opacity=".32"/>' +
    '</symbol>' +

    '<symbol id="ch-byword" viewBox="0 0 200 260">' + daw(false) + '</symbol>' +
    '<symbol id="ch-byword-o" viewBox="0 0 200 260">' + daw(true) + '</symbol>' +
    '</defs></svg>';

  window.CAST = {
    quillon: { id: 'ch-quillon', who: 'Mistress Quillon', role: 'Clock-Warden of Gilderby · forty-one years', bg: '#2c2540' },
    sable: { id: 'ch-sable', who: 'Mr Ambrose Sable', role: 'Mayor of Gilderby · waiting', bg: '#2a2030' },
    byword: { id: 'ch-byword-o', who: 'Byword', role: 'The Warden’s jackdaw · he says what he has heard said', bg: '#262b3a' }
  };
  window.FACE = function (k, bg) {
    var c = window.CAST[k];
    return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet"' + (bg ? ' style="background:' + bg + '"' : '') + '><use href="#' + c.id + '"/></svg>';      /* the panel behind is the room's own --face-bg */
  };
})();
