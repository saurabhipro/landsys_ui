import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PaymentAdviceType } from 'app/entities/enumerations/payment-advice-type.model';
import { PaymentStatus } from 'app/entities/enumerations/payment-status.model';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';
import { ICreatePaymentFile, CreatePaymentFile } from '../create-payment-file.model';

import { CreatePaymentFileService } from './create-payment-file.service';

describe('CreatePaymentFile Service', () => {
  let service: CreatePaymentFileService;
  let httpMock: HttpTestingController;
  let elemDefault: ICreatePaymentFile;
  let expectedResult: ICreatePaymentFile | ICreatePaymentFile[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CreatePaymentFileService);
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

    it('should create a CreatePaymentFile', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new CreatePaymentFile()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CreatePaymentFile', () => {
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

    it('should partial update a CreatePaymentFile', () => {
      const patchObject = Object.assign(
        {
          accountHolderBankName: 'BBBBBB',
          accountNumber: 'BBBBBB',
          ifscCode: 'BBBBBB',
          referenceNumber: 'BBBBBB',
        },
        new CreatePaymentFile()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CreatePaymentFile', () => {
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

    it('should delete a CreatePaymentFile', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCreatePaymentFileToCollectionIfMissing', () => {
      it('should add a CreatePaymentFile to an empty array', () => {
        const createPaymentFile: ICreatePaymentFile = { id: 123 };
        expectedResult = service.addCreatePaymentFileToCollectionIfMissing([], createPaymentFile);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(createPaymentFile);
      });

      it('should not add a CreatePaymentFile to an array that contains it', () => {
        const createPaymentFile: ICreatePaymentFile = { id: 123 };
        const createPaymentFileCollection: ICreatePaymentFile[] = [
          {
            ...createPaymentFile,
          },
          { id: 456 },
        ];
        expectedResult = service.addCreatePaymentFileToCollectionIfMissing(createPaymentFileCollection, createPaymentFile);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CreatePaymentFile to an array that doesn't contain it", () => {
        const createPaymentFile: ICreatePaymentFile = { id: 123 };
        const createPaymentFileCollection: ICreatePaymentFile[] = [{ id: 456 }];
        expectedResult = service.addCreatePaymentFileToCollectionIfMissing(createPaymentFileCollection, createPaymentFile);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(createPaymentFile);
      });

      it('should add only unique CreatePaymentFile to an array', () => {
        const createPaymentFileArray: ICreatePaymentFile[] = [{ id: 123 }, { id: 456 }, { id: 75445 }];
        const createPaymentFileCollection: ICreatePaymentFile[] = [{ id: 123 }];
        expectedResult = service.addCreatePaymentFileToCollectionIfMissing(createPaymentFileCollection, ...createPaymentFileArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const createPaymentFile: ICreatePaymentFile = { id: 123 };
        const createPaymentFile2: ICreatePaymentFile = { id: 456 };
        expectedResult = service.addCreatePaymentFileToCollectionIfMissing([], createPaymentFile, createPaymentFile2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(createPaymentFile);
        expect(expectedResult).toContain(createPaymentFile2);
      });

      it('should accept null and undefined values', () => {
        const createPaymentFile: ICreatePaymentFile = { id: 123 };
        expectedResult = service.addCreatePaymentFileToCollectionIfMissing([], null, createPaymentFile, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(createPaymentFile);
      });

      it('should return initial array if no CreatePaymentFile is added', () => {
        const createPaymentFileCollection: ICreatePaymentFile[] = [{ id: 123 }];
        expectedResult = service.addCreatePaymentFileToCollectionIfMissing(createPaymentFileCollection, undefined, null);
        expect(expectedResult).toEqual(createPaymentFileCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
