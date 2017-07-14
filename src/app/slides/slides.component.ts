import { Component, OnInit, Input } from '@angular/core';
import { Slide } from 'slide';
import { SlideService } from './slide.service';

@Component({
  selector: 'app-slides',
  templateUrl: './slides.component.html',
  styleUrls: ['./slides.component.css']
})
export class SlidesComponent implements OnInit {
  @Input() public id;
  
  constructor(private slideService: SlideService,) {}
  slide;
  ngOnInit(): void {
    this.slide = this.slideService.getSlideData(this.id);
  }
  ngAfterViewInit(): void {
    
  }
}
