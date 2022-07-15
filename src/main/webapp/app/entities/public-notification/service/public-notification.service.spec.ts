import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IPublicNotification, PublicNotification } from '../public-notification.model';

import { PublicNotificationService } from './public-notification.service';

describe('PublicNotification Service', () => {
  let service: PublicNotificationService;
  let httpMock: HttpTestingController;
  let elemDefault: IPublicNotification;
  let expectedResult: IPublicNotification | IPublicNotification[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PublicNotificationService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      date: currentDate,
      fileContentType: 'image/png',
      file: 'AAAAAAA',
      description: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a PublicNotification', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          date: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.create(new PublicNotification()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PublicNotification', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_FORMAT),
          file: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PublicNotification', () => {
      const patchObject = Object.assign({}, new PublicNotification());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PublicNotification', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          date: currentDate.format(DATE_FORMAT),
          file: 'BBBBBB',
          description: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          date: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a PublicNotification', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addPublicNotificationToCollectionIfMissing', () => {
      it('should add a PublicNotification to an empty array', () => {
        const publicNotification: IPublicNotification = { id: 123 };
        expectedResult = service.addPublicNotificationToCollectionIfMissing([], publicNotification);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(publicNotification);
      });

      it('should not add a PublicNotification to an array that contains it', () => {
        const publicNotification: IPublicNotification = { id: 123 };
        const publicNotificationCollection: IPublicNotification[] = [
          {
            ...publicNotification,
          },
          { id: 456 },
        ];
        expectedResult = service.addPublicNotificationToCollectionIfMissing(publicNotificationCollection, publicNotification);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PublicNotification to an array that doesn't contain it", () => {
        const publicNotification: IPublicNotification = { id: 123 };
        const publicNotificationCollection: IPublicNotification[] = [{ id: 456 }];
        expectedResult = service.addPublicNotificationToCollectionIfMissing(publicNotificationCollection, publicNotification);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(publicNotification);
      });

      it('should add only unique PublicNotification to an array', () => {
        const publicNotificationArray: IPublicNotification[] = [{ id: 123 }, { id: 456 }, { id: 54875 }];
        const publicNotificationCollection: IPublicNotification[] = [{ id: 123 }];
        expectedResult = service.addPublicNotificationToCollectionIfMissing(publicNotificationCollection, ...publicNotificationArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const publicNotification: IPublicNotification = { id: 123 };
        const publicNotification2: IPublicNotification = { id: 456 };
        expectedResult = service.addPublicNotificationToCollectionIfMissing([], publicNotification, publicNotification2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(publicNotification);
        expect(expectedResult).toContain(publicNotification2);
      });

      it('should accept null and undefined values', () => {
        const publicNotification: IPublicNotification = { id: 123 };
        expectedResult = service.addPublicNotificationToCollectionIfMissing([], null, publicNotification, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(publicNotification);
      });

      it('should return initial array if no PublicNotification is added', () => {
        const publicNotificationCollection: IPublicNotification[] = [{ id: 123 }];
        expectedResult = service.addPublicNotificationToCollectionIfMissing(publicNotificationCollection, undefined, null);
        expect(expectedResult).toEqual(publicNotificationCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
