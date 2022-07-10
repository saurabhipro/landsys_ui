import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PaymentAdviceDetailComponent } from './payment-advice-detail.component';

describe('PaymentAdvice Management Detail Component', () => {
  let comp: PaymentAdviceDetailComponent;
  let fixture: ComponentFixture<PaymentAdviceDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentAdviceDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ paymentAdvice: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PaymentAdviceDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PaymentAdviceDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load paymentAdvice on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.paymentAdvice).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
