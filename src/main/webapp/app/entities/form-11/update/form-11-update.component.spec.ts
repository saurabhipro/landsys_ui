import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { Form11Service } from '../service/form-11.service';
import { IForm11, Form11 } from '../form-11.model';

import { Form11UpdateComponent } from './form-11-update.component';

describe('Form11 Management Update Component', () => {
  let comp: Form11UpdateComponent;
  let fixture: ComponentFixture<Form11UpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let form11Service: Form11Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [Form11UpdateComponent],
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
      .overrideTemplate(Form11UpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(Form11UpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    form11Service = TestBed.inject(Form11Service);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const form11: IForm11 = { id: 456 };

      activatedRoute.data = of({ form11 });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(form11));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Form11>>();
      const form11 = { id: 123 };
      jest.spyOn(form11Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ form11 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: form11 }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(form11Service.update).toHaveBeenCalledWith(form11);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Form11>>();
      const form11 = new Form11();
      jest.spyOn(form11Service, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ form11 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: form11 }));
      saveSubject.complete();

      // THEN
      expect(form11Service.create).toHaveBeenCalledWith(form11);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Form11>>();
      const form11 = { id: 123 };
      jest.spyOn(form11Service, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ form11 });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(form11Service.update).toHaveBeenCalledWith(form11);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
