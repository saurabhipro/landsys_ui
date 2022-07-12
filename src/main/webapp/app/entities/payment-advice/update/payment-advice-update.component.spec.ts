import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PaymentAdviceService } from '../service/payment-advice.service';
import { IPaymentAdvice, PaymentAdvice } from '../payment-advice.model';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { LandCompensationService } from 'app/entities/land-compensation/service/land-compensation.service';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';
import { ISurvey } from 'app/entities/survey/survey.model';
import { SurveyService } from 'app/entities/survey/service/survey.service';
import { ICitizen } from 'app/entities/citizen/citizen.model';
import { CitizenService } from 'app/entities/citizen/service/citizen.service';
import { IPaymentFile } from 'app/entities/payment-file/payment-file.model';
import { PaymentFileService } from 'app/entities/payment-file/service/payment-file.service';
import { ILand } from 'app/entities/land/land.model';
import { LandService } from 'app/entities/land/service/land.service';

import { PaymentAdviceUpdateComponent } from './payment-advice-update.component';

describe('PaymentAdvice Management Update Component', () => {
  let comp: PaymentAdviceUpdateComponent;
  let fixture: ComponentFixture<PaymentAdviceUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paymentAdviceService: PaymentAdviceService;
  let landCompensationService: LandCompensationService;
  let projectLandService: ProjectLandService;
  let surveyService: SurveyService;
  let citizenService: CitizenService;
  let paymentFileService: PaymentFileService;
  let landService: LandService;

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
    landCompensationService = TestBed.inject(LandCompensationService);
    projectLandService = TestBed.inject(ProjectLandService);
    surveyService = TestBed.inject(SurveyService);
    citizenService = TestBed.inject(CitizenService);
    paymentFileService = TestBed.inject(PaymentFileService);
    landService = TestBed.inject(LandService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
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

    it('Should call Citizen query and add missing value', () => {
      const paymentAdvice: IPaymentAdvice = { id: 456 };
      const citizen: ICitizen = { id: 62577 };
      paymentAdvice.citizen = citizen;

      const citizenCollection: ICitizen[] = [{ id: 61996 }];
      jest.spyOn(citizenService, 'query').mockReturnValue(of(new HttpResponse({ body: citizenCollection })));
      const additionalCitizens = [citizen];
      const expectedCollection: ICitizen[] = [...additionalCitizens, ...citizenCollection];
      jest.spyOn(citizenService, 'addCitizenToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentAdvice });
      comp.ngOnInit();

      expect(citizenService.query).toHaveBeenCalled();
      expect(citizenService.addCitizenToCollectionIfMissing).toHaveBeenCalledWith(citizenCollection, ...additionalCitizens);
      expect(comp.citizensSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PaymentFile query and add missing value', () => {
      const paymentAdvice: IPaymentAdvice = { id: 456 };
      const paymentFile: IPaymentFile = { id: 70240 };
      paymentAdvice.paymentFile = paymentFile;

      const paymentFileCollection: IPaymentFile[] = [{ id: 48561 }];
      jest.spyOn(paymentFileService, 'query').mockReturnValue(of(new HttpResponse({ body: paymentFileCollection })));
      const additionalPaymentFiles = [paymentFile];
      const expectedCollection: IPaymentFile[] = [...additionalPaymentFiles, ...paymentFileCollection];
      jest.spyOn(paymentFileService, 'addPaymentFileToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentAdvice });
      comp.ngOnInit();

      expect(paymentFileService.query).toHaveBeenCalled();
      expect(paymentFileService.addPaymentFileToCollectionIfMissing).toHaveBeenCalledWith(paymentFileCollection, ...additionalPaymentFiles);
      expect(comp.paymentFilesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Land query and add missing value', () => {
      const paymentAdvice: IPaymentAdvice = { id: 456 };
      const land: ILand = { id: 34955 };
      paymentAdvice.land = land;

      const landCollection: ILand[] = [{ id: 84793 }];
      jest.spyOn(landService, 'query').mockReturnValue(of(new HttpResponse({ body: landCollection })));
      const additionalLands = [land];
      const expectedCollection: ILand[] = [...additionalLands, ...landCollection];
      jest.spyOn(landService, 'addLandToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentAdvice });
      comp.ngOnInit();

      expect(landService.query).toHaveBeenCalled();
      expect(landService.addLandToCollectionIfMissing).toHaveBeenCalledWith(landCollection, ...additionalLands);
      expect(comp.landsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const paymentAdvice: IPaymentAdvice = { id: 456 };
      const landCompensation: ILandCompensation = { id: 47210 };
      paymentAdvice.landCompensation = landCompensation;
      const projectLand: IProjectLand = { id: 91548 };
      paymentAdvice.projectLand = projectLand;
      const survey: ISurvey = { id: 25019 };
      paymentAdvice.survey = survey;
      const citizen: ICitizen = { id: 61632 };
      paymentAdvice.citizen = citizen;
      const paymentFile: IPaymentFile = { id: 93619 };
      paymentAdvice.paymentFile = paymentFile;
      const land: ILand = { id: 84618 };
      paymentAdvice.land = land;

      activatedRoute.data = of({ paymentAdvice });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paymentAdvice));
      expect(comp.landCompensationsSharedCollection).toContain(landCompensation);
      expect(comp.projectLandsSharedCollection).toContain(projectLand);
      expect(comp.surveysSharedCollection).toContain(survey);
      expect(comp.citizensSharedCollection).toContain(citizen);
      expect(comp.paymentFilesSharedCollection).toContain(paymentFile);
      expect(comp.landsSharedCollection).toContain(land);
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

    describe('trackCitizenById', () => {
      it('Should return tracked Citizen primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackCitizenById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackPaymentFileById', () => {
      it('Should return tracked PaymentFile primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPaymentFileById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackLandById', () => {
      it('Should return tracked Land primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLandById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
