import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILandType, LandType } from '../land-type.model';

import { LandTypeService } from './land-type.service';

describe('LandType Service', () => {
  let service: LandTypeService;
  let httpMock: HttpTestingController;
  let elemDefault: ILandType;
  let expectedResult: ILandType | ILandType[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LandTypeService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      description: 'AAAAAAA',
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

    it('should create a LandType', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new LandType()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LandType', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LandType', () => {
      const patchObject = Object.assign({}, new LandType());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LandType', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          description: 'BBBBBB',
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

    it('should delete a LandType', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLandTypeToCollectionIfMissing', () => {
      it('should add a LandType to an empty array', () => {
        const landType: ILandType = { id: 123 };
        expectedResult = service.addLandTypeToCollectionIfMissing([], landType);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(landType);
      });

      it('should not add a LandType to an array that contains it', () => {
        const landType: ILandType = { id: 123 };
        const landTypeCollection: ILandType[] = [
          {
            ...landType,
          },
          { id: 456 },
        ];
        expectedResult = service.addLandTypeToCollectionIfMissing(landTypeCollection, landType);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LandType to an array that doesn't contain it", () => {
        const landType: ILandType = { id: 123 };
        const landTypeCollection: ILandType[] = [{ id: 456 }];
        expectedResult = service.addLandTypeToCollectionIfMissing(landTypeCollection, landType);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(landType);
      });

      it('should add only unique LandType to an array', () => {
        const landTypeArray: ILandType[] = [{ id: 123 }, { id: 456 }, { id: 70411 }];
        const landTypeCollection: ILandType[] = [{ id: 123 }];
        expectedResult = service.addLandTypeToCollectionIfMissing(landTypeCollection, ...landTypeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const landType: ILandType = { id: 123 };
        const landType2: ILandType = { id: 456 };
        expectedResult = service.addLandTypeToCollectionIfMissing([], landType, landType2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(landType);
        expect(expectedResult).toContain(landType2);
      });

      it('should accept null and undefined values', () => {
        const landType: ILandType = { id: 123 };
        expectedResult = service.addLandTypeToCollectionIfMissing([], null, landType, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(landType);
      });

      it('should return initial array if no LandType is added', () => {
        const landTypeCollection: ILandType[] = [{ id: 123 }];
        expectedResult = service.addLandTypeToCollectionIfMissing(landTypeCollection, undefined, null);
        expect(expectedResult).toEqual(landTypeCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
