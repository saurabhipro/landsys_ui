import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITransactionHistory, TransactionHistory } from '../transaction-history.model';

import { TransactionHistoryService } from './transaction-history.service';

describe('TransactionHistory Service', () => {
  let service: TransactionHistoryService;
  let httpMock: HttpTestingController;
  let elemDefault: ITransactionHistory;
  let expectedResult: ITransactionHistory | ITransactionHistory[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TransactionHistoryService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      projectName: 'AAAAAAA',
      khasraNumber: 'AAAAAAA',
      state: 'AAAAAAA',
      citizenName: 'AAAAAAA',
      citizenAadhar: 'AAAAAAA',
      surveyerName: 'AAAAAAA',
      landValue: 'AAAAAAA',
      paymentAmount: 0,
      accountNumber: 'AAAAAAA',
      bankName: 'AAAAAAA',
      transactionId: 'AAAAAAA',
      transactionType: 'AAAAAAA',
      eventType: 'AAAAAAA',
      eventStatus: 'AAAAAAA',
      approver1: 'AAAAAAA',
      approver2: 'AAAAAAA',
      approver3: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a TransactionHistory', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new TransactionHistory()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a TransactionHistory', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          projectName: 'BBBBBB',
          khasraNumber: 'BBBBBB',
          state: 'BBBBBB',
          citizenName: 'BBBBBB',
          citizenAadhar: 'BBBBBB',
          surveyerName: 'BBBBBB',
          landValue: 'BBBBBB',
          paymentAmount: 1,
          accountNumber: 'BBBBBB',
          bankName: 'BBBBBB',
          transactionId: 'BBBBBB',
          transactionType: 'BBBBBB',
          eventType: 'BBBBBB',
          eventStatus: 'BBBBBB',
          approver1: 'BBBBBB',
          approver2: 'BBBBBB',
          approver3: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a TransactionHistory', () => {
      const patchObject = Object.assign(
        {
          projectName: 'BBBBBB',
          khasraNumber: 'BBBBBB',
          state: 'BBBBBB',
          surveyerName: 'BBBBBB',
          landValue: 'BBBBBB',
          paymentAmount: 1,
          accountNumber: 'BBBBBB',
          transactionType: 'BBBBBB',
          eventType: 'BBBBBB',
          approver1: 'BBBBBB',
          approver3: 'BBBBBB',
        },
        new TransactionHistory()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of TransactionHistory', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          projectName: 'BBBBBB',
          khasraNumber: 'BBBBBB',
          state: 'BBBBBB',
          citizenName: 'BBBBBB',
          citizenAadhar: 'BBBBBB',
          surveyerName: 'BBBBBB',
          landValue: 'BBBBBB',
          paymentAmount: 1,
          accountNumber: 'BBBBBB',
          bankName: 'BBBBBB',
          transactionId: 'BBBBBB',
          transactionType: 'BBBBBB',
          eventType: 'BBBBBB',
          eventStatus: 'BBBBBB',
          approver1: 'BBBBBB',
          approver2: 'BBBBBB',
          approver3: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a TransactionHistory', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTransactionHistoryToCollectionIfMissing', () => {
      it('should add a TransactionHistory to an empty array', () => {
        const transactionHistory: ITransactionHistory = { id: 123 };
        expectedResult = service.addTransactionHistoryToCollectionIfMissing([], transactionHistory);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(transactionHistory);
      });

      it('should not add a TransactionHistory to an array that contains it', () => {
        const transactionHistory: ITransactionHistory = { id: 123 };
        const transactionHistoryCollection: ITransactionHistory[] = [
          {
            ...transactionHistory,
          },
          { id: 456 },
        ];
        expectedResult = service.addTransactionHistoryToCollectionIfMissing(transactionHistoryCollection, transactionHistory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a TransactionHistory to an array that doesn't contain it", () => {
        const transactionHistory: ITransactionHistory = { id: 123 };
        const transactionHistoryCollection: ITransactionHistory[] = [{ id: 456 }];
        expectedResult = service.addTransactionHistoryToCollectionIfMissing(transactionHistoryCollection, transactionHistory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(transactionHistory);
      });

      it('should add only unique TransactionHistory to an array', () => {
        const transactionHistoryArray: ITransactionHistory[] = [{ id: 123 }, { id: 456 }, { id: 52122 }];
        const transactionHistoryCollection: ITransactionHistory[] = [{ id: 123 }];
        expectedResult = service.addTransactionHistoryToCollectionIfMissing(transactionHistoryCollection, ...transactionHistoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const transactionHistory: ITransactionHistory = { id: 123 };
        const transactionHistory2: ITransactionHistory = { id: 456 };
        expectedResult = service.addTransactionHistoryToCollectionIfMissing([], transactionHistory, transactionHistory2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(transactionHistory);
        expect(expectedResult).toContain(transactionHistory2);
      });

      it('should accept null and undefined values', () => {
        const transactionHistory: ITransactionHistory = { id: 123 };
        expectedResult = service.addTransactionHistoryToCollectionIfMissing([], null, transactionHistory, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(transactionHistory);
      });

      it('should return initial array if no TransactionHistory is added', () => {
        const transactionHistoryCollection: ITransactionHistory[] = [{ id: 123 }];
        expectedResult = service.addTransactionHistoryToCollectionIfMissing(transactionHistoryCollection, undefined, null);
        expect(expectedResult).toEqual(transactionHistoryCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
