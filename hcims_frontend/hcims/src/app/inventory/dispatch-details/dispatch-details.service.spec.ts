import { TestBed } from '@angular/core/testing';

import { DispatchDetailsService } from './dispatch-details.service';

describe('DispatchDetailsService', () => {
  let service: DispatchDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispatchDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
