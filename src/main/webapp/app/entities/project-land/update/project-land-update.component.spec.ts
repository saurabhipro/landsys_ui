import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProjectLandService } from '../service/project-land.service';
import { IProjectLand, ProjectLand } from '../project-land.model';
import { ILand } from 'app/entities/land/land.model';
import { LandService } from 'app/entities/land/service/land.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';
import { INoticeStatusInfo } from 'app/entities/notice-status-info/notice-status-info.model';
import { NoticeStatusInfoService } from 'app/entities/notice-status-info/service/notice-status-info.service';

import { ProjectLandUpdateComponent } from './project-land-update.component';

describe('ProjectLand Management Update Component', () => {
  let comp: ProjectLandUpdateComponent;
  let fixture: ComponentFixture<ProjectLandUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let projectLandService: ProjectLandService;
  let landService: LandService;
  let projectService: ProjectService;
  let noticeStatusInfoService: NoticeStatusInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProjectLandUpdateComponent],
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
      .overrideTemplate(ProjectLandUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectLandUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    projectLandService = TestBed.inject(ProjectLandService);
    landService = TestBed.inject(LandService);
    projectService = TestBed.inject(ProjectService);
    noticeStatusInfoService = TestBed.inject(NoticeStatusInfoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Land query and add missing value', () => {
      const projectLand: IProjectLand = { id: 456 };
      const land: ILand = { id: 15678 };
      projectLand.land = land;

      const landCollection: ILand[] = [{ id: 63661 }];
      jest.spyOn(landService, 'query').mockReturnValue(of(new HttpResponse({ body: landCollection })));
      const additionalLands = [land];
      const expectedCollection: ILand[] = [...additionalLands, ...landCollection];
      jest.spyOn(landService, 'addLandToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ projectLand });
      comp.ngOnInit();

      expect(landService.query).toHaveBeenCalled();
      expect(landService.addLandToCollectionIfMissing).toHaveBeenCalledWith(landCollection, ...additionalLands);
      expect(comp.landsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Project query and add missing value', () => {
      const projectLand: IProjectLand = { id: 456 };
      const project: IProject = { id: 84181 };
      projectLand.project = project;

      const projectCollection: IProject[] = [{ id: 49342 }];
      jest.spyOn(projectService, 'query').mockReturnValue(of(new HttpResponse({ body: projectCollection })));
      const additionalProjects = [project];
      const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
      jest.spyOn(projectService, 'addProjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ projectLand });
      comp.ngOnInit();

      expect(projectService.query).toHaveBeenCalled();
      expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(projectCollection, ...additionalProjects);
      expect(comp.projectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call NoticeStatusInfo query and add missing value', () => {
      const projectLand: IProjectLand = { id: 456 };
      const noticeStatusInfo: INoticeStatusInfo = { id: 50222 };
      projectLand.noticeStatusInfo = noticeStatusInfo;

      const noticeStatusInfoCollection: INoticeStatusInfo[] = [{ id: 77840 }];
      jest.spyOn(noticeStatusInfoService, 'query').mockReturnValue(of(new HttpResponse({ body: noticeStatusInfoCollection })));
      const additionalNoticeStatusInfos = [noticeStatusInfo];
      const expectedCollection: INoticeStatusInfo[] = [...additionalNoticeStatusInfos, ...noticeStatusInfoCollection];
      jest.spyOn(noticeStatusInfoService, 'addNoticeStatusInfoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ projectLand });
      comp.ngOnInit();

      expect(noticeStatusInfoService.query).toHaveBeenCalled();
      expect(noticeStatusInfoService.addNoticeStatusInfoToCollectionIfMissing).toHaveBeenCalledWith(
        noticeStatusInfoCollection,
        ...additionalNoticeStatusInfos
      );
      expect(comp.noticeStatusInfosSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const projectLand: IProjectLand = { id: 456 };
      const land: ILand = { id: 6691 };
      projectLand.land = land;
      const project: IProject = { id: 92901 };
      projectLand.project = project;
      const noticeStatusInfo: INoticeStatusInfo = { id: 97324 };
      projectLand.noticeStatusInfo = noticeStatusInfo;

      activatedRoute.data = of({ projectLand });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(projectLand));
      expect(comp.landsSharedCollection).toContain(land);
      expect(comp.projectsSharedCollection).toContain(project);
      expect(comp.noticeStatusInfosSharedCollection).toContain(noticeStatusInfo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProjectLand>>();
      const projectLand = { id: 123 };
      jest.spyOn(projectLandService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectLand });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projectLand }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(projectLandService.update).toHaveBeenCalledWith(projectLand);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProjectLand>>();
      const projectLand = new ProjectLand();
      jest.spyOn(projectLandService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectLand });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projectLand }));
      saveSubject.complete();

      // THEN
      expect(projectLandService.create).toHaveBeenCalledWith(projectLand);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProjectLand>>();
      const projectLand = { id: 123 };
      jest.spyOn(projectLandService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectLand });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(projectLandService.update).toHaveBeenCalledWith(projectLand);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackLandById', () => {
      it('Should return tracked Land primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackLandById(0, entity);
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

    describe('trackNoticeStatusInfoById', () => {
      it('Should return tracked NoticeStatusInfo primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackNoticeStatusInfoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
