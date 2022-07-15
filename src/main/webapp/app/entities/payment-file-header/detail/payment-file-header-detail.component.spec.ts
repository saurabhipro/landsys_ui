import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PaymentFileHeaderDetailComponent } from './payment-file-header-detail.component';

describe('PaymentFileHeader Management Detail Component', () => {
  let comp: PaymentFileHeaderDetailComponent;
  let fixture: ComponentFixture<PaymentFileHeaderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentFileHeaderDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ paymentFileHeader: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(PaymentFileHeaderDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(PaymentFileHeaderDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load paymentFileHeader on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.paymentFileHeader).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
