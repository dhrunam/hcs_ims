import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseItemReceivedDetailsComponent } from './purchase-item-received-details.component';

describe('PurchaseItemReceivedDetailsComponent', () => {
  let component: PurchaseItemReceivedDetailsComponent;
  let fixture: ComponentFixture<PurchaseItemReceivedDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseItemReceivedDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchaseItemReceivedDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
