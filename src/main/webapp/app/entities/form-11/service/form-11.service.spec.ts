import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IForm11, Form11 } from '../form-11.model';

import { Form11Service } from './form-11.service';

describe('Form11 Service', () => {
  let service: Form11Service;
  let httpMock: HttpTestingController;
  let elemDefault: IForm11;
  let expectedResult: IForm11 | IForm11[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(Form11Service);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      projectName: 'AAAAAAA',
      district: 'AAAAAAA',
      subDistrict: 'AAAAAAA',
      village: 'AAAAAAA',
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

    it('should create a Form11', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Form11()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Form11', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          projectName: 'BBBBBB',
          district: 'BBBBBB',
          subDistrict: 'BBBBBB',
          village: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Form11', () => {
      const patchObject = Object.assign(
        {
          projectName: 'BBBBBB',
          district: 'BBBBBB',
          subDistrict: 'BBBBBB',
        },
        new Form11()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Form11', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          projectName: 'BBBBBB',
          district: 'BBBBBB',
          subDistrict: 'BBBBBB',
          village: 'BBBBBB',
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

    it('should delete a Form11', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addForm11ToCollectionIfMissing', () => {
      it('should add a Form11 to an empty array', () => {
        const form11: IForm11 = { id: 123 };
        expectedResult = service.addForm11ToCollectionIfMissing([], form11);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(form11);
      });

      it('should not add a Form11 to an array that contains it', () => {
        const form11: IForm11 = { id: 123 };
        const form11Collection: IForm11[] = [
          {
            ...form11,
          },
          { id: 456 },
        ];
        expectedResult = service.addForm11ToCollectionIfMissing(form11Collection, form11);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Form11 to an array that doesn't contain it", () => {
        const form11: IForm11 = { id: 123 };
        const form11Collection: IForm11[] = [{ id: 456 }];
        expectedResult = service.addForm11ToCollectionIfMissing(form11Collection, form11);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(form11);
      });

      it('should add only unique Form11 to an array', () => {
        const form11Array: IForm11[] = [{ id: 123 }, { id: 456 }, { id: 67778 }];
        const form11Collection: IForm11[] = [{ id: 123 }];
        expectedResult = service.addForm11ToCollectionIfMissing(form11Collection, ...form11Array);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const form11: IForm11 = { id: 123 };
        const form112: IForm11 = { id: 456 };
        expectedResult = service.addForm11ToCollectionIfMissing([], form11, form112);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(form11);
        expect(expectedResult).toContain(form112);
      });

      it('should accept null and undefined values', () => {
        const form11: IForm11 = { id: 123 };
        expectedResult = service.addForm11ToCollectionIfMissing([], null, form11, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(form11);
      });

      it('should return initial array if no Form11 is added', () => {
        const form11Collection: IForm11[] = [{ id: 123 }];
        expectedResult = service.addForm11ToCollectionIfMissing(form11Collection, undefined, null);
        expect(expectedResult).toEqual(form11Collection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
