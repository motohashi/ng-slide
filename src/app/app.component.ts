import 'rxjs/add/operator/concatMap';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import FireWorks from 'lib/fireworks';
import { EffectProviderBusService } from './effect-provider-bus.service'
import { ChangeDetectorRef } from '@angular/core'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  canvasEffect;
  bgEffect;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private _effectService: EffectProviderBusService,
    private ref: ChangeDetectorRef
  ) {
    this.canvasEffect = '';
    this.bgEffect = '';
  }
  ngOnInit(): void {
    this._effectService.effectEvent$.concatMap((className) => {
      console.log(className);
      return this.animate( className );
    }).subscribe( ( className ) => {
      this.canvasEffect = '';
      this.bgEffect = '';
      this.ref.detectChanges();
    });
  }
  animate( className ) {
    if ( className === "spark") {
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
