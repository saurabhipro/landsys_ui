import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PaymentAdviceType } from 'app/entities/enumerations/payment-advice-type.model';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';
import { IPaymentAdvice, PaymentAdvice } from '../payment-advice.model';

import { PaymentAdviceService } from './payment-advice.service';

describe('PaymentAdvice Service', () => {
  let service: PaymentAdviceService;
  let httpMock: HttpTestingController;
  let elemDefault: IPaymentAdvice;
  let expectedResult: IPaymentAdvice | IPaymentAdvice[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PaymentAdviceService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      accountHolderName: 'AAAAAAA',
      accountHolderBankName: 'AAAAAAA',
      paymentAmount: 0,
      bankName: 'AAAAAAA',
      accountNumber: 'AAAAAAA',
      ifscCode: 'AAAAAAA',
      checkNumber: 'AAAAAAA',
      micrCode: 'AAAAAAA',
      paymentAdviceType: PaymentAdviceType.ONLINE,
      referenceNumber: 'AAAAAAA',
      paymentStatus: PaymentStatus.PENDING,
      hissaType: HissaType.SINGLE_OWNER,
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

    it('should create a PaymentAdvice', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new PaymentAdvice()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PaymentAdvice', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          accountHolderName: 'BBBBBB',
          accountHolderBankName: 'BBBBBB',
          paymentAmount: 1,
          bankName: 'BBBBBB',
          accountNumber: 'BBBBBB',
          ifscCode: 'BBBBBB',
          checkNumber: 'BBBBBB',
          micrCode: 'BBBBBB',
          paymentAdviceType: 'BBBBBB',
          referenceNumber: 'BBBBBB',
          paymentStatus: 'BBBBBB',
          hissaType: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PaymentAdvice', () => {
      const patchObject = Object.assign(
        {
          accountHolderName: 'BBBBBB',
          accountHolderBankName: 'BBBBBB',
          bankName: 'BBBBBB',
          accountNumber: 'BBBBBB',
          ifscCode: 'BBBBBB',
          checkNumber: 'BBBBBB',
          paymentAdviceType: 'BBBBBB',
        },
        new PaymentAdvice()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PaymentAdvice', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          accountHolderName: 'BBBBBB',
          accountHolderBankName: 'BBBBBB',
          paymentAmount: 1,
          bankName: 'BBBBBB',
          accountNumber: 'BBBBBB',
          ifscCode: 'BBBBBB',
          checkNumber: 'BBBBBB',
          micrCode: 'BBBBBB',
          paymentAdviceType: 'BBBBBB',
          referenceNumber: 'BBBBBB',
          paymentStatus: 'BBBBBB',
          hissaType: 'BBBBBB',
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

    it('should delete a PaymentAdvice', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPaymentAdviceToCollectionIfMissing', () => {
      it('should add a PaymentAdvice to an empty array', () => {
        const paymentAdvice: IPaymentAdvice = { id: 123 };
        expectedResult = service.addPaymentAdviceToCollectionIfMissing([], paymentAdvice);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paymentAdvice);
      });

      it('should not add a PaymentAdvice to an array that contains it', () => {
        const paymentAdvice: IPaymentAdvice = { id: 123 };
        const paymentAdviceCollection: IPaymentAdvice[] = [
          {
            ...paymentAdvice,
          },
          { id: 456 },
        ];
        expectedResult = service.addPaymentAdviceToCollectionIfMissing(paymentAdviceCollection, paymentAdvice);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PaymentAdvice to an array that doesn't contain it", () => {
        const paymentAdvice: IPaymentAdvice = { id: 123 };
        const paymentAdviceCollection: IPaymentAdvice[] = [{ id: 456 }];
        expectedResult = service.addPaymentAdviceToCollectionIfMissing(paymentAdviceCollection, paymentAdvice);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paymentAdvice);
      });

      it('should add only unique PaymentAdvice to an array', () => {
        const paymentAdviceArray: IPaymentAdvice[] = [{ id: 123 }, { id: 456 }, { id: 31406 }];
        const paymentAdviceCollection: IPaymentAdvice[] = [{ id: 123 }];
        expectedResult = service.addPaymentAdviceToCollectionIfMissing(paymentAdviceCollection, ...paymentAdviceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const paymentAdvice: IPaymentAdvice = { id: 123 };
        const paymentAdvice2: IPaymentAdvice = { id: 456 };
        expectedResult = service.addPaymentAdviceToCollectionIfMissing([], paymentAdvice, paymentAdvice2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paymentAdvice);
        expect(expectedResult).toContain(paymentAdvice2);
      });

      it('should accept null and undefined values', () => {
        const paymentAdvice: IPaymentAdvice = { id: 123 };
        expectedResult = service.addPaymentAdviceToCollectionIfMissing([], null, paymentAdvice, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paymentAdvice);
      });

      it('should return initial array if no PaymentAdvice is added', () => {
        const paymentAdviceCollection: IPaymentAdvice[] = [{ id: 123 }];
        expectedResult = service.addPaymentAdviceToCollectionIfMissing(paymentAdviceCollection, undefined, null);
        expect(expectedResult).toEqual(paymentAdviceCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
