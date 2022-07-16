import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PaymentFileHeaderService } from '../service/payment-file-header.service';
import { IPaymentFileHeader, PaymentFileHeader } from '../payment-file-header.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';

import { PaymentFileHeaderUpdateComponent } from './payment-file-header-update.component';

describe('PaymentFileHeader Management Update Component', () => {
  let comp: PaymentFileHeaderUpdateComponent;
  let fixture: ComponentFixture<PaymentFileHeaderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paymentFileHeaderService: PaymentFileHeaderService;
  let projectLandService: ProjectLandService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PaymentFileHeaderUpdateComponent],
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
      .overrideTemplate(PaymentFileHeaderUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PaymentFileHeaderUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    paymentFileHeaderService = TestBed.inject(PaymentFileHeaderService);
    projectLandService = TestBed.inject(ProjectLandService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call ProjectLand query and add missing value', () => {
      const paymentFileHeader: IPaymentFileHeader = { id: 456 };
      const projectLand: IProjectLand = { id: 99550 };
      paymentFileHeader.projectLand = projectLand;

      const projectLandCollection: IProjectLand[] = [{ id: 41110 }];
      jest.spyOn(projectLandService, 'query').mockReturnValue(of(new HttpResponse({ body: projectLandCollection })));
      const additionalProjectLands = [projectLand];
      const expectedCollection: IProjectLand[] = [...additionalProjectLands, ...projectLandCollection];
      jest.spyOn(projectLandService, 'addProjectLandToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentFileHeader });
      comp.ngOnInit();

      expect(projectLandService.query).toHaveBeenCalled();
      expect(projectLandService.addProjectLandToCollectionIfMissing).toHaveBeenCalledWith(projectLandCollection, ...additionalProjectLands);
      expect(comp.projectLandsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const paymentFileHeader: IPaymentFileHeader = { id: 456 };
      const projectLand: IProjectLand = { id: 70754 };
      paymentFileHeader.projectLand = projectLand;

      activatedRoute.data = of({ paymentFileHeader });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paymentFileHeader));
      expect(comp.projectLandsSharedCollection).toContain(projectLand);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentFileHeader>>();
      const paymentFileHeader = { id: 123 };
      jest.spyOn(paymentFileHeaderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentFileHeader });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paymentFileHeader }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(paymentFileHeaderService.update).toHaveBeenCalledWith(paymentFileHeader);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentFileHeader>>();
      const paymentFileHeader = new PaymentFileHeader();
      jest.spyOn(paymentFileHeaderService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentFileHeader });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: paymentFileHeader }));
      saveSubject.complete();

      // THEN
      expect(paymentFileHeaderService.create).toHaveBeenCalledWith(paymentFileHeader);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PaymentFileHeader>>();
      const paymentFileHeader = { id: 123 };
      jest.spyOn(paymentFileHeaderService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ paymentFileHeader });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(paymentFileHeaderService.update).toHaveBeenCalledWith(paymentFileHeader);
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
  });
});
