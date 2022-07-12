import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SurveyService } from '../service/survey.service';
import { ISurvey, Survey } from '../survey.model';
import { IProjectLand } from 'app/entities/project-land/project-land.model';
import { ProjectLandService } from 'app/entities/project-land/service/project-land.service';

import { SurveyUpdateComponent } from './survey-update.component';

describe('Survey Management Update Component', () => {
  let comp: SurveyUpdateComponent;
  let fixture: ComponentFixture<SurveyUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let surveyService: SurveyService;
  let projectLandService: ProjectLandService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SurveyUpdateComponent],
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
      .overrideTemplate(SurveyUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SurveyUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    surveyService = TestBed.inject(SurveyService);
    projectLandService = TestBed.inject(ProjectLandService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call projectLand query and add missing value', () => {
      const survey: ISurvey = { id: 456 };
      const projectLand: IProjectLand = { id: 31480 };
      survey.projectLand = projectLand;

      const projectLandCollection: IProjectLand[] = [{ id: 58817 }];
      jest.spyOn(projectLandService, 'query').mockReturnValue(of(new HttpResponse({ body: projectLandCollection })));
      const expectedCollection: IProjectLand[] = [projectLand, ...projectLandCollection];
      jest.spyOn(projectLandService, 'addProjectLandToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ survey });
      comp.ngOnInit();

      expect(projectLandService.query).toHaveBeenCalled();
      expect(projectLandService.addProjectLandToCollectionIfMissing).toHaveBeenCalledWith(projectLandCollection, projectLand);
      expect(comp.projectLandsCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const survey: ISurvey = { id: 456 };
      const projectLand: IProjectLand = { id: 31685 };
      survey.projectLand = projectLand;

      activatedRoute.data = of({ survey });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(survey));
      expect(comp.projectLandsCollection).toContain(projectLand);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Survey>>();
      const survey = { id: 123 };
      jest.spyOn(surveyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ survey });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: survey }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(surveyService.update).toHaveBeenCalledWith(survey);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Survey>>();
      const survey = new Survey();
      jest.spyOn(surveyService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ survey });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: survey }));
      saveSubject.complete();

      // THEN
      expect(surveyService.create).toHaveBeenCalledWith(survey);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Survey>>();
      const survey = { id: 123 };
      jest.spyOn(surveyService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ survey });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(surveyService.update).toHaveBeenCalledWith(survey);
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
  });
});
