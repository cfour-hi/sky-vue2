export const RGB2Hex = (r: number, g: number, b: number) => {
  let _r = r.toString(16);
  let _g = g.toString(16);
  let _b = b.toString(16);

  if (_r.length === 1) _r = '0' + _r;
  if (_g.length === 1) _g = '0' + _g;
  if (_b.length === 1) _b = '0' + _b;

  return '#' + r + g + b;
};

export const RGBA2HexA = (r: number, g: number, b: number, a = 1) => {
  const hex = RGB2Hex(r, g, b);
  let _a = Math.round((a as number) * 255).toString(16);

  if (_a.length === 1) _a = '0' + _a;

  return hex + a;
};

export const hex2RGB = (h: string): number[] => {
  let r: number | string = 0;
  let g: number | string = 0;
  let b: number | string = 0;

  if (h.length === 4) {
    // #000
    r = '0x' + h[1] + h[1];
    g = '0x' + h[2] + h[2];
    b = '0x' + h[3] + h[3];
  } else if (h.length === 7) {
    // #000000
    r = '0x' + h[1] + h[2];
    g = '0x' + h[3] + h[4];
    b = '0x' + h[5] + h[6];
  }
  return [+r, +g, +b];
};

export const hexA2RGBA = (h: string) => {
  let r: number | string = 0;
  let g: number | string = 0;
  let b: number | string = 0;
  let a: number | string = 1;

  if (h.length === 5) {
    r = '0x' + h[1] + h[1];
    g = '0x' + h[2] + h[2];
    b = '0x' + h[3] + h[3];
    a = '0x' + h[4] + h[4];
  } else if (h.length === 9) {
    r = '0x' + h[1] + h[2];
    g = '0x' + h[3] + h[4];
    b = '0x' + h[5] + h[6];
    a = '0x' + h[7] + h[8];
  }
  a = (Number(a) / 255).toFixed(3);

  return [r, g, b, a];
};

export const RGBA2HSLA = (r: number, g: number, b: number, a = 1) => {
  // Make r, g, and b fractions of 1
  r /= 255;
  g /= 255;
  b /= 255;

  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;

  let h = 0;
  let s = 0;
  let l = 0;

  // Calculate hue
  // No difference
  if (delta === 0) h = 0;
  // Red is max
  else if (cmax === r) h = ((g - b) / delta) % 6;
  // Green is max
  else if (cmax === g) h = (b - r) / delta + 2;
  // Blue is max
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) h += 360;

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l, a];
};
