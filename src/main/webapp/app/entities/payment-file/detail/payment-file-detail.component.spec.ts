import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PaymentFileDetailComponent } from './payment-file-detail.component';

describe('PaymentFile Management Detail Component', () => {
  let comp: PaymentFileDetailComponent;
  let fixture: ComponentFixture<PaymentFileDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentFileDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ paymentFile: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PaymentFileDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PaymentFileDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load paymentFile on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.paymentFile).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
