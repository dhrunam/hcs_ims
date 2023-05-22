import { TestBed } from '@angular/core/testing';

import { PurchaseItemReceivedDetailsService } from './purchase-item-received-details.service';

describe('PurchaseItemReceivedDetailsService', () => {
  let service: PurchaseItemReceivedDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseItemReceivedDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
