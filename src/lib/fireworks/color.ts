var colorz = {
    cmp: function (val1, val2) {
      if (val1 === 0) {
        return 0;
      }
      return val1 - 0 || val2 - 0;
    },
    // HSL Class
    // 括弧内は引数省略時のデフォルト値
    // alphaのみの省略も可
    // h:[  0 .. 359 (0)]色相(hue)
    // s:[  0 .. 100 (0)]彩度(saturation)
    // l:[  0 .. 100 (0)]明度(lightness)
    // a:[0.0 .. 1.0 (1)]透明度(alpha)
    hsl: function () {
      var h = this.cmp(arguments[0], 0);
      var s = this.cmp(arguments[1], 0);
      var l = this.cmp(arguments[2], 0);
      var a = this.cmp(arguments[3], 1);
      return {
        h: function () {
          return h = colorz.cmp(arguments[0], h);
        },
        s: function () {
          return s = colorz.cmp(arguments[0], s);
        },
        l: function () {
          return l = colorz.cmp(arguments[0], l);
        },
        a: function () {
          return a = colorz.cmp(arguments[0], a);
        },
        set: function () {
          this.h(colorz.cmp(arguments[0], h));
          this.s(colorz.cmp(arguments[1], s));
          this.l(colorz.cmp(arguments[2], l));
          this.a(colorz.cmp(arguments[3], a));
        },        
        toString: function () {
          if (this.a() < 1) {
            return "hsla(" + this.h() + ", " + this.s() + "%, " + this.l() + "%, " + this.a() + ")";
          }
          return "hsl(" + this.h() + ", " + this.s() + "%, " + this.l() + "%)";
        }
      };
    },
    // RGB Class
    // 括弧内は引数省略時のデフォルト値
    // alphaのみの省略も可
    // r:[  0 .. 255 (0)]赤(red)
    // g:[  0 .. 255 (0)]緑(green)
    // b:[  0 .. 255 (0)]青(blue)
    // a:[0.0 .. 1.0 (1)]透明度(alpha)
    rgb: function () {
      var r = this.cmp(arguments[0], 0);
      var g = this.cmp(arguments[1], 0);
      var b = this.cmp(arguments[2], 0);
      var a = this.cmp(arguments[3], 1);
      return {
        r: function () {
          return r = colorz.cmp(arguments[0], r);
        },
        g: function () {
          return g = colorz.cmp(arguments[0], g);
        },
        b: function () {
          return b = colorz.cmp(arguments[0], b);
        },
        a: function () {
          return a = colorz.cmp(arguments[0], a);
        },
        set: function () {
          this.r(colorz.cmp(arguments[0], r));
          this.g(colorz.cmp(arguments[1], g));
          this.b(colorz.cmp(arguments[2], b));
          this.a(colorz.cmp(arguments[3], a));
        },        
        toString: function () {
          if (this.a() < 1) {
            return "rgba(" + this.r() + ", " + this.g() + ", " + this.b() + ", " + this.a() + ")";
          }
          return "rgb(" + this.r() + ", " + this.g() + ", " + this.b() + ")";
        }
      };
    },
    
    // hslToRgb:HSLをRGBオブジェクトに変換
    // h:[  0 .. 359]色相(hue)
    // s:[  0 .. 100]彩度(saturation)
    // l:[  0 .. 100]明度(lightness)
    // a:[0.0 .. 1.0]透明度(alpha)省略可
    hslToRgb: function (h, s, l) {
      var hsl = {
        h: h,
        s: s / 100,
        l: l / 100
      };
      var rgb = {
        r: 0,
        g: 0,
        b: 0
      };
      var m, M, v, idx, colVal;
  
      if (hsl.s === 0) {
        v = parseInt(hsl.l * 255, 10);
        return this.rgb(v, v, v, arguments[3]);
      }
      
      if (hsl.l < 0.5) {
        M = hsl.l * (1.0 + hsl.s);
      } else {
        M = hsl.l * (1.0 - hsl.s) + hsl.s;
      }
      m = 2.0 * hsl.l - M;
  
      rgb.r = hsl.h + 120;
      if (rgb.r > 360) { rgb.r -= 360; }
      rgb.g = hsl.h;
      rgb.b = hsl.h - 120;
      if (rgb.b < 0) { rgb.b += 360; }
      
      
      for (idx in rgb) {
        colVal = function (v) {
          if (v < 60) {
            return m + (M - m) * v / 60;
          } else if (v < 180) {
            return M;
          } else if (v < 240) {
            return m + (M - m) * (240 - v) / 60;
          } else {
            return m;
          }
        };
        rgb[idx] = parseInt(colVal(rgb[idx]) * 255, 10);        
      }
      return this.rgb(rgb.r, rgb.g, rgb.b, arguments[3]);
    },
  
    // rgbToHsl:RGBをHSLオブジェクトに変換
    // r:[  0 .. 255]赤(red)
    // g:[  0 .. 255]緑(green)
    // b:[  0 .. 255]青(blue)
    //透明度(alpha)省略可
    rgbToHsl: function (r, g, b) {
      var rgb = {
        r: r / 255,
        g: g / 255,
        b: b / 255
      };
      var hsl = {
        h: 0,
        s: 0,
        l: 0
      };
      var m = 1.0, M = 0.0;
      var idx, v, diff;
      for (idx in rgb) {
        v = rgb[idx];
        if (m > v) { m = v; }
        if (M < v) { M = v; }
      }
      hsl.l = (m + M) / 2 * 100;
      
      if (0 < (diff = M - m)) {
        if (hsl.l < 0.5) {
          hsl.s = diff / (M + m) * 100;
        } else {
          hsl.s = diff / (2.0 - M - m) * 100;
        }
      
        if (rgb.r === M) {
          hsl.h = (rgb.g - rgb.b) / diff;
        } else if (rgb.g === M) {
          hsl.h = (rgb.b - rgb.r) / diff + 2.0;
        } else {
          hsl.h = (rgb.r - rgb.g) / diff + 4.0;
        }
        hsl.h *= 60;
        if (hsl.h < 0) {
          hsl.h += 360;
        }
      }
      for (idx in hsl) {
        hsl[idx] = hsl[idx].toFixed(2);
      }
      return this.hsl(hsl.h, hsl.s, hsl.l, arguments[3]);
    },
    
    // 指定範囲内のランダムなHSLオブジェクトを返す
    // maxS:[  0 .. 100]最大彩度(saturation)
    // mimS:[  0 .. 100]最小彩度(saturation)
    // maxL:[  0 .. 100]最大明度(lightness)
    // minL:[  0 .. 100]最小明度(lightness)
    // maxA:[0.0 .. 1.0]最大透明度(alpha)省略可
    // minA:[0.0 .. 1.0]最小透明度(alpha)省略可
    randHsl: function (maxS, minS, maxL, minL, maxA, minA) {
      var hsl = {
        h: parseInt(Math.random() * 360, 10),
        s: parseInt(Math.random() * (maxS - minS) + minS, 10),
        l: parseInt(Math.random() * (maxL - minL) + minL, 10),
        a: this.cmp(Math.random() * (maxA - minA) + minA, 1)
      };
      return this.hsl(hsl.h, hsl.s, hsl.l, hsl.a);  
    },
    
    // flameLoop:canvasを指定レート、カラーでLoopさせる。
    // rate:rate per sec
    // rgba:"rgba( R, G, B, A)"
    // cvsW:canvas.width
    // cvsH:canvas.height
    flameLoop: function (rate, rgba, cvsW, cvsH ) {
      setInterval(loop, 1000 / rate, rgb_to_rgbaTxt(0, 0.03), SCREEN_W, SCREEN_H );  
      function loop() {
        ctx.fillStyle = rgba;
        ctx.fillRect(0, 0, cvsW, cvsH);
      }
    }
  };
  
  function test () {
    var val, text = "";
    alert(colorz.randHsl(100, 90, 55, 45, 1.0, 0.9).toString());
  }
  // test();