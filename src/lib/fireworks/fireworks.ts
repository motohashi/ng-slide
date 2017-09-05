

 const QTY = 360;  // particles quantity
 const SIZE = 2.0; // particle size
 let DECAY = 0.98; // energy decay
 let GRAVITY = 1.5; // virtual gravity


class Circle {
  ctx;
  radian = Math.PI * 2;
  posX;
  posY;
  velX;
  velY;
  size;
  addVelocity() {
    this.posX += this.velX;
    this.posY += this.velY;
    return this;
  }
  computeDecay(d) {
    this.velX *= d;
    this.velY *= d;
    this.size *= d;
    return this;
  }
  computeGravity(g) {
    this.posY += g;
    return this;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.posX, this.posY, this.size, 0, circle.rad, true);
    if(this.sw) {
      ctx.fillStyle = "#FFFFFF";
      this.sw = false;
    } else {
      ctx.fillStyle = this.col;
      this.sw = true;
    }
    ctx.fill();
  }
};

class FireWork {

  rfws = [];

  cvs;
  ctx;
  width;
  hight;
  left;
  top;
  fps = 0;
  constructor(cvs) {
    this.cvs = cvs || document.getElementsByTagName('canvas');
    this.ctx = cvs.getContext('2d');
  }

  explode(x, y) {
    var i, color;
    const generateSpark = function () {
        var angle, velocity, spark;
        angle    = Math.random() * (circle.rad);
        velocity = Math.random() * 5;
        return spark = {
          posX: x,
          posY: y,
          velX: Math.cos(angle) * velocity,
          velY: Math.sin(angle) * velocity,
          col : color,
          size: SIZE,
          sw: Math.random() > 0.5 ? true : false      };
      };
      x -= this.left;
      y -= this.top;
      color = colorz.randHsl(100, 90, 60, 50, 90, 70).toString();
    for (i = 0; i < QTY; i += 1) {
      fws.push(generateSpark());
    }
  }
    
  update() {
    var i, s, len = fws.length;
    var updateSpark = function (s) {
      circle.addVelocity.call(s);
      circle.computeDecay.call(s, DECAY);
      circle.computeGravity.call(s, GRAVITY);
    };
    for (i = 0; i < len; i++) {
      updateSpark(s = fws[i]);
      if (s.size < 0.1 || s.posX < 5 || s.posX > 395 || s.posY > 395) {
        fws.splice(i, 1);
        len -= 1;
      }
    }
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fillRect(0, 0, cvsW, cvsH);
  }
  
  render() {
      var i, s, len = fws.length;
      fps += 1;
      for (i = 0; i < len; i += 1) {
        s = fws[i];
        circle.draw.call(s);
      }
  }
      
 
  if (cvs && cvs.getContext) {
      ctx = cvs.getContext('2d');
      cvsW = ctx.canvas.width;
      cvsH = ctx.canvas.height;
      cvsL = cvs.getBoundingClientRect().left;
      cvsT = cvs.getBoundingClientRect().top;
      // Register event listeners
      cvs.addEventListener('mousedown', function (e) {
        explode(e.clientX, e.clientY);  
      }, false);
      cvs.addEventListener('touchstart', function (e) {
        explode(e.touches[0].pageX, e.touches[0].pageY);  
      }, false);
      setInterval(render, 0);
      setInterval(update, 1000 / 60);
      setInterval(fpsUpdate, 1000);
    }

}

