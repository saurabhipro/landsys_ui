import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { KhatedarService } from '../service/khatedar.service';
import { IKhatedar, Khatedar } from '../khatedar.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';
import { ICitizen } from 'app/entities/citizen/citizen.model';
import { CitizenService } from 'app/entities/citizen/service/citizen.service';
import { IPaymentAdvice } from 'app/entities/payment-advice/payment-advice.model';
import { PaymentAdviceService } from 'app/entities/payment-advice/service/payment-advice.service';

import { KhatedarUpdateComponent } from './khatedar-update.component';

describe('Khatedar Management Update Component', () => {
  let comp: KhatedarUpdateComponent;
  let fixture: ComponentFixture<KhatedarUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let khatedarService: KhatedarService;
  let projectLandService: ProjectLandService;
  let citizenService: CitizenService;
  let paymentAdviceService: PaymentAdviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [KhatedarUpdateComponent],
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
      .overrideTemplate(KhatedarUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(KhatedarUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    khatedarService = TestBed.inject(KhatedarService);
    projectLandService = TestBed.inject(ProjectLandService);
    citizenService = TestBed.inject(CitizenService);
    paymentAdviceService = TestBed.inject(PaymentAdviceService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ProjectLand query and add missing value', () => {
      const khatedar: IKhatedar = { id: 456 };
      const projectLand: IProjectLand = { id: 77159 };
      khatedar.projectLand = projectLand;

      const projectLandCollection: IProjectLand[] = [{ id: 83772 }];
      jest.spyOn(projectLandService, 'query').mockReturnValue(of(new HttpResponse({ body: projectLandCollection })));
      const additionalProjectLands = [projectLand];
      const expectedCollection: IProjectLand[] = [...additionalProjectLands, ...projectLandCollection];
      jest.spyOn(projectLandService, 'addProjectLandToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ khatedar });
      comp.ngOnInit();

      expect(projectLandService.query).toHaveBeenCalled();
      expect(projectLandService.addProjectLandToCollectionIfMissing).toHaveBeenCalledWith(projectLandCollection, ...additionalProjectLands);
      expect(comp.projectLandsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Citizen query and add missing value', () => {
      const khatedar: IKhatedar = { id: 456 };
      const citizen: ICitizen = { id: 7106 };
      khatedar.citizen = citizen;

      const citizenCollection: ICitizen[] = [{ id: 21174 }];
      jest.spyOn(citizenService, 'query').mockReturnValue(of(new HttpResponse({ body: citizenCollection })));
      const additionalCitizens = [citizen];
      const expectedCollection: ICitizen[] = [...additionalCitizens, ...citizenCollection];
      jest.spyOn(citizenService, 'addCitizenToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ khatedar });
      comp.ngOnInit();

      expect(citizenService.query).toHaveBeenCalled();
      expect(citizenService.addCitizenToCollectionIfMissing).toHaveBeenCalledWith(citizenCollection, ...additionalCitizens);
      expect(comp.citizensSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PaymentAdvice query and add missing value', () => {
      const khatedar: IKhatedar = { id: 456 };
      const paymentAdvice: IPaymentAdvice = { id: 18608 };
      khatedar.paymentAdvice = paymentAdvice;

      const paymentAdviceCollection: IPaymentAdvice[] = [{ id: 53149 }];
      jest.spyOn(paymentAdviceService, 'query').mockReturnValue(of(new HttpResponse({ body: paymentAdviceCollection })));
      const additionalPaymentAdvices = [paymentAdvice];
      const expectedCollection: IPaymentAdvice[] = [...additionalPaymentAdvices, ...paymentAdviceCollection];
      jest.spyOn(paymentAdviceService, 'addPaymentAdviceToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ khatedar });
      comp.ngOnInit();

      expect(paymentAdviceService.query).toHaveBeenCalled();
      expect(paymentAdviceService.addPaymentAdviceToCollectionIfMissing).toHaveBeenCalledWith(
        paymentAdviceCollection,
        ...additionalPaymentAdvices
      );
      expect(comp.paymentAdvicesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const khatedar: IKhatedar = { id: 456 };
      const projectLand: IProjectLand = { id: 84080 };
      khatedar.projectLand = projectLand;
      const citizen: ICitizen = { id: 17296 };
      khatedar.citizen = citizen;
      const paymentAdvice: IPaymentAdvice = { id: 6651 };
      khatedar.paymentAdvice = paymentAdvice;

      activatedRoute.data = of({ khatedar });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(khatedar));
      expect(comp.projectLandsSharedCollection).toContain(projectLand);
      expect(comp.citizensSharedCollection).toContain(citizen);
      expect(comp.paymentAdvicesSharedCollection).toContain(paymentAdvice);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Khatedar>>();
      const khatedar = { id: 123 };
      jest.spyOn(khatedarService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ khatedar });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: khatedar }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(khatedarService.update).toHaveBeenCalledWith(khatedar);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Khatedar>>();
      const khatedar = new Khatedar();
      jest.spyOn(khatedarService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ khatedar });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: khatedar }));
      saveSubject.complete();

      // THEN
      expect(khatedarService.create).toHaveBeenCalledWith(khatedar);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Khatedar>>();
      const khatedar = { id: 123 };
      jest.spyOn(khatedarService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ khatedar });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(khatedarService.update).toHaveBeenCalledWith(khatedar);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackProjectLandById', () => {
      it('Should return tracked ProjectLand primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProjectLandById(0, entity);
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

    describe('trackPaymentAdviceById', () => {
      it('Should return tracked PaymentAdvice primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackPaymentAdviceById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
