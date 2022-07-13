import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PaymentAdviceDetailsService } from '../service/payment-advice-details.service';
import { IPaymentAdviceDetails, PaymentAdviceDetails } from '../payment-advice-details.model';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { PaymentAdviceService } from 'app/entities/payment-advice/service/payment-advice.service';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';

import { PaymentAdviceDetailsUpdateComponent } from './payment-advice-details-update.component';

describe('PaymentAdviceDetails Management Update Component', () => {
  let comp: PaymentAdviceDetailsUpdateComponent;
  let fixture: ComponentFixture<PaymentAdviceDetailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paymentAdviceDetailsService: PaymentAdviceDetailsService;
  let paymentAdviceService: PaymentAdviceService;
  let projectLandService: ProjectLandService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PaymentAdviceDetailsUpdateComponent],
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
      .overrideTemplate(PaymentAdviceDetailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PaymentAdviceDetailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paymentAdviceDetailsService = TestBed.inject(PaymentAdviceDetailsService);
    paymentAdviceService = TestBed.inject(PaymentAdviceService);
    projectLandService = TestBed.inject(ProjectLandService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call PaymentAdvice query and add missing value', () => {
      const paymentAdviceDetails: IPaymentAdviceDetails = { id: 456 };
      const paymentAdvice: IPaymentAdvice = { id: 89980 };
      paymentAdviceDetails.paymentAdvice = paymentAdvice;

      const paymentAdviceCollection: IPaymentAdvice[] = [{ id: 15446 }];
      jest.spyOn(paymentAdviceService, 'query').mockReturnValue(of(new HttpResponse({ body: paymentAdviceCollection })));
      const additionalPaymentAdvices = [paymentAdvice];
      const expectedCollection: IPaymentAdvice[] = [...additionalPaymentAdvices, ...paymentAdviceCollection];
      jest.spyOn(paymentAdviceService, 'addPaymentAdviceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentAdviceDetails });
      comp.ngOnInit();

      expect(paymentAdviceService.query).toHaveBeenCalled();
      expect(paymentAdviceService.addPaymentAdviceToCollectionIfMissing).toHaveBeenCalledWith(
        paymentAdviceCollection,
        ...additionalPaymentAdvices
      );
      expect(comp.paymentAdvicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ProjectLand query and add missing value', () => {
      const paymentAdviceDetails: IPaymentAdviceDetails = { id: 456 };
      const projectLand: IProjectLand = { id: 58954 };
      paymentAdviceDetails.projectLand = projectLand;

      const projectLandCollection: IProjectLand[] = [{ id: 76603 }];
      jest.spyOn(projectLandService, 'query').mockReturnValue(of(new HttpResponse({ body: projectLandCollection })));
      const additionalProjectLands = [projectLand];
      const expectedCollection: IProjectLand[] = [...additionalProjectLands, ...projectLandCollection];
      jest.spyOn(projectLandService, 'addProjectLandToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentAdviceDetails });
      comp.ngOnInit();

      expect(projectLandService.query).toHaveBeenCalled();
      expect(projectLandService.addProjectLandToCollectionIfMissing).toHaveBeenCalledWith(projectLandCollection, ...additionalProjectLands);
      expect(comp.projectLandsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const paymentAdviceDetails: IPaymentAdviceDetails = { id: 456 };
      const paymentAdvice: IPaymentAdvice = { id: 97652 };
      paymentAdviceDetails.paymentAdvice = paymentAdvice;
      const projectLand: IProjectLand = { id: 84859 };
      paymentAdviceDetails.projectLand = projectLand;

      activatedRoute.data = of({ paymentAdviceDetails });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paymentAdviceDetails));
      expect(comp.paymentAdvicesSharedCollection).toContain(paymentAdvice);
      expect(comp.projectLandsSharedCollection).toContain(projectLand);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentAdviceDetails>>();
      const paymentAdviceDetails = { id: 123 };
      jest.spyOn(paymentAdviceDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentAdviceDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paymentAdviceDetails }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(paymentAdviceDetailsService.update).toHaveBeenCalledWith(paymentAdviceDetails);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentAdviceDetails>>();
      const paymentAdviceDetails = new PaymentAdviceDetails();
      jest.spyOn(paymentAdviceDetailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentAdviceDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paymentAdviceDetails }));
      saveSubject.complete();

      // THEN
      expect(paymentAdviceDetailsService.create).toHaveBeenCalledWith(paymentAdviceDetails);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentAdviceDetails>>();
      const paymentAdviceDetails = { id: 123 };
      jest.spyOn(paymentAdviceDetailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentAdviceDetails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paymentAdviceDetailsService.update).toHaveBeenCalledWith(paymentAdviceDetails);
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

    describe('trackProjectLandById', () => {
      it('Should return tracked ProjectLand primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProjectLandById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
