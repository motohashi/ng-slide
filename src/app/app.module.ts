import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { SlidesComponent } from './slides/slides.component';
import { SpeechTextComponent } from './speech-text/speech-text.component';
import { SlidesService } from './slides/slides.service';
import { SlideComponent  } from './slides/slide/slide.component';
import { SlideBusService } from './slides/slide-bus.service'
import { EffectProviderBusService } from './effect-provider-bus.service'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

const appRoutes: Routes = [
  { path: '', component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SlidesComponent,
    SlideComponent,
    SpeechTextComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true }
    )
  ],
  exports: [ RouterModule ],
  providers: [SlidesService, SlideBusService, SlidesService, EffectProviderBusService],
  bootstrap: [AppComponent]
})
export class AppModule { }

