import {Injectable, EventEmitter} from '@angular/core';

@Injectable()
export class EffectProviderBusService {
  public effectEvent$: EventEmitter<any>;
  public colorEvent$: EventEmitter<any>;

  constructor() {
    this.colorEvent$ = new EventEmitter();
    this.effectEvent$ = new EventEmitter();
  }
}

