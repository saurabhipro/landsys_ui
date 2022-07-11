import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { NoticeStatus } from 'app/entities/enumerations/notice-status.model';
import { INoticeStatusInfo, NoticeStatusInfo } from '../notice-status-info.model';

import { NoticeStatusInfoService } from './notice-status-info.service';

describe('NoticeStatusInfo Service', () => {
  let service: NoticeStatusInfoService;
  let httpMock: HttpTestingController;
  let elemDefault: INoticeStatusInfo;
  let expectedResult: INoticeStatusInfo | INoticeStatusInfo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NoticeStatusInfoService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      status: NoticeStatus.SENT,
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

    it('should create a NoticeStatusInfo', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new NoticeStatusInfo()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a NoticeStatusInfo', () => {
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

    it('should partial update a NoticeStatusInfo', () => {
      const patchObject = Object.assign(
        {
          status: 'BBBBBB',
        },
        new NoticeStatusInfo()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of NoticeStatusInfo', () => {
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

    it('should delete a NoticeStatusInfo', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addNoticeStatusInfoToCollectionIfMissing', () => {
      it('should add a NoticeStatusInfo to an empty array', () => {
        const noticeStatusInfo: INoticeStatusInfo = { id: 123 };
        expectedResult = service.addNoticeStatusInfoToCollectionIfMissing([], noticeStatusInfo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(noticeStatusInfo);
      });

      it('should not add a NoticeStatusInfo to an array that contains it', () => {
        const noticeStatusInfo: INoticeStatusInfo = { id: 123 };
        const noticeStatusInfoCollection: INoticeStatusInfo[] = [
          {
            ...noticeStatusInfo,
          },
          { id: 456 },
        ];
        expectedResult = service.addNoticeStatusInfoToCollectionIfMissing(noticeStatusInfoCollection, noticeStatusInfo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a NoticeStatusInfo to an array that doesn't contain it", () => {
        const noticeStatusInfo: INoticeStatusInfo = { id: 123 };
        const noticeStatusInfoCollection: INoticeStatusInfo[] = [{ id: 456 }];
        expectedResult = service.addNoticeStatusInfoToCollectionIfMissing(noticeStatusInfoCollection, noticeStatusInfo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(noticeStatusInfo);
      });

      it('should add only unique NoticeStatusInfo to an array', () => {
        const noticeStatusInfoArray: INoticeStatusInfo[] = [{ id: 123 }, { id: 456 }, { id: 30605 }];
        const noticeStatusInfoCollection: INoticeStatusInfo[] = [{ id: 123 }];
        expectedResult = service.addNoticeStatusInfoToCollectionIfMissing(noticeStatusInfoCollection, ...noticeStatusInfoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const noticeStatusInfo: INoticeStatusInfo = { id: 123 };
        const noticeStatusInfo2: INoticeStatusInfo = { id: 456 };
        expectedResult = service.addNoticeStatusInfoToCollectionIfMissing([], noticeStatusInfo, noticeStatusInfo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(noticeStatusInfo);
        expect(expectedResult).toContain(noticeStatusInfo2);
      });

      it('should accept null and undefined values', () => {
        const noticeStatusInfo: INoticeStatusInfo = { id: 123 };
        expectedResult = service.addNoticeStatusInfoToCollectionIfMissing([], null, noticeStatusInfo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(noticeStatusInfo);
      });

      it('should return initial array if no NoticeStatusInfo is added', () => {
        const noticeStatusInfoCollection: INoticeStatusInfo[] = [{ id: 123 }];
        expectedResult = service.addNoticeStatusInfoToCollectionIfMissing(noticeStatusInfoCollection, undefined, null);
        expect(expectedResult).toEqual(noticeStatusInfoCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
