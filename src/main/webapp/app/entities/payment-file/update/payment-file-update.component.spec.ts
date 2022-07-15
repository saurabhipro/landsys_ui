import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PaymentFileService } from '../service/payment-file.service';
import { IPaymentFile, PaymentFile } from '../payment-file.model';
import { IKhatedar } from 'app/entities/khatedar/khatedar.model';
import { KhatedarService } from 'app/entities/khatedar/service/khatedar.service';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { PaymentAdviceService } from 'app/entities/payment-advice/service/payment-advice.service';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';
import { ISurvey } from 'app/entities/survey/survey.model';
import { SurveyService } from 'app/entities/survey/service/survey.service';
import { IBank } from 'app/entities/bank/bank.model';
import { BankService } from 'app/entities/bank/service/bank.service';
import { IBankBranch } from 'app/entities/bank-branch/bank-branch.model';
import { BankBranchService } from 'app/entities/bank-branch/service/bank-branch.service';
import { ILandCompensation } from 'app/entities/land-compensation/land-compensation.model';
import { LandCompensationService } from 'app/entities/land-compensation/service/land-compensation.service';
import { IPaymentFileHeader } from 'app/entities/payment-file-header/payment-file-header.model';
import { PaymentFileHeaderService } from 'app/entities/payment-file-header/service/payment-file-header.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';

import { PaymentFileUpdateComponent } from './payment-file-update.component';

describe('PaymentFile Management Update Component', () => {
  let comp: PaymentFileUpdateComponent;
  let fixture: ComponentFixture<PaymentFileUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paymentFileService: PaymentFileService;
  let khatedarService: KhatedarService;
  let paymentAdviceService: PaymentAdviceService;
  let projectLandService: ProjectLandService;
  let surveyService: SurveyService;
  let bankService: BankService;
  let bankBranchService: BankBranchService;
  let landCompensationService: LandCompensationService;
  let paymentFileHeaderService: PaymentFileHeaderService;
  let projectService: ProjectService;

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
    khatedarService = TestBed.inject(KhatedarService);
    paymentAdviceService = TestBed.inject(PaymentAdviceService);
    projectLandService = TestBed.inject(ProjectLandService);
    surveyService = TestBed.inject(SurveyService);
    bankService = TestBed.inject(BankService);
    bankBranchService = TestBed.inject(BankBranchService);
    landCompensationService = TestBed.inject(LandCompensationService);
    paymentFileHeaderService = TestBed.inject(PaymentFileHeaderService);
    projectService = TestBed.inject(ProjectService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call khatedar query and add missing value', () => {
      const paymentFile: IPaymentFile = { id: 456 };
      const khatedar: IKhatedar = { id: 764 };
      paymentFile.khatedar = khatedar;

      const khatedarCollection: IKhatedar[] = [{ id: 80315 }];
      jest.spyOn(khatedarService, 'query').mockReturnValue(of(new HttpResponse({ body: khatedarCollection })));
      const expectedCollection: IKhatedar[] = [khatedar, ...khatedarCollection];
      jest.spyOn(khatedarService, 'addKhatedarToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentFile });
      comp.ngOnInit();

      expect(khatedarService.query).toHaveBeenCalled();
      expect(khatedarService.addKhatedarToCollectionIfMissing).toHaveBeenCalledWith(khatedarCollection, khatedar);
      expect(comp.khatedarsCollection).toEqual(expectedCollection);
    });

    it('Should call paymentAdvice query and add missing value', () => {
      const paymentFile: IPaymentFile = { id: 456 };
      const paymentAdvice: IPaymentAdvice = { id: 40278 };
      paymentFile.paymentAdvice = paymentAdvice;

      const paymentAdviceCollection: IPaymentAdvice[] = [{ id: 35810 }];
      jest.spyOn(paymentAdviceService, 'query').mockReturnValue(of(new HttpResponse({ body: paymentAdviceCollection })));
      const expectedCollection: IPaymentAdvice[] = [paymentAdvice, ...paymentAdviceCollection];
      jest.spyOn(paymentAdviceService, 'addPaymentAdviceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentFile });
      comp.ngOnInit();

      expect(paymentAdviceService.query).toHaveBeenCalled();
      expect(paymentAdviceService.addPaymentAdviceToCollectionIfMissing).toHaveBeenCalledWith(paymentAdviceCollection, paymentAdvice);
      expect(comp.paymentAdvicesCollection).toEqual(expectedCollection);
    });

    it('Should call ProjectLand query and add missing value', () => {
      const paymentFile: IPaymentFile = { id: 456 };
      const projectLand: IProjectLand = { id: 15537 };
      paymentFile.projectLand = projectLand;

      const projectLandCollection: IProjectLand[] = [{ id: 4465 }];
      jest.spyOn(projectLandService, 'query').mockReturnValue(of(new HttpResponse({ body: projectLandCollection })));
      const additionalProjectLands = [projectLand];
      const expectedCollection: IProjectLand[] = [...additionalProjectLands, ...projectLandCollection];
      jest.spyOn(projectLandService, 'addProjectLandToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentFile });
      comp.ngOnInit();

      expect(projectLandService.query).toHaveBeenCalled();
      expect(projectLandService.addProjectLandToCollectionIfMissing).toHaveBeenCalledWith(projectLandCollection, ...additionalProjectLands);
      expect(comp.projectLandsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Survey query and add missing value', () => {
      const paymentFile: IPaymentFile = { id: 456 };
      const survey: ISurvey = { id: 65247 };
      paymentFile.survey = survey;

      const surveyCollection: ISurvey[] = [{ id: 60117 }];
      jest.spyOn(surveyService, 'query').mockReturnValue(of(new HttpResponse({ body: surveyCollection })));
      const additionalSurveys = [survey];
      const expectedCollection: ISurvey[] = [...additionalSurveys, ...surveyCollection];
      jest.spyOn(surveyService, 'addSurveyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentFile });
      comp.ngOnInit();

      expect(surveyService.query).toHaveBeenCalled();
      expect(surveyService.addSurveyToCollectionIfMissing).toHaveBeenCalledWith(surveyCollection, ...additionalSurveys);
      expect(comp.surveysSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Bank query and add missing value', () => {
      const paymentFile: IPaymentFile = { id: 456 };
      const bank: IBank = { id: 79480 };
      paymentFile.bank = bank;

      const bankCollection: IBank[] = [{ id: 7375 }];
      jest.spyOn(bankService, 'query').mockReturnValue(of(new HttpResponse({ body: bankCollection })));
      const additionalBanks = [bank];
      const expectedCollection: IBank[] = [...additionalBanks, ...bankCollection];
      jest.spyOn(bankService, 'addBankToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentFile });
      comp.ngOnInit();

      expect(bankService.query).toHaveBeenCalled();
      expect(bankService.addBankToCollectionIfMissing).toHaveBeenCalledWith(bankCollection, ...additionalBanks);
      expect(comp.banksSharedCollection).toEqual(expectedCollection);
    });

    it('Should call BankBranch query and add missing value', () => {
      const paymentFile: IPaymentFile = { id: 456 };
      const bankBranch: IBankBranch = { id: 24798 };
      paymentFile.bankBranch = bankBranch;

      const bankBranchCollection: IBankBranch[] = [{ id: 39877 }];
      jest.spyOn(bankBranchService, 'query').mockReturnValue(of(new HttpResponse({ body: bankBranchCollection })));
      const additionalBankBranches = [bankBranch];
      const expectedCollection: IBankBranch[] = [...additionalBankBranches, ...bankBranchCollection];
      jest.spyOn(bankBranchService, 'addBankBranchToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentFile });
      comp.ngOnInit();

      expect(bankBranchService.query).toHaveBeenCalled();
      expect(bankBranchService.addBankBranchToCollectionIfMissing).toHaveBeenCalledWith(bankBranchCollection, ...additionalBankBranches);
      expect(comp.bankBranchesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call LandCompensation query and add missing value', () => {
      const paymentFile: IPaymentFile = { id: 456 };
      const landCompensation: ILandCompensation = { id: 8211 };
      paymentFile.landCompensation = landCompensation;

      const landCompensationCollection: ILandCompensation[] = [{ id: 88808 }];
      jest.spyOn(landCompensationService, 'query').mockReturnValue(of(new HttpResponse({ body: landCompensationCollection })));
      const additionalLandCompensations = [landCompensation];
      const expectedCollection: ILandCompensation[] = [...additionalLandCompensations, ...landCompensationCollection];
      jest.spyOn(landCompensationService, 'addLandCompensationToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentFile });
      comp.ngOnInit();

      expect(landCompensationService.query).toHaveBeenCalled();
      expect(landCompensationService.addLandCompensationToCollectionIfMissing).toHaveBeenCalledWith(
        landCompensationCollection,
        ...additionalLandCompensations
      );
      expect(comp.landCompensationsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PaymentFileHeader query and add missing value', () => {
      const paymentFile: IPaymentFile = { id: 456 };
      const paymentFileHeader: IPaymentFileHeader = { id: 16443 };
      paymentFile.paymentFileHeader = paymentFileHeader;

      const paymentFileHeaderCollection: IPaymentFileHeader[] = [{ id: 52377 }];
      jest.spyOn(paymentFileHeaderService, 'query').mockReturnValue(of(new HttpResponse({ body: paymentFileHeaderCollection })));
      const additionalPaymentFileHeaders = [paymentFileHeader];
      const expectedCollection: IPaymentFileHeader[] = [...additionalPaymentFileHeaders, ...paymentFileHeaderCollection];
      jest.spyOn(paymentFileHeaderService, 'addPaymentFileHeaderToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentFile });
      comp.ngOnInit();

      expect(paymentFileHeaderService.query).toHaveBeenCalled();
      expect(paymentFileHeaderService.addPaymentFileHeaderToCollectionIfMissing).toHaveBeenCalledWith(
        paymentFileHeaderCollection,
        ...additionalPaymentFileHeaders
      );
      expect(comp.paymentFileHeadersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Project query and add missing value', () => {
      const paymentFile: IPaymentFile = { id: 456 };
      const project: IProject = { id: 58276 };
      paymentFile.project = project;

      const projectCollection: IProject[] = [{ id: 28535 }];
      jest.spyOn(projectService, 'query').mockReturnValue(of(new HttpResponse({ body: projectCollection })));
      const additionalProjects = [project];
      const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
      jest.spyOn(projectService, 'addProjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentFile });
      comp.ngOnInit();

      expect(projectService.query).toHaveBeenCalled();
      expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(projectCollection, ...additionalProjects);
      expect(comp.projectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const paymentFile: IPaymentFile = { id: 456 };
      const khatedar: IKhatedar = { id: 36126 };
      paymentFile.khatedar = khatedar;
      const paymentAdvice: IPaymentAdvice = { id: 46001 };
      paymentFile.paymentAdvice = paymentAdvice;
      const projectLand: IProjectLand = { id: 570 };
      paymentFile.projectLand = projectLand;
      const survey: ISurvey = { id: 44610 };
      paymentFile.survey = survey;
      const bank: IBank = { id: 52699 };
      paymentFile.bank = bank;
      const bankBranch: IBankBranch = { id: 18251 };
      paymentFile.bankBranch = bankBranch;
      const landCompensation: ILandCompensation = { id: 12136 };
      paymentFile.landCompensation = landCompensation;
      const paymentFileHeader: IPaymentFileHeader = { id: 393 };
      paymentFile.paymentFileHeader = paymentFileHeader;
      const project: IProject = { id: 98352 };
      paymentFile.project = project;

      activatedRoute.data = of({ paymentFile });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paymentFile));
      expect(comp.khatedarsCollection).toContain(khatedar);
      expect(comp.paymentAdvicesCollection).toContain(paymentAdvice);
      expect(comp.projectLandsSharedCollection).toContain(projectLand);
      expect(comp.surveysSharedCollection).toContain(survey);
      expect(comp.banksSharedCollection).toContain(bank);
      expect(comp.bankBranchesSharedCollection).toContain(bankBranch);
      expect(comp.landCompensationsSharedCollection).toContain(landCompensation);
      expect(comp.paymentFileHeadersSharedCollection).toContain(paymentFileHeader);
      expect(comp.projectsSharedCollection).toContain(project);
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

  describe('Tracking relationships identifiers', () => {
    describe('trackKhatedarById', () => {
      it('Should return tracked Khatedar primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackKhatedarById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

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

    describe('trackSurveyById', () => {
      it('Should return tracked Survey primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSurveyById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackBankById', () => {
      it('Should return tracked Bank primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBankById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackBankBranchById', () => {
      it('Should return tracked BankBranch primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBankBranchById(0, entity);
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

    describe('trackPaymentFileHeaderById', () => {
      it('Should return tracked PaymentFileHeader primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPaymentFileHeaderById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackProjectById', () => {
      it('Should return tracked Project primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProjectById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
