import {HostBinding, Component, Input} from '@angular/core';
import {trigger, animate, style, transition, query} from '@angular/animations';

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
  @HostBinding('@nextAnimation') next = false;
}
