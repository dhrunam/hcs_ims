import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentAcknowledgeWorkflowComponent } from './consignment-acknowledge-workflow.component';

describe('ConsignmentAcknowledgeWorkflowComponent', () => {
  let component: ConsignmentAcknowledgeWorkflowComponent;
  let fixture: ComponentFixture<ConsignmentAcknowledgeWorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsignmentAcknowledgeWorkflowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentAcknowledgeWorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
