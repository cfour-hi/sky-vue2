export const RGB2Hex = (r: number, g: number, b: number) => {
  let _r = r.toString(16);
  let _g = g.toString(16);
  let _b = b.toString(16);

  if (_r.length === 1) _r = '0' + _r;
  if (_g.length === 1) _g = '0' + _g;
  if (_b.length === 1) _b = '0' + _b;

  return '#' + _r + _g + _b;
};

export const RGB2HSL = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const minVal = Math.min(r, g, b);
  const maxVal = Math.max(r, g, b);
  const delta = maxVal - minVal;

  let h = 0;
  let s = 0;
  const l = maxVal;
  if (delta === 0) {
    h = s = 0;
  } else {
    s = delta / maxVal;
    const dr = ((maxVal - r) / 6 + delta / 2) / delta;
    const dg = ((maxVal - g) / 6 + delta / 2) / delta;
    const db = ((maxVal - b) / 6 + delta / 2) / delta;

    if (r === maxVal) {
      h = db - dg;
    } else if (g === maxVal) {
      h = 1 / 3 + dr - db;
    } else if (b === maxVal) {
      h = 2 / 3 + dg - dr;
    }

    if (h < 0) {
      h += 1;
    } else if (h > 1) {
      h -= 1;
    }
  }

  return [h * 360, s * 100, l * 100];
};

export const RGBA2HSLA = (r: number, g: number, b: number, a = 1) => [
  ...RGB2HSL(r, g, b),
  a,
];

export function HSL2RGB(h: number, s: number, l: number) {
  h = (h / 360) * 6;
  s /= 100;
  l /= 100;

  const i = Math.floor(h);

  const f = h - i;
  const p = l * (1 - s);
  const q = l * (1 - f * s);
  const t = l * (1 - (1 - f) * s);

  const mod = i % 6;
  const r = [l, q, p, p, t, l][mod];
  const g = [t, l, l, q, p, p][mod];
  const b = [p, p, t, l, l, q][mod];

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

export const HSLA2RGBA = (h: number, s: number, l: number, a = 1) => [
  ...HSL2RGB(h, s, l),
  a,
];

export const HSL2Hex = (h: number, s: number, l: number) => {
  const [r, g, b] = HSL2RGB(h, s, l);
  return RGB2Hex(r, g, b);
};

export const hex2RGB = (hex: string) => {
  let r = 0;
  let g = 0;
  let b = 0;

  if (hex.length == 4) {
    // 3 digits
    r = +('0x' + hex[1] + hex[1]);
    g = +('0x' + hex[2] + hex[2]);
    b = +('0x' + hex[3] + hex[3]);
  } else if (hex.length == 7) {
    // 6 digits
    r = +('0x' + hex[1] + hex[2]);
    g = +('0x' + hex[3] + hex[4]);
    b = +('0x' + hex[5] + hex[6]);
  }

  return [r, g, b];
};
