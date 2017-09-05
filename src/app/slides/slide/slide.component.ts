import {HostBinding, Component, Input, Output, EventEmitter} from '@angular/core';
import {trigger, animate, style, transition, animateChild, group, query, stagger} from '@angular/animations';
import {SlideBusService} from '../slide-bus.service';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.css'],
  animations: [
    trigger('nextAnimation', [
      transition(':enter', [
        query('*', [
          style({ transform: 'translateX(200px)', opacity: 0 }),
            animate('1200ms cubic-bezier(0.35, 0, 0.25, 1)', style('*'))
        ])
      ])
    ])
  ]
})


export class SlideComponent {
  @Input() html;
  @Input() title;
  @Output('close')
  public closeNotify = new EventEmitter();
  public activeSlides: any[] = [];

  @HostBinding('@nextAnimation') next = false;

  @Input('slide')
  set slide(slide: any) {
    this.activeSlides = [];
    if (slide && this.activeSlides[0] !== slide) {
      this.activeSlides.push(slide);
      this._slideService.notifyOpen(this);
    }
  }

  constructor(private _slideService: SlideBusService) {
    _slideService.onOtherSlideOpen(this, () => this.close());
  }

  close() {
    this.closeNotify.next();
  }
}
