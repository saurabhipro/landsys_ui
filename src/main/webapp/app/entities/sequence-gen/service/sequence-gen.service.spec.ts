import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { SequenceType } from 'app/entities/enumerations/sequence-type.model';
import { ISequenceGen, SequenceGen } from '../sequence-gen.model';

import { SequenceGenService } from './sequence-gen.service';

describe('SequenceGen Service', () => {
  let service: SequenceGenService;
  let httpMock: HttpTestingController;
  let elemDefault: ISequenceGen;
  let expectedResult: ISequenceGen | ISequenceGen[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SequenceGenService);
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

    it('should create a SequenceGen', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new SequenceGen()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SequenceGen', () => {
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

    it('should partial update a SequenceGen', () => {
      const patchObject = Object.assign(
        {
          seqType: 'BBBBBB',
        },
        new SequenceGen()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SequenceGen', () => {
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

    it('should delete a SequenceGen', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSequenceGenToCollectionIfMissing', () => {
      it('should add a SequenceGen to an empty array', () => {
        const sequenceGen: ISequenceGen = { id: 123 };
        expectedResult = service.addSequenceGenToCollectionIfMissing([], sequenceGen);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sequenceGen);
      });

      it('should not add a SequenceGen to an array that contains it', () => {
        const sequenceGen: ISequenceGen = { id: 123 };
        const sequenceGenCollection: ISequenceGen[] = [
          {
            ...sequenceGen,
          },
          { id: 456 },
        ];
        expectedResult = service.addSequenceGenToCollectionIfMissing(sequenceGenCollection, sequenceGen);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SequenceGen to an array that doesn't contain it", () => {
        const sequenceGen: ISequenceGen = { id: 123 };
        const sequenceGenCollection: ISequenceGen[] = [{ id: 456 }];
        expectedResult = service.addSequenceGenToCollectionIfMissing(sequenceGenCollection, sequenceGen);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sequenceGen);
      });

      it('should add only unique SequenceGen to an array', () => {
        const sequenceGenArray: ISequenceGen[] = [{ id: 123 }, { id: 456 }, { id: 45179 }];
        const sequenceGenCollection: ISequenceGen[] = [{ id: 123 }];
        expectedResult = service.addSequenceGenToCollectionIfMissing(sequenceGenCollection, ...sequenceGenArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const sequenceGen: ISequenceGen = { id: 123 };
        const sequenceGen2: ISequenceGen = { id: 456 };
        expectedResult = service.addSequenceGenToCollectionIfMissing([], sequenceGen, sequenceGen2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(sequenceGen);
        expect(expectedResult).toContain(sequenceGen2);
      });

      it('should accept null and undefined values', () => {
        const sequenceGen: ISequenceGen = { id: 123 };
        expectedResult = service.addSequenceGenToCollectionIfMissing([], null, sequenceGen, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(sequenceGen);
      });

      it('should return initial array if no SequenceGen is added', () => {
        const sequenceGenCollection: ISequenceGen[] = [{ id: 123 }];
        expectedResult = service.addSequenceGenToCollectionIfMissing(sequenceGenCollection, undefined, null);
        expect(expectedResult).toEqual(sequenceGenCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
