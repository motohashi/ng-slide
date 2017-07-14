import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location }                 from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) { }
  private page = 1;
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.page = params['page'];
    });
  }
}
