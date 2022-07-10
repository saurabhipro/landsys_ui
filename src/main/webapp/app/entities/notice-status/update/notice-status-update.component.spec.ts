import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NoticeStatusService } from '../service/notice-status.service';
import { INoticeStatus, NoticeStatus } from '../notice-status.model';

import { NoticeStatusUpdateComponent } from './notice-status-update.component';

describe('NoticeStatus Management Update Component', () => {
  let comp: NoticeStatusUpdateComponent;
  let fixture: ComponentFixture<NoticeStatusUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let noticeStatusService: NoticeStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NoticeStatusUpdateComponent],
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
      .overrideTemplate(NoticeStatusUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NoticeStatusUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    noticeStatusService = TestBed.inject(NoticeStatusService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const noticeStatus: INoticeStatus = { id: 456 };

      activatedRoute.data = of({ noticeStatus });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(noticeStatus));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NoticeStatus>>();
      const noticeStatus = { id: 123 };
      jest.spyOn(noticeStatusService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ noticeStatus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: noticeStatus }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(noticeStatusService.update).toHaveBeenCalledWith(noticeStatus);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NoticeStatus>>();
      const noticeStatus = new NoticeStatus();
      jest.spyOn(noticeStatusService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ noticeStatus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: noticeStatus }));
      saveSubject.complete();

      // THEN
      expect(noticeStatusService.create).toHaveBeenCalledWith(noticeStatus);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NoticeStatus>>();
      const noticeStatus = { id: 123 };
      jest.spyOn(noticeStatusService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ noticeStatus });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(noticeStatusService.update).toHaveBeenCalledWith(noticeStatus);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
