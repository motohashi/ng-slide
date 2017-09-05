import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeechTextComponent } from './speech-text.component';

describe('SpeechTextComponent', () => {
  let component: SpeechTextComponent;
  let fixture: ComponentFixture<SpeechTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeechTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeechTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('can get token', () => {
    const test = component.getTokenAsync();
    expect(test).toBeTruthy();
  });
});
