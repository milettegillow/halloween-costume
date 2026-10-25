/* Halloween costume - SVG drawing.
   Everything is drawn in a 400 x 520 portrait space, centred on x = 200.
   Every layer positions itself from the anchors returned by anchors(). */
(function (global) {
  'use strict';

  const CX = 200;
  const GLASS = { cx: 200, cy: 255, rx: 166, ry: 213 };

  /* ---------- small helpers ---------- */

  const f = n => Math.round(n * 10) / 10;
  const pt = (x, y) => f(x) + ',' + f(y);
  const P = (d, fill, extra) => `<path d="${d}" fill="${fill}"${extra ? ' ' + extra : ''}/>`;
  const S = (d, stroke, w, extra) =>
    `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra ? ' ' + extra : ''}/>`;
  const E = (cx, cy, rx, ry, fill, extra) =>
    `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${extra ? ' ' + extra : ''}/>`;
  const C = (cx, cy, r, fill, extra) =>
    `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}"${extra ? ' ' + extra : ''}/>`;
  const G = (content, attrs) => `<g${attrs ? ' ' + attrs : ''}>${content}</g>`;
  const op = o => `opacity="${o}"`;

  function hexToRgb(h) {
    h = h.replace('#', '');
    return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16));
  }
  function rgbToHex(c) {
    return '#' + c.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
  }
  function mix(a, b, t) {
    const A = hexToRgb(a), B = hexToRgb(b);
    return rgbToHex(A.map((v, i) => v + (B[i] - v) * t));
  }

  function rng(seed) {
    let s = seed >>> 0;
    return function () {
      s += 0x6D2B79F5;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Catmull-Rom spline through points, as cubic beziers.
  function spline(pts, closed) {
    const n = pts.length;
    const get = i => closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))];
    let d = 'M' + pt(pts[0][0], pts[0][1]);
    const segs = closed ? n : n - 1;
    for (let i = 0; i < segs; i++) {
      const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2);
      d += 'C' + pt(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
        pt(p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6) + ' ' + pt(p2[0], p2[1]);
    }
    return d + (closed ? 'Z' : '');
  }

  // Right-half outline -> full symmetrical closed outline.
  function mirrorPts(right) {
    const left = right.slice(1, -1).reverse().map(([x, y]) => [2 * CX - x, y]);
    return right.concat(left);
  }

  /* ---------- palettes ---------- */

  function skinPalette(base, tint) {
    tint = tint || '#5b2a24';
    return {
      base,
      shade: mix(base, tint, 0.2),
      deep: mix(base, tint, 0.42),
      light: mix(base, '#fff8ee', 0.38),
      line: mix(base, '#1c0d0a', 0.66),
      lip: mix(base, '#a8423e', 0.36)
    };
  }

  function hairPalette(base) {
    return {
      base,
      shade: mix(base, '#000000', 0.38),
      deep: mix(base, '#000000', 0.6),
      light: mix(base, '#ffffff', 0.4)
    };
  }

  const SKIN_MAKEUP = {
    none: null,
    corpse: { mix: '#e6dfd4', t: 0.74, tint: '#4b3a4a' },
    zombie: { mix: '#9dac86', t: 0.74, tint: '#2c3a22' },
    ghostly: { mix: '#f4f2ee', t: 0.88, tint: '#56607a' },
    bruised: { mix: '#a9b4cc', t: 0.7, tint: '#2c2d55' }
  };

  /* ---------- anchors ---------- */

  const SHAPES = {
    pointed: { crownY: 94, w: 1.02, jaw: [[85, 252], [77, 276], [62, 300], [42, 322], [20, 338], [5, 344], [0, 345]] },
    oval: { crownY: 94, w: 1, jaw: [[84, 256], [78, 282], [66, 306], [48, 324], [26, 334], [0, 337]] },
    square: { crownY: 96, w: 1.01, jaw: [[86, 258], [85, 284], [81, 306], [68, 322], [44, 330], [0, 332]] }
  };

  const FEATURES = {
    feminine: { jaw: -4, brow: 3.4, arch: 8, lashes: 4, lashLen: 8, lipTop: 5.5, lipBot: 7.5, mouthW: 15.5, nose: -4, neckW: 29, shoulderW: 124, eyeRX: 23.5, eyeRY: 19.5 },
    androgynous: { jaw: 0, brow: 4.6, arch: 5.5, lashes: 3, lashLen: 5.5, lipTop: 4.2, lipBot: 6, mouthW: 17, nose: 0, neckW: 32, shoulderW: 132, eyeRX: 23, eyeRY: 18.5 },
    masculine: { jaw: 5, brow: 6.6, arch: 2.5, lashes: 2, lashLen: 3.5, lipTop: 3, lipBot: 5, mouthW: 18.5, nose: 6, neckW: 36, shoulderW: 142, eyeRX: 22, eyeRY: 17.5 }
  };

  function anchors(shape, features) {
    const s = SHAPES[shape] || SHAPES.oval;
    const ft = FEATURES[features] || FEATURES.androgynous;
    const w = s.w;
    const upper = [[0, s.crownY], [48 * w, s.crownY + 4], [76 * w, s.crownY + 22], [86 * w, s.crownY + 54], [88 * w, 190], [88 * w, 226]];
    const jaw = s.jaw.map(([x, y], i, arr) => {
      if (i === arr.length - 1 || y < 270) return [x, y];
      return [Math.max(0, x + ft.jaw * (i === arr.length - 2 ? 0.7 : 1)), y];
    });
    const right = upper.concat(jaw).map(([x, y]) => [CX + x, y]);
    const pts = mirrorPts(right);
    const chinY = jaw[jaw.length - 1][1];
    const eyeY = 214;
    const noseY = 252 + ft.nose;
    const a = {
      shape, features, ft,
      cx: CX,
      crownY: s.crownY,
      hairlineY: s.crownY + 50,
      browY: eyeY - 30,
      eyeY, eyeDX: 40, eyeRX: ft.eyeRX, eyeRY: ft.eyeRY,
      noseTop: eyeY + 4, noseY,
      mouthY: noseY + 30, mouthW: ft.mouthW, lipTop: ft.lipTop, lipBot: ft.lipBot,
      cheekY: 238,
      chinY,
      jawY: jaw[2][1],
      jawW: jaw[2][0],
      neckW: ft.neckW,
      collarY: 382,
      shoulderW: ft.shoulderW,
      right,
      headPath: spline(pts, true)
    };
    // half-width of the head at a given y
    a.widthAt = y => {
      for (let i = 0; i < right.length - 1; i++) {
        const [x1, y1] = right[i], [x2, y2] = right[i + 1];
        if (y >= y1 && y <= y2) return (x1 + (x2 - x1) * ((y - y1) / ((y2 - y1) || 1))) - CX;
      }
      return y < right[0][1] ? 0 : 0;
    };
    return a;
  }

  /* ---------- eyes geometry ---------- */

  // side: -1 = viewer's left, 1 = viewer's right
  function eyeGeom(a, side) {
    const ex = CX + side * a.eyeDX, ey = a.eyeY;
    const x1 = ex - side * a.eyeRX, x2 = ex + side * a.eyeRX; // inner, outer
    const y1 = ey + 2, y2 = ey - 1;
    return { ex, ey, x1, y1, x2, y2, rx: a.eyeRX, ry: a.eyeRY, side };
  }
  function eyePath(g) {
    const dx = g.x2 - g.x1;
    return `M${pt(g.x1, g.y1)}C${pt(g.x1 + dx * 0.12, g.y1 - g.ry * 1.32)} ${pt(g.x2 - dx * 0.12, g.y2 - g.ry * 1.36)} ${pt(g.x2, g.y2)}` +
      `C${pt(g.x2 - dx * 0.1, g.y2 + g.ry * 1.18)} ${pt(g.x1 + dx * 0.14, g.y1 + g.ry * 1.12)} ${pt(g.x1, g.y1)}Z`;
  }
  function upperLid(g, ext) {
    const dx = g.x2 - g.x1;
    ext = ext || 0;
    return `M${pt(g.x1, g.y1)}C${pt(g.x1 + dx * 0.12, g.y1 - g.ry * 1.32)} ${pt(g.x2 - dx * 0.12, g.y2 - g.ry * 1.36)} ${pt(g.x2, g.y2)}` +
      (ext ? `Q${pt(g.x2 + g.side * ext * 0.6, g.y2 - 1)} ${pt(g.x2 + g.side * ext, g.y2 - ext * 0.5)}` : '');
  }
  function lowerLid(g) {
    const dx = g.x2 - g.x1;
    return `M${pt(g.x2, g.y2)}C${pt(g.x2 - dx * 0.1, g.y2 + g.ry * 1.18)} ${pt(g.x1 + dx * 0.14, g.y1 + g.ry * 1.12)} ${pt(g.x1, g.y1)}`;
  }

  /* ---------- hair locks ---------- */

  // A tapered lock of hair from root (x1,y1) to tip (x2,y2).
  // b1/b2 bow the lock sideways (relative to its direction: positive bows to the
  // lock's right-hand normal, so a lock heading right bows downwards).
  function lock(h, R, x1, y1, x2, y2, w, b1, b2, o) {
    o = o || {};
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
    const nx = -dy / L, ny = dx / L;
    const c1 = [x1 + dx * 0.33 + nx * b1 * L, y1 + dy * 0.33 + ny * b1 * L];
    const c2 = [x1 + dx * 0.66 + nx * b2 * L, y1 + dy * 0.66 + ny * b2 * L];
    const at = t => {
      const u = 1 - t;
      return [
        u * u * u * x1 + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * x2,
        u * u * u * y1 + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * y2
      ];
    };
    const N = 9, hw = w / 2;
    const width = t => o.blunt ? hw * (1 - 0.3 * t) : hw * (1 - Math.pow(t, o.full ? 3 : 2.2)) * (0.9 + 0.25 * Math.sin(Math.PI * t * 0.8));
    const samples = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N, p = at(t), p2 = at(Math.min(1, t + 0.02)), p1 = at(Math.max(0, t - 0.02));
      const tx = p2[0] - p1[0], ty = p2[1] - p1[1], tl = Math.hypot(tx, ty) || 1;
      samples.push({ t, p, n: [-ty / tl, tx / tl], w: width(t) });
    }
    // outline between two offsets (fractions of the local half-width)
    const band = (k0, k1) => {
      const A = samples.map(s => [s.p[0] + s.n[0] * s.w * k0, s.p[1] + s.n[1] * s.w * k0]);
      const B = samples.map(s => [s.p[0] + s.n[0] * s.w * k1, s.p[1] + s.n[1] * s.w * k1]).reverse();
      if (o.blunt) return spline(A, false) + 'L' + spline(B, false).slice(1) + 'Z';
      return spline(A.concat(B.slice(1, -1)), true);
    };
    let out = P(band(1, -1), o.fill || h.base, `stroke="${h.deep}" stroke-width="0.6" stroke-opacity="0.5"`);
    out += P(band(-1, -0.15), h.shade, op(0.8));
    out += P(band(-1, -0.7), h.deep, op(0.5));
    const n = o.hl === undefined ? 2 : o.hl;
    for (let i = 0; i < n; i++) {
      const k = 0.15 + R() * 0.55, t0 = 0.06 + R() * 0.14, t1 = 0.45 + R() * 0.35;
      const pts = samples.filter(s => s.t >= t0 && s.t <= t1).map(s => [s.p[0] + s.n[0] * s.w * k, s.p[1] + s.n[1] * s.w * k]);
      if (pts.length > 1) out += S(spline(pts, false), h.light, f(0.5 + R() * 0.7), op(f(0.4 + R() * 0.35)));
    }
    return out;
  }

  // Close-fitting cap of hair over the skull, down to the hairline.
  function hairCap(a, h, o) {
    return P(capPath(a, o), h.base);
  }
  function capPath(a, o) {
    o = o || {};
    const top = o.top !== undefined ? o.top : a.crownY - 14;
    const side = o.side || 96;
    const hl = a.hairlineY;
    const right = [[CX, top], [CX + 58, top + 6], [CX + 86, top + 28], [CX + side, hl + 4], [CX + side - 3, 206]];
    const inner = [[CX + 86, 202], [CX + 82, hl + 22], [CX + 62, hl + 4], [CX + 30, hl - 2], [CX, hl + (o.peak || 0)]];
    const left = right.slice(1).reverse().map(([x, y]) => [2 * CX - x, y]);
    const innerL = inner.slice(0, -1).reverse().map(([x, y]) => [2 * CX - x, y]);
    const ring = right.concat(inner).concat(innerL).concat(left);
    return spline(ring, true);
  }

  /* ---------- hairstyles ---------- */
  // Each returns { back, front, top } where top is the highest y of the hair.

  const HAIR = {
    crop(a, h) {
      const R = rng(11), r = (x, y) => x + R() * (y - x);
      const top = a.crownY - 26;
      const back = E(CX, 160, 100, 78, h.deep);
      let front = hairCap(a, h, { top: a.crownY - 16 });
      // locks falling forwards and sideways from the crown
      for (let i = 0; i < 13; i++) {
        const t = i / 12 * 2 - 1, sd = t < 0 ? -1 : 1;
        const tx = CX + t * 98 + r(-6, 6), ty = 150 + Math.abs(t) * 46 + r(-6, 10);
        front += lock(h, R, CX + t * 30 + r(-10, 10), a.crownY + r(-4, 6), tx, ty, r(32, 42), -sd * r(0.12, 0.2) * Math.max(0.4, Math.abs(t)), sd * r(0.0, 0.06));
      }
      // sides over the tops of the ears
      [-1, 1].forEach(s => {
        for (let i = 0; i < 3; i++) {
          front += lock(h, R, CX + s * r(64, 76), 132 + i * 14, CX + s * r(94, 100), 196 + i * 10 + r(0, 10), r(18, 24), -s * r(0.08, 0.14), s * r(0, 0.05));
        }
      });
      // tousled fringe falling forwards
      for (let i = 0; i < 7; i++) {
        const x = CX - 58 + i * 19 + r(-4, 4);
        const tx = x + r(-4, 24);
        front += lock(h, R, x + r(-10, 10), r(104, 116), tx, r(150, 174), r(24, 32), (tx > x ? 1 : -1) * r(0.05, 0.14), r(-0.06, 0.06));
      }
      return { back, front, top };
    },

    bob(a, h) {
      const R = rng(23), r = (x, y) => x + R() * (y - x);
      const top = a.crownY - 22;
      const sil = mirrorPts([[CX, top], [CX + 74, top + 12], [CX + 108, 140], [CX + 118, 220], [CX + 124, 296], [CX + 112, 330], [CX + 70, 318], [CX, 300]]);
      let back = P(spline(sil, true), h.deep);
      [-1, 1].forEach(s => {
        for (let i = 0; i < 5; i++) {
          back += lock(h, R, CX + s * r(70, 96), r(150, 200), CX + s * r(98, 118), r(310, 332), r(26, 34), -s * 0.08, s * 0.08, { hl: 1 });
        }
      });
      let front = hairCap(a, h, { top: a.crownY - 14 });
      const part = CX - 26;
      // volume over the crown, from the parting
      for (let i = 0; i < 10; i++) {
        const s = i < 3 ? -1 : 1;
        const tx = CX + s * r(60, 104), ty = r(132, 176);
        front += lock(h, R, part + r(-4, 4), r(100, 108), tx, ty, r(30, 40), -s * r(0.16, 0.24), -s * r(0.02, 0.08));
      }
      // waved side sections
      [-1, 1].forEach(s => {
        for (let i = 0; i < 5; i++) {
          front += lock(h, R, CX + s * r(74, 90), r(140, 176), CX + s * r(96, 120), r(296, 330), r(24, 32), -s * r(0.06, 0.1), s * r(0.06, 0.12));
        }
      });
      // side-swept fringe
      for (let i = 0; i < 6; i++) {
        front += lock(h, R, part + r(-6, 6), r(102, 110), CX + r(30, 90), r(150, 178), r(28, 36), -r(0.12, 0.2), r(0.0, 0.06));
      }
      for (let i = 0; i < 2; i++) {
        front += lock(h, R, part + r(-4, 4), r(104, 110), CX - r(66, 86), r(150, 168), r(22, 28), r(0.12, 0.2), r(-0.04, 0.02));
      }
      return { back, front, top };
    },

    long(a, h) {
      const R = rng(37), r = (x, y) => x + R() * (y - x);
      const top = a.crownY - 18;
      const sil = mirrorPts([[CX, top], [CX + 78, top + 12], [CX + 106, 140], [CX + 114, 250], [CX + 122, 560], [CX, 560]]);
      let back = P(spline(sil, true), h.deep);
      for (let i = 0; i < 12; i++) {
        const s = i % 2 ? 1 : -1;
        const x = CX + s * r(70, 118);
        back += lock(h, R, x, r(150, 220), x + s * r(2, 8), r(500, 560), r(14, 22), 0, 0, { hl: 1, blunt: true });
      }
      let front = hairCap(a, h, { top: a.crownY - 12 });
      // side curtains
      [-1, 1].forEach(s => {
        for (let i = 0; i < 6; i++) {
          front += lock(h, R, CX + s * r(76, 96), r(130, 160), CX + s * r(100, 130), r(480, 540), r(16, 23), s * r(-0.01, 0.02), s * r(-0.02, 0.01), { blunt: true });
        }
      });
      // volume from the parting
      [-1, 1].forEach(sd => {
        for (let i = 0; i < 4; i++) {
          front += lock(h, R, CX + r(-6, 6), a.crownY - 10 + r(0, 6), CX + sd * r(80, 104), r(140, 170), r(30, 38), -sd * r(0.14, 0.2), sd * r(0, 0.05));
        }
      });
      // heavy fringe, cut straight but with a few longer pieces
      const n = 10;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1) * 2 - 1;
        const x = CX + t * 74 + r(-4, 4);
        const ry = a.crownY + 2 + t * t * 30;
        front += lock(h, R, x, ry, CX + t * 90 + r(-4, 4), a.browY - 8 + r(-2, 4) + t * t * 6, r(24, 32), r(-0.04, 0.04), r(-0.03, 0.03), { full: true, hl: 2 });
      }
      return { back, front, top };
    },

    slick(a, h, id) {
      const R = rng(41), r = (x, y) => x + R() * (y - x);
      const top = a.crownY - 12;
      const back = E(CX, 150, 98, 70, h.deep) + E(CX, 210, 94, 28, h.deep);
      const cap = capPath(a, { top, peak: 6 });
      const hl = a.hairlineY;
      let locks = '';
      const n = 12;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1) * 2 - 1;
        const sd = t < -0.2 ? -1 : 1;
        locks += lock(h, R, CX + t * 84, hl + 10 + t * t * 44, CX + t * 60 + sd * r(10, 24), top - r(10, 30), r(28, 36), sd * r(0.12, 0.18), -sd * r(0.1, 0.14), { hl: 3, blunt: true });
      }
      [-1, 1].forEach(s => {
        for (let i = 0; i < 3; i++) {
          locks += lock(h, R, CX + s * 90, 210 - i * 14, CX + s * r(84, 96), 120 - i * 8, r(16, 20), s * 0.06, -s * 0.03, { hl: 2, blunt: true });
        }
      });
      const front = `<clipPath id="${id}cap"><path d="${cap}"/></clipPath>` + P(cap, h.base) + G(locks, `clip-path="url(#${id}cap)"`) +
        S(cap, h.deep, 1, op(0.6));
      return { back, front, top };
    },

    bun(a, h, id) {
      const R = rng(53), r = (x, y) => x + R() * (y - x);
      const by = a.crownY - 22, br = 28;
      const top = by - br - 4;
      const back = E(CX, 160, 96, 64, h.deep);
      const cap = capPath(a, { top: a.crownY - 8 });
      const hl = a.hairlineY;
      let locks = '';
      const n = 13;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1) * 2 - 1;
        locks += lock(h, R, CX + t * 92, hl + 14 + t * t * 56, CX + t * r(8, 16), a.crownY - 14 + r(-4, 4), r(26, 32), Math.sign(t) * 0.12, Math.sign(t) * 0.04, { hl: 2, blunt: true });
      }
      let front = `<clipPath id="${id}cap"><path d="${cap}"/></clipPath>` + P(cap, h.base) + G(locks, `clip-path="url(#${id}cap)"`) + S(cap, h.deep, 1, op(0.6));
      // the bun itself
      let bun = C(CX, by, br, h.shade);
      for (let i = 0; i < 8; i++) {
        const t0 = i / 8 * Math.PI * 2 + r(-0.2, 0.2), t1 = t0 + r(1.6, 2.2);
        const rr = br * r(0.55, 0.92);
        bun += lock(h, R, CX + Math.cos(t0) * rr, by + Math.sin(t0) * rr, CX + Math.cos(t1) * rr, by + Math.sin(t1) * rr, r(12, 17), 0.32, 0.28, { hl: 2 });
      }
      front += bun + E(CX, by + br - 3, 16, 5, h.deep);
      // loose wisps at the temples
      [-1, 1].forEach(s => {
        for (let i = 0; i < 2; i++) {
          front += lock(h, R, CX + s * r(78, 86), r(150, 166), CX + s * r(88, 96), r(232, 262), r(4, 6), s * 0.08, -s * 0.1, { hl: 1 });
        }
      });
      return { back, front, top };
    },

    witch(a, h) {
      const R = rng(67), r = (x, y) => x + R() * (y - x);
      const top = a.crownY - 34;
      const ring = [];
      for (let i = 0; i <= 26; i++) {
        const th = Math.PI + i / 26 * Math.PI;
        const rad = r(0.92, 1.08);
        ring.push([CX + Math.cos(th) * 140 * rad, 170 + Math.sin(th) * 106 * rad]);
      }
      ring.push([CX + 156, 300], [CX + 150, 400], [CX + 136, 486], [CX + 100, 470], [CX + 60, 400], [CX - 60, 400], [CX - 100, 474], [CX - 140, 490], [CX - 152, 400], [CX - 158, 300]);
      let back = P(spline(ring, true), h.deep);
      for (let i = 0; i < 30; i++) {
        const s = i % 2 ? 1 : -1;
        back += lock(h, R, CX + r(-60, 60), r(90, 140), CX + s * r(96, 160), r(150, 490), r(16, 28), r(-0.2, 0.2), r(-0.2, 0.2), { hl: 1 });
      }
      for (let i = 0; i < 22; i++) {
        const th = Math.PI + R() * Math.PI * 1.3 - 0.15;
        const sx = CX + Math.cos(th) * 130, sy = 175 + Math.sin(th) * 98;
        const ex = sx + Math.cos(th) * r(12, 30), ey = sy + Math.sin(th) * r(10, 26);
        back += S(`M${pt(sx, sy)}Q${pt((sx + ex) / 2 + r(-8, 8), (sy + ey) / 2 + r(-8, 8))} ${pt(ex, ey)}`, h.shade, f(r(0.8, 1.6)));
      }
      let front = hairCap(a, h, { top: a.crownY - 20, side: 98 });
      for (let i = 0; i < 12; i++) {
        const s = i % 2 ? 1 : -1;
        front += lock(h, R, CX + s * r(0, 14), r(96, 110), CX + s * r(78, 112), r(130, 178), r(18, 28), s * r(-0.16, -0.04), s * r(-0.06, 0.12));
      }
      [-1, 1].forEach(s => {
        for (let i = 0; i < 7; i++) {
          front += lock(h, R, CX + s * r(74, 96), r(124, 170), CX + s * r(100, 150), r(270, 470), r(16, 26), s * r(-0.12, 0.12), s * r(-0.14, 0.14));
        }
        for (let i = 0; i < 6; i++) {
          const sx = CX + s * r(96, 140), sy = r(220, 440);
          front += S(`M${pt(sx, sy)}q${f(s * r(4, 14))},${f(r(-10, 10))} ${f(s * r(8, 22))},${f(r(-4, 18))}`, h.light, f(r(0.6, 1.1)), op(0.6));
        }
      });
      // straggly strands over the forehead
      for (let i = 0; i < 4; i++) {
        const x = CX + r(-46, 46);
        front += lock(h, R, x, r(108, 116), x + r(-20, 20), r(164, 180), r(6, 10), r(-0.2, 0.2), r(-0.2, 0.2), { hl: 1 });
      }
      return { back, front, top };
    },

    bunches(a, h) {
      const R = rng(79), r = (x, y) => x + R() * (y - x);
      const top = a.crownY - 14;
      const back = E(CX, 160, 96, 66, h.deep);
      let front = '';
      [-1, 1].forEach(s => {
        const tx = CX + s * 98, ty = 156;
        let b = '';
        for (let i = 0; i < 9; i++) {
          b += lock(h, R, tx + s * r(-2, 6), ty + r(-6, 6), CX + s * r(112, 150), r(260, 340), r(22, 30), -s * r(0.1, 0.22), s * r(0.12, 0.26));
        }
        front += b;
      });
      front += hairCap(a, h, { top: a.crownY - 10 });
      // centre parting, combed to each tie
      [-1, 1].forEach(s => {
        for (let i = 0; i < 7; i++) {
          front += lock(h, R, CX + s * r(1, 6), r(100, 128), CX + s * r(92, 100), r(148, 164), r(18, 24), -s * r(0.12, 0.18), -s * r(0.02, 0.08), { hl: 2 });
        }
        front += E(CX + s * 98, 156, 7, 9, '#7a1426') + E(CX + s * 97, 153, 3, 3.5, '#a8384a');
      });
      front += S(`M${pt(CX, a.crownY - 8)}L${pt(CX, a.hairlineY - 6)}`, h.deep, 1.4);
      // soft short fringe
      for (let i = 0; i < 7; i++) {
        const t = i / 6 * 2 - 1;
        front += lock(h, R, CX + t * 60 + r(-3, 3), a.crownY + 4 + t * t * 20, CX + t * 72 + r(-3, 3), r(160, 168), r(26, 32), r(-0.04, 0.04), r(-0.03, 0.03), { full: true });
      }
      return { back, front, top };
    },

    shaved(a, h, id) {
      const top = a.crownY;
      const hl = a.hairlineY;
      const area = `M0,0H400V214H${CX + 84}C${CX + 82},${hl + 20} ${CX + 60},${hl} ${CX},${hl}C${CX - 60},${hl} ${CX - 82},${hl + 20} ${CX - 84},214H0Z`;
      const dots = `<pattern id="${id}stub" width="3" height="3" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="0.55" fill="${h.deep}"/><circle cx="2.4" cy="2.3" r="0.4" fill="${h.shade}"/></pattern>`;
      const front = `<defs>${dots}<clipPath id="${id}svc"><path d="${area}"/></clipPath></defs>` +
        G(P(a.headPath, h.shade, op(0.24)) + P(a.headPath, `url(#${id}stub)`, op(0.5)), `clip-path="url(#${id}svc)"`);
      return { back: '', front, top };
    }
  };

  /* ---------- body, neck and head ---------- */

  // Silhouette of shoulders and chest, open at the top between the neck sides.
  function bodice(a, o) {
    o = o || {};
    const sw = a.shoulderW + (o.grow || 0), L = CX - sw, Rr = CX + sw, y0 = a.collarY - 6 + (o.drop || 0);
    const w = o.nlW, y = o.nlY;
    let d = `M${pt(CX - w, y)}C${pt(CX - w - 16, y + 7)} ${pt(L + 46, y0 + 14)} ${pt(L + 22, y0 + 26)}` +
      `C${pt(L + 4, y0 + 34)} ${pt(L - 6, y0 + 64)} ${pt(L - 8, 560)}L${pt(Rr + 8, 560)}` +
      `C${pt(Rr + 6, y0 + 64)} ${pt(Rr - 4, y0 + 34)} ${pt(Rr - 22, y0 + 26)}C${pt(Rr - 46, y0 + 14)} ${pt(CX + w + 16, y + 7)} ${pt(CX + w, y)}`;
    if (o.vee) d += `L${pt(CX, o.nlD)}Z`;
    else d += `C${pt(CX + w * 0.62, o.nlD)} ${pt(CX - w * 0.62, o.nlD)} ${pt(CX - w, y)}Z`;
    return d;
  }
  // Region above a neckline, used to clip the neck.
  function neckClip(o) {
    const w = o.nlW, y = o.nlY;
    const curve = o.vee ? `L${pt(CX, o.nlD)}L${pt(CX - w, y)}` : `C${pt(CX + w * 0.62, o.nlD)} ${pt(CX - w * 0.62, o.nlD)} ${pt(CX - w, y)}`;
    return `M-60,-60H460V${f(y)}H${f(CX + w)}${curve}H-60Z`;
  }

  function bodySkin(a, sk) {
    const d = bodice(a, { nlW: a.neckW - 2, nlY: a.collarY - 26, nlD: a.collarY - 26 });
    let out = P(d, sk.base, `stroke="${sk.line}" stroke-width="1.5"`);
    // collarbones and chest shading
    const y = a.collarY + 18;
    out += S(`M${pt(CX - 14, y + 4)}Q${pt(CX - 44, y - 6)} ${pt(CX - 84, y + 2)}`, sk.shade, 2.4, op(0.8));
    out += S(`M${pt(CX + 14, y + 4)}Q${pt(CX + 44, y - 6)} ${pt(CX + 84, y + 2)}`, sk.shade, 2.4, op(0.8));
    out += P(`M${pt(CX - 6, y + 10)}Q${pt(CX, y + 30)} ${pt(CX + 6, y + 10)}Z`, sk.shade, op(0.6));
    out += P(`M${pt(CX + 40, y + 10)}C${pt(CX + 80, y + 4)} ${pt(CX + 120, y + 30)} ${pt(CX + 140, y + 80)}L${pt(CX + 60, y + 90)}Z`, sk.shade, op(0.55));
    return out;
  }

  function neck(a, sk, id) {
    const nw = a.neckW, top = a.jawY - 30, bot = a.collarY + 12;
    const col = `M${pt(CX - nw, top)}C${pt(CX - nw, top + 40)} ${pt(CX - nw - 1, bot - 30)} ${pt(CX - nw - 10, bot)}L${pt(CX + nw + 10, bot)}` +
      `C${pt(CX + nw + 1, bot - 30)} ${pt(CX + nw, top + 40)} ${pt(CX + nw, top)}Z`;
    let out = `<clipPath id="${id}nk"><path d="${col}"/></clipPath>`;
    out += P(col, sk.base);
    // shadow side of the neck and the cast shadow of the chin
    out += G(
      P(`M${pt(CX + nw * 0.35, top)}C${pt(CX + nw * 0.5, top + 50)} ${pt(CX + nw * 0.55, bot - 20)} ${pt(CX + nw * 0.8, bot)}H${CX + 80}V${top}Z`, sk.shade, op(0.8)) +
      P(a.headPath, sk.deep, `transform="translate(3,15)" ${op(0.55)}`) +
      P(a.headPath, sk.shade, `transform="translate(1,22)" ${op(0.5)}`) +
      S(`M${pt(CX - 9, bot - 26)}Q${pt(CX, bot - 18)} ${pt(CX + 9, bot - 26)}`, sk.shade, 1.6, op(0.7)),
      `clip-path="url(#${id}nk)"`);
    out += S(`M${pt(CX - nw, top)}C${pt(CX - nw, top + 40)} ${pt(CX - nw - 1, bot - 30)} ${pt(CX - nw - 10, bot)}`, sk.line, 1.5);
    out += S(`M${pt(CX + nw, top)}C${pt(CX + nw, top + 40)} ${pt(CX + nw + 1, bot - 30)} ${pt(CX + nw + 10, bot)}`, sk.line, 1.5);
    return out;
  }

  function ears(a, sk) {
    let out = '';
    [-1, 1].forEach(s => {
      const x = CX + s * (a.widthAt(232) - 2), y = 234;
      const d = `M${pt(x - s * 4, y - 22)}C${pt(x + s * 10, y - 30)} ${pt(x + s * 18, y - 12)} ${pt(x + s * 14, y + 4)}` +
        `C${pt(x + s * 11, y + 18)} ${pt(x + s * 6, y + 26)} ${pt(x - s * 4, y + 24)}Z`;
      out += P(d, s > 0 ? sk.shade : sk.base, `stroke="${sk.line}" stroke-width="1.5"`);
      out += S(`M${pt(x + s * 1, y - 16)}C${pt(x + s * 10, y - 18)} ${pt(x + s * 11, y - 4)} ${pt(x + s * 6, y + 6)}C${pt(x + s * 3, y + 12)} ${pt(x + s * 4, y + 16)} ${pt(x, y + 18)}`, sk.deep, 1.6, op(0.75));
    });
    return out;
  }

  function head(a, sk, id) {
    const hp = a.headPath;
    let out = ears(a, sk);
    out += `<clipPath id="${id}hd"><path d="${hp}"/></clipPath>`;
    out += P(hp, sk.base);
    let sh = '';
    // shadowed side of the face (light from the viewer's left)
    sh += P(`M${pt(CX + 46, a.crownY - 10)}C${pt(CX + 74, 150)} ${pt(CX + 70, a.eyeY - 6)} ${pt(CX + 72, a.cheekY)}` +
      `C${pt(CX + 72, a.jawY - 10)} ${pt(CX + 44, a.chinY - 20)} ${pt(CX + 10, a.chinY + 4)}H${CX + 140}V${a.crownY - 10}Z`, sk.shade, op(0.85));
    // temples
    sh += E(CX - 84, a.browY + 4, 12, 26, sk.shade, op(0.45)) + E(CX + 84, a.browY + 4, 12, 26, sk.shade, op(0.6));
    // eye sockets
    [-1, 1].forEach(s => {
      sh += E(CX + s * a.eyeDX + s * 2, a.eyeY - 7, a.eyeRX + 9, a.eyeRY + 8, sk.shade, op(s > 0 ? 0.55 : 0.4));
    });
    // cheek hollows
    [-1, 1].forEach(s => {
      const cw = a.widthAt(a.cheekY) - 4;
      sh += P(`M${pt(CX + s * (cw + 2), a.cheekY - 2)}C${pt(CX + s * (cw - 18), a.cheekY + 4)} ${pt(CX + s * (cw - 34), a.cheekY + 14)} ${pt(CX + s * (cw - 40), a.cheekY + 26)}` +
        `C${pt(CX + s * (cw - 30), a.cheekY + 32)} ${pt(CX + s * (cw - 12), a.cheekY + 34)} ${pt(CX + s * (cw + 2), a.cheekY + 30)}Z`, sk.shade, op(s > 0 ? 0.7 : 0.5));
    });
    // jaw band
    sh += G(S(hp, sk.shade, 18, op(0.6)), `clip-path="url(#${id}jw)"`);
    out += `<clipPath id="${id}jw"><rect x="0" y="${a.jawY - 40}" width="400" height="200"/></clipPath>`;
    // highlights
    sh += E(CX - 20, a.crownY + 56, 34, 17, sk.light, op(0.45));
    sh += E(CX - 56, a.cheekY - 8, 15, 7, sk.light, `${op(0.45)} transform="rotate(-18 ${CX - 56} ${a.cheekY - 8})"`);
    sh += E(CX - 4, a.chinY - 12, 10, 4.5, sk.light, op(0.4));
    sh += E(CX - 2, a.eyeY + 14, 3.5, 12, sk.light, op(0.35));
    // under-nose shadow and philtrum
    sh += E(CX + 2, a.noseY + 7, 8, 2.8, sk.shade, op(0.75));
    sh += P(`M${pt(CX - 4, a.noseY + 10)}Q${pt(CX, a.mouthY - 8)} ${pt(CX - 5, a.mouthY - a.lipTop - 1)}H${CX + 5}Q${pt(CX + 1, a.mouthY - 8)} ${pt(CX + 4, a.noseY + 10)}Z`, sk.shade, op(0.35));
    out += G(sh, `clip-path="url(#${id}hd)"`);
    // nose: one shaded line and a nostril curve
    out += S(`M${pt(CX + 5, a.noseTop)}C${pt(CX + 10, a.noseTop + 14)} ${pt(CX + 12, a.noseY - 14)} ${pt(CX + 10, a.noseY - 3)}`, sk.deep, 2.2, op(0.75));
    out += S(`M${pt(CX + 12, a.noseY - 4)}C${pt(CX + 16, a.noseY + 2)} ${pt(CX + 9, a.noseY + 5.5)} ${pt(CX + 3, a.noseY + 3)}`, sk.line, 1.6);
    out += S(`M${pt(CX - 10, a.noseY + 0.5)}Q${pt(CX - 7, a.noseY + 4.5)} ${pt(CX - 2, a.noseY + 3.5)}`, sk.line, 1.3, op(0.7));
    out += C(CX - 3, a.noseY - 5, 2.6, sk.light, op(0.6));
    out += P(hp, 'none', `stroke="${sk.line}" stroke-width="1.5"`);
    return out;
  }

  /* ---------- eyes (whites, lenses, lids, brows) ---------- */

  const LENS = {
    none: { iris: '#3d2717', ring: '#24150c', r: 8.5, pupil: 5 },
    whiteout: { iris: '#ebe7df', ring: '#c4beb2', r: 9.5, pupil: 0 },
    red: { iris: '#b3121f', ring: '#560510', r: 9.5, pupil: 4 },
    cat: { iris: '#e6bd1e', ring: '#8a650c', r: 11.5, pupil: 0, slit: true },
    black: { iris: '#1d1719', ring: '#000000', r: 8.5, pupil: 4, sclera: '#0e0b0c' },
    ice: { iris: '#bfe3f2', ring: '#4f87a3', r: 9.5, pupil: 3 }
  };

  function eyes(a, look, sk, id) {
    const ft = a.ft;
    const lens = LENS[look.lenses] || LENS.none;
    let out = '';
    [-1, 1].forEach(s => {
      const g = eyeGeom(a, s);
      const ep = eyePath(g);
      const cid = `${id}e${s > 0 ? 'r' : 'l'}`;
      out += `<clipPath id="${cid}"><path d="${ep}"/></clipPath>`;
      let inner = P(ep, lens.sclera || '#f6f1e6');
      const ix = g.ex + 2, iy = g.ey + 1;
      inner += C(ix, iy, lens.r, lens.iris) + C(ix, iy, lens.r, 'none', `stroke="${lens.ring}" stroke-width="1.6"`);
      if (lens.slit) inner += E(ix, iy, 1.9, lens.r - 1.5, '#0d0805');
      else if (lens.pupil) inner += C(ix, iy, lens.pupil, '#0d0805');
      else inner += C(ix, iy, 2.4, '#cfc9be', op(0.8));
      inner += C(ix - 3, iy - 3.5, 1.9, '#ffffff', op(0.95));
      // lid shadow across the top of the eyeball
      inner += P(upperLid(g) + `L${pt(g.x2, g.y2 - 20)}L${pt(g.x1, g.y1 - 20)}Z`, '#000000', `${op(0.18)} transform="translate(0,5)"`);
      out += G(inner, `clip-path="url(#${cid})"`);
      // crease, lids and lashes
      out += S(upperLid(g), sk.deep, 1.3, `${op(0.7)} transform="translate(${s * 1.5},-6.5) scale(1)"`);
      out += S(lowerLid(g), sk.line, 1.1, op(0.6));
      out += S(upperLid(g, 3 + ft.lashLen * 0.3), '#1a100c', f(2.4 + (4 - ft.lashes) * 0.15));
      for (let i = 0; i < ft.lashes; i++) {
        const t = 0.62 + i * (0.36 / Math.max(1, ft.lashes - 1));
        const x = g.x1 + (g.x2 - g.x1) * t;
        const yTop = g.ey - g.ry * (1 - Math.pow((t - 0.5) * 2, 2)) * 0.98 - 1;
        const len = ft.lashLen * (0.75 + t * 0.35);
        out += S(`M${pt(x, yTop)}q${f(s * len * 0.35)},${f(-len * 0.45)} ${f(s * len * 0.8)},${f(-len * 0.75)}`, '#1a100c', 1.4);
      }
      // brows
      if (!look.hideBrows) out += brow(a, s, look.browColour);
    });
    return out;
  }

  function brow(a, s, colour) {
    const ft = a.ft, ex = CX + s * a.eyeDX, by = a.browY;
    const xi = ex - s * a.eyeRX * 0.95, xo = ex + s * a.eyeRX * 1.15;
    const peak = ex + s * a.eyeRX * 0.35;
    const t = ft.brow;
    const d = `M${pt(xi, by + 3)}C${pt(xi + s * 6, by - t - 2)} ${pt(peak - s * 8, by - ft.arch - t * 0.4)} ${pt(peak, by - ft.arch - 0.5)}` +
      `C${pt(peak + s * 8, by - ft.arch + 0.5)} ${pt(xo - s * 5, by - 2)} ${pt(xo, by + 3)}` +
      `C${pt(xo - s * 6, by + 1)} ${pt(peak + s * 6, by - ft.arch + t * 0.7)} ${pt(peak, by - ft.arch + t * 0.85)}` +
      `C${pt(peak - s * 9, by - ft.arch + t)} ${pt(xi + s * 4, by + t * 0.9)} ${pt(xi, by + t * 0.9 + 1)}Z`;
    return P(d, colour) + S(`M${pt(xi + s * 3, by + 1)}Q${pt(peak - s * 4, by - ft.arch)} ${pt(peak + s * 6, by - ft.arch + 1)}`, mix(colour, '#ffffff', 0.25), 0.7, op(0.6));
  }

  /* ---------- skin effects ---------- */

  function skinEffects(a, look, sk, id) {
    const R = rng(91), r = (x, y) => x + R() * (y - x);
    let out = '';
    switch (look.skin) {
      case 'corpse':
        out += E(CX - 82, a.browY + 8, 12, 28, '#6f5f72', op(0.25)) + E(CX + 82, a.browY + 8, 12, 28, '#6f5f72', op(0.35));
        [-1, 1].forEach(s => {
          out += P(`M${pt(CX + s * 80, a.cheekY)}Q${pt(CX + s * 54, a.cheekY + 12)} ${pt(CX + s * (a.mouthW + 18), a.mouthY - 6)}Q${pt(CX + s * 56, a.cheekY + 26)} ${pt(CX + s * 82, a.cheekY + 18)}Z`, '#6f5f72', op(0.3));
        });
        break;
      case 'zombie':
        for (let i = 0; i < 9; i++) {
          const x = CX + r(-70, 70), y = r(a.crownY + 40, a.chinY - 20);
          out += E(x, y, r(6, 16), r(5, 12), i % 3 ? '#5f6f44' : '#7a5a3a', `${op(f(r(0.25, 0.45)))} transform="rotate(${f(r(0, 180))} ${f(x)} ${f(y)})"`);
        }
        out += E(CX - a.mouthW - 6, a.mouthY + 4, 7, 4, '#3a2a1a', op(0.4)) + E(CX + a.mouthW + 6, a.mouthY + 3, 6, 4, '#3a2a1a', op(0.4));
        break;
      case 'ghostly':
        out += G(S(a.headPath, '#8f9bb5', 16, op(0.45)), `clip-path="url(#${id}hd)"`);
        break;
      case 'bruised':
        [[CX - 56, a.cheekY - 6, 18, 11], [CX + 62, a.crownY + 66, 14, 10], [CX + 50, a.jawY + 6, 13, 9]].forEach(([x, y, rx, ry]) => {
          out += E(x, y, rx * 1.4, ry * 1.4, '#a8a654', op(0.22)) + E(x, y, rx, ry, '#5a3a78', op(0.4)) + E(x + 2, y + 1, rx * 0.5, ry * 0.5, '#3d2252', op(0.35));
        });
        break;
    }
    return out ? G(out, `clip-path="url(#${id}hd)"`) : '';
  }

  /* ---------- face paint ---------- */

  function facePaint(a, look, sk, id) {
    const hp = a.headPath;
    const clip = `clip-path="url(#${id}hd)"`;
    let out = '';
    switch (look.facePaint) {
      case 'clown': {
        out += G(P(hp, '#f3efe6'), clip);
        // painted arched brows
        [-1, 1].forEach(s => {
          const ex = CX + s * a.eyeDX;
          out += S(`M${pt(ex - s * 20, a.browY - 4)}Q${pt(ex + s * 2, a.browY - 34)} ${pt(ex + s * 24, a.browY - 10)}`, '#141014', 3.4);
        });
        // grin
        const mw = a.mouthW, my = a.mouthY;
        out += P(`M${pt(CX - mw - 18, my - 14)}C${pt(CX - mw - 6, my - 6)} ${pt(CX - 10, my - 7)} ${pt(CX, my - 7)}C${pt(CX + 10, my - 7)} ${pt(CX + mw + 6, my - 6)} ${pt(CX + mw + 18, my - 14)}` +
          `C${pt(CX + mw + 18, my + 10)} ${pt(CX + 12, my + 16)} ${pt(CX, my + 16)}C${pt(CX - 12, my + 16)} ${pt(CX - mw - 18, my + 10)} ${pt(CX - mw - 18, my - 14)}Z`,
          '#b3141c', `stroke="#141014" stroke-width="1.6"`);
        // tear
        out += P(`M${pt(CX - a.eyeDX + 4, a.eyeY + a.eyeRY + 8)}q-4,8 0,11q4,-3 0,-11Z`, '#141014');
        out += C(CX + 1, a.noseY - 4, 11.5, '#c4161c', `stroke="#6e0a0e" stroke-width="1.2"`) + C(CX - 3, a.noseY - 8, 3.2, '#ff8a80', op(0.8));
        break;
      }
      case 'skull': {
        const half = `M${CX + 2},0L${CX - 1},${a.browY}L${CX + 3},${a.noseY - 20}L${CX - 1},${a.noseY + 6}L${CX + 2},${a.mouthY - 4}L${CX - 1},${a.chinY + 10}H0V0Z`;
        out += `<clipPath id="${id}sk"><path d="${half}"/></clipPath>`;
        let s = P(hp, '#ecebe5');
        s += G(S(hp, '#9b9a96', 16, op(0.6)), `clip-path="url(#${id}jw)"`);
        const ex = CX - a.eyeDX;
        s += P(`M${pt(ex - 34, a.eyeY - 4)}C${pt(ex - 34, a.eyeY - 36)} ${pt(ex + 20, a.eyeY - 40)} ${pt(ex + 30, a.eyeY - 10)}C${pt(ex + 36, a.eyeY + 14)} ${pt(ex + 22, a.eyeY + 34)} ${pt(ex - 2, a.eyeY + 32)}C${pt(ex - 26, a.eyeY + 30)} ${pt(ex - 34, a.eyeY + 18)} ${pt(ex - 34, a.eyeY - 4)}Z`, '#121012');
        s += P(`M${pt(CX + 2, a.noseY - 16)}C${pt(CX - 6, a.noseY - 8)} ${pt(CX - 14, a.noseY + 2)} ${pt(CX - 6, a.noseY + 6)}L${pt(CX + 2, a.noseY + 4)}Z`, '#121012');
        const cw = a.widthAt(a.cheekY);
        s += P(`M${pt(CX - cw, a.cheekY - 6)}Q${pt(CX - cw + 30, a.cheekY + 4)} ${pt(CX - a.mouthW - 16, a.mouthY - 8)}Q${pt(CX - cw + 26, a.cheekY + 36)} ${pt(CX - cw, a.cheekY + 34)}Z`, '#3a383c', op(0.85));
        s += E(CX - 84, a.browY + 4, 14, 26, '#7a787c', op(0.55));
        out += G(G(s, `clip-path="url(#${id}sk)"`), clip);
        break;
      }
      case 'sugarSkull': {
        let s = P(hp, '#f2ede3');
        [-1, 1].forEach(sd => {
          const ex = CX + sd * a.eyeDX, ey = a.eyeY;
          const c1 = sd < 0 ? '#2a8a99' : '#a3307a', c2 = sd < 0 ? '#e0a21c' : '#3f8a3a';
          for (let i = 0; i < 9; i++) {
            const th = i / 9 * Math.PI * 2;
            s += E(ex + Math.cos(th) * 31, ey + Math.sin(th) * 29, 7, 5, c2, `transform="rotate(${f(th * 180 / Math.PI)} ${f(ex + Math.cos(th) * 31)} ${f(ey + Math.sin(th) * 29)})"`);
          }
          s += E(ex, ey, 30, 28, c1) + E(ex, ey, 30, 28, 'none', `stroke="#141014" stroke-width="1.4"`);
          s += S(`M${pt(ex - 22, a.browY - 4)}q7,-8 14,0 q7,-8 14,0 q7,-8 14,0`, '#141014', 1.6);
        });
        s += P(`M${pt(CX, a.noseY + 6)}C${pt(CX - 16, a.noseY - 4)} ${pt(CX - 10, a.noseY - 18)} ${pt(CX, a.noseY - 10)}C${pt(CX + 10, a.noseY - 18)} ${pt(CX + 16, a.noseY - 4)} ${pt(CX, a.noseY + 6)}Z`, '#141014');
        // forehead flower
        const fy = a.crownY + 66;
        for (let i = 0; i < 6; i++) {
          const th = i / 6 * Math.PI * 2;
          s += E(CX + Math.cos(th) * 9, fy + Math.sin(th) * 9, 6, 4, '#c43d3d', `transform="rotate(${f(th * 180 / Math.PI)} ${f(CX + Math.cos(th) * 9)} ${f(fy + Math.sin(th) * 9)})"`);
        }
        s += C(CX, fy, 4.5, '#e0a21c');
        // chin dots and cheek swirls
        for (let i = -2; i <= 2; i++) s += C(CX + i * 9, a.chinY - 14 + Math.abs(i) * -2, 2.4, '#2a8a99');
        [-1, 1].forEach(sd => {
          s += S(`M${pt(CX + sd * 70, a.cheekY + 6)}c${sd * -8},-6 ${sd * -16},2 ${sd * -10},8 c${sd * 4},4 ${sd * 10},0 ${sd * 6},-4`, '#a3307a', 1.6);
        });
        out += G(s, clip);
        break;
      }
      case 'pumpkin': {
        let s = P(hp, '#e2741f');
        [-62, -30, 0, 30, 62].forEach(dx => {
          s += P(`M${pt(CX + dx, a.crownY - 10)}C${pt(CX + dx * 1.35 - 6, a.eyeY)} ${pt(CX + dx * 1.35 - 6, a.mouthY)} ${pt(CX + dx * 0.8, a.chinY + 10)}` +
            `L${pt(CX + dx * 0.8 + 7, a.chinY + 10)}C${pt(CX + dx * 1.35 + 4, a.mouthY)} ${pt(CX + dx * 1.35 + 4, a.eyeY)} ${pt(CX + dx + 7, a.crownY - 10)}Z`, '#c2580f', op(0.55));
        });
        s += G(S(hp, '#a8460c', 14, op(0.6)), '');
        s += E(CX - 30, a.crownY + 58, 24, 12, '#f39a4a', op(0.5));
        [-1, 1].forEach(sd => {
          const ex = CX + sd * a.eyeDX, ey = a.eyeY;
          s += P(`M${pt(ex - 30, ey + 24)}L${pt(ex + 30, ey + 24)}L${pt(ex + sd * 5, ey - 36)}Z`, '#120c08', `stroke-linejoin="round" stroke="#120c08" stroke-width="3"`);
        });
        s += P(`M${pt(CX - 11, a.noseY + 5)}L${pt(CX + 11, a.noseY + 5)}L${pt(CX, a.noseY - 15)}Z`, '#120c08', `stroke-linejoin="round" stroke="#120c08" stroke-width="2"`);
        out += G(s, clip);
        break;
      }
    }
    return out;
  }

  // Parts of face paint that sit over the mouth.
  function paintOverMouth(a, look) {
    const mw = a.mouthW, my = a.mouthY;
    let out = '';
    if (look.facePaint === 'skull') {
      const x0 = CX - 1, x1 = CX - mw - 22;
      out += P(`M${pt(x0, my - 9)}L${pt(x1, my - 7)}L${pt(x1 + 2, my + 8)}L${pt(x0, my + 10)}Z`, '#ecebe5');
      for (let x = x0; x > x1; x -= 6) {
        out += S(`M${pt(x, my - 8)}V${f(my + 9)}`, '#121012', 1.2);
      }
      out += S(`M${pt(x0, my)}L${pt(x1 - 2, my - 1)}`, '#121012', 1.8) + S(`M${pt(x0, my - 9)}L${pt(x1, my - 7)}M${pt(x0, my + 10)}L${pt(x1 + 2, my + 8)}`, '#121012', 1.2, op(0.7));
    } else if (look.facePaint === 'sugarSkull') {
      out += S(`M${pt(CX - mw - 30, my - 2)}Q${pt(CX, my + 4)} ${pt(CX + mw + 30, my - 2)}`, '#141014', 2);
      for (let i = -6; i <= 6; i++) {
        const x = CX + i * ((mw + 26) / 6);
        out += S(`M${pt(x, my - 6)}V${f(my + 7)}`, '#141014', 1.4);
      }
    } else if (look.facePaint === 'pumpkin') {
      out += P(`M${pt(CX - mw - 30, my - 14)}Q${pt(CX, my + 2)} ${pt(CX + mw + 30, my - 14)}L${pt(CX + mw + 18, my + 2)}Q${pt(CX + mw + 6, my + 14)} ${pt(CX + 8, my + 16)}` +
        `L${pt(CX + 8, my + 8)}L${pt(CX - 2, my + 8)}L${pt(CX - 2, my + 17)}Q${pt(CX - mw - 6, my + 16)} ${pt(CX - mw - 18, my + 2)}Z` +
        `M${pt(CX + 14, my - 4)}L${pt(CX + 22, my - 5)}L${pt(CX + 22, my + 3)}L${pt(CX + 14, my + 3)}Z M${pt(CX - 22, my - 5)}L${pt(CX - 13, my - 4)}L${pt(CX - 13, my + 3)}L${pt(CX - 22, my + 3)}Z`,
        '#120c08', 'fill-rule="evenodd"');
    }
    return out;
  }

  /* ---------- under-eyes ---------- */

  function underEyes(a, look) {
    let out = '';
    [-1, 1].forEach(s => {
      const ex = CX + s * a.eyeDX, ey = a.eyeY, rx = a.eyeRX, ry = a.eyeRY;
      switch (look.underEyes) {
        case 'hollows':
          out += E(ex + s * 2, ey + 2, rx + 12, ry + 14, '#5f4a5e', op(0.32));
          out += P(`M${pt(ex - rx - 4, ey + 2)}C${pt(ex - rx, ey + ry + 18)} ${pt(ex + rx, ey + ry + 18)} ${pt(ex + rx + 4, ey)}C${pt(ex + rx - 4, ey + ry + 6)} ${pt(ex - rx + 4, ey + ry + 6)} ${pt(ex - rx - 4, ey + 2)}Z`, '#3d2a3c', op(0.5));
          out += E(ex - s * rx * 0.9, ey + 3, 7, 9, '#3d2a3c', op(0.45));
          break;
        case 'bruised':
          out += E(ex, ey + 4, rx + 16, ry + 16, '#9b9a4c', op(0.25));
          out += E(ex, ey + 4, rx + 10, ry + 11, '#6d2f62', op(0.45));
          out += P(`M${pt(ex - rx - 6, ey)}C${pt(ex - rx, ey + ry + 16)} ${pt(ex + rx, ey + ry + 14)} ${pt(ex + rx + 6, ey - 2)}Z`, '#4a1a46', op(0.45));
          break;
        case 'kohl':
          out += P(`M${pt(ex - rx - 2, ey + 4)}C${pt(ex - rx, ey + ry + 8)} ${pt(ex + rx, ey + ry + 10)} ${pt(ex + rx + 6, ey)}C${pt(ex + rx + 2, ey + ry + 18)} ${pt(ex + 6, ey + ry + 16)} ${pt(ex + 2, ey + ry + 28)}` +
            `C${pt(ex - 2, ey + ry + 18)} ${pt(ex - 10, ey + ry + 14)} ${pt(ex - 12, ey + ry + 22)}C${pt(ex - 14, ey + ry + 12)} ${pt(ex - rx, ey + ry + 8)} ${pt(ex - rx - 2, ey + 4)}Z`, '#141012', op(0.7));
          out += S(`M${pt(ex + s * 8, ey + ry + 8)}q${f(s * 2)},14 ${f(s * -1)},26`, '#141012', 2, op(0.45));
          break;
        case 'sockets':
          out += E(ex + s * 1, ey - 2, rx + 20, ry + 22, '#2a1d22', op(0.38));
          out += E(ex + s * 1, ey, rx + 11, ry + 13, '#140c10', op(0.8));
          break;
      }
    });
    return out;
  }

  /* ---------- eye makeup ---------- */

  function eyeMakeup(a, look, id) {
    let out = '';
    [-1, 1].forEach(s => {
      const g = eyeGeom(a, s);
      const ex = g.ex, ey = g.ey, rx = g.rx, ry = g.ry;
      const hole = (d, fill, extra) => P(d, fill, extra);
      switch (look.eyes) {
        case 'smoky':
          out += hole(`M${pt(g.x1 - s * 2, ey + 4)}C${pt(g.x1, ey - ry - 18)} ${pt(g.x2 + s * 6, ey - ry - 20)} ${pt(g.x2 + s * 14, ey - 6)}C${pt(g.x2 + s * 10, ey + ry + 6)} ${pt(g.x1, ey + ry + 8)} ${pt(g.x1 - s * 2, ey + 4)}Z`, '#141012', op(0.38));
          out += hole(`M${pt(g.x1, ey + 2)}C${pt(g.x1, ey - ry - 10)} ${pt(g.x2, ey - ry - 12)} ${pt(g.x2 + s * 8, ey - 3)}C${pt(g.x2, ey + ry - 2)} ${pt(g.x1, ey + ry)} ${pt(g.x1, ey + 2)}Z`, '#141012', op(0.82));
          out += S(upperLid(g, 6), '#0a0809', 3.4);
          break;
        case 'redLiner':
          out += P(upperLid(g) + `L${pt(g.x2 + s * 14, ey - 14)}L${pt(g.x2 - s * 4, ey - ry * 0.55)}` +
            `C${pt(g.x2 - (g.x2 - g.x1) * 0.15, ey - ry - 3)} ${pt(g.x1 + (g.x2 - g.x1) * 0.15, ey - ry - 2)} ${pt(g.x1, g.y1)}Z`, '#a3101d');
          out += S(lowerLid(g), '#a3101d', 2.6);
          if (s > 0) out += P(`M${pt(g.x2 - 3, ey + 6)}q-3,14 -1,22q4,4 6,0q1,-10 -5,-22Z`, '#8e0d18') + C(g.x2 - 1, ey + 26, 1.2, '#ff6b6b', op(0.7));
          break;
        case 'glitter': {
          const R = rng(s > 0 ? 7 : 3);
          out += hole(`M${pt(g.x1, ey + 1)}C${pt(g.x1, ey - ry - 12)} ${pt(g.x2, ey - ry - 14)} ${pt(g.x2 + s * 6, ey - 2)}C${pt(g.x2, ey - ry * 0.4)} ${pt(g.x1, ey - ry * 0.4)} ${pt(g.x1, ey + 1)}Z`, '#6b4c8f', op(0.75));
          for (let i = 0; i < 26; i++) {
            const t = R(), x = g.x1 + (g.x2 - g.x1) * t, y = ey - ry * (0.9 + R() * 0.45) * (1 - Math.pow(t - 0.5, 2) * 1.6) + R() * 6;
            out += `<rect x="${f(x)}" y="${f(y)}" width="1.6" height="1.6" fill="${['#e9d8ff', '#ffd1e8', '#d8c27a', '#ffffff'][i % 4]}" transform="rotate(45 ${f(x)} ${f(y)})"/>`;
          }
          const sx = g.x2 - s * 2, sy = ey - ry - 4;
          out += P(`M${pt(sx, sy - 6)}L${pt(sx + 1.2, sy - 1.2)}L${pt(sx + 6, sy)}L${pt(sx + 1.2, sy + 1.2)}L${pt(sx, sy + 6)}L${pt(sx - 1.2, sy + 1.2)}L${pt(sx - 6, sy)}L${pt(sx - 1.2, sy - 1.2)}Z`, '#ffffff', op(0.95));
          for (let i = 0; i < 8; i++) {
            const x = ex + (R() - 0.5) * rx * 1.6, y = ey + ry + 2 + R() * 6;
            out += C(x, y, 0.8, '#e9d8ff', op(0.9));
          }
          break;
        }
        case 'diamonds':
          out += hole(`M${pt(ex, a.browY - 18)}L${pt(ex + rx * 0.82, ey)}L${pt(ex, ey + ry + 30)}L${pt(ex - rx * 0.82, ey)}Z`, '#1c2a6b', `stroke="#0e1433" stroke-width="1"`);
          break;
      }
    });
    if (!out) return '';
    // keep makeup off the eyeballs
    const clip = `<clipPath id="${id}nx"><path d="M-50,-50H450V600H-50Z${eyePath(eyeGeom(a, -1))}${eyePath(eyeGeom(a, 1))}" clip-rule="evenodd"/></clipPath>`;
    return clip + G(out, `clip-path="url(#${id}nx)"`);
  }

  /* ---------- lips ---------- */

  const LIPS = {
    black: '#17121a',
    blood: '#8e0d18',
    blue: '#56658c',
    stitched: null
  };

  function lips(a, look, sk) {
    const mw = a.mouthW, my = a.mouthY, lt = a.lipTop, lb = a.lipBot;
    let colour = LIPS[look.lips] || (a.features === 'masculine' ? mix(sk.lip, sk.base, 0.4) : sk.lip);
    if (look.lips === 'stitched') colour = mix(sk.lip, '#6a5a6e', 0.55);
    const upper = `M${pt(CX - mw, my)}C${pt(CX - mw * 0.6, my - lt * 0.9)} ${pt(CX - mw * 0.32, my - lt - 0.5)} ${pt(CX - 3, my - lt + 0.4)}Q${pt(CX, my - lt + 1.6)} ${pt(CX + 3, my - lt + 0.4)}` +
      `C${pt(CX + mw * 0.32, my - lt - 0.5)} ${pt(CX + mw * 0.6, my - lt * 0.9)} ${pt(CX + mw, my)}Q${pt(CX, my + 2)} ${pt(CX - mw, my)}Z`;
    const lower = `M${pt(CX - mw, my)}Q${pt(CX, my + 2)} ${pt(CX + mw, my)}C${pt(CX + mw * 0.6, my + lb * 1.35)} ${pt(CX - mw * 0.6, my + lb * 1.35)} ${pt(CX - mw, my)}Z`;
    let out = E(CX, my + lb + 4, mw * 0.5, 2.6, sk.shade, op(0.7));
    out += P(lower, colour) + P(upper, mix(colour, '#000000', 0.12));
    out += E(CX - 3, my + lb * 0.5, mw * 0.32, lb * 0.22, '#ffffff', op(look.lips === 'black' ? 0.18 : 0.28));
    out += S(`M${pt(CX - mw, my)}Q${pt(CX - mw * 0.5, my + 2)} ${pt(CX, my + 1)}Q${pt(CX + mw * 0.5, my + 2)} ${pt(CX + mw, my)}`, mix(colour, '#1a0a0a', 0.6), 1.5);
    out += C(CX - mw, my, 1.2, sk.line, op(0.6)) + C(CX + mw, my, 1.2, sk.line, op(0.6));
    if (look.lips === 'stitched') {
      for (let i = -3; i <= 3; i++) {
        const x = CX + i * (mw / 3.6);
        out += S(`M${pt(x, my - lt - 3)}L${pt(x, my + lb + 3)}`, '#120c10', 1.4);
        out += S(`M${pt(x - 2.5, my - 2)}L${pt(x + 2.5, my + 2)}`, '#120c10', 1);
        out += C(x, my - lt - 3, 1.1, '#7a1a22') + C(x, my + lb + 3, 1.1, '#7a1a22');
      }
    }
    return out + paintOverMouth(a, look);
  }

  /* ---------- face effects ---------- */

  function faceEffects(a, look, sk, id) {
    const R = rng(103), r = (x, y) => x + R() * (y - x);
    let out = '';
    const mw = a.mouthW, my = a.mouthY;
    switch (look.effects) {
      case 'wound': {
        const x = CX + 50, y = a.cheekY + 18;
        const ring = [];
        for (let i = 0; i < 16; i++) {
          const th = i / 16 * Math.PI * 2, rad = r(0.75, 1.15);
          ring.push([x + Math.cos(th) * 17 * rad, y + Math.sin(th) * 12 * rad]);
        }
        const inner = ring.map(([px, py]) => [x + (px - x) * 0.62 + r(-1.5, 1.5), y + (py - y) * 0.62 + r(-1.5, 1.5)]);
        out += P(spline(ring.map(([px, py]) => [x + (px - x) * 1.25, y + (py - y) * 1.25]), true), '#9a3a3a', op(0.25));
        out += P(spline(ring, true), sk.light, `stroke="${sk.deep}" stroke-width="1"`);
        out += P(spline(inner, true), '#6e0a12');
        out += P(spline(inner.map(([px, py]) => [x + (px - x) * 0.55, y + (py - y) * 0.5 + 1]), true), '#2e0306');
        out += C(x - 4, y - 2, 1.6, '#e0525a', op(0.8)) + C(x + 5, y + 1, 1.1, '#e0525a', op(0.7));
        out += P(`M${pt(x - 3, y + 8)}q-2,12 1,20q4,1 3,-4q-1,-8 -4,-16Z`, '#6e0a12');
        break;
      }
      case 'stitchedMouth':
        [-1, 1].forEach(s => {
          const x0 = CX + s * mw, x1 = CX + s * (mw + 36), y1 = my - 22;
          const d = `M${pt(x0, my)}Q${pt(CX + s * (mw + 20), my - 4)} ${pt(x1, y1)}`;
          out += S(d, '#a04048', 6, op(0.3)) + S(d, '#4a1018', 1.8);
          for (let i = 1; i <= 4; i++) {
            const t = i / 5, x = x0 + (x1 - x0) * t, y = my + (y1 - my) * t * t;
            out += S(`M${pt(x - s * 3, y - 4)}L${pt(x + s * 3, y + 4)}`, '#120c10', 1.3);
          }
        });
        break;
      case 'scar': {
        const x0 = CX - 74, y0 = a.eyeY + 26, x1 = CX - 34, y1 = a.cheekY + 42;
        const d = `M${pt(x0, y0)}Q${pt(CX - 60, a.cheekY + 20)} ${pt(x1, y1)}`;
        out += S(d, '#c46a6a', 7, op(0.35)) + S(d, '#7a2a30', 2.2) + S(d, sk.light, 0.8, `${op(0.7)} transform="translate(-1,-1)"`);
        for (let i = 1; i <= 5; i++) {
          const t = i / 6;
          const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * (CX - 60) + t * t * x1;
          const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * (a.cheekY + 20) + t * t * y1;
          out += S(`M${pt(x - 5, y + 2)}L${pt(x + 5, y - 3)}M${pt(x - 4, y - 3)}L${pt(x + 4, y + 2)}`, '#141012', 1.2);
        }
        break;
      }
      case 'cracked': {
        let c = '';
        [-1, 1].forEach(s => c += E(CX + s * 52, a.cheekY + 6, 15, 11, '#e2737f', op(0.55)) + E(CX + s * 52 - 3, a.cheekY + 3, 5, 3, '#ffffff', op(0.4)));
        const cracks = [
          [[CX - 70, a.crownY + 50], [CX - 52, a.crownY + 66], [CX - 56, a.browY - 8], [CX - 40, a.browY + 6]],
          [[CX - 52, a.crownY + 66], [CX - 30, a.crownY + 62], [CX - 18, a.crownY + 74]],
          [[CX - 64, a.eyeY + 28], [CX - 72, a.cheekY + 6], [CX - 60, a.cheekY + 30], [CX - 66, a.jawY]],
          [[CX - 72, a.cheekY + 6], [CX - 84, a.cheekY + 16]],
          [[CX + 30, a.chinY - 8], [CX + 22, a.mouthY + 16], [CX + 30, a.mouthY + 6]]
        ];
        cracks.forEach(line => {
          const d = 'M' + line.map(p => pt(p[0], p[1])).join('L');
          c += S(d, sk.light, 1.1, `${op(0.9)} transform="translate(1,1)"`) + S(d, '#2b2226', 1.2);
        });
        const chip = `M${pt(CX + 54, a.crownY + 48)}L${pt(CX + 70, a.crownY + 56)}L${pt(CX + 66, a.crownY + 70)}L${pt(CX + 74, a.crownY + 82)}L${pt(CX + 56, a.crownY + 80)}L${pt(CX + 50, a.crownY + 64)}Z`;
        c += P(chip, '#1a1214') + S(chip, sk.light, 1, `${op(0.8)} transform="translate(-1,-1)"`);
        out += G(c, `clip-path="url(#${id}hd)"`);
        break;
      }
      case 'veins': {
        const vein = (x, y, ang, len, depth) => {
          let d = '';
          const ex = x + Math.cos(ang) * len, ey = y + Math.sin(ang) * len;
          d += S(`M${pt(x, y)}Q${pt((x + ex) / 2 + r(-4, 4), (y + ey) / 2 + r(-4, 4))} ${pt(ex, ey)}`, '#4b3a6b', f(1.6 - depth * 0.4), op(0.75));
          if (depth < 2) {
            d += vein(ex, ey, ang + r(0.3, 0.7), len * 0.65, depth + 1);
            d += vein(ex, ey, ang - r(0.3, 0.7), len * 0.6, depth + 1);
          }
          return d;
        };
        out += G(vein(CX - 88, a.browY - 10, 0.5, 16, 0) + vein(CX + 88, a.browY - 6, Math.PI - 0.4, 16, 0) +
          vein(CX - 34, a.eyeY + 30, 2.2, 12, 0) + vein(CX + 52, a.eyeY + 28, 1.0, 12, 0) +
          vein(CX - 76, a.jawY - 10, -0.8, 14, 0), `clip-path="url(#${id}hd)"`);
        out += vein(CX + a.neckW - 8, a.collarY + 4, -1.8, 18, 0);
        break;
      }
    }
    return out;
  }

  /* ---------- fangs, blood, wart and nose ---------- */

  function extras(a, look, sk) {
    const list = look.extras || [];
    const mw = a.mouthW, my = a.mouthY;
    let out = '';
    if (list.includes('nose')) {
      const t = a.noseTop - 2, ny = a.noseY;
      const d = `M${pt(CX - 6, t)}C${pt(CX - 4, t + 16)} ${pt(CX - 2, ny - 18)} ${pt(CX - 4, ny - 6)}C${pt(CX - 8, ny + 6)} ${pt(CX - 2, ny + 14)} ${pt(CX + 8, ny + 20)}` +
        `C${pt(CX + 14, ny + 23)} ${pt(CX + 20, ny + 20)} ${pt(CX + 18, ny + 12)}C${pt(CX + 22, ny + 6)} ${pt(CX + 16, ny - 6)} ${pt(CX + 14, ny - 12)}` +
        `C${pt(CX + 10, ny - 22)} ${pt(CX + 14, t + 8)} ${pt(CX + 8, t)}Z`;
      out += E(CX + 6, ny + 10, 18, 9, sk.shade, op(0.5));
      out += P(d, sk.base, `stroke="${sk.line}" stroke-width="1.5"`);
      out += P(`M${pt(CX + 8, t + 2)}C${pt(CX + 14, t + 12)} ${pt(CX + 12, ny - 20)} ${pt(CX + 16, ny - 8)}C${pt(CX + 22, ny + 6)} ${pt(CX + 18, ny + 18)} ${pt(CX + 10, ny + 20)}C${pt(CX + 16, ny + 10)} ${pt(CX + 12, ny)} ${pt(CX + 6, ny - 10)}Z`, sk.shade, op(0.85));
      out += E(CX + 1, ny - 14, 3, 5, sk.light, op(0.5)) + C(CX + 4, ny - 2, 3.6, sk.base, `stroke="${sk.deep}" stroke-width="0.8"`);
      out += S(`M${pt(CX + 2, ny + 12)}q4,4 10,4`, sk.line, 1.4);
    }
    if (list.includes('wart')) {
      const x = CX - 22, y = Math.min(a.chinY - 18, a.mouthY + 26);
      out += C(x, y, 5.5, mix(sk.base, '#6f6232', 0.35), `stroke="${sk.line}" stroke-width="0.8"`);
      out += C(x - 1.5, y - 1.5, 1.6, sk.light, op(0.6)) + C(x + 2, y + 1.5, 1.4, mix(sk.base, '#3a2a10', 0.5), op(0.6));
      out += S(`M${pt(x + 1, y - 4)}q2,-6 6,-7M${pt(x - 1, y - 4)}q-1,-5 1,-9`, '#2a2018', 0.8);
    }
    if (list.includes('fangs')) {
      [-1, 1].forEach(s => {
        const x = CX + s * mw * 0.42;
        out += P(`M${pt(x - 3.6, my + 0.5)}L${pt(x + 3.6, my + 0.5)}L${pt(x + s * 0.8, my + 12)}Z`, '#f8f4ea', `stroke="#6a5a50" stroke-width="0.8" stroke-linejoin="round"`);
      });
    }
    if (list.includes('blood')) {
      const x = CX - mw * 0.55;
      out += P(`M${pt(x - 3, my + 2)}C${pt(x - 4, my + 14)} ${pt(x - 2, a.chinY - 16)} ${pt(x - 4, a.chinY - 4)}C${pt(x - 5, a.chinY + 2)} ${pt(x + 2, a.chinY + 2)} ${pt(x + 1, a.chinY - 4)}C${pt(x + 1, my + 22)} ${pt(x + 4, my + 10)} ${pt(x + 3, my + 2)}Z`, '#7d0a12');
      out += S(`M${pt(x - 1.5, my + 8)}V${f(my + 18)}`, '#e0525a', 0.8, op(0.7));
      out += P(`M${pt(CX + mw * 0.42 + 1, my + 10)}q-2,6 0,9q2,-3 0,-9Z`, '#7d0a12');
      out += E(CX + 16, my + 3, 5, 2, '#7d0a12', op(0.7));
    }
    return out;
  }

  /* ---------- clothing ---------- */
  // Each returns { back, main, collar, clip } where clip is the neckline opening.

  function shade(d, id, content) {
    return `<clipPath id="${id}"><path d="${d}"/></clipPath>` + G(content, `clip-path="url(#${id})"`);
  }

  const CLOTHES = {
    plain(a, id) {
      const nw = a.neckW, y = a.collarY;
      const o = { nlW: nw + 8, nlY: y - 10, nlD: y + 14 };
      const d = bodice(a, o);
      let s = P(`M${CX + 36},${y}C${CX + 66},${y + 30} ${CX + 78},${y + 80} ${CX + 70},560H460V${y - 40}Z`, '#1d1b20');
      s += P(`M${CX - 110},${y + 30}C${CX - 80},${y + 60} ${CX - 70},${y + 110} ${CX - 76},560H${CX - 96}C${CX - 92},${y + 110} ${CX - 100},${y + 60} ${CX - 120},${y + 34}Z`, '#3c3940', op(0.8));
      s += S(`M${CX - 86},${y + 36}Q${CX - 50},${y + 70} ${CX - 30},${y + 120}`, '#1a181c', 2, op(0.7));
      s += S(`M${CX + 92},${y + 40}Q${CX + 60},${y + 80} ${CX + 50},${y + 130}`, '#141216', 2.2, op(0.8));
      s += S(`M${CX - a.shoulderW + 24},${y + 22}C${CX - a.shoulderW + 34},${y + 60} ${CX - a.shoulderW + 30},${y + 110} ${CX - a.shoulderW + 34},560`, '#1a181c', 1.4);
      s += S(`M${CX + a.shoulderW - 24},${y + 22}C${CX + a.shoulderW - 34},${y + 60} ${CX + a.shoulderW - 30},${y + 110} ${CX + a.shoulderW - 34},560`, '#141216', 1.4);
      // ribbed neckband
      const band = `M${pt(CX - o.nlW - 2, o.nlY - 1)}C${pt(CX - o.nlW * 0.6, o.nlD + 1)} ${pt(CX + o.nlW * 0.6, o.nlD + 1)} ${pt(CX + o.nlW + 2, o.nlY - 1)}` +
        `L${pt(CX + o.nlW + 9, o.nlY + 3)}C${pt(CX + o.nlW * 0.7, o.nlD + 10)} ${pt(CX - o.nlW * 0.7, o.nlD + 10)} ${pt(CX - o.nlW - 9, o.nlY + 3)}Z`;
      s += P(band, '#252328') + S(`M${pt(CX - o.nlW - 8, o.nlY + 4)}C${pt(CX - o.nlW * 0.7, o.nlD + 10)} ${pt(CX + o.nlW * 0.7, o.nlD + 10)} ${pt(CX + o.nlW + 8, o.nlY + 4)}`, '#47434b', 1, op(0.8));
      const main = P(d, '#2e2b31') + shade(d, id + 'pl', s) + P(d, 'none', 'stroke="#121014" stroke-width="1.4"');
      return { back: '', main, collar: '', clip: neckClip(o) };
    },

    vampire(a, id) {
      const nw = a.neckW, y = a.collarY, sw = a.shoulderW;
      // standing collar behind the head
      const outer = `M${pt(CX - 150, a.eyeY + 6)}C${pt(CX - 128, a.eyeY + 50)} ${pt(CX - 96, y - 50)} ${pt(CX - 66, y + 4)}L${pt(CX + 66, y + 4)}` +
        `C${pt(CX + 96, y - 50)} ${pt(CX + 128, a.eyeY + 50)} ${pt(CX + 150, a.eyeY + 6)}C${pt(CX + 120, a.eyeY - 30)} ${pt(CX + 60, a.eyeY - 40)} ${pt(CX, a.eyeY - 30)}` +
        `C${pt(CX - 60, a.eyeY - 40)} ${pt(CX - 120, a.eyeY - 30)} ${pt(CX - 150, a.eyeY + 6)}Z`;
      let lin = '';
      for (let i = -4; i <= 4; i++) {
        if (!i) continue;
        lin += S(`M${pt(CX + i * 8, y)}Q${pt(CX + i * 24, y - 70)} ${pt(CX + i * 36, a.eyeY - 14)}`, '#4e0913', 3, op(0.7));
        lin += S(`M${pt(CX + i * 8 - 3, y)}Q${pt(CX + i * 24 - 4, y - 70)} ${pt(CX + i * 36 - 4, a.eyeY - 14)}`, '#9c1f30', 1.2, op(0.6));
      }
      const back = P(outer, '#121014') + P(outer, '#7a0f1f', `transform="translate(0,6) scale(1,0.97)" transform-origin="${CX} ${y}"`) + shade(outer, id + 'vl', lin) +
        S(`M${pt(CX - 150, a.eyeY + 6)}C${pt(CX - 120, a.eyeY - 30)} ${pt(CX - 60, a.eyeY - 40)} ${pt(CX, a.eyeY - 30)}C${pt(CX + 60, a.eyeY - 40)} ${pt(CX + 120, a.eyeY - 30)} ${pt(CX + 150, a.eyeY + 6)}`, '#c9a24a', 1.2, op(0.7));
      const o = { nlW: nw + 6, nlY: y - 14, nlD: y - 6 };
      const body = bodice(a, o);
      // shirt and waistcoat under the cape
      let inner = P(`M${CX - 40},${y - 10}L${CX + 40},${y - 10}L${CX + 20},560L${CX - 20},560Z`, '#ece6da');
      inner += S(`M${CX},${y + 40}V560`, '#c9c0b0', 1.2);
      const wc = `M${CX - 70},${y + 10}L${CX - 22},${y + 20}L${CX - 4},560H${CX - 90}Z M${CX + 70},${y + 10}L${CX + 22},${y + 20}L${CX + 4},560H${CX + 90}Z`;
      inner += P(wc, '#5e0f1c') + P(`M${CX + 22},${y + 20}L${CX + 4},560H${CX + 90}L${CX + 70},${y + 10}Z`, '#3e0912', op(0.6));
      for (let i = 0; i < 6; i++) inner += S(`M${CX - 66 + i * 8},${y + 26}l4,6l-4,6l4,6`, '#7c1a2a', 1, op(0.8));
      inner += S(`M${CX - 22},${y + 20}L${CX - 4},560`, '#2a050b', 1.4) + S(`M${CX + 22},${y + 20}L${CX + 4},560`, '#2a050b', 1.4);
      [y + 60, y + 86, y + 112].forEach(by => inner += C(CX - 12, by, 3, '#c9a24a', 'stroke="#8a6d2a" stroke-width="0.8"') + C(CX - 13, by - 1, 1, '#f0d890'));
      // cape panels
      const capeL = `M${pt(CX - nw - 6, y - 16)}C${pt(CX - nw - 24, y - 8)} ${pt(CX - sw + 30, y + 8)} ${pt(CX - sw - 2, y + 22)}C${pt(CX - sw - 16, y + 32)} ${pt(CX - sw - 22, y + 70)} ${pt(CX - sw - 24, 560)}L${CX - 58},560C${CX - 62},${y + 80} ${CX - 52},${y + 20} ${pt(CX - nw - 6, y - 16)}Z`;
      let capeS = '';
      capeS += S(`M${CX - sw + 10},${y + 40}C${CX - sw + 20},${y + 80} ${CX - sw + 16},${y + 120} ${CX - sw + 22},560`, '#2c2832', 2.2, op(0.9));
      capeS += S(`M${CX - 80},${y + 40}C${CX - 76},${y + 90} ${CX - 82},${y + 130} ${CX - 78},560`, '#2c2832', 1.6, op(0.8));
      capeS += P(`M${CX + 60},${y}C${CX + 90},${y + 40} ${CX + 96},${y + 90} ${CX + 92},560H460V${y - 40}Z`, '#000000', op(0.45));
      capeS += S(`M${CX - 58},560C${CX - 62},${y + 80} ${CX - 52},${y + 20} ${CX - nw - 6},${y - 16}`, '#7a0f1f', 3);
      capeS += S(`M${CX + 58},560C${CX + 62},${y + 80} ${CX + 52},${y + 20} ${CX + nw + 6},${y - 16}`, '#7a0f1f', 3);
      const cape = `M${pt(CX - nw - 6, y - 16)}C${pt(CX - nw - 24, y - 8)} ${pt(CX - sw + 30, y + 8)} ${pt(CX - sw - 2, y + 22)}C${pt(CX - sw - 16, y + 32)} ${pt(CX - sw - 22, y + 70)} ${pt(CX - sw - 24, 560)}H${CX - 58}C${CX - 62},${y + 80} ${CX - 52},${y + 20} ${pt(CX - nw - 6, y - 16)}Z` +
        `M${pt(CX + nw + 6, y - 16)}C${pt(CX + nw + 24, y - 8)} ${pt(CX + sw - 30, y + 8)} ${pt(CX + sw + 2, y + 22)}C${pt(CX + sw + 16, y + 32)} ${pt(CX + sw + 22, y + 70)} ${pt(CX + sw + 24, 560)}H${CX + 58}C${CX + 62},${y + 80} ${CX + 52},${y + 20} ${pt(CX + nw + 6, y - 16)}Z`;
      const main = shade(body, id + 'vb', inner) + P(cape, '#141216', 'stroke="#050405" stroke-width="1.2"') + shade(cape, id + 'vc', capeS);
      // shirt collar points and cravat
      let collar = P(`M${pt(CX - nw - 4, y - 22)}L${pt(CX - 6, y + 4)}L${pt(CX - nw + 2, y + 10)}L${pt(CX - nw - 10, y - 6)}Z`, '#f2ede3', 'stroke="#9a9284" stroke-width="1"');
      collar += P(`M${pt(CX + nw + 4, y - 22)}L${pt(CX + 6, y + 4)}L${pt(CX + nw - 2, y + 10)}L${pt(CX + nw + 10, y - 6)}Z`, '#ddd6c8', 'stroke="#9a9284" stroke-width="1"');
      const cr = [[0, y - 4, 22, 10], [-4, y + 12, 26, 12], [3, y + 28, 24, 12], [-2, y + 42, 20, 11]];
      cr.forEach(([dx, cy, rx, ry], i) => {
        collar += P(`M${pt(CX + dx - rx, cy)}C${pt(CX + dx - rx, cy + ry * 1.2)} ${pt(CX + dx + rx, cy + ry * 1.2)} ${pt(CX + dx + rx, cy)}C${pt(CX + dx + rx * 0.5, cy - ry * 0.4)} ${pt(CX + dx - rx * 0.5, cy - ry * 0.4)} ${pt(CX + dx - rx, cy)}Z`,
          i % 2 ? '#e8e1d4' : '#f4efe5', 'stroke="#a49a8a" stroke-width="1"');
        collar += S(`M${pt(CX + dx - rx * 0.5, cy + 2)}q${f(rx * 0.25)},${f(ry * 0.7)} ${f(rx * 0.5)},${f(ry * 0.2)}M${pt(CX + dx + 2, cy + 3)}q${f(rx * 0.25)},${f(ry * 0.6)} ${f(rx * 0.55)},0`, '#bdb3a2', 1);
      });
      collar += C(CX, y + 8, 4.5, '#a3101d', 'stroke="#c9a24a" stroke-width="1.4"') + C(CX - 1.5, y + 6.5, 1.3, '#ff9a9a');
      return { back, main, collar, clip: neckClip({ nlW: nw + 6, nlY: y - 18, nlD: y - 18 }) };
    },

    shawl(a, id) {
      const nw = a.neckW, y = a.collarY, sw = a.shoulderW;
      const o = { nlW: nw + 10, nlY: y - 8, nlD: y + 18 };
      const dress = bodice(a, o);
      let main = P(dress, '#2b2622') + shade(dress, id + 'hd1', P(`M${CX + 40},${y}C${CX + 70},${y + 40} ${CX + 80},${y + 90} ${CX + 70},560H460V${y - 40}Z`, '#191512'));
      const R = rng(5), r = (x, yy) => x + R() * (yy - x);
      // ragged shawl draped over the shoulders, crossing at the front
      let edge = '';
      const pts = [];
      for (let i = 0; i <= 14; i++) {
        const t = i / 14, x = CX - sw - 20 + t * (sw + 20 - 4);
        pts.push([x, y + 40 + Math.sin(t * Math.PI) * 60 + (i % 2 ? r(10, 22) : 0)]);
      }
      edge = pts.map(p => pt(p[0], p[1])).join('L');
      const right = pts.map(([x, yy]) => [2 * CX - x, yy]).reverse().map(p => pt(p[0], p[1])).join('L');
      const shawl = `M${pt(CX - nw - 8, y - 18)}C${pt(CX - nw - 30, y - 8)} ${pt(CX - sw + 20, y + 4)} ${pt(CX - sw - 18, y + 30)}L${edge}L${pt(CX + 4, y + 70)}L${right}` +
        `L${pt(CX + sw + 18, y + 30)}C${pt(CX + sw - 20, y + 4)} ${pt(CX + nw + 30, y - 8)} ${pt(CX + nw + 8, y - 18)}C${pt(CX + nw + 4, y + 12)} ${pt(CX + 20, y + 30)} ${pt(CX, y + 36)}C${pt(CX - 20, y + 30)} ${pt(CX - nw - 4, y + 12)} ${pt(CX - nw - 8, y - 18)}Z`;
      let tex = '';
      for (let row = 0; row < 14; row++) {
        const yy = y - 10 + row * 9;
        let d = '';
        for (let x = CX - sw - 20; x < CX + sw + 20; x += 8) d += `M${x},${yy}l4,5l4,-5`;
        tex += S(d, row % 2 ? '#3a3a2a' : '#5c5b46', 1, op(0.8));
      }
      tex += P(`M${CX + 30},${y + 10}C${CX + 70},${y + 30} ${CX + 100},${y + 70} ${CX + 120},560H460V${y - 40}Z`, '#000000', op(0.35));
      [[CX - 70, y + 50], [CX + 86, y + 34], [CX - 30, y + 80]].forEach(([hx, hy]) => tex += E(hx, hy, 6, 4, '#120f0c', `transform="rotate(20 ${hx} ${hy})"`));
      main += P(shawl, '#4a4a38', 'stroke="#22221a" stroke-width="1.2"') + shade(shawl, id + 'hs', tex);
      // tassels on the points
      pts.forEach(([x, yy], i) => { if (i % 2) main += S(`M${pt(x, yy)}l-1,10M${pt(2 * CX - x, yy)}l1,10`, '#3a3a2a', 1.6); });
      const collar = E(CX, y + 40, 14, 10, '#4a4a38', 'stroke="#22221a" stroke-width="1.2"') + S(`M${CX - 8},${y + 38}q8,6 16,0`, '#22221a', 1.2) +
        P(`M${CX - 6},${y + 46}L${CX - 14},${y + 86}L${CX - 2},${y + 82}Z M${CX + 6},${y + 46}L${CX + 16},${y + 90}L${CX + 4},${y + 84}Z`, '#3d3d2e', 'stroke="#22221a" stroke-width="1"');
      return { back: '', main, collar, clip: neckClip(o) };
    },

    zombie(a, id) {
      const nw = a.neckW, y = a.collarY;
      const o = { nlW: nw + 4, nlY: y - 12, nlD: y + 54, vee: true };
      const d = bodice(a, o);
      const R = rng(17), r = (x, yy) => x + R() * (yy - x);
      let s = P(`M${CX + 30},${y}C${CX + 60},${y + 40} ${CX + 76},${y + 90} ${CX + 66},560H460V${y - 40}Z`, '#a69c80');
      s += S(`M${CX - 96},${y + 40}Q${CX - 60},${y + 60} ${CX - 40},${y + 120}`, '#968c70', 2.2);
      s += S(`M${CX + 100},${y + 40}Q${CX + 70},${y + 80} ${CX + 60},${y + 130}`, '#8a8064', 2.2);
      for (let i = 0; i < 7; i++) {
        const x = CX + r(-110, 110), yy = r(y + 20, y + 120);
        s += E(x, yy, r(8, 18), r(6, 12), i % 2 ? '#8a7650' : '#6d7448', `${op(0.45)} transform="rotate(${f(r(0, 180))} ${f(x)} ${f(yy)})"`);
      }
      s += P(`M${CX + 34},${y + 30}q8,10 4,24q6,8 2,18q-6,-10 -10,-6q2,-18 4,-36Z`, '#6b1414', op(0.85));
      s += P(`M${CX - 60},${y + 70}l10,-6l6,8l8,-4l2,12l-10,6l-6,-4l-8,4Z`, '#2a2018');
      s += P(`M${CX + 76},${y + 52}l8,-8l4,10l6,0l-4,10l-10,-2Z`, '#2a2018');
      s += S(`M${CX + 2},${y + 56}V560`, '#8a8064', 1.6) + C(CX + 8, y + 90, 3, '#e8e0cc', 'stroke="#6a6250" stroke-width="0.8"');
      s += S(`M${CX + 8},${y + 118}q4,6 -2,10`, '#6a6250', 0.8);
      const main = P(d, '#cbc2a8') + shade(d, id + 'zs', s) + P(d, 'none', 'stroke="#5a5240" stroke-width="1.3"');
      const collar = P(`M${pt(CX - nw - 2, y - 18)}L${pt(CX - 6, y + 50)}L${pt(CX - 30, y + 30)}L${pt(CX - 26, y + 36)}L${pt(CX - nw - 26, y + 6)}Z`, '#d8d0b8', 'stroke="#5a5240" stroke-width="1.2"') +
        P(`M${pt(CX + nw + 2, y - 18)}L${pt(CX + 6, y + 50)}L${pt(CX + 22, y + 40)}L${pt(CX + 28, y + 26)}L${pt(CX + 36, y + 20)}L${pt(CX + nw + 22, y + 4)}Z`, '#b9b094', 'stroke="#5a5240" stroke-width="1.2"') +
        E(CX - 30, y + 16, 6, 3, '#6b1414', op(0.6));
      return { back: '', main, collar, clip: neckClip(o) };
    },

    clown(a, id) {
      const nw = a.neckW, y = a.collarY;
      const o = { nlW: nw + 6, nlY: y - 12, nlD: y };
      const d = bodice(a, o);
      let s = '';
      for (let i = 0; i < 12; i++) {
        const yy = y - 10 + i * 18;
        s += P(`M-10,${yy}Q${CX},${yy + 14} 410,${yy}V${yy + 9}Q${CX},${yy + 23} -10,${yy + 9}Z`, '#a8161e');
      }
      s += P(`M${CX + 40},${y}C${CX + 70},${y + 40} ${CX + 80},${y + 90} ${CX + 70},560H460V${y - 40}Z`, '#000000', op(0.25));
      const main = P(d, '#ece6da') + shade(d, id + 'cs', s) + P(d, 'none', 'stroke="#2a1416" stroke-width="1.3"');
      // two-tier pleated ruff
      const ruff = (cy, rx, ry, n, c1, c2) => {
        let out = '';
        for (let i = 0; i < n; i++) {
          const t0 = i / n * Math.PI * 2, t1 = (i + 1) / n * Math.PI * 2;
          const p0 = [CX + Math.cos(t0) * rx, cy + Math.sin(t0) * ry], p1 = [CX + Math.cos(t1) * rx, cy + Math.sin(t1) * ry];
          const tm = (t0 + t1) / 2, bulge = [CX + Math.cos(tm) * rx * 1.08, cy + Math.sin(tm) * ry * 1.12];
          out += P(`M${CX},${cy}L${pt(p0[0], p0[1])}Q${pt(bulge[0], bulge[1])} ${pt(p1[0], p1[1])}Z`, i % 2 ? c1 : c2, 'stroke="#8c8476" stroke-width="0.8"');
        }
        return out;
      };
      const collar = ruff(y + 8, 104, 30, 26, '#f4f0e8', '#d6cec0') + ruff(y + 2, 80, 22, 22, '#fbf8f2', '#ddd5c7') + E(CX, y - 2, nw + 2, 9, '#ccc4b6');
      return { back: '', main, collar, clip: neckClip({ nlW: nw + 6, nlY: y - 14, nlD: y - 14 }) };
    },

    bride(a, id) {
      const nw = a.neckW, y = a.collarY;
      const o = { nlW: nw + 34, nlY: y + 4, nlD: y + 40, drop: 8 };
      const d = bodice(a, o);
      const R = rng(29), r = (x, yy) => x + R() * (yy - x);
      let s = P(`M${CX + 40},${y + 20}C${CX + 70},${y + 50} ${CX + 80},${y + 90} ${CX + 70},560H460V${y - 40}Z`, '#bcb19a');
      for (let i = 0; i < 26; i++) {
        const x = CX + r(-130, 130), yy = r(y + 30, y + 150);
        s += C(x, yy, 3.2, 'none', 'stroke="#b4aa94" stroke-width="1"') + C(x, yy, 1, '#b4aa94');
      }
      for (let i = 0; i < 5; i++) s += S(`M${CX - 30 + i * 15},${y + 50}V560`, '#cfc5b0', 1.2);
      s += E(CX - 70, y + 90, 22, 14, '#8a8270', op(0.3)) + E(CX + 60, y + 110, 18, 12, '#8a8270', op(0.3));
      s += P(`M${CX + 64},${y + 60}l6,10l-3,8l7,8l-10,-2l-4,-10Z`, '#3a332a') + P(`M${CX - 92},${y + 40}l8,4l-2,8l6,6l-9,0l-4,-8Z`, '#3a332a');
      let main = P(d, '#e4dccb') + shade(d, id + 'bs', s) + P(d, 'none', 'stroke="#7a705c" stroke-width="1.2"');
      // scalloped lace edge along the neckline
      const n = 16;
      for (let i = 0; i <= n; i++) {
        const t = i / n, u = 1 - t;
        const x = u * u * u * (CX - o.nlW) + 3 * u * u * t * (CX - o.nlW * 0.62) + 3 * u * t * t * (CX + o.nlW * 0.62) + t * t * t * (CX + o.nlW);
        const yy = u * u * u * o.nlY + 3 * u * u * t * o.nlD + 3 * u * t * t * o.nlD + t * t * t * o.nlY;
        main += C(x, yy, 5.2, '#f1ebdf', 'stroke="#9a907a" stroke-width="0.8"') + C(x, yy - 1, 1.3, '#9a907a');
      }
      return { back: '', main, collar: '', clip: neckClip(o) };
    },

    hoodie(a, id) {
      const nw = a.neckW, y = a.collarY;
      const hood = `M${CX - 108},${y + 20}C${CX - 112},${y - 40} ${CX - 60},${y - 62} ${CX},${y - 62}C${CX + 60},${y - 62} ${CX + 112},${y - 40} ${CX + 108},${y + 20}Z`;
      const back = P(hood, '#1d1c21', 'stroke="#0b0a0c" stroke-width="1.2"') + S(`M${CX - 90},${y}C${CX - 90},${y - 40} ${CX - 50},${y - 50} ${CX},${y - 50}C${CX + 50},${y - 50} ${CX + 90},${y - 40} ${CX + 90},${y}`, '#2c2a31', 6);
      const o = { nlW: nw + 6, nlY: y - 10, nlD: y + 10 };
      const d = bodice(a, o);
      const bone = '#e8e4da';
      let s = P(`M${CX + 40},${y}C${CX + 70},${y + 40} ${CX + 80},${y + 90} ${CX + 70},560H460V${y - 40}Z`, '#0e0d10');
      s += S(`M${CX - 90},${y + 40}Q${CX - 60},${y + 70} ${CX - 40},${y + 120}`, '#2a282e', 2);
      // printed collarbones, sternum and ribs
      [-1, 1].forEach(sd => {
        s += S(`M${CX + sd * 12},${y + 26}Q${CX + sd * 50},${y + 16} ${CX + sd * 100},${y + 26}`, bone, 6);
        s += C(CX + sd * 100, y + 26, 5, bone) + C(CX + sd * 12, y + 26, 4, bone);
        for (let i = 0; i < 4; i++) {
          const yy = y + 46 + i * 20;
          s += S(`M${CX + sd * 10},${yy}C${CX + sd * 40},${yy - 10} ${CX + sd * 80},${yy - 4} ${CX + sd * (96 - i * 4)},${yy + 18}`, bone, 5);
        }
      });
      s += P(`M${CX - 7},${y + 30}H${CX + 7}L${CX + 6},${y + 130}H${CX - 6}Z`, bone);
      s += S(`M${CX - 12},${y + 26}Q${CX - 50},${y + 16} ${CX - 100},${y + 26}`, '#9a968e', 1, op(0.6));
      // drawstrings
      s += S(`M${CX - 16},${y + 8}q-2,40 -6,70`, '#d8d4ca', 2.2) + S(`M${CX + 16},${y + 8}q2,40 6,64`, '#d8d4ca', 2.2);
      s += `<rect x="${CX - 25}" y="${y + 76}" width="6" height="10" fill="#9a9a9a"/><rect x="${CX + 19}" y="${y + 70}" width="6" height="10" fill="#9a9a9a"/>`;
      const main = P(d, '#18171b') + shade(d, id + 'hs', s) + P(d, 'none', 'stroke="#050506" stroke-width="1.2"');
      const collar = P(`M${pt(CX - nw - 14, y - 16)}C${pt(CX - nw - 8, y + 20)} ${pt(CX + nw + 8, y + 20)} ${pt(CX + nw + 14, y - 16)}L${pt(CX + nw + 4, y - 14)}C${pt(CX + nw * 0.6, y + 10)} ${pt(CX - nw * 0.6, y + 10)} ${pt(CX - nw - 4, y - 14)}Z`, '#232227', 'stroke="#0b0a0c" stroke-width="1"');
      return { back, main, collar, clip: neckClip(o) };
    },

    doll(a, id) {
      const nw = a.neckW, y = a.collarY, sw = a.shoulderW;
      const o = { nlW: nw + 6, nlY: y - 12, nlD: y };
      const d = bodice(a, o);
      let s = P(`M${CX + 40},${y}C${CX + 70},${y + 40} ${CX + 80},${y + 90} ${CX + 70},560H460V${y - 40}Z`, '#9f6672');
      for (let i = -3; i <= 3; i++) s += S(`M${CX + i * 9},${y + 40}V560`, '#a87480', 1.2, op(0.8));
      [y + 64, y + 88, y + 112].forEach(by => s += C(CX, by, 2.6, '#f3eee4', 'stroke="#8a7a70" stroke-width="0.6"'));
      let main = P(d, '#c88f9a') + shade(d, id + 'ds', s) + P(d, 'none', 'stroke="#5a2e38" stroke-width="1.2"');
      // puffed sleeves
      [-1, 1].forEach(sd => {
        const px = CX + sd * (sw - 4), py = y + 46;
        const puff = `M${pt(px - sd * 34, py - 30)}C${pt(px - sd * 10, py - 56)} ${pt(px + sd * 44, py - 40)} ${pt(px + sd * 44, py)}C${pt(px + sd * 44, py + 30)} ${pt(px + sd * 20, py + 50)} ${pt(px - sd * 8, py + 44)}C${pt(px - sd * 30, py + 30)} ${pt(px - sd * 44, py - 10)} ${pt(px - sd * 34, py - 30)}Z`;
        main += P(puff, sd > 0 ? '#b07a86' : '#d39ca7', 'stroke="#5a2e38" stroke-width="1.2"');
        for (let i = 0; i < 4; i++) main += S(`M${pt(px - sd * 20 + sd * i * 12, py - 34 + i * 2)}Q${pt(px - sd * 6 + sd * i * 14, py)} ${pt(px - sd * 10 + sd * i * 12, py + 40)}`, '#9a5e6a', 1.2, op(0.8));
        main += E(px + sd * 10, py - 20, 12, 6, '#f0c4cc', `${op(0.4)} transform="rotate(${sd * 30} ${px + sd * 10} ${py - 20})"`);
      });
      // lace collar with a bow
      let collar = '';
      [-1, 1].forEach(sd => {
        const flap = `M${pt(CX, y + 2)}C${pt(CX + sd * 10, y + 36)} ${pt(CX + sd * 60, y + 40)} ${pt(CX + sd * 76, y + 16)}C${pt(CX + sd * 74, y)} ${pt(CX + sd * (nw + 18), y - 18)} ${pt(CX + sd * (nw + 2), y - 18)}C${pt(CX + sd * (nw - 4), y - 6)} ${pt(CX + sd * 10, y - 2)} ${pt(CX, y + 2)}Z`;
        collar += P(flap, sd > 0 ? '#e0d8ca' : '#f3eee4', 'stroke="#8a8070" stroke-width="1"');
        for (let i = 0; i < 7; i++) {
          const t = (i + 0.5) / 7;
          const x = CX + sd * (6 + t * 66), yy = y + 30 - Math.pow(t - 0.45, 2) * 50 + 4;
          collar += C(x, yy, 4.6, '#f7f3ea', 'stroke="#a49a88" stroke-width="0.7"') + C(x, yy - 1, 1.1, '#a49a88');
        }
      });
      collar += P(`M${CX},${y + 4}C${CX - 10},${y - 8} ${CX - 22},${y - 4} ${CX - 20},${y + 6}C${CX - 18},${y + 16} ${CX - 8},${y + 12} ${CX},${y + 4}Z M${CX},${y + 4}C${CX + 10},${y - 8} ${CX + 22},${y - 4} ${CX + 20},${y + 6}C${CX + 18},${y + 16} ${CX + 8},${y + 12} ${CX},${y + 4}Z`, '#1a1418');
      collar += S(`M${CX - 2},${y + 6}l-6,22M${CX + 2},${y + 6}l7,20`, '#1a1418', 3) + C(CX, y + 4, 3.4, '#2a2228');
      return { back: '', main, collar, clip: neckClip({ nlW: nw + 4, nlY: y - 18, nlD: y - 14 }) };
    },

    mourning(a, id) {
      const nw = a.neckW, y = a.collarY, sw = a.shoulderW;
      const o = { nlW: nw + 6, nlY: y - 12, nlD: y };
      const d = bodice(a, o);
      let s = P(`M${CX + 36},${y}C${CX + 66},${y + 40} ${CX + 76},${y + 90} ${CX + 66},560H460V${y - 40}Z`, '#24262d');
      for (let i = -4; i <= 4; i++) if (i) s += S(`M${CX + i * 8},${y + 20}V560`, i < 0 ? '#4a4e5a' : '#30333b', 1.2);
      for (let i = 0; i < 6; i++) s += C(CX, y + 26 + i * 18, 3, '#0a0a0c') + C(CX - 1, y + 25 + i * 18, 1, '#8a8e9a');
      let main = P(d, '#3a3d47') + shade(d, id + 'ms', s) + P(d, 'none', 'stroke="#121318" stroke-width="1.2"');
      [-1, 1].forEach(sd => {
        const px = CX + sd * (sw - 2), py = y + 40;
        const puff = `M${pt(px - sd * 30, py - 26)}C${pt(px - sd * 6, py - 50)} ${pt(px + sd * 40, py - 36)} ${pt(px + sd * 42, py + 4)}C${pt(px + sd * 42, py + 40)} ${pt(px + sd * 20, py + 60)} ${pt(px - sd * 6, py + 60)}C${pt(px - sd * 26, py + 40)} ${pt(px - sd * 40, py - 6)} ${pt(px - sd * 30, py - 26)}Z`;
        main += P(puff, sd > 0 ? '#2e3038' : '#454955', 'stroke="#121318" stroke-width="1.2"');
        for (let i = 0; i < 3; i++) main += S(`M${pt(px - sd * 14 + sd * i * 14, py - 32)}Q${pt(px + sd * i * 12, py + 4)} ${pt(px - sd * 4 + sd * i * 12, py + 54)}`, '#1d1f25', 1.4, op(0.8));
      });
      // high lace collar up the neck
      const top = a.chinY + 16, cw = nw + 3;
      const band = `M${pt(CX - cw, top)}Q${pt(CX, top + 8)} ${pt(CX + cw, top)}L${pt(CX + cw + 8, y + 2)}Q${pt(CX, y + 14)} ${pt(CX - cw - 8, y + 2)}Z`;
      let collar = P(band, '#2e3038', 'stroke="#121318" stroke-width="1.2"');
      collar += shade(band, id + 'mc', P(`M${CX + 10},${top}L${CX + cw + 10},${top}L${CX + cw + 10},${y + 20}L${CX + 16},${y + 20}Z`, '#1d1f25', op(0.7)) +
        [-2, -1, 0, 1, 2].map(i => S(`M${CX + i * 11},${top + 4}V${y + 10}`, '#4a4e5a', 1)).join(''));
      for (let i = 0; i <= 8; i++) {
        const x = CX - cw + i * (cw * 2 / 8);
        collar += C(x, top + 1 + Math.sin(i / 8 * Math.PI) * 3, 3.4, '#5a5e6a', 'stroke="#1d1f25" stroke-width="0.6"');
      }
      return { back: '', main, collar, clip: `M-60,-60H460V${top + 2}H-60Z` };
    },

    pumpkin(a, id) {
      const nw = a.neckW, y = a.collarY;
      const o = { nlW: nw + 6, nlY: y - 12, nlD: y };
      const d = bodice(a, o);
      let s = '';
      [-120, -80, -40, 0, 40, 80, 120].forEach(dx => {
        s += P(`M${CX + dx * 0.5 - 4},${y}C${CX + dx * 1.1 - 10},${y + 60} ${CX + dx * 1.1 - 10},${y + 120} ${CX + dx * 1.2 - 8},560H${CX + dx * 1.2 + 8}C${CX + dx * 1.1 + 6},${y + 120} ${CX + dx * 1.1 + 4},${y + 60} ${CX + dx * 0.5 + 4},${y}Z`, '#b14e12', op(0.7));
        s += S(`M${CX + dx * 0.5 + 14},${y + 10}C${CX + dx * 1.1 + 18},${y + 60} ${CX + dx * 1.1 + 18},${y + 120} ${CX + dx * 1.2 + 22},560`, '#f09040', 2, op(0.6));
      });
      s += P(`M${CX + 40},${y}C${CX + 70},${y + 40} ${CX + 80},${y + 90} ${CX + 70},560H460V${y - 40}Z`, '#7a3008', op(0.35));
      const main = P(d, '#d9661c') + shade(d, id + 'ps', s) + P(d, 'none', 'stroke="#5a2408" stroke-width="1.2"');
      // leafy collar
      let collar = '';
      const n = 9;
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1) * 2 - 1;
        const bx = CX + t * (nw + 6), by = y - 6 + Math.abs(t) * -6;
        const tx = CX + t * (nw + 60), ty = y + 40 - Math.abs(t) * 20;
        const nx = -(ty - by), ny = tx - bx, L = Math.hypot(nx, ny);
        const w = 14;
        const leaf = `M${pt(bx, by)}C${pt(bx + nx / L * w, by + ny / L * w)} ${pt(tx + nx / L * w * 0.8, ty + ny / L * w * 0.8)} ${pt(tx, ty)}C${pt(tx - nx / L * w * 0.8, ty - ny / L * w * 0.8)} ${pt(bx - nx / L * w, by - ny / L * w)} ${pt(bx, by)}Z`;
        collar += P(leaf, i % 2 ? '#3c6420' : '#4e7d2b', 'stroke="#22380f" stroke-width="1"') + S(`M${pt(bx, by)}L${pt(tx, ty)}`, '#2d4c18', 1);
      }
      collar += P(`M${pt(CX - nw - 6, y - 14)}C${pt(CX - nw * 0.6, y + 4)} ${pt(CX + nw * 0.6, y + 4)} ${pt(CX + nw + 6, y - 14)}L${pt(CX + nw + 10, y - 6)}C${pt(CX + nw * 0.6, y + 12)} ${pt(CX - nw * 0.6, y + 12)} ${pt(CX - nw - 10, y - 6)}Z`, '#355a1c');
      return { back: '', main, collar, clip: neckClip(o) };
    }
  };

  /* ---------- headwear ---------- */
  // Each returns { back, front, clipHair } - clipHair hides hair above a y line.

  const HEADWEAR = {
    witchHat(a, hair, id) {
      const by = a.hairlineY - 8;
      const brim = E(CX, by, 150, 24, '#141318', `transform="rotate(-5 ${CX} ${by})"`);
      const under = E(CX, by + 4, 146, 20, '#0a090c', `transform="rotate(-5 ${CX} ${by + 4})"`);
      const crown = `M${pt(CX - 98, by + 2)}C${pt(CX - 76, by - 30)} ${pt(CX - 52, by - 62)} ${pt(CX - 26, by - 78)}C${pt(CX - 4, by - 90)} ${pt(CX + 34, by - 90)} ${pt(CX + 56, by - 66)}` +
        `C${pt(CX + 40, by - 70)} ${pt(CX + 28, by - 68)} ${pt(CX + 22, by - 56)}C${pt(CX + 40, by - 40)} ${pt(CX + 74, by - 22)} ${pt(CX + 94, by - 12)}Z`;
      let c = P(crown, '#1b1a20', 'stroke="#4a4552" stroke-width="1.6"');
      c += shade(crown, id + 'wh', P(`M${CX + 6},${by - 66}C${CX + 30},${by - 40} ${CX + 56},${by - 20} ${CX + 70},${by}H${CX + 110}V${by - 100}Z`, '#0c0b0e', op(0.8)) +
        S(`M${CX - 40},${by - 20}C${CX - 34},${by - 44} ${CX - 22},${by - 60} ${CX - 4},${by - 72}`, '#3a3640', 2.4, op(0.8)) +
        S(`M${CX - 2},${by - 58}q12,4 20,-2`, '#060508', 1.4) +
        P(`M${CX - 30},${by - 50}l18,-4l4,16l-18,4Z`, '#3a2f2a') + S(`M${CX - 30},${by - 50}l18,-4l4,16l-18,4Z`, '#c9b89a', 0.7, 'stroke-dasharray="2 2"') +
        P(`M${CX - 100},${by - 18}C${CX - 30},${by - 30} ${CX + 30},${by - 34} ${CX + 100},${by - 26}V${by - 6}C${CX + 30},${by - 14} ${CX - 30},${by - 12} ${CX - 100},${by + 2}Z`, '#5e0f1c') +
        `<rect x="${CX - 12}" y="${by - 28}" width="16" height="16" fill="none" stroke="#c9a24a" stroke-width="2.4"/>`);
      const front = `<defs><clipPath id="${id}hb"><path d="${a.headPath}"/></clipPath></defs>` +
        G(E(CX, by + 24, 110, 16, '#000000', op(0.22)), `clip-path="url(#${id}hb)"`) +
        under + brim + E(CX, by, 150, 24, 'none', `stroke="#4a4552" stroke-width="1.4" transform="rotate(-5 ${CX} ${by})"`) + S(`M${CX - 148},${by + 10}Q${CX},${by + 38} ${CX + 148},${by - 16}`, '#2c2a32', 1.6, op(0.8)) + c;
      return { back: '', front, clipHair: by - 4 };
    },

    cone(a, hair) {
      const x = CX + 34, y = Math.max(hair.top + 24, a.crownY + 14);
      let s = '';
      const cone = `M${x - 24},${y}L${x},${y - 66}L${x + 24},${y}Z`;
      s += P(cone, '#ece6da', 'stroke="#2a1416" stroke-width="1.2"');
      s += P(`M${x - 18},${y - 16}L${x + 20},${y - 10}L${x + 16},${y - 22}L${x - 13},${y - 30}Z M${x - 8},${y - 42}L${x + 11},${y - 36}L${x + 7},${y - 48}L${x - 3},${y - 54}Z`, '#a8161e');
      s += P(`M${x},${y - 66}L${x + 24},${y}H${x + 6}Z`, '#000000', op(0.2));
      for (let i = 0; i < 6; i++) s += C(x - 22 + i * 9, y, 4.6, '#1a1214');
      s += C(x - 4, y - 70, 8, '#a8161e') + C(x + 4, y - 68, 7, '#8a0f16') + C(x, y - 74, 6, '#c42028') + C(x - 3, y - 76, 2, '#ff8a80', op(0.7));
      return { back: '', front: G(s, `transform="rotate(16 ${x} ${y}) translate(${x} ${y}) scale(0.8) translate(${-x} ${-y})"`) };
    },

    veil(a, hair) {
      const y = a.hairlineY - 18;
      const R = rng(61), r = (x, yy) => x + R() * (yy - x);
      // sheer veil falling behind the head
      let hem = '';
      for (let i = 0; i <= 10; i++) hem += `L${f(CX + 176 - i * 35.2)},${f(540 + (i % 2 ? r(-24, -8) : 0))}`;
      const veilPath = `M${CX - 96},${y + 6}Q${CX},${y - 40} ${CX + 96},${y + 6}C${CX + 140},${y + 60} ${CX + 170},${y + 200} ${CX + 176},540${hem}C${CX - 170},${y + 200} ${CX - 140},${y + 60} ${CX - 96},${y + 6}Z`;
      let back = P(veilPath, '#ebe6da', op(0.4));
      for (let i = -3; i <= 3; i++) back += S(`M${CX + i * 22},${y}Q${CX + i * 44},${y + 200} ${CX + i * 52},540`, '#ffffff', 1.2, op(0.3));
      back += S(veilPath, '#ffffff', 1, op(0.35));
      // wilted flower crown
      let front = S(`M${CX - 96},${y + 30}Q${CX},${y - 28} ${CX + 96},${y + 30}`, '#5a5a3e', 3);
      const flowers = 9;
      for (let i = 0; i < flowers; i++) {
        const t = i / (flowers - 1);
        const x = (1 - t) * (1 - t) * (CX - 96) + 2 * (1 - t) * t * CX + t * t * (CX + 96);
        const yy = (1 - t) * (1 - t) * (y + 30) + 2 * (1 - t) * t * (y - 28) + t * t * (y + 30);
        const col = ['#a07a80', '#d8cfc0', '#7e5a5e', '#b89a8a'][i % 4];
        const rr = i % 2 ? 8 : 11;
        front += E(x + r(-6, 6), yy + 4, 9, 4, '#6b7457', `transform="rotate(${f(r(-50, 50))} ${f(x)} ${f(yy)})"`);
        front += C(x, yy, rr, col, `stroke="${mix(col, '#000000', 0.45)}" stroke-width="0.9"`);
        front += S(`M${pt(x - rr * 0.5, yy)}a${f(rr * 0.5)},${f(rr * 0.5)} 0 1 1 ${f(rr * 0.6)},${f(rr * 0.3)}a${f(rr * 0.3)},${f(rr * 0.3)} 0 1 1 ${f(-rr * 0.3)},${f(-rr * 0.4)}`, mix(col, '#000000', 0.4), 1.1);
        front += P(`M${pt(x + rr * 0.4, yy + rr * 0.7)}q3,8 0,14q-4,-6 0,-14Z`, mix(col, '#3a2a20', 0.3));
      }
      for (let i = 0; i < 14; i++) front += C(CX + r(-90, 90), y + r(-12, 24), 1.6, '#efeae0');
      return { back, front };
    },

    bow(a, hair) {
      const x = CX + 54, y = hair.top + 30;
      let s = '';
      const loopL = `M${x},${y}C${x - 20},${y - 30} ${x - 52},${y - 22} ${x - 46},${y + 4}C${x - 42},${y + 22} ${x - 16},${y + 14} ${x},${y}Z`;
      const loopR = `M${x},${y}C${x + 20},${y - 30} ${x + 52},${y - 22} ${x + 46},${y + 4}C${x + 42},${y + 22} ${x + 16},${y + 14} ${x},${y}Z`;
      s += P(`M${x - 4},${y + 4}L${x - 20},${y + 44}L${x - 8},${y + 40}L${x - 2},${y + 48}L${x + 2},${y + 6}Z M${x + 4},${y + 4}L${x + 16},${y + 42}L${x + 6},${y + 38}L${x},${y + 46}Z`, '#5a0f1c');
      s += P(loopL, '#7a1426', 'stroke="#3a0810" stroke-width="1.2"') + P(loopR, '#6a1121', 'stroke="#3a0810" stroke-width="1.2"');
      s += S(`M${x - 8},${y - 4}Q${x - 26},${y - 16} ${x - 38},${y - 6}`, '#a8384a', 2, op(0.8)) + S(`M${x + 8},${y + 2}Q${x + 26},${y + 10} ${x + 38},${y + 6}`, '#3a0810', 2, op(0.8));
      s += E(x, y, 8, 10, '#5a0f1c', 'stroke="#3a0810" stroke-width="1"') + E(x - 2, y - 3, 3, 3, '#a8384a', op(0.7));
      return { back: '', front: G(s, `transform="rotate(-14 ${x} ${y})"`) };
    },

    stalk(a, hair) {
      const top = hair.top;
      const yE = 168;
      let s = S(`M${CX - 98},${yE}Q${CX},${2 * top - yE + 16} ${CX + 98},${yE}`, '#2d4c18', 5);
      s += S(`M${CX - 98},${yE - 1}Q${CX},${2 * top - yE + 15} ${CX + 98},${yE - 1}`, '#4e7d2b', 1.4, op(0.8));
      const sy = top + 6;
      s += P(`M${CX - 7},${sy + 4}C${CX - 8},${sy - 14} ${CX - 4},${sy - 26} ${CX + 8},${sy - 36}L${CX + 16},${sy - 30}C${CX + 6},${sy - 20} ${CX + 5},${sy - 10} ${CX + 7},${sy + 4}Z`, '#5b6b2a', 'stroke="#2d3a12" stroke-width="1.2"');
      s += S(`M${CX - 2},${sy}C${CX - 2},${sy - 14} ${CX + 2},${sy - 24} ${CX + 10},${sy - 32}`, '#8a9a48', 1.2);
      s += P(`M${CX + 6},${sy - 10}C${CX + 24},${sy - 30} ${CX + 50},${sy - 24} ${CX + 56},${sy - 6}C${CX + 40},${sy - 2} ${CX + 20},${sy + 2} ${CX + 6},${sy - 10}Z`, '#4e7d2b', 'stroke="#22380f" stroke-width="1"');
      s += S(`M${CX + 8},${sy - 10}Q${CX + 30},${sy - 16} ${CX + 54},${sy - 7}`, '#2d4c18', 1);
      s += S(`M${CX - 6},${sy - 6}c-14,-4 -20,-16 -12,-22c6,-4 12,2 8,6c-2,2 -5,0 -4,-2`, '#4e7d2b', 1.4);
      return { back: '', front: s };
    }
  };

  /* ---------- accessories ---------- */

  const ACCESSORIES = {
    amulet(a) {
      const y = a.collarY;
      let s = S(`M${CX - 30},${y - 4}Q${CX - 24},${y + 40} ${CX},${y + 56}Q${CX + 24},${y + 40} ${CX + 30},${y - 4}`, '#c9a24a', 1.6, 'stroke-dasharray="3 1.5"');
      s += E(CX, y + 66, 12, 15, '#c9a24a', 'stroke="#8a6d2a" stroke-width="1.2"') + E(CX, y + 66, 7, 9.5, '#a3101d') + E(CX - 2, y + 62, 2.4, 3, '#ff8a8a', op(0.8));
      for (let i = 0; i < 8; i++) {
        const th = i / 8 * Math.PI * 2;
        s += C(CX + Math.cos(th) * 12, y + 66 + Math.sin(th) * 15, 1.6, '#e6c878');
      }
      return s;
    },
    bones(a) {
      const y = a.collarY + 6;
      let s = S(`M${CX - 34},${y - 8}Q${CX},${y + 50} ${CX + 34},${y - 8}`, '#4a3a2a', 1.6);
      for (let i = -3; i <= 3; i++) {
        const t = (i + 3) / 6, x = CX - 30 + t * 60, yy = y - 4 + Math.sin(t * Math.PI) * 26;
        if (i % 2) s += C(x, yy + 2, 3.4, '#8a5a3a', 'stroke="#3a2418" stroke-width="0.8"');
        else s += P(`M${x - 2},${yy}h4l-0.5,10q2,2 -1.5,4q-3.5,-2 -1.5,-4Z`, '#e6dcc4', 'stroke="#6a5a40" stroke-width="0.8"');
      }
      return s;
    },
    locket(a) {
      const y = a.collarY + 22;
      let s = '';
      for (let i = 0; i <= 18; i++) {
        const t = i / 18, x = CX - 54 + t * 108, yy = y - 6 + Math.sin(t * Math.PI) * 26;
        s += C(x, yy, 2.6, '#f2ede2', 'stroke="#a49a88" stroke-width="0.5"');
      }
      s += P(`M${CX},${y + 46}C${CX - 18},${y + 34} ${CX - 12},${y + 20} ${CX},${y + 28}C${CX + 12},${y + 20} ${CX + 18},${y + 34} ${CX},${y + 46}Z`, '#b8b4ac', 'stroke="#6a665e" stroke-width="1"');
      return s;
    },
    cameo(a) {
      const y = a.collarY + 6;
      return E(CX, y, 11, 13, '#c9a24a', 'stroke="#8a6d2a" stroke-width="1"') + E(CX, y, 8, 10, '#3a2a3a') +
        P(`M${CX + 1},${y - 7}c-4,0 -5,4 -4,6c-2,1 -1,3 0,3c-1,3 1,5 4,5c1,-2 2,-4 0,-6c3,-2 2,-8 0,-8Z`, '#efe6d6');
    },
    key(a) {
      const y = a.collarY + 10;
      let s = S(`M${CX - 30},${y - 12}Q${CX},${y + 36} ${CX + 30},${y - 12}`, '#1a1418', 2.4);
      s += C(CX, y + 30, 6, 'none', 'stroke="#8a7a50" stroke-width="2.4"') + P(`M${CX - 1.6},${y + 36}h3.2v26h-3.2Z`, '#8a7a50');
      s += P(`M${CX + 1.6},${y + 52}h6v3h-6Z M${CX + 1.6},${y + 58}h4v3h-4Z`, '#8a7a50');
      return s;
    },
    pompoms(a) {
      let s = '';
      [a.collarY + 50, a.collarY + 80].forEach(y => {
        s += C(CX, y, 9, '#a8161e') + C(CX + 3, y + 2, 6, '#7a0f16', op(0.7)) + C(CX - 3, y - 3, 3, '#ff6b6b', op(0.6));
      });
      return s;
    }
  };

  /* ---------- assembly ---------- */

  function portraitContent(look, id) {
    const a = anchors(look.shape, look.features);
    const sm = SKIN_MAKEUP[look.skin];
    const skinBase = sm ? mix(look.skinTone, sm.mix, sm.t) : look.skinTone;
    const sk = skinPalette(skinBase, sm && sm.tint);
    const h = hairPalette(look.hairColour);
    const hairFn = HAIR[look.hairStyle] || HAIR.crop;
    const hair = hairFn(a, h, id);
    const cloth = (CLOTHES[look.clothing] || CLOTHES.plain)(a, id + 'c');
    const hw = HEADWEAR[look.headwear] ? HEADWEAR[look.headwear](a, hair, id + 'h') : { back: '', front: '' };
    const acc = ACCESSORIES[look.accessory] ? ACCESSORIES[look.accessory](a) : '';
    const hideBrows = ['clown', 'sugarSkull', 'pumpkin'].includes(look.facePaint);
    const l = Object.assign({}, look, { hideBrows });

    let hairClip = '';
    if (hw.clipHair) hairClip = `<clipPath id="${id}hc"><rect x="-100" y="${hw.clipHair}" width="600" height="800"/></clipPath>`;
    const hc = hw.clipHair ? `clip-path="url(#${id}hc)"` : '';

    const bg = background(id);
    const layers = [
      ['background', bg],
      ['back-hair', G(hair.back, hc)],
      ['clothing', hw.back + cloth.back + bodySkin(a, sk) + cloth.main],
      ['neck', `<clipPath id="${id}ncl"><path d="${cloth.clip}"/></clipPath>` + G(neck(a, sk, id), `clip-path="url(#${id}ncl)"`) + cloth.collar],
      ['head', head(a, sk, id)],
      ['skin-effects', skinEffects(a, l, sk, id)],
      ['face-paint', facePaint(a, l, sk, id)],
      ['under-eyes', underEyes(a, l)],
      ['eyes', eyes(a, l, sk, id)],
      ['eye-makeup', eyeMakeup(a, l, id)],
      ['lips', lips(a, l, sk)],
      ['face-effects', faceEffects(a, l, sk, id)],
      ['extras', extras(a, l, sk)],
      ['front-hair', G(hair.front, hc)],
      ['headwear', hw.front],
      ['accessories', acc]
    ];
    return hairClip + layers.map(([name, svg]) => `<g data-layer="${name}">${svg}</g>`).join('');
  }

  function background(id) {
    return `<rect x="-40" y="-40" width="480" height="600" fill="#17221d"/>` +
      P(`M-40,120L160,-40H230L-40,200Z`, '#21302a', op(0.55)) +
      P(`M-40,260L300,-40H330L-40,300Z`, '#21302a', op(0.35)) +
      E(GLASS.cx, GLASS.cy, GLASS.rx, GLASS.ry, 'none', `stroke="#0b120f" stroke-width="40" ${op(0.5)}`);
  }

  /* ---------- the mirror frame ---------- */

  const GOLD = { base: '#c9a24a', shadow: '#8a6d2a', dark: '#5a4518', light: '#ecd590' };

  function gild(d, w, extra) {
    return S(d, GOLD.dark, w + 2.4, `transform="translate(1.4,1.8)"${extra ? ' ' + extra : ''}`) +
      S(d, GOLD.shadow, w + 1.2) + S(d, GOLD.base, w) + S(d, GOLD.light, Math.max(0.6, w * 0.28), `transform="translate(-0.6,-0.8)" ${op(0.85)}`);
  }
  function gildFill(d, extra) {
    return P(d, GOLD.dark, `transform="translate(1.4,2)"${extra ? ' ' + extra : ''}`) + P(d, GOLD.base, `stroke="${GOLD.shadow}" stroke-width="1"`) +
      S(d, GOLD.light, 0.8, `transform="translate(-0.5,-0.6)" ${op(0.6)}`);
  }
  // acanthus leaf pointing up from the origin
  const LEAF = 'M0,0C-10,-6 -14,-18 -8,-28C-12,-30 -12,-38 -6,-40C-8,-46 -2,-52 2,-50C6,-54 12,-48 8,-42C14,-40 14,-32 8,-30C14,-20 10,-6 0,0Z';
  const CSCROLL = 'M0,0C8,-18 34,-26 50,-12C60,-2 54,12 42,12C32,12 30,2 38,-2C42,-4 46,0 44,4';
  const VOLUTE = 'M0,0C0,-14 14,-20 22,-12C28,-6 24,4 16,4C10,4 9,-3 14,-4';

  function ornament(d, x, y, rot, sx, sy, w, fill) {
    const t = `transform="translate(${f(x)},${f(y)}) rotate(${f(rot)}) scale(${f(sx)},${f(sy)})"`;
    return G(fill ? gildFill(d) : gild(d, w), t);
  }

  function frame() {
    const { cx, cy } = GLASS;
    let s = '';
    // feet / stand behind the frame
    [-1, 1].forEach(sd => {
      const d = `M${cx + sd * 110},${cy + 196}C${cx + sd * 150},${cy + 230} ${cx + sd * 170},${cy + 260} ${cx + sd * 164},${cy + 292}`;
      s += gild(d, 9);
      s += ornament(VOLUTE, cx + sd * 164, cy + 292, sd > 0 ? 90 : -90, sd, 1, 4);
      s += G(gildFill(`M-12,0C-12,-10 12,-10 12,0C12,6 -12,6 -12,0Z`), `transform="translate(${cx + sd * 170},${cy + 306})"`);
    });
    // mouldings, clipped to a ring so the glass stays clear
    let m = '';
    const ring = (rx, ry, fill, extra) => { m += E(cx, cy, rx, ry, fill, extra); return ''; };
    s += ring(204, 251, GOLD.dark, 'transform="translate(2,3)"');
    s += ring(202, 249, GOLD.shadow);
    s += ring(199, 246, GOLD.base);
    s += ring(193, 240, GOLD.light);
    s += ring(191, 238, '#b38f3c');
    s += ring(184, 231, GOLD.base);
    s += ring(178, 225, GOLD.shadow);
    s += ring(176, 223, '#d4b05a');
    s += ring(169, 216, GOLD.dark);
    // light from the top left, shade on the lower right
    m += P(`M${cx + 210},${cy - 40}C${cx + 200},${cy + 160} ${cx + 100},${cy + 260} ${cx - 120},${cy + 250}L${cx - 60},${cy + 300}L${cx + 260},${cy + 300}V${cy - 40}Z`, '#000000', op(0.18));
    s += G(m, 'clip-path="url(#__RING__)"');
    // carved flutes in the cove
    for (let i = 0; i < 72; i++) {
      const th = i / 72 * Math.PI * 2;
      const x1 = cx + Math.cos(th) * 186, y1 = cy + Math.sin(th) * 233, x2 = cx + Math.cos(th) * 192, y2 = cy + Math.sin(th) * 239;
      s += S(`M${pt(x1, y1)}L${pt(x2, y2)}`, GOLD.shadow, 1.4, op(0.8));
    }
    // beaded inner edge
    const beads = 120;
    for (let i = 0; i < beads; i++) {
      const th = i / beads * Math.PI * 2;
      const x = cx + Math.cos(th) * 172.5, y = cy + Math.sin(th) * 219.5;
      s += C(x + 0.6, y + 0.8, 3, GOLD.dark) + C(x, y, 2.8, '#d9b65e') + C(x - 0.9, y - 0.9, 0.9, '#f6e2a4');
    }
    // side scrollwork
    [-1, 1].forEach(sd => {
      const x = cx + sd * 198, y = cy;
      s += ornament(CSCROLL, x, y - 4, sd > 0 ? -80 : -100, 0.9, sd, 4.2);
      s += ornament(CSCROLL, x, y + 4, sd > 0 ? 80 : 100, 0.9, -sd, 4.2);
      s += ornament(LEAF, x + sd * 4, y, sd * 90, 0.9, 0.9, 0, true);
      s += G(gildFill(`M-5,0a5,5 0 1 0 10,0a5,5 0 1 0 -10,0Z`), `transform="translate(${x + sd * 2},${y})"`);
      // diagonal leaf sprays
      [[-0.72, -1], [0.72, 1]].forEach(([k, up]) => {
        const th = Math.PI / 2 * (1 - sd) + sd * k;
        const ax = cx + Math.cos(th) * 196, ay = cy + Math.sin(th) * 243;
        s += ornament(LEAF, ax, ay, (Math.atan2(Math.sin(th) * 246, Math.cos(th) * 199) * 180 / Math.PI) + 90, 0.62, 0.62, 0, true);
      });
    });
    // crest at the top: a shell between two scrolls
    const ty = cy - 244;
    [-1, 1].forEach(sd => {
      s += ornament(CSCROLL, cx + sd * 8, ty + 4, sd > 0 ? -16 : 196, 0.95, sd > 0 ? 1 : -1, 4.4);
      s += ornament(LEAF, cx + sd * 64, ty + 10, sd * 64, 0.7, 0.7, 0, true);
    });
    let shell = '';
    const sr = 34, scy = ty - 4;
    let edge = '';
    for (let i = 0; i <= 10; i++) {
      const th = Math.PI + i / 10 * Math.PI;
      const x = cx + Math.cos(th) * sr, y = scy + Math.sin(th) * sr * 1.05;
      edge += (i ? 'L' : 'M') + pt(x, y);
      if (i < 10) {
        const tm = Math.PI + (i + 0.5) / 10 * Math.PI;
        edge += `Q${pt(cx + Math.cos(tm) * (sr + 6), scy + Math.sin(tm) * (sr + 6) * 1.05)} `;
        const th2 = Math.PI + (i + 1) / 10 * Math.PI;
        edge += pt(cx + Math.cos(th2) * sr, scy + Math.sin(th2) * sr * 1.05);
      }
    }
    shell += gildFill(`M${cx - sr},${scy}` + edge.replace(/^M[^LQ]+/, '') + `L${cx + 8},${scy + 8}L${cx - 8},${scy + 8}Z`);
    for (let i = 1; i < 10; i++) {
      const th = Math.PI + i / 10 * Math.PI;
      shell += S(`M${cx},${scy + 6}L${pt(cx + Math.cos(th) * (sr - 2), scy + Math.sin(th) * (sr - 2) * 1.05)}`, GOLD.shadow, 1.4) +
        S(`M${cx - 1},${scy + 5}L${pt(cx + Math.cos(th) * (sr - 3) - 1, scy + Math.sin(th) * (sr - 3) * 1.05 - 1)}`, GOLD.light, 0.6, op(0.7));
    }
    shell += G(gildFill(`M-8,0C-8,-8 8,-8 8,0C8,5 -8,5 -8,0Z`), `transform="translate(${cx},${scy + 10})"`);
    shell += G(gildFill('M0,0C-5,-6 -5,-14 0,-20C5,-14 5,-6 0,0Z'), `transform="translate(${cx},${scy - sr - 4})"`);
    s += shell;
    // bracket at the bottom
    const byy = cy + 246;
    [-1, 1].forEach(sd => {
      s += ornament(CSCROLL, cx + sd * 6, byy - 2, sd > 0 ? 18 : 162, 0.9, sd > 0 ? -1 : 1, 4.2);
    });
    s += ornament(LEAF, cx, byy + 2, 180, 1.05, 1.05, 0, true);
    s += G(gildFill(`M-7,0C-7,-7 7,-7 7,0C7,6 -7,6 -7,0Z`), `transform="translate(${cx},${byy})"`);
    s += G(gildFill('M0,0C-6,6 -6,14 0,22C6,14 6,6 0,0Z'), `transform="translate(${cx},${byy + 48})"`);
    return s;
  }

  const VIEW = { x: -24, y: -64, w: 448, h: 640 };

  function mirrorSVG(look, id, extraAttrs) {
    id = id || 'm';
    const ell = (rx, ry) => `M${GLASS.cx - rx},${GLASS.cy}a${rx},${ry} 0 1,0 ${rx * 2},0a${rx},${ry} 0 1,0 ${-rx * 2},0Z`;
    const ringClip = `<clipPath id="${id}ring"><path d="${ell(212, 260)}${ell(GLASS.rx, GLASS.ry)}" clip-rule="evenodd"/></clipPath>`;
    const glassClip = `<clipPath id="${id}glass"><ellipse cx="${GLASS.cx}" cy="${GLASS.cy}" rx="${GLASS.rx}" ry="${GLASS.ry}"/></clipPath>`;
    const fr = frame().replace('__RING__', id + 'ring');
    const sheen = P(`M${GLASS.cx - 160},${GLASS.cy - 40}L${GLASS.cx - 40},${GLASS.cy - 220}H${GLASS.cx}L${GLASS.cx - 160},${GLASS.cy + 20}Z`, '#ffffff', op(0.035));
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEW.x} ${VIEW.y} ${VIEW.w} ${VIEW.h}"${extraAttrs ? ' ' + extraAttrs : ''}>` +
      `<defs>${ringClip}${glassClip}</defs>` +
      G(portraitContent(look, id) + G(sheen, ''), `clip-path="url(#${id}glass)"`) +
      E(GLASS.cx, GLASS.cy, GLASS.rx + 1, GLASS.ry + 1, 'none', `stroke="#000000" stroke-width="6" ${op(0.35)}`) +
      fr + '</svg>';
  }

  function portraitSVG(look, id, viewBox, extraAttrs) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox || '0 0 400 520'}"${extraAttrs ? ' ' + extraAttrs : ''}>` +
      portraitContent(look, id) + '</svg>';
  }

  // Small ornamental corner flourish for the page panels.
  function cornerSVG() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" aria-hidden="true" focusable="false">` +
      `<path d="M2,58V14C2,7 7,2 14,2H58" fill="none" stroke="#c9a24a" stroke-width="1.2"/>` +
      `<path d="M8,58V20C8,13 13,8 20,8H58" fill="none" stroke="#8a6d2a" stroke-width="0.8"/>` +
      `<path d="M14,14C22,10 30,14 28,22C26,28 18,26 20,20C21,17 25,17 25,20" fill="none" stroke="#c9a24a" stroke-width="1.4" stroke-linecap="round"/>` +
      `<path d="M28,8C34,14 42,14 48,8M8,28C14,34 14,42 8,48" fill="none" stroke="#c9a24a" stroke-width="1" stroke-linecap="round"/>` +
      `<circle cx="14" cy="14" r="2.2" fill="#c9a24a"/></svg>`;
  }

  global.Art = { mirrorSVG, portraitSVG, cornerSVG, anchors, VIEW };
})(window);
