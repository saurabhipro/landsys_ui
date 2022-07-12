import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LandService } from '../service/land.service';
import { ILand, Land } from '../land.model';
import { IVillage } from 'app/entities/village/village.model';
import { VillageService } from 'app/entities/village/service/village.service';
import { IUnit } from 'app/entities/unit/unit.model';
import { UnitService } from 'app/entities/unit/service/unit.service';
import { ILandType } from 'app/entities/land-type/land-type.model';
import { LandTypeService } from 'app/entities/land-type/service/land-type.service';
import { IState } from 'app/entities/state/state.model';
import { StateService } from 'app/entities/state/service/state.service';
import { ICitizen } from 'app/entities/citizen/citizen.model';
import { CitizenService } from 'app/entities/citizen/service/citizen.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';

import { LandUpdateComponent } from './land-update.component';

describe('Land Management Update Component', () => {
  let comp: LandUpdateComponent;
  let fixture: ComponentFixture<LandUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let landService: LandService;
  let villageService: VillageService;
  let unitService: UnitService;
  let landTypeService: LandTypeService;
  let stateService: StateService;
  let citizenService: CitizenService;
  let projectService: ProjectService;

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
    villageService = TestBed.inject(VillageService);
    unitService = TestBed.inject(UnitService);
    landTypeService = TestBed.inject(LandTypeService);
    stateService = TestBed.inject(StateService);
    citizenService = TestBed.inject(CitizenService);
    projectService = TestBed.inject(ProjectService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
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

    it('Should call State query and add missing value', () => {
      const land: ILand = { id: 456 };
      const state: IState = { id: 4614 };
      land.state = state;

      const stateCollection: IState[] = [{ id: 67577 }];
      jest.spyOn(stateService, 'query').mockReturnValue(of(new HttpResponse({ body: stateCollection })));
      const additionalStates = [state];
      const expectedCollection: IState[] = [...additionalStates, ...stateCollection];
      jest.spyOn(stateService, 'addStateToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ land });
      comp.ngOnInit();

      expect(stateService.query).toHaveBeenCalled();
      expect(stateService.addStateToCollectionIfMissing).toHaveBeenCalledWith(stateCollection, ...additionalStates);
      expect(comp.statesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Citizen query and add missing value', () => {
      const land: ILand = { id: 456 };
      const citizen: ICitizen = { id: 64002 };
      land.citizen = citizen;

      const citizenCollection: ICitizen[] = [{ id: 4522 }];
      jest.spyOn(citizenService, 'query').mockReturnValue(of(new HttpResponse({ body: citizenCollection })));
      const additionalCitizens = [citizen];
      const expectedCollection: ICitizen[] = [...additionalCitizens, ...citizenCollection];
      jest.spyOn(citizenService, 'addCitizenToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ land });
      comp.ngOnInit();

      expect(citizenService.query).toHaveBeenCalled();
      expect(citizenService.addCitizenToCollectionIfMissing).toHaveBeenCalledWith(citizenCollection, ...additionalCitizens);
      expect(comp.citizensSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Project query and add missing value', () => {
      const land: ILand = { id: 456 };
      const project: IProject = { id: 45305 };
      land.project = project;

      const projectCollection: IProject[] = [{ id: 3959 }];
      jest.spyOn(projectService, 'query').mockReturnValue(of(new HttpResponse({ body: projectCollection })));
      const additionalProjects = [project];
      const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
      jest.spyOn(projectService, 'addProjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ land });
      comp.ngOnInit();

      expect(projectService.query).toHaveBeenCalled();
      expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(projectCollection, ...additionalProjects);
      expect(comp.projectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const land: ILand = { id: 456 };
      const village: IVillage = { id: 43848 };
      land.village = village;
      const unit: IUnit = { id: 45002 };
      land.unit = unit;
      const landType: ILandType = { id: 32417 };
      land.landType = landType;
      const state: IState = { id: 14797 };
      land.state = state;
      const citizen: ICitizen = { id: 62202 };
      land.citizen = citizen;
      const project: IProject = { id: 10153 };
      land.project = project;

      activatedRoute.data = of({ land });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(land));
      expect(comp.villagesSharedCollection).toContain(village);
      expect(comp.unitsSharedCollection).toContain(unit);
      expect(comp.landTypesSharedCollection).toContain(landType);
      expect(comp.statesSharedCollection).toContain(state);
      expect(comp.citizensSharedCollection).toContain(citizen);
      expect(comp.projectsSharedCollection).toContain(project);
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
    describe('trackVillageById', () => {
      it('Should return tracked Village primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackVillageById(0, entity);
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

    describe('trackLandTypeById', () => {
      it('Should return tracked LandType primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLandTypeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackStateById', () => {
      it('Should return tracked State primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackStateById(0, entity);
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

    describe('trackProjectById', () => {
      it('Should return tracked Project primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackProjectById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
