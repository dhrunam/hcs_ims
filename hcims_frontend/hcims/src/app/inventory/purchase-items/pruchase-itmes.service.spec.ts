import { TestBed } from '@angular/core/testing';

import { PurchaseItmesService } from './purchase-itmes.service';

describe('PruchaseItmesService', () => {
  let service: PurchaseItmesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseItmesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
