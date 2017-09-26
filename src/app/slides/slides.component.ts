import {
  HostListener,
  Component,
  Input,
  OnInit
} from '@angular/core';
import {trigger, animate, style, transition, animateChild, group, query, stagger} from '@angular/animations';
import {SlidesService} from './slides.service';
import {SlideComponent} from './slide/slide.component';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.css'],
})

export class SlidesComponent implements OnInit {

  @Input() public slides;
  currentIndex = 0;
  selectedSlide = null;

  constructor(
              private _slideService: SlidesService,
            ) {
    this.slides = this._slideService.getAll();
  }

  ngOnInit() {
    this.selectSlide(this.currentIndex);
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
      this.selectSlide(++this.currentIndex);
    }
  }

  @HostListener('window:keyup.arrowLeft')
  onArrowLeft() {
    if (this.currentIndex - 1 >= 0) {
      this.selectSlide(--this.currentIndex);
    }
  }
}
