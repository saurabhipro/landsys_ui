import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IKhatedar, Khatedar } from '../khatedar.model';

import { KhatedarService } from './khatedar.service';

describe('Khatedar Service', () => {
  let service: KhatedarService;
  let httpMock: HttpTestingController;
  let elemDefault: IKhatedar;
  let expectedResult: IKhatedar | IKhatedar[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(KhatedarService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      caseFileNo: 'AAAAAAA',
      remarks: 'AAAAAAA',
      khatedarStatus: 'AAAAAAA',
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

    it('should create a Khatedar', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Khatedar()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Khatedar', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          caseFileNo: 'BBBBBB',
          remarks: 'BBBBBB',
          khatedarStatus: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Khatedar', () => {
      const patchObject = Object.assign(
        {
          remarks: 'BBBBBB',
          khatedarStatus: 'BBBBBB',
        },
        new Khatedar()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Khatedar', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          caseFileNo: 'BBBBBB',
          remarks: 'BBBBBB',
          khatedarStatus: 'BBBBBB',
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

    it('should delete a Khatedar', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addKhatedarToCollectionIfMissing', () => {
      it('should add a Khatedar to an empty array', () => {
        const khatedar: IKhatedar = { id: 123 };
        expectedResult = service.addKhatedarToCollectionIfMissing([], khatedar);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(khatedar);
      });

      it('should not add a Khatedar to an array that contains it', () => {
        const khatedar: IKhatedar = { id: 123 };
        const khatedarCollection: IKhatedar[] = [
          {
            ...khatedar,
          },
          { id: 456 },
        ];
        expectedResult = service.addKhatedarToCollectionIfMissing(khatedarCollection, khatedar);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Khatedar to an array that doesn't contain it", () => {
        const khatedar: IKhatedar = { id: 123 };
        const khatedarCollection: IKhatedar[] = [{ id: 456 }];
        expectedResult = service.addKhatedarToCollectionIfMissing(khatedarCollection, khatedar);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(khatedar);
      });

      it('should add only unique Khatedar to an array', () => {
        const khatedarArray: IKhatedar[] = [{ id: 123 }, { id: 456 }, { id: 41993 }];
        const khatedarCollection: IKhatedar[] = [{ id: 123 }];
        expectedResult = service.addKhatedarToCollectionIfMissing(khatedarCollection, ...khatedarArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const khatedar: IKhatedar = { id: 123 };
        const khatedar2: IKhatedar = { id: 456 };
        expectedResult = service.addKhatedarToCollectionIfMissing([], khatedar, khatedar2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(khatedar);
        expect(expectedResult).toContain(khatedar2);
      });

      it('should accept null and undefined values', () => {
        const khatedar: IKhatedar = { id: 123 };
        expectedResult = service.addKhatedarToCollectionIfMissing([], null, khatedar, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(khatedar);
      });

      it('should return initial array if no Khatedar is added', () => {
        const khatedarCollection: IKhatedar[] = [{ id: 123 }];
        expectedResult = service.addKhatedarToCollectionIfMissing(khatedarCollection, undefined, null);
        expect(expectedResult).toEqual(khatedarCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
