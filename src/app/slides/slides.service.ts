import {Injectable} from '@angular/core';
import {SLIDES} from './slides.data';

@Injectable()
export class SlidesService {
  private _slides = [].concat(SLIDES);
  getAll() {
    return this._slides;
  }
}
