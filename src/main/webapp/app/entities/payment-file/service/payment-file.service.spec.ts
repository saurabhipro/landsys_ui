import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';
import { IPaymentFile, PaymentFile } from '../payment-file.model';

import { PaymentFileService } from './payment-file.service';

describe('PaymentFile Service', () => {
  let service: PaymentFileService;
  let httpMock: HttpTestingController;
  let elemDefault: IPaymentFile;
  let expectedResult: IPaymentFile | IPaymentFile[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PaymentFileService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      paymentFileId: 0,
      totalPaymentAmount: 0,
      paymentFileDate: currentDate,
      paymentStatus: PaymentStatus.PENDING,
      bankName: 'AAAAAAA',
      ifscCode: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          paymentFileDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a PaymentFile', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          paymentFileDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          paymentFileDate: currentDate,
        },
        returnedFromService
      );

      service.create(new PaymentFile()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PaymentFile', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          paymentFileId: 1,
          totalPaymentAmount: 1,
          paymentFileDate: currentDate.format(DATE_FORMAT),
          paymentStatus: 'BBBBBB',
          bankName: 'BBBBBB',
          ifscCode: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          paymentFileDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PaymentFile', () => {
      const patchObject = Object.assign(
        {
          totalPaymentAmount: 1,
        },
        new PaymentFile()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          paymentFileDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PaymentFile', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          paymentFileId: 1,
          totalPaymentAmount: 1,
          paymentFileDate: currentDate.format(DATE_FORMAT),
          paymentStatus: 'BBBBBB',
          bankName: 'BBBBBB',
          ifscCode: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          paymentFileDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a PaymentFile', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPaymentFileToCollectionIfMissing', () => {
      it('should add a PaymentFile to an empty array', () => {
        const paymentFile: IPaymentFile = { id: 123 };
        expectedResult = service.addPaymentFileToCollectionIfMissing([], paymentFile);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paymentFile);
      });

      it('should not add a PaymentFile to an array that contains it', () => {
        const paymentFile: IPaymentFile = { id: 123 };
        const paymentFileCollection: IPaymentFile[] = [
          {
            ...paymentFile,
          },
          { id: 456 },
        ];
        expectedResult = service.addPaymentFileToCollectionIfMissing(paymentFileCollection, paymentFile);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PaymentFile to an array that doesn't contain it", () => {
        const paymentFile: IPaymentFile = { id: 123 };
        const paymentFileCollection: IPaymentFile[] = [{ id: 456 }];
        expectedResult = service.addPaymentFileToCollectionIfMissing(paymentFileCollection, paymentFile);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paymentFile);
      });

      it('should add only unique PaymentFile to an array', () => {
        const paymentFileArray: IPaymentFile[] = [{ id: 123 }, { id: 456 }, { id: 81659 }];
        const paymentFileCollection: IPaymentFile[] = [{ id: 123 }];
        expectedResult = service.addPaymentFileToCollectionIfMissing(paymentFileCollection, ...paymentFileArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const paymentFile: IPaymentFile = { id: 123 };
        const paymentFile2: IPaymentFile = { id: 456 };
        expectedResult = service.addPaymentFileToCollectionIfMissing([], paymentFile, paymentFile2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paymentFile);
        expect(expectedResult).toContain(paymentFile2);
      });

      it('should accept null and undefined values', () => {
        const paymentFile: IPaymentFile = { id: 123 };
        expectedResult = service.addPaymentFileToCollectionIfMissing([], null, paymentFile, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paymentFile);
      });

      it('should return initial array if no PaymentFile is added', () => {
        const paymentFileCollection: IPaymentFile[] = [{ id: 123 }];
        expectedResult = service.addPaymentFileToCollectionIfMissing(paymentFileCollection, undefined, null);
        expect(expectedResult).toEqual(paymentFileCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
