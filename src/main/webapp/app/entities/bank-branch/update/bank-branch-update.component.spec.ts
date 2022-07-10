import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { BankBranchService } from '../service/bank-branch.service';
import { IBankBranch, BankBranch } from '../bank-branch.model';
import { IBank } from 'app/entities/bank/bank.model';
import { BankService } from 'app/entities/bank/service/bank.service';

import { BankBranchUpdateComponent } from './bank-branch-update.component';

describe('BankBranch Management Update Component', () => {
  let comp: BankBranchUpdateComponent;
  let fixture: ComponentFixture<BankBranchUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bankBranchService: BankBranchService;
  let bankService: BankService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [BankBranchUpdateComponent],
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
      .overrideTemplate(BankBranchUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BankBranchUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bankBranchService = TestBed.inject(BankBranchService);
    bankService = TestBed.inject(BankService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Bank query and add missing value', () => {
      const bankBranch: IBankBranch = { id: 456 };
      const bank: IBank = { id: 50327 };
      bankBranch.bank = bank;

      const bankCollection: IBank[] = [{ id: 20517 }];
      jest.spyOn(bankService, 'query').mockReturnValue(of(new HttpResponse({ body: bankCollection })));
      const additionalBanks = [bank];
      const expectedCollection: IBank[] = [...additionalBanks, ...bankCollection];
      jest.spyOn(bankService, 'addBankToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ bankBranch });
      comp.ngOnInit();

      expect(bankService.query).toHaveBeenCalled();
      expect(bankService.addBankToCollectionIfMissing).toHaveBeenCalledWith(bankCollection, ...additionalBanks);
      expect(comp.banksSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const bankBranch: IBankBranch = { id: 456 };
      const bank: IBank = { id: 39425 };
      bankBranch.bank = bank;

      activatedRoute.data = of({ bankBranch });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(bankBranch));
      expect(comp.banksSharedCollection).toContain(bank);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BankBranch>>();
      const bankBranch = { id: 123 };
      jest.spyOn(bankBranchService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankBranch });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bankBranch }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(bankBranchService.update).toHaveBeenCalledWith(bankBranch);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BankBranch>>();
      const bankBranch = new BankBranch();
      jest.spyOn(bankBranchService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankBranch });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: bankBranch }));
      saveSubject.complete();

      // THEN
      expect(bankBranchService.create).toHaveBeenCalledWith(bankBranch);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<BankBranch>>();
      const bankBranch = { id: 123 };
      jest.spyOn(bankBranchService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ bankBranch });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bankBranchService.update).toHaveBeenCalledWith(bankBranch);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackBankById', () => {
      it('Should return tracked Bank primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackBankById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
