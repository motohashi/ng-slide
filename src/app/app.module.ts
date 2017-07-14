import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SlidesComponent } from './slides/slides.component';
import { SpeechTextComponent } from './speech-text/speech-text.component';
import { SlideService } from './slides/slide.service';

const appRoutes: Routes = [
  { path: 'slide/:page',      component: SlidesComponent },
  { path: ':page',      component: AppComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    SlidesComponent,
    SpeechTextComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } 
    )

  ],
  exports: [ RouterModule ],
  providers: [SlideService],
  bootstrap: [AppComponent]
})
export class AppModule { }

