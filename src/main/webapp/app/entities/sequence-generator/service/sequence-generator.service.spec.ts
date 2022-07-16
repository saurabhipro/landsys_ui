import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SequenceType } from 'app/entities/enumerations/sequence-type.model';
import { ISequenceGenerator, SequenceGenerator } from '../sequence-generator.model';

import { SequenceGeneratorService } from './sequence-generator.service';

describe('SequenceGenerator Service', () => {
  let service: SequenceGeneratorService;
  let httpMock: HttpTestingController;
  let elemDefault: ISequenceGenerator;
  let expectedResult: ISequenceGenerator | ISequenceGenerator[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SequenceGeneratorService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      seqType: SequenceType.SURVEY,
      latestSequence: 0,
      sequenceSuffix: 'AAAAAAA',
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

    it('should create a SequenceGenerator', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SequenceGenerator()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SequenceGenerator', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          seqType: 'BBBBBB',
          latestSequence: 1,
          sequenceSuffix: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SequenceGenerator', () => {
      const patchObject = Object.assign(
        {
          latestSequence: 1,
          sequenceSuffix: 'BBBBBB',
        },
        new SequenceGenerator()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SequenceGenerator', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          seqType: 'BBBBBB',
          latestSequence: 1,
          sequenceSuffix: 'BBBBBB',
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

    it('should delete a SequenceGenerator', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSequenceGeneratorToCollectionIfMissing', () => {
      it('should add a SequenceGenerator to an empty array', () => {
        const sequenceGenerator: ISequenceGenerator = { id: 123 };
        expectedResult = service.addSequenceGeneratorToCollectionIfMissing([], sequenceGenerator);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sequenceGenerator);
      });

      it('should not add a SequenceGenerator to an array that contains it', () => {
        const sequenceGenerator: ISequenceGenerator = { id: 123 };
        const sequenceGeneratorCollection: ISequenceGenerator[] = [
          {
            ...sequenceGenerator,
          },
          { id: 456 },
        ];
        expectedResult = service.addSequenceGeneratorToCollectionIfMissing(sequenceGeneratorCollection, sequenceGenerator);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SequenceGenerator to an array that doesn't contain it", () => {
        const sequenceGenerator: ISequenceGenerator = { id: 123 };
        const sequenceGeneratorCollection: ISequenceGenerator[] = [{ id: 456 }];
        expectedResult = service.addSequenceGeneratorToCollectionIfMissing(sequenceGeneratorCollection, sequenceGenerator);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sequenceGenerator);
      });

      it('should add only unique SequenceGenerator to an array', () => {
        const sequenceGeneratorArray: ISequenceGenerator[] = [{ id: 123 }, { id: 456 }, { id: 81403 }];
        const sequenceGeneratorCollection: ISequenceGenerator[] = [{ id: 123 }];
        expectedResult = service.addSequenceGeneratorToCollectionIfMissing(sequenceGeneratorCollection, ...sequenceGeneratorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sequenceGenerator: ISequenceGenerator = { id: 123 };
        const sequenceGenerator2: ISequenceGenerator = { id: 456 };
        expectedResult = service.addSequenceGeneratorToCollectionIfMissing([], sequenceGenerator, sequenceGenerator2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sequenceGenerator);
        expect(expectedResult).toContain(sequenceGenerator2);
      });

      it('should accept null and undefined values', () => {
        const sequenceGenerator: ISequenceGenerator = { id: 123 };
        expectedResult = service.addSequenceGeneratorToCollectionIfMissing([], null, sequenceGenerator, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sequenceGenerator);
      });

      it('should return initial array if no SequenceGenerator is added', () => {
        const sequenceGeneratorCollection: ISequenceGenerator[] = [{ id: 123 }];
        expectedResult = service.addSequenceGeneratorToCollectionIfMissing(sequenceGeneratorCollection, undefined, null);
        expect(expectedResult).toEqual(sequenceGeneratorCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
