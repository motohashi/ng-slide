import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SpeechTextComponent } from './speech-text/speech-text.component';
import { SlidesComponent } from './slides/slides.component';
import { SlideComponent } from './slides/slide/slide.component';

import { SlidesService } from './slides/slides.service';
import {EffectProviderBusService} from './effect-provider-bus.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    SpeechTextComponent,
    SlidesComponent,
    SlideComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    SlidesService,
    SlidesService,
    EffectProviderBusService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
