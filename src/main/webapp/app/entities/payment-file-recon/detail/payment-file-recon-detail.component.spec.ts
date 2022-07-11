import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PaymentFileReconDetailComponent } from './payment-file-recon-detail.component';

describe('PaymentFileRecon Management Detail Component', () => {
  let comp: PaymentFileReconDetailComponent;
  let fixture: ComponentFixture<PaymentFileReconDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentFileReconDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ paymentFileRecon: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PaymentFileReconDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PaymentFileReconDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load paymentFileRecon on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.paymentFileRecon).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
