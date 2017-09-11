import { RGB, HSL, Color } from './color';

const QTY = 360;
const SIZE = 2.0;
const DECAY = 0.98;
const PSEUDO_GRAVITY = 1.5;

class Spark {
  public static radian = Math.PI * 2;
  public size = SIZE;
  static generateSpark(x, y) {
    const theta   = Math.random() * Spark.radian;
    const velocity = Math.random() * 5;
    return new Spark(
      x,
      y,
      Math.cos(theta) * velocity,
      Math.sin(theta) * velocity,
      Color.randHsl(100, 90, 55, 45, 1.0, 0.9).toString(),
      velocity,
      Math.random() > 0.5 ? true : false
    );
  }
  constructor(
    private posX: number,
    private posY: number,
    private velX: number,
    private velY: number,
    private col: string,
    private velocity: number,
    private sw: boolean
  ) {}
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
  computePseudoGravity(g) {
    this.posY += g;
    return this;
  }
  updateNextTick() {
    this.addVelocity();
    this.computeDecay(DECAY);
    this.computePseudoGravity(PSEUDO_GRAVITY);
  };
}

class FireWorksRenderrer {
  public cvs;
  public ctx;
  public fws;
  width;
  height;
  left;
  top;
  fps = 0;
  constructor(cvs) {
    this.cvs = cvs || document.getElementsByTagName('canvas');
    this.ctx = cvs.getContext('2d');
    this.width = this.ctx.canvas.width;
    this.height = this.ctx.canvas.height;
    this.left = this.ctx.canvas.getBoundingClientRect().left;
    this.top = this.ctx.canvas.getBoundingClientRect().top;
    this.fws = [];
  }
  draw(spark) {
    this.ctx.beginPath();
    this.ctx.arc(spark.posX, spark.posY, spark.size, 0, Spark.radian, true);
    if ( spark.sw ) {
      this.ctx.fillStyle = "#FFFFFF";
      spark.sw = false;
    } else {
      this.ctx.fillStyle = spark.col;
      spark.sw = true;
    }
    this.ctx.fill();
  }
  public explode(x, y) {
    x -= this.left;
    y -= this.top;
    for (let i = 0; i < QTY; i += 1) {
      this.fws.push(Spark.generateSpark(x, y));
    }
  }
  public update() {
    let len = this.fws.length;
    for ( let i = len - 1 ; i >= 0; i--) {
      const s = this.fws[i];
      s.updateNextTick();
      if ( s.size < 0.1 || s.posX < 5 || s.posX > this.width || s.posY > this.height) {
        this.fws.splice(i, 1);
        len -= 1;
      }
    }
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  public render() {
      const len = this.fws.length;
      this.fps += 1;
      for (let i = 0; i < len; i += 1) {
        const s = this.fws[i];
        this.draw(s);
      }
  }
}

export {Spark, FireWorksRenderrer}
