import { Injectable } from '@angular/core';
import { SlidesService } from './slides.service';

@Injectable()
export class SlideBusService {
  public slidesByName = new Map<any, any>();
  private _callbacks = new Map<any, () => any>();

  constructor(private _slides: SlidesService) { }

  openSlideByTitle(title: string) {
    const slides = this._slides.getAll();
    let data: any;
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      if (slide.title === title) {
          data = slide;
          break;
      }
    }
    if ( !data ) return;
    const slidesComponent = this.slidesByName.get(data.title);
    slidesComponent.selectSlide(data.title);
  }

  register(name: any, component: any) {
    this.slidesByName.set(name, component);
  }

  onOtherSlideOpen(previewComponent: any, cb: () => any) {
    this._callbacks.set(previewComponent, cb);
  }

  notifyOpen(previewComponent: any) {
    Promise.resolve().then(() => {
      this._callbacks.forEach((cb, cmp) => {
        if (previewComponent !== cmp) {
          cb();
        }
      });
    });
  }
}
