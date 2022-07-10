import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProjectStatusHistoryService } from '../service/project-status-history.service';
import { IProjectStatusHistory, ProjectStatusHistory } from '../project-status-history.model';

import { ProjectStatusHistoryUpdateComponent } from './project-status-history-update.component';

describe('ProjectStatusHistory Management Update Component', () => {
  let comp: ProjectStatusHistoryUpdateComponent;
  let fixture: ComponentFixture<ProjectStatusHistoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let projectStatusHistoryService: ProjectStatusHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProjectStatusHistoryUpdateComponent],
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
      .overrideTemplate(ProjectStatusHistoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProjectStatusHistoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    projectStatusHistoryService = TestBed.inject(ProjectStatusHistoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const projectStatusHistory: IProjectStatusHistory = { id: 456 };

      activatedRoute.data = of({ projectStatusHistory });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(projectStatusHistory));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProjectStatusHistory>>();
      const projectStatusHistory = { id: 123 };
      jest.spyOn(projectStatusHistoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectStatusHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projectStatusHistory }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(projectStatusHistoryService.update).toHaveBeenCalledWith(projectStatusHistory);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProjectStatusHistory>>();
      const projectStatusHistory = new ProjectStatusHistory();
      jest.spyOn(projectStatusHistoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectStatusHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: projectStatusHistory }));
      saveSubject.complete();

      // THEN
      expect(projectStatusHistoryService.create).toHaveBeenCalledWith(projectStatusHistory);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ProjectStatusHistory>>();
      const projectStatusHistory = { id: 123 };
      jest.spyOn(projectStatusHistoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ projectStatusHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(projectStatusHistoryService.update).toHaveBeenCalledWith(projectStatusHistory);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
