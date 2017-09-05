import { TestBed, inject } from '@angular/core/testing';

import { SlideBusService } from './slide-bus.service';

describe('SlideService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SlideBusService]
    });
  });

  it('should be created', inject([SlideBusService], (service: SlideBusService) => {
    expect(service).toBeTruthy();
  }));
});
