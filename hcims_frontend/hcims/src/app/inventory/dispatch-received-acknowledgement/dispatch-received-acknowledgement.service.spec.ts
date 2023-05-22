import { TestBed } from '@angular/core/testing';

import { DispatchReceivedAcknowledgementService } from './dispatch-received-acknowledgement.service';

describe('DispatchReceivedAcknowledgementService', () => {
  let service: DispatchReceivedAcknowledgementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispatchReceivedAcknowledgementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
