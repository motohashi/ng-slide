import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SlidesComponent }  from './slides.component';

const slidesRoutes: Routes = [
  { path: '/:id', component: SlidesComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(slidesRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class SlideRoutingModule { }