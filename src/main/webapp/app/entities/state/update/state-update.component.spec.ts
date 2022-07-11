import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { StateService } from '../service/state.service';
import { IState, State } from '../state.model';
import { IDistrict } from 'app/entities/district/district.model';
import { DistrictService } from 'app/entities/district/service/district.service';

import { StateUpdateComponent } from './state-update.component';

describe('State Management Update Component', () => {
  let comp: StateUpdateComponent;
  let fixture: ComponentFixture<StateUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let stateService: StateService;
  let districtService: DistrictService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [StateUpdateComponent],
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
      .overrideTemplate(StateUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StateUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    stateService = TestBed.inject(StateService);
    districtService = TestBed.inject(DistrictService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call District query and add missing value', () => {
      const state: IState = { id: 456 };
      const district: IDistrict = { id: 94684 };
      state.district = district;

      const districtCollection: IDistrict[] = [{ id: 67374 }];
      jest.spyOn(districtService, 'query').mockReturnValue(of(new HttpResponse({ body: districtCollection })));
      const additionalDistricts = [district];
      const expectedCollection: IDistrict[] = [...additionalDistricts, ...districtCollection];
      jest.spyOn(districtService, 'addDistrictToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ state });
      comp.ngOnInit();

      expect(districtService.query).toHaveBeenCalled();
      expect(districtService.addDistrictToCollectionIfMissing).toHaveBeenCalledWith(districtCollection, ...additionalDistricts);
      expect(comp.districtsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const state: IState = { id: 456 };
      const district: IDistrict = { id: 48526 };
      state.district = district;

      activatedRoute.data = of({ state });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(state));
      expect(comp.districtsSharedCollection).toContain(district);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<State>>();
      const state = { id: 123 };
      jest.spyOn(stateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ state });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: state }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(stateService.update).toHaveBeenCalledWith(state);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<State>>();
      const state = new State();
      jest.spyOn(stateService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ state });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: state }));
      saveSubject.complete();

      // THEN
      expect(stateService.create).toHaveBeenCalledWith(state);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<State>>();
      const state = { id: 123 };
      jest.spyOn(stateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ state });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(stateService.update).toHaveBeenCalledWith(state);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackDistrictById', () => {
      it('Should return tracked District primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDistrictById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
