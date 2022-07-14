import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PaymentAdviceService } from '../service/payment-advice.service';
import { IPaymentAdvice, PaymentAdvice } from '../payment-advice.model';
import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { KhatedarService } from 'app/entities/khatedar/service/khatedar.service';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { LandCompensationService } from 'app/entities/land-compensation/service/land-compensation.service';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';
import { ISurvey } from 'app/entities/survey/survey.model';
import { SurveyService } from 'app/entities/survey/service/survey.service';

import { PaymentAdviceUpdateComponent } from './payment-advice-update.component';

describe('PaymentAdvice Management Update Component', () => {
  let comp: PaymentAdviceUpdateComponent;
  let fixture: ComponentFixture<PaymentAdviceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paymentAdviceService: PaymentAdviceService;
  let khatedarService: KhatedarService;
  let landCompensationService: LandCompensationService;
  let projectLandService: ProjectLandService;
  let surveyService: SurveyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PaymentAdviceUpdateComponent],
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
      .overrideTemplate(PaymentAdviceUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PaymentAdviceUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paymentAdviceService = TestBed.inject(PaymentAdviceService);
    khatedarService = TestBed.inject(KhatedarService);
    landCompensationService = TestBed.inject(LandCompensationService);
    projectLandService = TestBed.inject(ProjectLandService);
    surveyService = TestBed.inject(SurveyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call khatedar query and add missing value', () => {
      const paymentAdvice: IPaymentAdvice = { id: 456 };
      const khatedar: IKhatedar = { id: 22266 };
      paymentAdvice.khatedar = khatedar;

      const khatedarCollection: IKhatedar[] = [{ id: 27798 }];
      jest.spyOn(khatedarService, 'query').mockReturnValue(of(new HttpResponse({ body: khatedarCollection })));
      const expectedCollection: IKhatedar[] = [khatedar, ...khatedarCollection];
      jest.spyOn(khatedarService, 'addKhatedarToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentAdvice });
      comp.ngOnInit();

      expect(khatedarService.query).toHaveBeenCalled();
      expect(khatedarService.addKhatedarToCollectionIfMissing).toHaveBeenCalledWith(khatedarCollection, khatedar);
      expect(comp.khatedarsCollection).toEqual(expectedCollection);
    });

    it('Should call LandCompensation query and add missing value', () => {
      const paymentAdvice: IPaymentAdvice = { id: 456 };
      const landCompensation: ILandCompensation = { id: 89639 };
      paymentAdvice.landCompensation = landCompensation;

      const landCompensationCollection: ILandCompensation[] = [{ id: 50844 }];
      jest.spyOn(landCompensationService, 'query').mockReturnValue(of(new HttpResponse({ body: landCompensationCollection })));
      const additionalLandCompensations = [landCompensation];
      const expectedCollection: ILandCompensation[] = [...additionalLandCompensations, ...landCompensationCollection];
      jest.spyOn(landCompensationService, 'addLandCompensationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentAdvice });
      comp.ngOnInit();

      expect(landCompensationService.query).toHaveBeenCalled();
      expect(landCompensationService.addLandCompensationToCollectionIfMissing).toHaveBeenCalledWith(
        landCompensationCollection,
        ...additionalLandCompensations
      );
      expect(comp.landCompensationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call ProjectLand query and add missing value', () => {
      const paymentAdvice: IPaymentAdvice = { id: 456 };
      const projectLand: IProjectLand = { id: 46007 };
      paymentAdvice.projectLand = projectLand;

      const projectLandCollection: IProjectLand[] = [{ id: 91105 }];
      jest.spyOn(projectLandService, 'query').mockReturnValue(of(new HttpResponse({ body: projectLandCollection })));
      const additionalProjectLands = [projectLand];
      const expectedCollection: IProjectLand[] = [...additionalProjectLands, ...projectLandCollection];
      jest.spyOn(projectLandService, 'addProjectLandToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentAdvice });
      comp.ngOnInit();

      expect(projectLandService.query).toHaveBeenCalled();
      expect(projectLandService.addProjectLandToCollectionIfMissing).toHaveBeenCalledWith(projectLandCollection, ...additionalProjectLands);
      expect(comp.projectLandsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Survey query and add missing value', () => {
      const paymentAdvice: IPaymentAdvice = { id: 456 };
      const survey: ISurvey = { id: 63791 };
      paymentAdvice.survey = survey;

      const surveyCollection: ISurvey[] = [{ id: 98864 }];
      jest.spyOn(surveyService, 'query').mockReturnValue(of(new HttpResponse({ body: surveyCollection })));
      const additionalSurveys = [survey];
      const expectedCollection: ISurvey[] = [...additionalSurveys, ...surveyCollection];
      jest.spyOn(surveyService, 'addSurveyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentAdvice });
      comp.ngOnInit();

      expect(surveyService.query).toHaveBeenCalled();
      expect(surveyService.addSurveyToCollectionIfMissing).toHaveBeenCalledWith(surveyCollection, ...additionalSurveys);
      expect(comp.surveysSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const paymentAdvice: IPaymentAdvice = { id: 456 };
      const khatedar: IKhatedar = { id: 55172 };
      paymentAdvice.khatedar = khatedar;
      const landCompensation: ILandCompensation = { id: 47210 };
      paymentAdvice.landCompensation = landCompensation;
      const projectLand: IProjectLand = { id: 91548 };
      paymentAdvice.projectLand = projectLand;
      const survey: ISurvey = { id: 25019 };
      paymentAdvice.survey = survey;

      activatedRoute.data = of({ paymentAdvice });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paymentAdvice));
      expect(comp.khatedarsCollection).toContain(khatedar);
      expect(comp.landCompensationsSharedCollection).toContain(landCompensation);
      expect(comp.projectLandsSharedCollection).toContain(projectLand);
      expect(comp.surveysSharedCollection).toContain(survey);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentAdvice>>();
      const paymentAdvice = { id: 123 };
      jest.spyOn(paymentAdviceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentAdvice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paymentAdvice }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(paymentAdviceService.update).toHaveBeenCalledWith(paymentAdvice);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentAdvice>>();
      const paymentAdvice = new PaymentAdvice();
      jest.spyOn(paymentAdviceService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentAdvice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paymentAdvice }));
      saveSubject.complete();

      // THEN
      expect(paymentAdviceService.create).toHaveBeenCalledWith(paymentAdvice);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentAdvice>>();
      const paymentAdvice = { id: 123 };
      jest.spyOn(paymentAdviceService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentAdvice });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paymentAdviceService.update).toHaveBeenCalledWith(paymentAdvice);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackKhatedarById', () => {
      it('Should return tracked Khatedar primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackKhatedarById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackLandCompensationById', () => {
      it('Should return tracked LandCompensation primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLandCompensationById(0, entity);
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

    describe('trackSurveyById', () => {
      it('Should return tracked Survey primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSurveyById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
