import {
  HostBinding,
  HostListener,
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ComponentFactoryResolver
} from '@angular/core';
import {trigger, animate, style, transition, animateChild, group, query, stagger} from '@angular/animations';
import {SlideBusService} from './slide-bus.service';
import {SlidesService} from './slides.service';
import {SlideDirective} from './slide/slide.directive';
import {SlideComponent} from './slide/slide.component';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.css'],
})
export class SlidesComponent implements OnInit {

@Input() public slides;

  selectedSlide = 0;
  currentIndex = 0;

  constructor(private _slideBusService: SlideBusService,
              private _slideService: SlidesService,
            ) {
    this.slides = this._slideService.getAll();
  }

  ngOnInit() {
    this.slides = this._slideService.getAll();
    this.selectSlide(this.currentIndex);

    console.log(this.slides)
    this.slides.forEach((_slide_data, index) => {
        this._slideBusService.register(index, _slide_data);
    });
  }

  selectSlide(slide_id: any) {
    if ( slide_id !== this.selectedSlide) {
      this.selectedSlide = slide_id ;
    }else {
      this.selectedSlide = null;
    }
  }

  @HostListener('window:keyup.arrowRight')
  onArrowRight() {
    if (this.currentIndex + 1 < this.slides.length) {
      const slide = this._slideBusService.slidesByName[++this.currentIndex];
      this.selectSlide(slide);
    }
    console.log('arrowUp..');
  }

  @HostListener('window:keyup.arrowLeft')
  onArrowLeft() {
    if (this.currentIndex - 1 >= 0) {
      const slide = this._slideBusService.slidesByName[--this.currentIndex];
      this.selectSlide(slide);
    }
  }
}
