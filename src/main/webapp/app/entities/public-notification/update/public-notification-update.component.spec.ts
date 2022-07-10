import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { PublicNotificationService } from '../service/public-notification.service';
import { IPublicNotification, PublicNotification } from '../public-notification.model';

import { PublicNotificationUpdateComponent } from './public-notification-update.component';

describe('PublicNotification Management Update Component', () => {
  let comp: PublicNotificationUpdateComponent;
  let fixture: ComponentFixture<PublicNotificationUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let publicNotificationService: PublicNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [PublicNotificationUpdateComponent],
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
      .overrideTemplate(PublicNotificationUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PublicNotificationUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    publicNotificationService = TestBed.inject(PublicNotificationService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const publicNotification: IPublicNotification = { id: 456 };

      activatedRoute.data = of({ publicNotification });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(publicNotification));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PublicNotification>>();
      const publicNotification = { id: 123 };
      jest.spyOn(publicNotificationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ publicNotification });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: publicNotification }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(publicNotificationService.update).toHaveBeenCalledWith(publicNotification);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PublicNotification>>();
      const publicNotification = new PublicNotification();
      jest.spyOn(publicNotificationService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ publicNotification });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: publicNotification }));
      saveSubject.complete();

      // THEN
      expect(publicNotificationService.create).toHaveBeenCalledWith(publicNotification);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<PublicNotification>>();
      const publicNotification = { id: 123 };
      jest.spyOn(publicNotificationService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ publicNotification });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(publicNotificationService.update).toHaveBeenCalledWith(publicNotification);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
