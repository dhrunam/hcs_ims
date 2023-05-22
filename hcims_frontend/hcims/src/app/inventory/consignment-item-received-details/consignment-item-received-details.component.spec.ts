import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentItemReceivedDetailsComponent } from './consignment-item-received-details.component';

describe('ConsignmentItemReceivedDetailsComponent', () => {
  let component: ConsignmentItemReceivedDetailsComponent;
  let fixture: ComponentFixture<ConsignmentItemReceivedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsignmentItemReceivedDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentItemReceivedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
