import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CitizenService } from '../service/citizen.service';
import { ICitizen, Citizen } from '../citizen.model';
import { IBankBranch } from 'app/entities/bank-branch/bank-branch.model';
import { BankBranchService } from 'app/entities/bank-branch/service/bank-branch.service';

import { CitizenUpdateComponent } from './citizen-update.component';

describe('Citizen Management Update Component', () => {
  let comp: CitizenUpdateComponent;
  let fixture: ComponentFixture<CitizenUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let citizenService: CitizenService;
  let bankBranchService: BankBranchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CitizenUpdateComponent],
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
      .overrideTemplate(CitizenUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CitizenUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    citizenService = TestBed.inject(CitizenService);
    bankBranchService = TestBed.inject(BankBranchService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call BankBranch query and add missing value', () => {
      const citizen: ICitizen = { id: 456 };
      const bankBranch: IBankBranch = { id: 35078 };
      citizen.bankBranch = bankBranch;

      const bankBranchCollection: IBankBranch[] = [{ id: 24408 }];
      jest.spyOn(bankBranchService, 'query').mockReturnValue(of(new HttpResponse({ body: bankBranchCollection })));
      const additionalBankBranches = [bankBranch];
      const expectedCollection: IBankBranch[] = [...additionalBankBranches, ...bankBranchCollection];
      jest.spyOn(bankBranchService, 'addBankBranchToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ citizen });
      comp.ngOnInit();

      expect(bankBranchService.query).toHaveBeenCalled();
      expect(bankBranchService.addBankBranchToCollectionIfMissing).toHaveBeenCalledWith(bankBranchCollection, ...additionalBankBranches);
      expect(comp.bankBranchesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const citizen: ICitizen = { id: 456 };
      const bankBranch: IBankBranch = { id: 71862 };
      citizen.bankBranch = bankBranch;

      activatedRoute.data = of({ citizen });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(citizen));
      expect(comp.bankBranchesSharedCollection).toContain(bankBranch);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Citizen>>();
      const citizen = { id: 123 };
      jest.spyOn(citizenService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ citizen });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: citizen }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(citizenService.update).toHaveBeenCalledWith(citizen);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Citizen>>();
      const citizen = new Citizen();
      jest.spyOn(citizenService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ citizen });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: citizen }));
      saveSubject.complete();

      // THEN
      expect(citizenService.create).toHaveBeenCalledWith(citizen);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Citizen>>();
      const citizen = { id: 123 };
      jest.spyOn(citizenService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ citizen });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(citizenService.update).toHaveBeenCalledWith(citizen);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackBankBranchById', () => {
      it('Should return tracked BankBranch primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBankBranchById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
