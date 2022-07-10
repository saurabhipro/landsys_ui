import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISubDistrict, SubDistrict } from '../sub-district.model';

import { SubDistrictService } from './sub-district.service';

describe('SubDistrict Service', () => {
  let service: SubDistrictService;
  let httpMock: HttpTestingController;
  let elemDefault: ISubDistrict;
  let expectedResult: ISubDistrict | ISubDistrict[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SubDistrictService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
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

    it('should create a SubDistrict', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SubDistrict()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SubDistrict', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SubDistrict', () => {
      const patchObject = Object.assign({}, new SubDistrict());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SubDistrict', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
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

    it('should delete a SubDistrict', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSubDistrictToCollectionIfMissing', () => {
      it('should add a SubDistrict to an empty array', () => {
        const subDistrict: ISubDistrict = { id: 123 };
        expectedResult = service.addSubDistrictToCollectionIfMissing([], subDistrict);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(subDistrict);
      });

      it('should not add a SubDistrict to an array that contains it', () => {
        const subDistrict: ISubDistrict = { id: 123 };
        const subDistrictCollection: ISubDistrict[] = [
          {
            ...subDistrict,
          },
          { id: 456 },
        ];
        expectedResult = service.addSubDistrictToCollectionIfMissing(subDistrictCollection, subDistrict);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SubDistrict to an array that doesn't contain it", () => {
        const subDistrict: ISubDistrict = { id: 123 };
        const subDistrictCollection: ISubDistrict[] = [{ id: 456 }];
        expectedResult = service.addSubDistrictToCollectionIfMissing(subDistrictCollection, subDistrict);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(subDistrict);
      });

      it('should add only unique SubDistrict to an array', () => {
        const subDistrictArray: ISubDistrict[] = [{ id: 123 }, { id: 456 }, { id: 74479 }];
        const subDistrictCollection: ISubDistrict[] = [{ id: 123 }];
        expectedResult = service.addSubDistrictToCollectionIfMissing(subDistrictCollection, ...subDistrictArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const subDistrict: ISubDistrict = { id: 123 };
        const subDistrict2: ISubDistrict = { id: 456 };
        expectedResult = service.addSubDistrictToCollectionIfMissing([], subDistrict, subDistrict2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(subDistrict);
        expect(expectedResult).toContain(subDistrict2);
      });

      it('should accept null and undefined values', () => {
        const subDistrict: ISubDistrict = { id: 123 };
        expectedResult = service.addSubDistrictToCollectionIfMissing([], null, subDistrict, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(subDistrict);
      });

      it('should return initial array if no SubDistrict is added', () => {
        const subDistrictCollection: ISubDistrict[] = [{ id: 123 }];
        expectedResult = service.addSubDistrictToCollectionIfMissing(subDistrictCollection, undefined, null);
        expect(expectedResult).toEqual(subDistrictCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
