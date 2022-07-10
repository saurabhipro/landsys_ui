import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TransactionHistoryService } from '../service/transaction-history.service';
import { ITransactionHistory, TransactionHistory } from '../transaction-history.model';

import { TransactionHistoryUpdateComponent } from './transaction-history-update.component';

describe('TransactionHistory Management Update Component', () => {
  let comp: TransactionHistoryUpdateComponent;
  let fixture: ComponentFixture<TransactionHistoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let transactionHistoryService: TransactionHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TransactionHistoryUpdateComponent],
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
      .overrideTemplate(TransactionHistoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TransactionHistoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    transactionHistoryService = TestBed.inject(TransactionHistoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const transactionHistory: ITransactionHistory = { id: 456 };

      activatedRoute.data = of({ transactionHistory });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(transactionHistory));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TransactionHistory>>();
      const transactionHistory = { id: 123 };
      jest.spyOn(transactionHistoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transactionHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: transactionHistory }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(transactionHistoryService.update).toHaveBeenCalledWith(transactionHistory);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TransactionHistory>>();
      const transactionHistory = new TransactionHistory();
      jest.spyOn(transactionHistoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transactionHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: transactionHistory }));
      saveSubject.complete();

      // THEN
      expect(transactionHistoryService.create).toHaveBeenCalledWith(transactionHistory);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<TransactionHistory>>();
      const transactionHistory = { id: 123 };
      jest.spyOn(transactionHistoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ transactionHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(transactionHistoryService.update).toHaveBeenCalledWith(transactionHistory);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
