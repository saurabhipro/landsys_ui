import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LandTypeService } from '../service/land-type.service';
import { ILandType, LandType } from '../land-type.model';

import { LandTypeUpdateComponent } from './land-type-update.component';

describe('LandType Management Update Component', () => {
  let comp: LandTypeUpdateComponent;
  let fixture: ComponentFixture<LandTypeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let landTypeService: LandTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LandTypeUpdateComponent],
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
      .overrideTemplate(LandTypeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LandTypeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    landTypeService = TestBed.inject(LandTypeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const landType: ILandType = { id: 456 };

      activatedRoute.data = of({ landType });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(landType));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LandType>>();
      const landType = { id: 123 };
      jest.spyOn(landTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ landType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: landType }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(landTypeService.update).toHaveBeenCalledWith(landType);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LandType>>();
      const landType = new LandType();
      jest.spyOn(landTypeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ landType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: landType }));
      saveSubject.complete();

      // THEN
      expect(landTypeService.create).toHaveBeenCalledWith(landType);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LandType>>();
      const landType = { id: 123 };
      jest.spyOn(landTypeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ landType });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(landTypeService.update).toHaveBeenCalledWith(landType);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
