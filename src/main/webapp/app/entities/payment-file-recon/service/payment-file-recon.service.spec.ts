import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';
import { IPaymentFileRecon, PaymentFileRecon } from '../payment-file-recon.model';

import { PaymentFileReconService } from './payment-file-recon.service';

describe('PaymentFileRecon Service', () => {
  let service: PaymentFileReconService;
  let httpMock: HttpTestingController;
  let elemDefault: IPaymentFileRecon;
  let expectedResult: IPaymentFileRecon | IPaymentFileRecon[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PaymentFileReconService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      primaryHolderName: 'AAAAAAA',
      paymentAmount: 0,
      paymentDate: currentDate,
      utrNumber: 'AAAAAAA',
      referenceNumber: 'AAAAAAA',
      paymentStatus: PaymentStatus.PENDING,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          paymentDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a PaymentFileRecon', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          paymentDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          paymentDate: currentDate,
        },
        returnedFromService
      );

      service.create(new PaymentFileRecon()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PaymentFileRecon', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          primaryHolderName: 'BBBBBB',
          paymentAmount: 1,
          paymentDate: currentDate.format(DATE_FORMAT),
          utrNumber: 'BBBBBB',
          referenceNumber: 'BBBBBB',
          paymentStatus: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          paymentDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PaymentFileRecon', () => {
      const patchObject = Object.assign(
        {
          primaryHolderName: 'BBBBBB',
          paymentAmount: 1,
          utrNumber: 'BBBBBB',
          referenceNumber: 'BBBBBB',
        },
        new PaymentFileRecon()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          paymentDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PaymentFileRecon', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          primaryHolderName: 'BBBBBB',
          paymentAmount: 1,
          paymentDate: currentDate.format(DATE_FORMAT),
          utrNumber: 'BBBBBB',
          referenceNumber: 'BBBBBB',
          paymentStatus: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          paymentDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a PaymentFileRecon', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPaymentFileReconToCollectionIfMissing', () => {
      it('should add a PaymentFileRecon to an empty array', () => {
        const paymentFileRecon: IPaymentFileRecon = { id: 123 };
        expectedResult = service.addPaymentFileReconToCollectionIfMissing([], paymentFileRecon);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paymentFileRecon);
      });

      it('should not add a PaymentFileRecon to an array that contains it', () => {
        const paymentFileRecon: IPaymentFileRecon = { id: 123 };
        const paymentFileReconCollection: IPaymentFileRecon[] = [
          {
            ...paymentFileRecon,
          },
          { id: 456 },
        ];
        expectedResult = service.addPaymentFileReconToCollectionIfMissing(paymentFileReconCollection, paymentFileRecon);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PaymentFileRecon to an array that doesn't contain it", () => {
        const paymentFileRecon: IPaymentFileRecon = { id: 123 };
        const paymentFileReconCollection: IPaymentFileRecon[] = [{ id: 456 }];
        expectedResult = service.addPaymentFileReconToCollectionIfMissing(paymentFileReconCollection, paymentFileRecon);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paymentFileRecon);
      });

      it('should add only unique PaymentFileRecon to an array', () => {
        const paymentFileReconArray: IPaymentFileRecon[] = [{ id: 123 }, { id: 456 }, { id: 99525 }];
        const paymentFileReconCollection: IPaymentFileRecon[] = [{ id: 123 }];
        expectedResult = service.addPaymentFileReconToCollectionIfMissing(paymentFileReconCollection, ...paymentFileReconArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const paymentFileRecon: IPaymentFileRecon = { id: 123 };
        const paymentFileRecon2: IPaymentFileRecon = { id: 456 };
        expectedResult = service.addPaymentFileReconToCollectionIfMissing([], paymentFileRecon, paymentFileRecon2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paymentFileRecon);
        expect(expectedResult).toContain(paymentFileRecon2);
      });

      it('should accept null and undefined values', () => {
        const paymentFileRecon: IPaymentFileRecon = { id: 123 };
        expectedResult = service.addPaymentFileReconToCollectionIfMissing([], null, paymentFileRecon, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paymentFileRecon);
      });

      it('should return initial array if no PaymentFileRecon is added', () => {
        const paymentFileReconCollection: IPaymentFileRecon[] = [{ id: 123 }];
        expectedResult = service.addPaymentFileReconToCollectionIfMissing(paymentFileReconCollection, undefined, null);
        expect(expectedResult).toEqual(paymentFileReconCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
