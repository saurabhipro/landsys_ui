import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { ICitizen, Citizen } from '../citizen.model';

import { CitizenService } from './citizen.service';

describe('Citizen Service', () => {
  let service: CitizenService;
  let httpMock: HttpTestingController;
  let elemDefault: ICitizen;
  let expectedResult: ICitizen | ICitizen[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CitizenService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      photoContentType: 'image/png',
      photo: 'AAAAAAA',
      name: 'AAAAAAA',
      address: 'AAAAAAA',
      mobileNumber: 'AAAAAAA',
      dob: currentDate,
      accountName: 'AAAAAAA',
      accountNumber: 'AAAAAAA',
      fatherName: 'AAAAAAA',
      spouseName: 'AAAAAAA',
      successorName: 'AAAAAAA',
      aadhar: 'AAAAAAA',
      pan: 'AAAAAAA',
      aadharImageContentType: 'image/png',
      aadharImage: 'AAAAAAA',
      panImageContentType: 'image/png',
      panImage: 'AAAAAAA',
      accountNo: 'AAAAAAA',
      accNoImageContentType: 'image/png',
      accNoImage: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dob: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Citizen', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dob: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dob: currentDate,
        },
        returnedFromService
      );

      service.create(new Citizen()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Citizen', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          photo: 'BBBBBB',
          name: 'BBBBBB',
          address: 'BBBBBB',
          mobileNumber: 'BBBBBB',
          dob: currentDate.format(DATE_FORMAT),
          accountName: 'BBBBBB',
          accountNumber: 'BBBBBB',
          fatherName: 'BBBBBB',
          spouseName: 'BBBBBB',
          successorName: 'BBBBBB',
          aadhar: 'BBBBBB',
          pan: 'BBBBBB',
          aadharImage: 'BBBBBB',
          panImage: 'BBBBBB',
          accountNo: 'BBBBBB',
          accNoImage: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dob: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Citizen', () => {
      const patchObject = Object.assign(
        {
          photo: 'BBBBBB',
          address: 'BBBBBB',
          mobileNumber: 'BBBBBB',
          dob: currentDate.format(DATE_FORMAT),
          fatherName: 'BBBBBB',
          spouseName: 'BBBBBB',
          successorName: 'BBBBBB',
          aadharImage: 'BBBBBB',
          accNoImage: 'BBBBBB',
        },
        new Citizen()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dob: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Citizen', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          photo: 'BBBBBB',
          name: 'BBBBBB',
          address: 'BBBBBB',
          mobileNumber: 'BBBBBB',
          dob: currentDate.format(DATE_FORMAT),
          accountName: 'BBBBBB',
          accountNumber: 'BBBBBB',
          fatherName: 'BBBBBB',
          spouseName: 'BBBBBB',
          successorName: 'BBBBBB',
          aadhar: 'BBBBBB',
          pan: 'BBBBBB',
          aadharImage: 'BBBBBB',
          panImage: 'BBBBBB',
          accountNo: 'BBBBBB',
          accNoImage: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dob: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Citizen', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addCitizenToCollectionIfMissing', () => {
      it('should add a Citizen to an empty array', () => {
        const citizen: ICitizen = { id: 123 };
        expectedResult = service.addCitizenToCollectionIfMissing([], citizen);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(citizen);
      });

      it('should not add a Citizen to an array that contains it', () => {
        const citizen: ICitizen = { id: 123 };
        const citizenCollection: ICitizen[] = [
          {
            ...citizen,
          },
          { id: 456 },
        ];
        expectedResult = service.addCitizenToCollectionIfMissing(citizenCollection, citizen);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Citizen to an array that doesn't contain it", () => {
        const citizen: ICitizen = { id: 123 };
        const citizenCollection: ICitizen[] = [{ id: 456 }];
        expectedResult = service.addCitizenToCollectionIfMissing(citizenCollection, citizen);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(citizen);
      });

      it('should add only unique Citizen to an array', () => {
        const citizenArray: ICitizen[] = [{ id: 123 }, { id: 456 }, { id: 21573 }];
        const citizenCollection: ICitizen[] = [{ id: 123 }];
        expectedResult = service.addCitizenToCollectionIfMissing(citizenCollection, ...citizenArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const citizen: ICitizen = { id: 123 };
        const citizen2: ICitizen = { id: 456 };
        expectedResult = service.addCitizenToCollectionIfMissing([], citizen, citizen2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(citizen);
        expect(expectedResult).toContain(citizen2);
      });

      it('should accept null and undefined values', () => {
        const citizen: ICitizen = { id: 123 };
        expectedResult = service.addCitizenToCollectionIfMissing([], null, citizen, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(citizen);
      });

      it('should return initial array if no Citizen is added', () => {
        const citizenCollection: ICitizen[] = [{ id: 123 }];
        expectedResult = service.addCitizenToCollectionIfMissing(citizenCollection, undefined, null);
        expect(expectedResult).toEqual(citizenCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
