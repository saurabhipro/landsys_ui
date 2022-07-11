import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PaymentFileReconService } from '../service/payment-file-recon.service';
import { IPaymentFileRecon, PaymentFileRecon } from '../payment-file-recon.model';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { PaymentAdviceService } from 'app/entities/payment-advice/service/payment-advice.service';

import { PaymentFileReconUpdateComponent } from './payment-file-recon-update.component';

describe('PaymentFileRecon Management Update Component', () => {
  let comp: PaymentFileReconUpdateComponent;
  let fixture: ComponentFixture<PaymentFileReconUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paymentFileReconService: PaymentFileReconService;
  let paymentAdviceService: PaymentAdviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PaymentFileReconUpdateComponent],
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
      .overrideTemplate(PaymentFileReconUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PaymentFileReconUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paymentFileReconService = TestBed.inject(PaymentFileReconService);
    paymentAdviceService = TestBed.inject(PaymentAdviceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call paymentAdvice query and add missing value', () => {
      const paymentFileRecon: IPaymentFileRecon = { id: 456 };
      const paymentAdvice: IPaymentAdvice = { id: 120 };
      paymentFileRecon.paymentAdvice = paymentAdvice;

      const paymentAdviceCollection: IPaymentAdvice[] = [{ id: 96650 }];
      jest.spyOn(paymentAdviceService, 'query').mockReturnValue(of(new HttpResponse({ body: paymentAdviceCollection })));
      const expectedCollection: IPaymentAdvice[] = [paymentAdvice, ...paymentAdviceCollection];
      jest.spyOn(paymentAdviceService, 'addPaymentAdviceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentFileRecon });
      comp.ngOnInit();

      expect(paymentAdviceService.query).toHaveBeenCalled();
      expect(paymentAdviceService.addPaymentAdviceToCollectionIfMissing).toHaveBeenCalledWith(paymentAdviceCollection, paymentAdvice);
      expect(comp.paymentAdvicesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const paymentFileRecon: IPaymentFileRecon = { id: 456 };
      const paymentAdvice: IPaymentAdvice = { id: 68500 };
      paymentFileRecon.paymentAdvice = paymentAdvice;

      activatedRoute.data = of({ paymentFileRecon });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paymentFileRecon));
      expect(comp.paymentAdvicesCollection).toContain(paymentAdvice);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentFileRecon>>();
      const paymentFileRecon = { id: 123 };
      jest.spyOn(paymentFileReconService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentFileRecon });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paymentFileRecon }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(paymentFileReconService.update).toHaveBeenCalledWith(paymentFileRecon);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentFileRecon>>();
      const paymentFileRecon = new PaymentFileRecon();
      jest.spyOn(paymentFileReconService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentFileRecon });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paymentFileRecon }));
      saveSubject.complete();

      // THEN
      expect(paymentFileReconService.create).toHaveBeenCalledWith(paymentFileRecon);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentFileRecon>>();
      const paymentFileRecon = { id: 123 };
      jest.spyOn(paymentFileReconService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentFileRecon });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paymentFileReconService.update).toHaveBeenCalledWith(paymentFileRecon);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackPaymentAdviceById', () => {
      it('Should return tracked PaymentAdvice primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPaymentAdviceById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
