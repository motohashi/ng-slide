import { Component, OnInit } from '@angular/core';
import {EffectProviderBusService} from './effect-provider-bus.service';
import { ChangeDetectorRef } from '@angular/core'
import 'rxjs/add/operator/concatMap'
import FireWorks from 'lib/fireworks';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  bgEffect;
  canvasEffect;
  constructor(
    private _effectService: EffectProviderBusService,
    private ref: ChangeDetectorRef
  ) {
    this.bgEffect = '';
  }
  ngOnInit(): void {
    this._effectService.effectEvent$.concatMap((className) => {
      return this.animate( className );
    }).subscribe( ( className ) => {
      this.canvasEffect = '';
      this.bgEffect = '';
      this.ref.detectChanges();
    });
  }
  animate( className ) {
    if ( className === 'spark') {
      this.bgEffect = 'slide';
      this.canvasEffect = className;
      this.ref.detectChanges();
      return FireWorks('canvas', 4000);
    } else {
      this.bgEffect = className;
    }
    this.ref.detectChanges();
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 5000);
    });
  }
}
