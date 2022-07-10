import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { INoticeStatus, NoticeStatus } from '../notice-status.model';

import { NoticeStatusService } from './notice-status.service';

describe('NoticeStatus Service', () => {
  let service: NoticeStatusService;
  let httpMock: HttpTestingController;
  let elemDefault: INoticeStatus;
  let expectedResult: INoticeStatus | INoticeStatus[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NoticeStatusService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      status: 'AAAAAAA',
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

    it('should create a NoticeStatus', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new NoticeStatus()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a NoticeStatus', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          status: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a NoticeStatus', () => {
      const patchObject = Object.assign(
        {
          status: 'BBBBBB',
        },
        new NoticeStatus()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of NoticeStatus', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          status: 'BBBBBB',
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

    it('should delete a NoticeStatus', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addNoticeStatusToCollectionIfMissing', () => {
      it('should add a NoticeStatus to an empty array', () => {
        const noticeStatus: INoticeStatus = { id: 123 };
        expectedResult = service.addNoticeStatusToCollectionIfMissing([], noticeStatus);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(noticeStatus);
      });

      it('should not add a NoticeStatus to an array that contains it', () => {
        const noticeStatus: INoticeStatus = { id: 123 };
        const noticeStatusCollection: INoticeStatus[] = [
          {
            ...noticeStatus,
          },
          { id: 456 },
        ];
        expectedResult = service.addNoticeStatusToCollectionIfMissing(noticeStatusCollection, noticeStatus);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a NoticeStatus to an array that doesn't contain it", () => {
        const noticeStatus: INoticeStatus = { id: 123 };
        const noticeStatusCollection: INoticeStatus[] = [{ id: 456 }];
        expectedResult = service.addNoticeStatusToCollectionIfMissing(noticeStatusCollection, noticeStatus);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(noticeStatus);
      });

      it('should add only unique NoticeStatus to an array', () => {
        const noticeStatusArray: INoticeStatus[] = [{ id: 123 }, { id: 456 }, { id: 78185 }];
        const noticeStatusCollection: INoticeStatus[] = [{ id: 123 }];
        expectedResult = service.addNoticeStatusToCollectionIfMissing(noticeStatusCollection, ...noticeStatusArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const noticeStatus: INoticeStatus = { id: 123 };
        const noticeStatus2: INoticeStatus = { id: 456 };
        expectedResult = service.addNoticeStatusToCollectionIfMissing([], noticeStatus, noticeStatus2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(noticeStatus);
        expect(expectedResult).toContain(noticeStatus2);
      });

      it('should accept null and undefined values', () => {
        const noticeStatus: INoticeStatus = { id: 123 };
        expectedResult = service.addNoticeStatusToCollectionIfMissing([], null, noticeStatus, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(noticeStatus);
      });

      it('should return initial array if no NoticeStatus is added', () => {
        const noticeStatusCollection: INoticeStatus[] = [{ id: 123 }];
        expectedResult = service.addNoticeStatusToCollectionIfMissing(noticeStatusCollection, undefined, null);
        expect(expectedResult).toEqual(noticeStatusCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
