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
  animations: [
    trigger('sliding', [
      // transition(':enter', [
      //   query('*', [
      //     style({ transform: 'translateX(200px)', opacity: 0 }),
      //     stagger(100, [
      //       animate('1200ms cubic-bezier(0.35, 0, 0.25, 1)', style('*'))
      //     ])
      //   ])
      // ])
      // transition('inactive <=> active', [
      //   animate('1000ms ease-in')
      //   // group([
      //   //   query(':leave', group([
      //   //     animate('1200ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 0, left: '-100%' }))
      //   //   ])),

      //   //   query(':enter', group([
      //   //     animateChild()
      //   //   ]), { delay: 200 }),
      //   // ])
      // ])
    ]),
  //   trigger('preview', [
  //     transition(':enter', [
  //       style({ overflow: 'hidden', height: 0 }),
  //       query('.image-container', [
  //         query('*', style({ opacity: 0 }))
  //       ], {optional: true}),
  //       group([
  //         animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', style({ height: '*' })),
  //         query('.image-container *', [
  //           stagger(100, animate(500, style({ opacity: 1 })))
  //         ], {optional: true})
  //       ])
  //     ]),
  //     transition(':leave', [
  //       style({ overflow: 'hidden' }),
  //       animate('0.5s cubic-bezier(0.35, 0, 0.25, 1)', style({ height: '0px'}))
  //     ]),
  //     transition('* => *', [
  //       query(':enter, :leave', style({ position: 'absolute', left: '0%' })),
  //       query(':enter', style({ left: '100%' })),

  //       group([
  //         query(':leave', group([
  //           animateChild(),
  //           animate('1200ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity:0, left:'-100%' }))
  //         ])),

  //         query(':enter', group([
  //           animate('1200ms cubic-bezier(0.35, 0, 0.25, 1)', style('*')),
  //           animateChild()
  //         ]), { delay: 200 }),
  //       ])
  //     ])
  //   ]),
  //   trigger('image', [
  //     transition(':enter', [
  //       query('*', [
  //         style({ transform: 'translateX(200px)', opacity: 0 }),
  //         stagger(100, [
  //           animate('1200ms cubic-bezier(0.35, 0, 0.25, 1)', style('*'))
  //         ])
  //       ])
  //     ])
  //   ])
  ]
})
export class SlidesComponent implements OnInit {

  // @ViewChild(SlideDirective) adHost: SlideDirective;

@Input() public slides;

  selectedSlide = 0;

  // @HostBinding('')
  currentIndex = 0;

  constructor(private _slideBusService: SlideBusService,
              private _slideService: SlidesService,
              // private componentFactoryResolver: ComponentFactoryResolver
            ) {
    this.slides = this._slideService.getAll();
    // this.slides = _slideService.getAll();
  }

  ngOnInit() {
    this.slides = this._slideService.getAll();
    this.selectSlide(this.currentIndex);

    console.log(this.slides)
    this.slides.forEach((_slide_data, index) => {
        // const html = require(_slide_data.path);
        // const slide = this.loadComponent(html);
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

  //@HostBinding('style.backgroundcolor') bgcolor = '#ECF6FF';

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
    // history.back();
  }
  // loadComponent(html: string) {
  //   let componentFactory = this.componentFactoryResolver.resolveComponentFactory(SlideComponent);
  //   let viewContainerRef = this.adHost.viewContainerRef;
  //   viewContainerRef.clear();
  //   let componentRef = viewContainerRef.createComponent(componentFactory);
  //   componentRef.instance.html = html;
  //   return componentRef;
  // }

}
