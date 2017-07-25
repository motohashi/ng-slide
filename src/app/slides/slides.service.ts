import {Injectable} from '@angular/core';
import {SLIDES} from './slides.data';

@Injectable()
export class SlidesService {
  private _slides = [].concat(SLIDES);

  getAll() {
    return this._slides;
  }

  add(slide) {
    this._slides.push(slide);
  }

  addSlide(title, path): number {
    let slide = this._slides.find(grp => grp.title === title);
    if (!slide) {
      const ts = timestamp();
      slide = {title, path, ts};
      this.add(slide);
    }
    return slide;
  }
}

function timestamp() {
  return Date.now();
}
