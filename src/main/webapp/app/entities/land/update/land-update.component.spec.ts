import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LandService } from '../service/land.service';
import { ILand, Land } from '../land.model';
import { IState } from 'app/entities/state/state.model';
import { StateService } from 'app/entities/state/service/state.service';
import { IVillage } from 'app/entities/village/village.model';
import { VillageService } from 'app/entities/village/service/village.service';
import { ILandType } from 'app/entities/land-type/land-type.model';
import { LandTypeService } from 'app/entities/land-type/service/land-type.service';
import { IUnit } from 'app/entities/unit/unit.model';
import { UnitService } from 'app/entities/unit/service/unit.service';

import { LandUpdateComponent } from './land-update.component';

describe('Land Management Update Component', () => {
  let comp: LandUpdateComponent;
  let fixture: ComponentFixture<LandUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let landService: LandService;
  let stateService: StateService;
  let villageService: VillageService;
  let landTypeService: LandTypeService;
  let unitService: UnitService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LandUpdateComponent],
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
      .overrideTemplate(LandUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LandUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    landService = TestBed.inject(LandService);
    stateService = TestBed.inject(StateService);
    villageService = TestBed.inject(VillageService);
    landTypeService = TestBed.inject(LandTypeService);
    unitService = TestBed.inject(UnitService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call state query and add missing value', () => {
      const land: ILand = { id: 456 };
      const state: IState = { id: 4614 };
      land.state = state;

      const stateCollection: IState[] = [{ id: 67577 }];
      jest.spyOn(stateService, 'query').mockReturnValue(of(new HttpResponse({ body: stateCollection })));
      const expectedCollection: IState[] = [state, ...stateCollection];
      jest.spyOn(stateService, 'addStateToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ land });
      comp.ngOnInit();

      expect(stateService.query).toHaveBeenCalled();
      expect(stateService.addStateToCollectionIfMissing).toHaveBeenCalledWith(stateCollection, state);
      expect(comp.statesCollection).toEqual(expectedCollection);
    });

    it('Should call Village query and add missing value', () => {
      const land: ILand = { id: 456 };
      const village: IVillage = { id: 47076 };
      land.village = village;

      const villageCollection: IVillage[] = [{ id: 75148 }];
      jest.spyOn(villageService, 'query').mockReturnValue(of(new HttpResponse({ body: villageCollection })));
      const additionalVillages = [village];
      const expectedCollection: IVillage[] = [...additionalVillages, ...villageCollection];
      jest.spyOn(villageService, 'addVillageToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ land });
      comp.ngOnInit();

      expect(villageService.query).toHaveBeenCalled();
      expect(villageService.addVillageToCollectionIfMissing).toHaveBeenCalledWith(villageCollection, ...additionalVillages);
      expect(comp.villagesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call LandType query and add missing value', () => {
      const land: ILand = { id: 456 };
      const landType: ILandType = { id: 50627 };
      land.landType = landType;

      const landTypeCollection: ILandType[] = [{ id: 29205 }];
      jest.spyOn(landTypeService, 'query').mockReturnValue(of(new HttpResponse({ body: landTypeCollection })));
      const additionalLandTypes = [landType];
      const expectedCollection: ILandType[] = [...additionalLandTypes, ...landTypeCollection];
      jest.spyOn(landTypeService, 'addLandTypeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ land });
      comp.ngOnInit();

      expect(landTypeService.query).toHaveBeenCalled();
      expect(landTypeService.addLandTypeToCollectionIfMissing).toHaveBeenCalledWith(landTypeCollection, ...additionalLandTypes);
      expect(comp.landTypesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Unit query and add missing value', () => {
      const land: ILand = { id: 456 };
      const unit: IUnit = { id: 38164 };
      land.unit = unit;

      const unitCollection: IUnit[] = [{ id: 55878 }];
      jest.spyOn(unitService, 'query').mockReturnValue(of(new HttpResponse({ body: unitCollection })));
      const additionalUnits = [unit];
      const expectedCollection: IUnit[] = [...additionalUnits, ...unitCollection];
      jest.spyOn(unitService, 'addUnitToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ land });
      comp.ngOnInit();

      expect(unitService.query).toHaveBeenCalled();
      expect(unitService.addUnitToCollectionIfMissing).toHaveBeenCalledWith(unitCollection, ...additionalUnits);
      expect(comp.unitsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const land: ILand = { id: 456 };
      const state: IState = { id: 14797 };
      land.state = state;
      const village: IVillage = { id: 43848 };
      land.village = village;
      const landType: ILandType = { id: 32417 };
      land.landType = landType;
      const unit: IUnit = { id: 45002 };
      land.unit = unit;

      activatedRoute.data = of({ land });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(land));
      expect(comp.statesCollection).toContain(state);
      expect(comp.villagesSharedCollection).toContain(village);
      expect(comp.landTypesSharedCollection).toContain(landType);
      expect(comp.unitsSharedCollection).toContain(unit);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Land>>();
      const land = { id: 123 };
      jest.spyOn(landService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ land });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: land }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(landService.update).toHaveBeenCalledWith(land);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Land>>();
      const land = new Land();
      jest.spyOn(landService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ land });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: land }));
      saveSubject.complete();

      // THEN
      expect(landService.create).toHaveBeenCalledWith(land);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Land>>();
      const land = { id: 123 };
      jest.spyOn(landService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ land });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(landService.update).toHaveBeenCalledWith(land);
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

    describe('trackVillageById', () => {
      it('Should return tracked Village primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackVillageById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackLandTypeById', () => {
      it('Should return tracked LandType primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLandTypeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackUnitById', () => {
      it('Should return tracked Unit primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackUnitById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
