import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPaymentAdviceComponent } from './view-payment-advice.component';

describe('ViewPaymentAdviceComponent', () => {
  let component: ViewPaymentAdviceComponent;
  let fixture: ComponentFixture<ViewPaymentAdviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewPaymentAdviceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPaymentAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
