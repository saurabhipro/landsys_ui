import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CreatePaymentFileService } from '../service/create-payment-file.service';
import { ICreatePaymentFile, CreatePaymentFile } from '../create-payment-file.model';

import { CreatePaymentFileUpdateComponent } from './create-payment-file-update.component';

describe('CreatePaymentFile Management Update Component', () => {
  let comp: CreatePaymentFileUpdateComponent;
  let fixture: ComponentFixture<CreatePaymentFileUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let createPaymentFileService: CreatePaymentFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CreatePaymentFileUpdateComponent],
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
      .overrideTemplate(CreatePaymentFileUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CreatePaymentFileUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    createPaymentFileService = TestBed.inject(CreatePaymentFileService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const createPaymentFile: ICreatePaymentFile = { id: 456 };

      activatedRoute.data = of({ createPaymentFile });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(createPaymentFile));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CreatePaymentFile>>();
      const createPaymentFile = { id: 123 };
      jest.spyOn(createPaymentFileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ createPaymentFile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: createPaymentFile }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(createPaymentFileService.update).toHaveBeenCalledWith(createPaymentFile);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CreatePaymentFile>>();
      const createPaymentFile = new CreatePaymentFile();
      jest.spyOn(createPaymentFileService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ createPaymentFile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: createPaymentFile }));
      saveSubject.complete();

      // THEN
      expect(createPaymentFileService.create).toHaveBeenCalledWith(createPaymentFile);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<CreatePaymentFile>>();
      const createPaymentFile = { id: 123 };
      jest.spyOn(createPaymentFileService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ createPaymentFile });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(createPaymentFileService.update).toHaveBeenCalledWith(createPaymentFile);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
