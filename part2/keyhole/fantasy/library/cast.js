/* The cast of "The Library That Locks at Dusk": one night librarian, 200 x 260, used in the scenes and in the talks.
   He is drawn sitting, wings folded round him like a cloak, so he can be put down on any flat thing. */
(function () {
  /* a feathery antenna along a curve from p0 to p1 (control point c) */
  function antenna(p0, c, p1) {
    var s = '<path d="M' + p0 + 'Q' + c + ' ' + p1 + '" stroke-width="3.6"/>', t, x, y, tx, ty, n, len, k, ax, ay, bx, by;
    for (t = 0.16; t <= 1.001; t += 0.085) {
      x = (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0];
      y = (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1];
      tx = 2 * (1 - t) * (c[0] - p0[0]) + 2 * t * (p1[0] - c[0]);
      ty = 2 * (1 - t) * (c[1] - p0[1]) + 2 * t * (p1[1] - c[1]);
      n = Math.sqrt(tx * tx + ty * ty); tx /= n; ty /= n;
      len = 13 - t * 8;
      for (k = -1; k <= 1; k += 2) {
        ax = x + (-ty * k * 0.9 + tx * 0.45) * len; ay = y + (tx * k * 0.9 + ty * 0.45) * len;
        bx = x + (-ty * k * 0.5 + tx * 0.1) * len * 0.5; by = y + (tx * k * 0.5 + ty * 0.1) * len * 0.5;
        s += '<path d="M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'Q' + bx.toFixed(1) + ' ' + by.toFixed(1) + ' ' + ax.toFixed(1) + ' ' + ay.toFixed(1) + '" stroke-width="1.7"/>';
      }
    }
    return s;
  }

  window.CAST_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0"><defs>' +
    '<symbol id="ch-octavo" viewBox="0 0 200 260">' +
    /* antennae */
    '<g fill="none" stroke="#6b5440" stroke-linecap="round">' + antenna([85, 72], [68, 28], [36, 16]) + antenna([115, 72], [132, 28], [164, 16]) + '</g>' +
    /* folded wings */
    '<path d="M100 150C70 150 40 168 28 204C20 228 22 248 26 260H174C178 248 180 228 172 204C160 168 130 150 100 150Z" fill="#7d654a"/>' +
    '<path d="M27 232Q100 200 173 232L176 260H24Z" fill="#574332" opacity=".62"/>' +
    '<path d="M31 227Q100 196 169 227" stroke="#d1b887" stroke-width="3" fill="none" stroke-linecap="round"/>' +
    '<path d="M47 190Q100 170 153 190" stroke="#574332" stroke-width="5" fill="none" stroke-linecap="round" opacity=".7"/>' +
    '<path d="M42 200Q100 180 158 200" stroke="#a88e68" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>' +
    '<path d="M100 170V260" stroke="#49382a" stroke-width="2.5"/>' +
    '<circle cx="60" cy="243" r="10.5" fill="#e8d5a4"/><circle cx="60" cy="243" r="5.2" fill="#2b1f17"/><circle cx="58.200" cy="241" r="1.600" fill="#fff"/>' +
    '<circle cx="140" cy="243" r="10.5" fill="#e8d5a4"/><circle cx="140" cy="243" r="5.2" fill="#2b1f17"/><circle cx="138.200" cy="241" r="1.600" fill="#fff"/>' +
    /* fur collar, bow tie */
    '<g fill="#f0e5ca"><circle cx="76" cy="161" r="13"/><circle cx="124" cy="161" r="13"/><circle cx="90" cy="168" r="14"/><circle cx="110" cy="168" r="14"/><circle cx="100" cy="156" r="16"/></g>' +
    '<path d="M70 168q6 8 14 6M116 174q8 2 14-6M92 180q8 5 16 0" stroke="#cdbb93" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    '<path d="M100 163L84 154V173ZM100 163L116 154V173Z" fill="#2f5a48"/><circle cx="100" cy="163" r="4.200" fill="#3d7460"/>' +
    /* head */
    '<path d="M88 66L92 54L98 64L104 52L108 64L114 56L114 70Z" fill="#ecdfc2"/>' +
    '<path d="M55 96L46 92L54 104L45 108L56 114ZM145 96L154 92L146 104L155 108L144 114Z" fill="#ecdfc2"/>' +
    '<ellipse cx="100" cy="104" rx="46" ry="43" fill="#ecdfc2"/>' +
    '<path d="M57 118Q100 152 143 118Q131 145 100 147Q69 145 57 118Z" fill="#d1bf98" opacity=".7"/>' +
    /* eyes behind round glasses */
    '<ellipse cx="80" cy="104" rx="15" ry="17" fill="#1c1626"/><ellipse cx="120" cy="104" rx="15" ry="17" fill="#1c1626"/>' +
    '<circle cx="75" cy="97" r="4.600" fill="#fff"/><circle cx="115" cy="97" r="4.600" fill="#fff"/>' +
    '<circle cx="86" cy="111" r="2" fill="#fff" opacity=".6"/><circle cx="126" cy="111" r="2" fill="#fff" opacity=".6"/>' +
    '<circle cx="80" cy="104" r="21" fill="rgba(255,255,255,.1)" stroke="#d8b150" stroke-width="2.8"/>' +
    '<circle cx="120" cy="104" r="21" fill="rgba(255,255,255,.1)" stroke="#d8b150" stroke-width="2.8"/>' +
    '<path d="M98.500 99q1.500-3.500 3 0M59 100L50 95M141 100L150 95" stroke="#d8b150" stroke-width="2.6" fill="none" stroke-linecap="round"/>' +
    /* the curled tongue all moths have */
    '<path d="M100 128q-7 8 0 12.500q7 2 6-4.500q-1-4-5-2" stroke="#8a6f52" stroke-width="2.4" fill="none" stroke-linecap="round"/>' +
    '</symbol>' +
    '</defs></svg>';

  window.CAST = {
    octavo: { id: 'ch-octavo', who: 'Octavo', role: 'Night librarian · a moth', bg: '#2d2440' }
  };
  window.FACE = function (k, bg) {
    var c = window.CAST[k];
    return '<svg viewBox="0 0 200 260" preserveAspectRatio="xMidYMax meet" style="background:' + (bg || c.bg) + '"><use href="#' + c.id + '"/></svg>';
  };
})();
