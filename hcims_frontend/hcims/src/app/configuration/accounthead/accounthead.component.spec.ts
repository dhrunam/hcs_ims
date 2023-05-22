import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountheadComponent } from './accounthead.component';

describe('AccountheadComponent', () => {
  let component: AccountheadComponent;
  let fixture: ComponentFixture<AccountheadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountheadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
