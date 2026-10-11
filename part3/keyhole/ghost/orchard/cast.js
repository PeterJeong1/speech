/* The living people of "Your Place Is Laid", as busts of 200 x 260.
   FACE('bellamy' | 'lumley' | 'fair') gives the picture for an interview. The Oakeses have no pictures: nobody kept one. */
(function () {
  function bust(o) {
    var s = '<rect width="200" height="260" fill="' + o.bg + '"/>' + (o.back || '');
    /* shoulders, neck, ears, head */
    s += '<path d="M2 260Q4 206 46 191L84 178H116L154 191Q196 206 198 260Z" fill="' + o.cloth + '"/>' + (o.dress || '');
    s += '<rect x="87" y="146" width="26" height="40" fill="' + o.skin + '"/><path d="M87 166q13 11 26 0v20h-26z" fill="' + o.shade + '" opacity=".55"/>';
    s += '<ellipse cx="58" cy="113" rx="6.500" ry="10.500" fill="' + o.skin + '"/><ellipse cx="142" cy="113" rx="6.500" ry="10.500" fill="' + o.skin + '"/>';
    s += '<ellipse cx="100" cy="' + (o.long ? 109 : 107) + '" rx="' + (o.wide || 41) + '" ry="' + (o.long ? 52 : 48) + '" fill="' + o.skin + '"/>';
    s += o.hair || '';
    /* eyes, brows, nose, mouth */
    s += '<ellipse cx="83" cy="112" rx="6.500" ry="' + (o.open || 4.6) + '" fill="#fbf7ee"/><ellipse cx="117" cy="112" rx="6.500" ry="' + (o.open || 4.6) + '" fill="#fbf7ee"/>' +
      '<circle cx="' + (83 + (o.look || 0)) + '" cy="112.400" r="3.400" fill="' + o.eye + '"/><circle cx="' + (117 + (o.look || 0)) + '" cy="112.400" r="3.400" fill="' + o.eye + '"/>' +
      '<circle cx="' + (84 + (o.look || 0)) + '" cy="111.200" r="1" fill="#fff"/><circle cx="' + (118 + (o.look || 0)) + '" cy="111.200" r="1" fill="#fff"/>';
    s += o.brows + '<path d="M100 117q-5 12 0 16q5 2 7 -2" stroke="' + o.shade + '" stroke-width="2.600" fill="none" stroke-linecap="round"/>' + o.mouth + (o.face || '');
    return s;
  }
  var S = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>';

  /* Mrs Bellamy, of the next farm: she has aired this house for eleven years, and she does not hold with any of it */
  S += '<symbol id="ch-bellamy" viewBox="0 0 200 260">' + bust({
    bg: '#3a3428', skin: '#ecc9ac', shade: '#cfa98a', eye: '#4a5a44', cloth: '#5a6a4c', wide: 43, open: 4.200,
    back: '<path d="M0 60h200M0 150h200" stroke="#2c271d" stroke-width="5"/><rect x="18" y="16" width="52" height="34" fill="#d6cba8" opacity=".5"/><path d="M26 28h36M26 38h26" stroke="#3a3428" stroke-width="3" opacity=".6"/>',
    dress: '<path d="M84 178L100 216L116 178Z" fill="#ead9b0"/><path d="M62 260V210L84 180M138 260V210L116 180" stroke="#d9cdb0" stroke-width="9" fill="none"/><path d="M62 222h76v38h-76z" fill="#d9cdb0"/><path d="M70 236h60" stroke="#b9ad90" stroke-width="2"/>',
    hair: '<path d="M55 118Q46 50 100 50Q154 50 145 118Q141 84 122 76Q100 68 78 76Q59 84 55 118Z" fill="#b9b4a8"/><path d="M55 104q-8 30 -1 52q8 -4 9 -14q-6 -18 -2 -34zM145 104q8 30 1 52q-8 -4 -9 -14q6 -18 2 -34z" fill="#b9b4a8"/><path d="M70 80q30 -16 60 0" stroke="#d6d2c8" stroke-width="2.500" fill="none" stroke-linecap="round"/>',
    brows: '<path d="M72 100q10 -4 20 -1M109 96q10 -5 20 1" stroke="#8f8a7e" stroke-width="3" fill="none" stroke-linecap="round"/>',
    mouth: '<path d="M88 146q12 2 25 -2" stroke="#9c5a50" stroke-width="2.800" fill="none" stroke-linecap="round"/>',
    face: '<ellipse cx="72" cy="130" rx="9" ry="6" fill="#e2a08a" opacity=".45"/><ellipse cx="128" cy="130" rx="9" ry="6" fill="#e2a08a" opacity=".45"/><path d="M70 122q7 3 14 0M116 122q7 3 14 0" stroke="#cfa98a" stroke-width="1.600" fill="none" stroke-linecap="round"/>'
  }) + '</symbol>';

  /* Miss Lumley, of the County Record Office: papers first, ghosts afterwards */
  S += '<symbol id="ch-lumley" viewBox="0 0 200 260">' + bust({
    bg: '#232a36', skin: '#e9c7a8', shade: '#c9a184', eye: '#3a2c24', cloth: '#27344a', long: 1, wide: 38, open: 4.800, look: 1,
    back: '<rect x="12" y="20" width="60" height="78" fill="#3a4456"/><path d="M12 46h60M12 72h60" stroke="#232a36" stroke-width="3"/><rect x="132" y="30" width="54" height="66" fill="#3a4456"/><path d="M132 52h54M132 74h54" stroke="#232a36" stroke-width="3"/>',
    dress: '<path d="M84 178L100 222L116 178Z" fill="#e9e3d2"/><path d="M84 178L66 198L92 232L100 210L108 232L134 198L116 178" fill="#31405a" stroke="#1c2434" stroke-width="2.500" stroke-linejoin="round"/><path d="M90 196L96 250M110 196L104 250" stroke="#7b2c22" stroke-width="3"/><rect x="88" y="244" width="24" height="16" rx="2" fill="#f1ecdc"/>',
    hair: '<circle cx="100" cy="48" r="17" fill="#3a2c24"/><path d="M60 112Q54 56 100 56Q146 56 140 112Q134 82 100 78Q66 82 60 112Z" fill="#3a2c24"/><path d="M104 58q16 4 24 22" stroke="#b9b4a8" stroke-width="5" fill="none" stroke-linecap="round"/>',
    brows: '<path d="M73 99q10 -5 19 -2M108 97q10 -3 19 2" stroke="#3a2c24" stroke-width="2.800" fill="none" stroke-linecap="round"/>',
    mouth: '<path d="M89 147q11 5 22 0" stroke="#9c4a48" stroke-width="2.800" fill="none" stroke-linecap="round"/>',
    face: '<rect x="71" y="103" width="24" height="18" rx="6" fill="none" stroke="#9c2f24" stroke-width="3"/><rect x="105" y="103" width="24" height="18" rx="6" fill="none" stroke="#9c2f24" stroke-width="3"/><path d="M95 110h10M71 109l-10 -3M129 109l10 -3" stroke="#9c2f24" stroke-width="2.600" stroke-linecap="round"/>'
  }) + '</symbol>';

  /* Ms Fairweather, of Hawke's Bay, New Zealand: sixty-four years in the sun, and twelve thousand miles from home */
  S += '<symbol id="ch-fair" viewBox="0 0 200 260">' + bust({
    bg: '#2c3a34', skin: '#c99670', shade: '#a87850', eye: '#4a6a7a', cloth: '#2f6a52', wide: 40, open: 4,
    back: '<path d="M0 190Q50 150 100 168T200 150V260H0Z" fill="#22302a"/><circle cx="160" cy="46" r="20" fill="#e2b25c" opacity=".35"/>',
    dress: '<path d="M84 178L100 214L116 178Z" fill="#e2b25c"/><path d="M80 176L60 190L74 214L100 190L126 214L140 190L120 176" fill="#3a7a60" stroke="#21503c" stroke-width="2.500" stroke-linejoin="round"/><path d="M52 196q-8 30 -4 64M148 196q8 30 4 64" stroke="#8c2f24" stroke-width="11" fill="none"/><path d="M100 190V260" stroke="#21503c" stroke-width="3"/>',
    hair: '<path d="M58 110Q52 54 100 54Q148 54 142 110Q136 80 118 72Q100 66 82 72Q64 80 58 110Z" fill="#d9dcdc"/><path d="M70 70q14 -12 34 -10M110 62q16 4 24 18" stroke="#f1f3f3" stroke-width="3" fill="none" stroke-linecap="round"/>',
    brows: '<path d="M72 99q10 -5 19 -1M109 98q9 -4 19 1" stroke="#c9cfcf" stroke-width="3" fill="none" stroke-linecap="round"/>',
    mouth: '<path d="M85 144q15 11 30 0" stroke="#8c4a3c" stroke-width="2.800" fill="none" stroke-linecap="round"/><path d="M89 147q11 5 22 0" stroke="#fbf7ee" stroke-width="2" fill="none"/>',
    face: '<path d="M66 108l-7 -4M66 113l-8 1M66 118l-6 5M134 108l7 -4M134 113l8 1M134 118l6 5" stroke="#a87850" stroke-width="1.600" stroke-linecap="round"/><path d="M72 134q-3 8 3 16M128 134q3 8 -3 16" stroke="#a87850" stroke-width="2" fill="none" stroke-linecap="round"/>'
  }) + '</symbol>';

  S += '</defs></svg>';
  window.CAST_SVG = S;
  window.FACE = function (who) {
    var bg = { bellamy: '#3a3428', lumley: '#232a36', fair: '#2c3a34' }[who] || '#222';
    return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:' + bg + '"><use href="#ch-' + who + '"/></svg>';
  };
})();
