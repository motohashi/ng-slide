// import * as ceil from '/' ;

const RGB_LIMIT = 255;

function cmp(val1, val2) {
  if (val1 === 0) {
    return 0;
  }
  const out = val1 - 0 || val2 - 0;
  // tslint:disable-next-line:curly
  if ( out > 0 ) return 255;
}

abstract class ColorType {
  abstract compare(comparer: ColorType): boolean
  abstract toString(): string
}

class RGB extends ColorType {
  r;
  g;
  b;
  a;
  static rgbToHsl(rgb: RGB): HSL {
    const rgbArr: number[] = [rgb.r, rgb.g, rgb.b];
    const maxRGB = Math.max(...rgbArr);
    const maxIndex = rgbArr.indexOf(maxRGB);
    const rests = rgbArr.splice(maxIndex)
    const minRGB = Math.min(...rests);
    if ( maxIndex === 2 ) {
      rests.reverse();
    }
    const diffMinMax = maxRGB - minRGB;
    const sumMinMax = maxRGB + minRGB;
    const h = rests.reduce((_in, out) => _in - out) / diffMinMax * 60 + 120 * maxIndex;
    const l = sumMinMax / (255 * 2);
    const denominator = l > 0.5 ? 2 * RGB_LIMIT - diffMinMax : sumMinMax;
    const s = sumMinMax / denominator;
    return new HSL( Math.floor(h)  , Math.floor(l) , Math.floor(s) , rgb.a);
  }
  constructor(...args) {
    super();
    this.r = cmp(arguments[0], 0);
    this.g = cmp(arguments[1], 0);
    this.b = cmp(arguments[2], 0);
    this.a = cmp(arguments[3], 1);
  }
  compare(comparer: ColorType): boolean {return true; }
  toString(): string {
    if (this.a < 1) {
      return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
    }
    return "rgb(" + this.r + ", " + this.g + ", " + this.b + ")";
  }
  toHsl(): HSL {
      return RGB.rgbToHsl(this);
  }
}

class HSL extends ColorType {
  h;
  s;
  l;
  a;
  static colVal(max, min, h) {
    const hue = (h + 180) % 360;
    if (h < 60) {
      return max + (min - max) * hue / 60;
    } else if (hue < 180) {
      return min;
    } else if (hue < 240) {
      return max + (min - max) * (240 - hue) / 60;
    } else {
      return max;
    }
  };
  constructor(...args) {
    super();
    this.h = cmp(arguments[0], 0);
    this.s = cmp(arguments[1], 0);
    this.l = cmp(arguments[2], 0);
    this.a = cmp(arguments[3], 1);
  }
  compare(comparer: ColorType): boolean {return true; }
  toString() {
    if (this.a < 1) {
      return "hsla(" + this.h + ", " + this.s + "%, " + this.l + "%, " + this.a + ")";
    }
    return "hsl(" + this.h + ", " + this.s + "%, " + this.l + "%)";
  }
  randHsl(maxS, minS, maxL, minL, maxA, minA) {
    this.h = Math.random() * 360;
    this.s = Math.random() * (maxS - minS) + minS;
    this.l = Math.random() * (maxL - minL) + minL;
    this.a = cmp(Math.random() * (maxA - minA) + minA, 1);
  }
  hslToRgb(hsl: HSL): RGB {
    if (hsl.s === 0) {
      const v = hsl.l * 255;
      return new RGB(v, v, v, hsl.a);
    }
    const l = hsl.l / 100;
    const s = hsl.s / 100;
    const max = l > 0.5 ? l * ( 1 + s ) : l + s - l * s;
    const min = 2 * l - max;

    const r = Math.floor(HSL.colVal(max, min, hsl.h + 120) * RGB_LIMIT);
    const g = Math.floor(HSL.colVal(max, min, hsl.h) * RGB_LIMIT);
    const b = Math.floor(HSL.colVal(max, min, hsl.h - 120) * RGB_LIMIT);
    return new RGB(r, g, b, hsl.a);
  }
}

class Color {
  rgb: RGB;
  hsl: HSL;
  static randHsl(maxS, minS, maxL, minL, maxA, minA) {
    const hsl = new HSL(
      Math.floor(Math.random() * 360),
      parseInt(Math.random() * (maxS - minS) + minS, 10),
      parseInt(Math.random() * (maxL - minL) + minL, 10),
      cmp(Math.random() * (maxA - minA) + minA, 1)
    );
    return hsl;
  }
}

export { RGB, HSL, Color }
