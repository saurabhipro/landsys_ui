import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DistrictService } from '../service/district.service';
import { IDistrict, District } from '../district.model';
import { IState } from 'app/entities/state/state.model';
import { StateService } from 'app/entities/state/service/state.service';

import { DistrictUpdateComponent } from './district-update.component';

describe('District Management Update Component', () => {
  let comp: DistrictUpdateComponent;
  let fixture: ComponentFixture<DistrictUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let districtService: DistrictService;
  let stateService: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DistrictUpdateComponent],
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
      .overrideTemplate(DistrictUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DistrictUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    districtService = TestBed.inject(DistrictService);
    stateService = TestBed.inject(StateService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call State query and add missing value', () => {
      const district: IDistrict = { id: 456 };
      const state: IState = { id: 54406 };
      district.state = state;

      const stateCollection: IState[] = [{ id: 94380 }];
      jest.spyOn(stateService, 'query').mockReturnValue(of(new HttpResponse({ body: stateCollection })));
      const additionalStates = [state];
      const expectedCollection: IState[] = [...additionalStates, ...stateCollection];
      jest.spyOn(stateService, 'addStateToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ district });
      comp.ngOnInit();

      expect(stateService.query).toHaveBeenCalled();
      expect(stateService.addStateToCollectionIfMissing).toHaveBeenCalledWith(stateCollection, ...additionalStates);
      expect(comp.statesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const district: IDistrict = { id: 456 };
      const state: IState = { id: 74670 };
      district.state = state;

      activatedRoute.data = of({ district });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(district));
      expect(comp.statesSharedCollection).toContain(state);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<District>>();
      const district = { id: 123 };
      jest.spyOn(districtService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ district });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: district }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(districtService.update).toHaveBeenCalledWith(district);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<District>>();
      const district = new District();
      jest.spyOn(districtService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ district });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: district }));
      saveSubject.complete();

      // THEN
      expect(districtService.create).toHaveBeenCalledWith(district);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<District>>();
      const district = { id: 123 };
      jest.spyOn(districtService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ district });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(districtService.update).toHaveBeenCalledWith(district);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackStateById', () => {
      it('Should return tracked State primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackStateById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
