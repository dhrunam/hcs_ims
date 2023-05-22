import { TestBed } from '@angular/core/testing';

import { AccountheadService } from './accounthead.service';

describe('AccountheadService', () => {
  let service: AccountheadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountheadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
