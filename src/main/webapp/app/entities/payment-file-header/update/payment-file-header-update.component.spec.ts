import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PaymentFileHeaderService } from '../service/payment-file-header.service';
import { IPaymentFileHeader, PaymentFileHeader } from '../payment-file-header.model';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';

import { PaymentFileHeaderUpdateComponent } from './payment-file-header-update.component';

describe('PaymentFileHeader Management Update Component', () => {
  let comp: PaymentFileHeaderUpdateComponent;
  let fixture: ComponentFixture<PaymentFileHeaderUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let paymentFileHeaderService: PaymentFileHeaderService;
  let projectService: ProjectService;

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
    projectService = TestBed.inject(ProjectService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Project query and add missing value', () => {
      const paymentFileHeader: IPaymentFileHeader = { id: 456 };
      const project: IProject = { id: 5983 };
      paymentFileHeader.project = project;

      const projectCollection: IProject[] = [{ id: 66667 }];
      jest.spyOn(projectService, 'query').mockReturnValue(of(new HttpResponse({ body: projectCollection })));
      const additionalProjects = [project];
      const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
      jest.spyOn(projectService, 'addProjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ paymentFileHeader });
      comp.ngOnInit();

      expect(projectService.query).toHaveBeenCalled();
      expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(projectCollection, ...additionalProjects);
      expect(comp.projectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const paymentFileHeader: IPaymentFileHeader = { id: 456 };
      const project: IProject = { id: 63687 };
      paymentFileHeader.project = project;

      activatedRoute.data = of({ paymentFileHeader });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(paymentFileHeader));
      expect(comp.projectsSharedCollection).toContain(project);
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
    describe('trackProjectById', () => {
      it('Should return tracked Project primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProjectById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
