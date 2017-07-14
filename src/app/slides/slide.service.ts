import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';
import { Slide } from './slide';
import { SLIDES } from './slide-data';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Injectable()
export class SlideService {

  constructor(private http: Http) {

  }
/*
  getSlides(): Promise<Slide[]> {
    return Promise.resolve(SLIDES);
  }
  public getSlideData(id: number): Promise<Slide>  {
    return this.getSlides().then(slides => slides.find(slide => slide.id === id) || slides[0]);
  }
*/
  getSlides() {
    return SLIDES;
  }
  public getSlideData(id: number)  {
    var slides = this.getSlides();
    return slides.find(slide => slide.id === id);//.then(slides => slides.find(slide => slide.id === id) || slides[0]);

/*
    slides.find((slide) =>{
  console.log(slide);
  console.log("slide[id]:",slide.id);
  console.log("param[id]:",id);
  return true;
    });
*/
  }
}