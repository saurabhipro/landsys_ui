import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CreatePaymentFileDetailComponent } from './create-payment-file-detail.component';

describe('CreatePaymentFile Management Detail Component', () => {
  let comp: CreatePaymentFileDetailComponent;
  let fixture: ComponentFixture<CreatePaymentFileDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePaymentFileDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ createPaymentFile: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CreatePaymentFileDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CreatePaymentFileDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load createPaymentFile on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.createPaymentFile).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
