import { TestBed } from '@angular/core/testing';

import { ConsignmentItemReceivedDetailsService } from './consignment-item-received-details.service';

describe('ConsignmentItemReceivedDetailsService', () => {
  let service: ConsignmentItemReceivedDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsignmentItemReceivedDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
