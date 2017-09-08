import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import FireWorks from 'lib/fireworks';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  camvasEffect;
  bgEffect;
  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) { }
  ngOnInit(): void {
    this.setCurrentClass();
    FireWorks('canvas');
  }
  setCurrentClass() {
    // CSS classes: added/removed per current state of component properties
    this.camvasEffect = 'test';
    this.bgEffect = 'test';
  }

}
