import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PaymentFileService } from '../service/payment-file.service';
import { IPaymentFile, PaymentFile } from '../payment-file.model';

import { PaymentFileUpdateComponent } from './payment-file-update.component';

describe('PaymentFile Management Update Component', () => {
  let comp: PaymentFileUpdateComponent;
  let fixture: ComponentFixture<PaymentFileUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paymentFileService: PaymentFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PaymentFileUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PaymentFileUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PaymentFileUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paymentFileService = TestBed.inject(PaymentFileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const paymentFile: IPaymentFile = { id: 456 };

      activatedRoute.data = of({ paymentFile });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paymentFile));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentFile>>();
      const paymentFile = { id: 123 };
      jest.spyOn(paymentFileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentFile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paymentFile }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(paymentFileService.update).toHaveBeenCalledWith(paymentFile);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentFile>>();
      const paymentFile = new PaymentFile();
      jest.spyOn(paymentFileService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentFile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paymentFile }));
      saveSubject.complete();

      // THEN
      expect(paymentFileService.create).toHaveBeenCalledWith(paymentFile);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentFile>>();
      const paymentFile = { id: 123 };
      jest.spyOn(paymentFileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentFile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paymentFileService.update).toHaveBeenCalledWith(paymentFile);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
