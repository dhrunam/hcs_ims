import { TestBed } from '@angular/core/testing';

import { DispatchItemsService } from './dispatch-items.service';

describe('DispatchItemsService', () => {
  let service: DispatchItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DispatchItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
