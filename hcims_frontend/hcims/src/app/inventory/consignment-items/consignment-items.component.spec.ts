import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsignmentItemsComponent } from './consignment-items.component';

describe('ConsignmentItemsComponent', () => {
  let component: ConsignmentItemsComponent;
  let fixture: ComponentFixture<ConsignmentItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsignmentItemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsignmentItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
