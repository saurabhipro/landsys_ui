import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SequenceGenService } from '../service/sequence-gen.service';
import { ISequenceGen, SequenceGen } from '../sequence-gen.model';

import { SequenceGenUpdateComponent } from './sequence-gen-update.component';

describe('SequenceGen Management Update Component', () => {
  let comp: SequenceGenUpdateComponent;
  let fixture: ComponentFixture<SequenceGenUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let sequenceGenService: SequenceGenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SequenceGenUpdateComponent],
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
      .overrideTemplate(SequenceGenUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SequenceGenUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    sequenceGenService = TestBed.inject(SequenceGenService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const sequenceGen: ISequenceGen = { id: 456 };

      activatedRoute.data = of({ sequenceGen });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(sequenceGen));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SequenceGen>>();
      const sequenceGen = { id: 123 };
      jest.spyOn(sequenceGenService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sequenceGen });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sequenceGen }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(sequenceGenService.update).toHaveBeenCalledWith(sequenceGen);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SequenceGen>>();
      const sequenceGen = new SequenceGen();
      jest.spyOn(sequenceGenService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sequenceGen });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: sequenceGen }));
      saveSubject.complete();

      // THEN
      expect(sequenceGenService.create).toHaveBeenCalledWith(sequenceGen);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SequenceGen>>();
      const sequenceGen = { id: 123 };
      jest.spyOn(sequenceGenService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ sequenceGen });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(sequenceGenService.update).toHaveBeenCalledWith(sequenceGen);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
