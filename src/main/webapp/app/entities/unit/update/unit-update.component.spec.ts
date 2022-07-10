import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UnitService } from '../service/unit.service';
import { IUnit, Unit } from '../unit.model';

import { UnitUpdateComponent } from './unit-update.component';

describe('Unit Management Update Component', () => {
  let comp: UnitUpdateComponent;
  let fixture: ComponentFixture<UnitUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let unitService: UnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UnitUpdateComponent],
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
      .overrideTemplate(UnitUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UnitUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    unitService = TestBed.inject(UnitService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const unit: IUnit = { id: 456 };

      activatedRoute.data = of({ unit });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(unit));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Unit>>();
      const unit = { id: 123 };
      jest.spyOn(unitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ unit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: unit }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(unitService.update).toHaveBeenCalledWith(unit);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Unit>>();
      const unit = new Unit();
      jest.spyOn(unitService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ unit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: unit }));
      saveSubject.complete();

      // THEN
      expect(unitService.create).toHaveBeenCalledWith(unit);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Unit>>();
      const unit = { id: 123 };
      jest.spyOn(unitService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ unit });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(unitService.update).toHaveBeenCalledWith(unit);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
