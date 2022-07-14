import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { HissaType } from 'app/entities/enumerations/hissa-type.model';
import { CompensationStatus } from 'app/entities/enumerations/compensation-status.model';
import { ILandCompensation, LandCompensation } from '../land-compensation.model';

import { LandCompensationService } from './land-compensation.service';

describe('LandCompensation Service', () => {
  let service: LandCompensationService;
  let httpMock: HttpTestingController;
  let elemDefault: ILandCompensation;
  let expectedResult: ILandCompensation | ILandCompensation[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LandCompensationService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      hissaType: HissaType.SINGLE_OWNER,
      area: 0,
      landMarketValue: 0,
      structuralCompensation: 0,
      horticultureCompensation: 0,
      forestCompensation: 0,
      solatiumMoney: 0,
      additionalCompensation: 0,
      status: CompensationStatus.OPEN,
      orderDate: currentDate,
      paymentAmount: 0,
      transactionId: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          orderDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a LandCompensation', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          orderDate: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          orderDate: currentDate,
        },
        returnedFromService
      );

      service.create(new LandCompensation()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LandCompensation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          hissaType: 'BBBBBB',
          area: 1,
          landMarketValue: 1,
          structuralCompensation: 1,
          horticultureCompensation: 1,
          forestCompensation: 1,
          solatiumMoney: 1,
          additionalCompensation: 1,
          status: 'BBBBBB',
          orderDate: currentDate.format(DATE_FORMAT),
          paymentAmount: 1,
          transactionId: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          orderDate: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LandCompensation', () => {
      const patchObject = Object.assign(
        {
          hissaType: 'BBBBBB',
          forestCompensation: 1,
          solatiumMoney: 1,
          status: 'BBBBBB',
          orderDate: currentDate.format(DATE_FORMAT),
          paymentAmount: 1,
        },
        new LandCompensation()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          orderDate: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LandCompensation', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          hissaType: 'BBBBBB',
          area: 1,
          landMarketValue: 1,
          structuralCompensation: 1,
          horticultureCompensation: 1,
          forestCompensation: 1,
          solatiumMoney: 1,
          additionalCompensation: 1,
          status: 'BBBBBB',
          orderDate: currentDate.format(DATE_FORMAT),
          paymentAmount: 1,
          transactionId: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          orderDate: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a LandCompensation', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLandCompensationToCollectionIfMissing', () => {
      it('should add a LandCompensation to an empty array', () => {
        const landCompensation: ILandCompensation = { id: 123 };
        expectedResult = service.addLandCompensationToCollectionIfMissing([], landCompensation);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(landCompensation);
      });

      it('should not add a LandCompensation to an array that contains it', () => {
        const landCompensation: ILandCompensation = { id: 123 };
        const landCompensationCollection: ILandCompensation[] = [
          {
            ...landCompensation,
          },
          { id: 456 },
        ];
        expectedResult = service.addLandCompensationToCollectionIfMissing(landCompensationCollection, landCompensation);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LandCompensation to an array that doesn't contain it", () => {
        const landCompensation: ILandCompensation = { id: 123 };
        const landCompensationCollection: ILandCompensation[] = [{ id: 456 }];
        expectedResult = service.addLandCompensationToCollectionIfMissing(landCompensationCollection, landCompensation);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(landCompensation);
      });

      it('should add only unique LandCompensation to an array', () => {
        const landCompensationArray: ILandCompensation[] = [{ id: 123 }, { id: 456 }, { id: 46179 }];
        const landCompensationCollection: ILandCompensation[] = [{ id: 123 }];
        expectedResult = service.addLandCompensationToCollectionIfMissing(landCompensationCollection, ...landCompensationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const landCompensation: ILandCompensation = { id: 123 };
        const landCompensation2: ILandCompensation = { id: 456 };
        expectedResult = service.addLandCompensationToCollectionIfMissing([], landCompensation, landCompensation2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(landCompensation);
        expect(expectedResult).toContain(landCompensation2);
      });

      it('should accept null and undefined values', () => {
        const landCompensation: ILandCompensation = { id: 123 };
        expectedResult = service.addLandCompensationToCollectionIfMissing([], null, landCompensation, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(landCompensation);
      });

      it('should return initial array if no LandCompensation is added', () => {
        const landCompensationCollection: ILandCompensation[] = [{ id: 123 }];
        expectedResult = service.addLandCompensationToCollectionIfMissing(landCompensationCollection, undefined, null);
        expect(expectedResult).toEqual(landCompensationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
