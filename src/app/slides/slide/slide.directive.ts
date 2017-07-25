import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[slide-host]',
})
export class SlideDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
