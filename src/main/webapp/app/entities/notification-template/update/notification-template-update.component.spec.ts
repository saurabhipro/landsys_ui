import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { NotificationTemplateService } from '../service/notification-template.service';
import { INotificationTemplate, NotificationTemplate } from '../notification-template.model';

import { NotificationTemplateUpdateComponent } from './notification-template-update.component';

describe('NotificationTemplate Management Update Component', () => {
  let comp: NotificationTemplateUpdateComponent;
  let fixture: ComponentFixture<NotificationTemplateUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let notificationTemplateService: NotificationTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [NotificationTemplateUpdateComponent],
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
      .overrideTemplate(NotificationTemplateUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(NotificationTemplateUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    notificationTemplateService = TestBed.inject(NotificationTemplateService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const notificationTemplate: INotificationTemplate = { id: 456 };

      activatedRoute.data = of({ notificationTemplate });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(notificationTemplate));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NotificationTemplate>>();
      const notificationTemplate = { id: 123 };
      jest.spyOn(notificationTemplateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ notificationTemplate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: notificationTemplate }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(notificationTemplateService.update).toHaveBeenCalledWith(notificationTemplate);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NotificationTemplate>>();
      const notificationTemplate = new NotificationTemplate();
      jest.spyOn(notificationTemplateService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ notificationTemplate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: notificationTemplate }));
      saveSubject.complete();

      // THEN
      expect(notificationTemplateService.create).toHaveBeenCalledWith(notificationTemplate);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<NotificationTemplate>>();
      const notificationTemplate = { id: 123 };
      jest.spyOn(notificationTemplateService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ notificationTemplate });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(notificationTemplateService.update).toHaveBeenCalledWith(notificationTemplate);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
