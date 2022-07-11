import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NoticeStatusInfoService } from '../service/notice-status-info.service';
import { INoticeStatusInfo, NoticeStatusInfo } from '../notice-status-info.model';

import { NoticeStatusInfoUpdateComponent } from './notice-status-info-update.component';

describe('NoticeStatusInfo Management Update Component', () => {
  let comp: NoticeStatusInfoUpdateComponent;
  let fixture: ComponentFixture<NoticeStatusInfoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let noticeStatusInfoService: NoticeStatusInfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NoticeStatusInfoUpdateComponent],
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
      .overrideTemplate(NoticeStatusInfoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NoticeStatusInfoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    noticeStatusInfoService = TestBed.inject(NoticeStatusInfoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const noticeStatusInfo: INoticeStatusInfo = { id: 456 };

      activatedRoute.data = of({ noticeStatusInfo });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(noticeStatusInfo));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NoticeStatusInfo>>();
      const noticeStatusInfo = { id: 123 };
      jest.spyOn(noticeStatusInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ noticeStatusInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: noticeStatusInfo }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(noticeStatusInfoService.update).toHaveBeenCalledWith(noticeStatusInfo);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NoticeStatusInfo>>();
      const noticeStatusInfo = new NoticeStatusInfo();
      jest.spyOn(noticeStatusInfoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ noticeStatusInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: noticeStatusInfo }));
      saveSubject.complete();

      // THEN
      expect(noticeStatusInfoService.create).toHaveBeenCalledWith(noticeStatusInfo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NoticeStatusInfo>>();
      const noticeStatusInfo = { id: 123 };
      jest.spyOn(noticeStatusInfoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ noticeStatusInfo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(noticeStatusInfoService.update).toHaveBeenCalledWith(noticeStatusInfo);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
