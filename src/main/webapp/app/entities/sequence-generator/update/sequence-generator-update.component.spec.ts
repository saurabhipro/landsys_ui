import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SequenceGeneratorService } from '../service/sequence-generator.service';
import { ISequenceGenerator, SequenceGenerator } from '../sequence-generator.model';

import { SequenceGeneratorUpdateComponent } from './sequence-generator-update.component';

describe('SequenceGenerator Management Update Component', () => {
  let comp: SequenceGeneratorUpdateComponent;
  let fixture: ComponentFixture<SequenceGeneratorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sequenceGeneratorService: SequenceGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SequenceGeneratorUpdateComponent],
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
      .overrideTemplate(SequenceGeneratorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SequenceGeneratorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sequenceGeneratorService = TestBed.inject(SequenceGeneratorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const sequenceGenerator: ISequenceGenerator = { id: 456 };

      activatedRoute.data = of({ sequenceGenerator });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(sequenceGenerator));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SequenceGenerator>>();
      const sequenceGenerator = { id: 123 };
      jest.spyOn(sequenceGeneratorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sequenceGenerator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sequenceGenerator }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(sequenceGeneratorService.update).toHaveBeenCalledWith(sequenceGenerator);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SequenceGenerator>>();
      const sequenceGenerator = new SequenceGenerator();
      jest.spyOn(sequenceGeneratorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sequenceGenerator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sequenceGenerator }));
      saveSubject.complete();

      // THEN
      expect(sequenceGeneratorService.create).toHaveBeenCalledWith(sequenceGenerator);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SequenceGenerator>>();
      const sequenceGenerator = { id: 123 };
      jest.spyOn(sequenceGeneratorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sequenceGenerator });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sequenceGeneratorService.update).toHaveBeenCalledWith(sequenceGenerator);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
