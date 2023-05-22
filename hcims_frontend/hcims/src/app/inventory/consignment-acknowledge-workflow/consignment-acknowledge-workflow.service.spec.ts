import { TestBed } from '@angular/core/testing';

import { ConsignmentAcknowledgeWorkflowService } from './consignment-acknowledge-workflow.service';

describe('ConsignmentAcknowledgeWorkflowService', () => {
  let service: ConsignmentAcknowledgeWorkflowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsignmentAcknowledgeWorkflowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
