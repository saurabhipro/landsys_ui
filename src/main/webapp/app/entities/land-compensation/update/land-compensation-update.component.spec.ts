import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LandCompensationService } from '../service/land-compensation.service';
import { ILandCompensation, LandCompensation } from '../land-compensation.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';
import { ISurvey } from 'app/entities/survey/survey.model';
import { SurveyService } from 'app/entities/survey/service/survey.service';

import { LandCompensationUpdateComponent } from './land-compensation-update.component';

describe('LandCompensation Management Update Component', () => {
  let comp: LandCompensationUpdateComponent;
  let fixture: ComponentFixture<LandCompensationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let landCompensationService: LandCompensationService;
  let projectLandService: ProjectLandService;
  let surveyService: SurveyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LandCompensationUpdateComponent],
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
      .overrideTemplate(LandCompensationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LandCompensationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    landCompensationService = TestBed.inject(LandCompensationService);
    projectLandService = TestBed.inject(ProjectLandService);
    surveyService = TestBed.inject(SurveyService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call projectLand query and add missing value', () => {
      const landCompensation: ILandCompensation = { id: 456 };
      const projectLand: IProjectLand = { id: 36022 };
      landCompensation.projectLand = projectLand;

      const projectLandCollection: IProjectLand[] = [{ id: 13732 }];
      jest.spyOn(projectLandService, 'query').mockReturnValue(of(new HttpResponse({ body: projectLandCollection })));
      const expectedCollection: IProjectLand[] = [projectLand, ...projectLandCollection];
      jest.spyOn(projectLandService, 'addProjectLandToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ landCompensation });
      comp.ngOnInit();

      expect(projectLandService.query).toHaveBeenCalled();
      expect(projectLandService.addProjectLandToCollectionIfMissing).toHaveBeenCalledWith(projectLandCollection, projectLand);
      expect(comp.projectLandsCollection).toEqual(expectedCollection);
    });

    it('Should call survey query and add missing value', () => {
      const landCompensation: ILandCompensation = { id: 456 };
      const survey: ISurvey = { id: 6462 };
      landCompensation.survey = survey;

      const surveyCollection: ISurvey[] = [{ id: 47359 }];
      jest.spyOn(surveyService, 'query').mockReturnValue(of(new HttpResponse({ body: surveyCollection })));
      const expectedCollection: ISurvey[] = [survey, ...surveyCollection];
      jest.spyOn(surveyService, 'addSurveyToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ landCompensation });
      comp.ngOnInit();

      expect(surveyService.query).toHaveBeenCalled();
      expect(surveyService.addSurveyToCollectionIfMissing).toHaveBeenCalledWith(surveyCollection, survey);
      expect(comp.surveysCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const landCompensation: ILandCompensation = { id: 456 };
      const projectLand: IProjectLand = { id: 46961 };
      landCompensation.projectLand = projectLand;
      const survey: ISurvey = { id: 76414 };
      landCompensation.survey = survey;

      activatedRoute.data = of({ landCompensation });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(landCompensation));
      expect(comp.projectLandsCollection).toContain(projectLand);
      expect(comp.surveysCollection).toContain(survey);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LandCompensation>>();
      const landCompensation = { id: 123 };
      jest.spyOn(landCompensationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ landCompensation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: landCompensation }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(landCompensationService.update).toHaveBeenCalledWith(landCompensation);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LandCompensation>>();
      const landCompensation = new LandCompensation();
      jest.spyOn(landCompensationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ landCompensation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: landCompensation }));
      saveSubject.complete();

      // THEN
      expect(landCompensationService.create).toHaveBeenCalledWith(landCompensation);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<LandCompensation>>();
      const landCompensation = { id: 123 };
      jest.spyOn(landCompensationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ landCompensation });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(landCompensationService.update).toHaveBeenCalledWith(landCompensation);
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

    describe('trackSurveyById', () => {
      it('Should return tracked Survey primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSurveyById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
