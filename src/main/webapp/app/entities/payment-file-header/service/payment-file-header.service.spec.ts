import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';
import { PaymentAdviceType } from 'app/entities/enumerations/payment-advice-type.model';
import { IPaymentFileHeader, PaymentFileHeader } from '../payment-file-header.model';

import { PaymentFileHeaderService } from './payment-file-header.service';

describe('PaymentFileHeader Service', () => {
  let service: PaymentFileHeaderService;
  let httpMock: HttpTestingController;
  let elemDefault: IPaymentFileHeader;
  let expectedResult: IPaymentFileHeader | IPaymentFileHeader[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PaymentFileHeaderService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      grandTotalPaymentAmount: 0,
      paymentStatus: PaymentStatus.PENDING,
      paymentMode: PaymentAdviceType.ONLINE,
      approverRemarks: 'AAAAAAA',
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

    it('should create a PaymentFileHeader', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new PaymentFileHeader()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PaymentFileHeader', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          grandTotalPaymentAmount: 1,
          paymentStatus: 'BBBBBB',
          paymentMode: 'BBBBBB',
          approverRemarks: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PaymentFileHeader', () => {
      const patchObject = Object.assign(
        {
          grandTotalPaymentAmount: 1,
          paymentStatus: 'BBBBBB',
          paymentMode: 'BBBBBB',
          approverRemarks: 'BBBBBB',
        },
        new PaymentFileHeader()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PaymentFileHeader', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          grandTotalPaymentAmount: 1,
          paymentStatus: 'BBBBBB',
          paymentMode: 'BBBBBB',
          approverRemarks: 'BBBBBB',
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

    it('should delete a PaymentFileHeader', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPaymentFileHeaderToCollectionIfMissing', () => {
      it('should add a PaymentFileHeader to an empty array', () => {
        const paymentFileHeader: IPaymentFileHeader = { id: 123 };
        expectedResult = service.addPaymentFileHeaderToCollectionIfMissing([], paymentFileHeader);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paymentFileHeader);
      });

      it('should not add a PaymentFileHeader to an array that contains it', () => {
        const paymentFileHeader: IPaymentFileHeader = { id: 123 };
        const paymentFileHeaderCollection: IPaymentFileHeader[] = [
          {
            ...paymentFileHeader,
          },
          { id: 456 },
        ];
        expectedResult = service.addPaymentFileHeaderToCollectionIfMissing(paymentFileHeaderCollection, paymentFileHeader);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PaymentFileHeader to an array that doesn't contain it", () => {
        const paymentFileHeader: IPaymentFileHeader = { id: 123 };
        const paymentFileHeaderCollection: IPaymentFileHeader[] = [{ id: 456 }];
        expectedResult = service.addPaymentFileHeaderToCollectionIfMissing(paymentFileHeaderCollection, paymentFileHeader);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paymentFileHeader);
      });

      it('should add only unique PaymentFileHeader to an array', () => {
        const paymentFileHeaderArray: IPaymentFileHeader[] = [{ id: 123 }, { id: 456 }, { id: 26192 }];
        const paymentFileHeaderCollection: IPaymentFileHeader[] = [{ id: 123 }];
        expectedResult = service.addPaymentFileHeaderToCollectionIfMissing(paymentFileHeaderCollection, ...paymentFileHeaderArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const paymentFileHeader: IPaymentFileHeader = { id: 123 };
        const paymentFileHeader2: IPaymentFileHeader = { id: 456 };
        expectedResult = service.addPaymentFileHeaderToCollectionIfMissing([], paymentFileHeader, paymentFileHeader2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paymentFileHeader);
        expect(expectedResult).toContain(paymentFileHeader2);
      });

      it('should accept null and undefined values', () => {
        const paymentFileHeader: IPaymentFileHeader = { id: 123 };
        expectedResult = service.addPaymentFileHeaderToCollectionIfMissing([], null, paymentFileHeader, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paymentFileHeader);
      });

      it('should return initial array if no PaymentFileHeader is added', () => {
        const paymentFileHeaderCollection: IPaymentFileHeader[] = [{ id: 123 }];
        expectedResult = service.addPaymentFileHeaderToCollectionIfMissing(paymentFileHeaderCollection, undefined, null);
        expect(expectedResult).toEqual(paymentFileHeaderCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
