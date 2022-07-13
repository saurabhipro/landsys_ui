import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HissaType } from 'app/entities/enumerations/hissa-type.model';
import { IPaymentAdviceDetails, PaymentAdviceDetails } from '../payment-advice-details.model';

import { PaymentAdviceDetailsService } from './payment-advice-details.service';

describe('PaymentAdviceDetails Service', () => {
  let service: PaymentAdviceDetailsService;
  let httpMock: HttpTestingController;
  let elemDefault: IPaymentAdviceDetails;
  let expectedResult: IPaymentAdviceDetails | IPaymentAdviceDetails[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PaymentAdviceDetailsService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      landOwners: 'AAAAAAA',
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

    it('should create a PaymentAdviceDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new PaymentAdviceDetails()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PaymentAdviceDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          landOwners: 'BBBBBB',
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

    it('should partial update a PaymentAdviceDetails', () => {
      const patchObject = Object.assign(
        {
          landOwners: 'BBBBBB',
          hissaType: 'BBBBBB',
        },
        new PaymentAdviceDetails()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PaymentAdviceDetails', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          landOwners: 'BBBBBB',
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

    it('should delete a PaymentAdviceDetails', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPaymentAdviceDetailsToCollectionIfMissing', () => {
      it('should add a PaymentAdviceDetails to an empty array', () => {
        const paymentAdviceDetails: IPaymentAdviceDetails = { id: 123 };
        expectedResult = service.addPaymentAdviceDetailsToCollectionIfMissing([], paymentAdviceDetails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paymentAdviceDetails);
      });

      it('should not add a PaymentAdviceDetails to an array that contains it', () => {
        const paymentAdviceDetails: IPaymentAdviceDetails = { id: 123 };
        const paymentAdviceDetailsCollection: IPaymentAdviceDetails[] = [
          {
            ...paymentAdviceDetails,
          },
          { id: 456 },
        ];
        expectedResult = service.addPaymentAdviceDetailsToCollectionIfMissing(paymentAdviceDetailsCollection, paymentAdviceDetails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PaymentAdviceDetails to an array that doesn't contain it", () => {
        const paymentAdviceDetails: IPaymentAdviceDetails = { id: 123 };
        const paymentAdviceDetailsCollection: IPaymentAdviceDetails[] = [{ id: 456 }];
        expectedResult = service.addPaymentAdviceDetailsToCollectionIfMissing(paymentAdviceDetailsCollection, paymentAdviceDetails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paymentAdviceDetails);
      });

      it('should add only unique PaymentAdviceDetails to an array', () => {
        const paymentAdviceDetailsArray: IPaymentAdviceDetails[] = [{ id: 123 }, { id: 456 }, { id: 92958 }];
        const paymentAdviceDetailsCollection: IPaymentAdviceDetails[] = [{ id: 123 }];
        expectedResult = service.addPaymentAdviceDetailsToCollectionIfMissing(paymentAdviceDetailsCollection, ...paymentAdviceDetailsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const paymentAdviceDetails: IPaymentAdviceDetails = { id: 123 };
        const paymentAdviceDetails2: IPaymentAdviceDetails = { id: 456 };
        expectedResult = service.addPaymentAdviceDetailsToCollectionIfMissing([], paymentAdviceDetails, paymentAdviceDetails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(paymentAdviceDetails);
        expect(expectedResult).toContain(paymentAdviceDetails2);
      });

      it('should accept null and undefined values', () => {
        const paymentAdviceDetails: IPaymentAdviceDetails = { id: 123 };
        expectedResult = service.addPaymentAdviceDetailsToCollectionIfMissing([], null, paymentAdviceDetails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(paymentAdviceDetails);
      });

      it('should return initial array if no PaymentAdviceDetails is added', () => {
        const paymentAdviceDetailsCollection: IPaymentAdviceDetails[] = [{ id: 123 }];
        expectedResult = service.addPaymentAdviceDetailsToCollectionIfMissing(paymentAdviceDetailsCollection, undefined, null);
        expect(expectedResult).toEqual(paymentAdviceDetailsCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
