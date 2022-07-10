import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IBankBranch, BankBranch } from '../bank-branch.model';

import { BankBranchService } from './bank-branch.service';

describe('BankBranch Service', () => {
  let service: BankBranchService;
  let httpMock: HttpTestingController;
  let elemDefault: IBankBranch;
  let expectedResult: IBankBranch | IBankBranch[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(BankBranchService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      ifsc: 'AAAAAAA',
      address: 'AAAAAAA',
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

    it('should create a BankBranch', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new BankBranch()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a BankBranch', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          ifsc: 'BBBBBB',
          address: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a BankBranch', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          address: 'BBBBBB',
        },
        new BankBranch()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of BankBranch', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          ifsc: 'BBBBBB',
          address: 'BBBBBB',
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

    it('should delete a BankBranch', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addBankBranchToCollectionIfMissing', () => {
      it('should add a BankBranch to an empty array', () => {
        const bankBranch: IBankBranch = { id: 123 };
        expectedResult = service.addBankBranchToCollectionIfMissing([], bankBranch);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bankBranch);
      });

      it('should not add a BankBranch to an array that contains it', () => {
        const bankBranch: IBankBranch = { id: 123 };
        const bankBranchCollection: IBankBranch[] = [
          {
            ...bankBranch,
          },
          { id: 456 },
        ];
        expectedResult = service.addBankBranchToCollectionIfMissing(bankBranchCollection, bankBranch);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a BankBranch to an array that doesn't contain it", () => {
        const bankBranch: IBankBranch = { id: 123 };
        const bankBranchCollection: IBankBranch[] = [{ id: 456 }];
        expectedResult = service.addBankBranchToCollectionIfMissing(bankBranchCollection, bankBranch);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bankBranch);
      });

      it('should add only unique BankBranch to an array', () => {
        const bankBranchArray: IBankBranch[] = [{ id: 123 }, { id: 456 }, { id: 42698 }];
        const bankBranchCollection: IBankBranch[] = [{ id: 123 }];
        expectedResult = service.addBankBranchToCollectionIfMissing(bankBranchCollection, ...bankBranchArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const bankBranch: IBankBranch = { id: 123 };
        const bankBranch2: IBankBranch = { id: 456 };
        expectedResult = service.addBankBranchToCollectionIfMissing([], bankBranch, bankBranch2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(bankBranch);
        expect(expectedResult).toContain(bankBranch2);
      });

      it('should accept null and undefined values', () => {
        const bankBranch: IBankBranch = { id: 123 };
        expectedResult = service.addBankBranchToCollectionIfMissing([], null, bankBranch, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(bankBranch);
      });

      it('should return initial array if no BankBranch is added', () => {
        const bankBranchCollection: IBankBranch[] = [{ id: 123 }];
        expectedResult = service.addBankBranchToCollectionIfMissing(bankBranchCollection, undefined, null);
        expect(expectedResult).toEqual(bankBranchCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
