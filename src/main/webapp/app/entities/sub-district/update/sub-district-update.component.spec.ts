import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SubDistrictService } from '../service/sub-district.service';
import { ISubDistrict, SubDistrict } from '../sub-district.model';
import { IDistrict } from 'app/entities/district/district.model';
import { DistrictService } from 'app/entities/district/service/district.service';

import { SubDistrictUpdateComponent } from './sub-district-update.component';

describe('SubDistrict Management Update Component', () => {
  let comp: SubDistrictUpdateComponent;
  let fixture: ComponentFixture<SubDistrictUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let subDistrictService: SubDistrictService;
  let districtService: DistrictService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SubDistrictUpdateComponent],
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
      .overrideTemplate(SubDistrictUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SubDistrictUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    subDistrictService = TestBed.inject(SubDistrictService);
    districtService = TestBed.inject(DistrictService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call District query and add missing value', () => {
      const subDistrict: ISubDistrict = { id: 456 };
      const district: IDistrict = { id: 15941 };
      subDistrict.district = district;

      const districtCollection: IDistrict[] = [{ id: 16021 }];
      jest.spyOn(districtService, 'query').mockReturnValue(of(new HttpResponse({ body: districtCollection })));
      const additionalDistricts = [district];
      const expectedCollection: IDistrict[] = [...additionalDistricts, ...districtCollection];
      jest.spyOn(districtService, 'addDistrictToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ subDistrict });
      comp.ngOnInit();

      expect(districtService.query).toHaveBeenCalled();
      expect(districtService.addDistrictToCollectionIfMissing).toHaveBeenCalledWith(districtCollection, ...additionalDistricts);
      expect(comp.districtsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const subDistrict: ISubDistrict = { id: 456 };
      const district: IDistrict = { id: 51401 };
      subDistrict.district = district;

      activatedRoute.data = of({ subDistrict });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(subDistrict));
      expect(comp.districtsSharedCollection).toContain(district);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SubDistrict>>();
      const subDistrict = { id: 123 };
      jest.spyOn(subDistrictService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subDistrict });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: subDistrict }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(subDistrictService.update).toHaveBeenCalledWith(subDistrict);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SubDistrict>>();
      const subDistrict = new SubDistrict();
      jest.spyOn(subDistrictService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subDistrict });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: subDistrict }));
      saveSubject.complete();

      // THEN
      expect(subDistrictService.create).toHaveBeenCalledWith(subDistrict);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<SubDistrict>>();
      const subDistrict = { id: 123 };
      jest.spyOn(subDistrictService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ subDistrict });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(subDistrictService.update).toHaveBeenCalledWith(subDistrict);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackDistrictById', () => {
      it('Should return tracked District primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDistrictById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
