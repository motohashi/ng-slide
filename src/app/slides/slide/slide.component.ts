import {HostBinding, Component, Input, Output, EventEmitter} from '@angular/core';
import {trigger, animate, style, transition, animateChild, group, query, stagger} from '@angular/animations';
import {SlideBusService} from '../slide-bus.service';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  styleUrls: ['./slide.component.css'],
  animations: [
    // trigger('leftLeave', [
    //   transition('* => *', [
    //     query(':enter, :leave', style({ position: 'absolute', left: '0%' })),
    //     query(':enter', style({ left: '100%' })),

    //     group([
    //       query(':leave', group([
    //         animateChild(),
    //         animate('1200ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 0, left: '-100%' }))
    //       ])),

    //       query(':enter', group([
    //         animate('1200ms cubic-bezier(0.35, 0, 0.25, 1)', style('*')),
    //         animateChild()
    //       ]), { delay: 200 }),
    //     ])
    //   ])
    // ]),
    // trigger('rightLeave', [
    //   transition('* => *', [
    //     query(':enter, :leave', style({ position: 'absolute', left: '0%' })),
    //     query(':enter', style({ left: '100%' })),

    //     group([
    //       query(':leave', group([
    //         animateChild(),
    //         animate('1200ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 0, left: '-100%' }))
    //       ])),

    //       query(':enter', group([
    //         animate('1200ms cubic-bezier(0.35, 0, 0.25, 1)', style('*')),
    //         animateChild()
    //       ]), { delay: 200 }),
    //     ])
    //   ])
    // ]),
    trigger('nextAnimation', [
      transition(':enter', [
        query('*', [
          style({ transform: 'translateX(200px)', opacity: 0 }),
            animate('1200ms cubic-bezier(0.35, 0, 0.25, 1)', style('*'))
        ])
      ])
    ]),
    // trigger('prevAnimation', [
    //   transition('* => *', [
    //     query(':enter, :leave', style({ position: 'absolute', left: '0%' })),
    //     query(':enter', style({ left: '100%' })),

    //     group([
    //       query(':leave', group([
    //         animateChild(),
    //         animate('1200ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 0, left: '-100%' }))
    //       ])),

    //       query(':enter', group([
    //         animate('1200ms cubic-bezier(0.35, 0, 0.25, 1)', style('*')),
    //         animateChild()
    //       ]), { delay: 200 }),
    //     ])
    //   ])
    // ])
  ]
})


export class SlideComponent {
  @Input() html;
  @Input() title;
  @Output('close')
  public closeNotify = new EventEmitter();
  public activeSlides: any[] = [];

  @HostBinding('@nextAnimation') next = false;
  // @HostBinding('@prevAnimation') prev = false;
  // @HostBinding('@leftLeave') left = false;
  // @HostBinding('@rightLeave') right = false;

//  @HostBinding('style.background') bgcolor = '#ECF6FF';

  @Input('slide')
  set slide(slide: any) {
    this.activeSlides = [];
    if (slide && this.activeSlides[0] !== slide) {
      this.activeSlides.push(slide);
      // this.count++;
      this._slideService.notifyOpen(this);
    }
  }



  // @HostBinding('@preview')
  // public count: number = 0;


  constructor(private _slideService: SlideBusService) {
    _slideService.onOtherSlideOpen(this, () => this.close());
  }

  close() {
    this.closeNotify.next();
  }
}
