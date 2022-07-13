import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PaymentAdviceDetailsDetailComponent } from './payment-advice-details-detail.component';

describe('PaymentAdviceDetails Management Detail Component', () => {
  let comp: PaymentAdviceDetailsDetailComponent;
  let fixture: ComponentFixture<PaymentAdviceDetailsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentAdviceDetailsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ paymentAdviceDetails: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PaymentAdviceDetailsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PaymentAdviceDetailsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load paymentAdviceDetails on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.paymentAdviceDetails).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
