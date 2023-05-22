import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchReceivedAcknowledgementComponent } from './dispatch-received-acknowledgement.component';

describe('DispatchReceivedAcknowledgementComponent', () => {
  let component: DispatchReceivedAcknowledgementComponent;
  let fixture: ComponentFixture<DispatchReceivedAcknowledgementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchReceivedAcknowledgementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchReceivedAcknowledgementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
