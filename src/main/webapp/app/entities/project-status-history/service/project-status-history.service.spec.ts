import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ProjectStatus } from 'app/entities/enumerations/project-status.model';
import { IProjectStatusHistory, ProjectStatusHistory } from '../project-status-history.model';

import { ProjectStatusHistoryService } from './project-status-history.service';

describe('ProjectStatusHistory Service', () => {
  let service: ProjectStatusHistoryService;
  let httpMock: HttpTestingController;
  let elemDefault: IProjectStatusHistory;
  let expectedResult: IProjectStatusHistory | IProjectStatusHistory[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProjectStatusHistoryService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      status: ProjectStatus.NEW,
      when: currentDate,
      remarks: 'AAAAAAA',
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          when: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a ProjectStatusHistory', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          when: currentDate.format(DATE_TIME_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          when: currentDate,
        },
        returnedFromService
      );

      service.create(new ProjectStatusHistory()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProjectStatusHistory', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          status: 'BBBBBB',
          when: currentDate.format(DATE_TIME_FORMAT),
          remarks: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          when: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProjectStatusHistory', () => {
      const patchObject = Object.assign(
        {
          when: currentDate.format(DATE_TIME_FORMAT),
          remarks: 'BBBBBB',
        },
        new ProjectStatusHistory()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          when: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProjectStatusHistory', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          status: 'BBBBBB',
          when: currentDate.format(DATE_TIME_FORMAT),
          remarks: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          when: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a ProjectStatusHistory', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProjectStatusHistoryToCollectionIfMissing', () => {
      it('should add a ProjectStatusHistory to an empty array', () => {
        const projectStatusHistory: IProjectStatusHistory = { id: 123 };
        expectedResult = service.addProjectStatusHistoryToCollectionIfMissing([], projectStatusHistory);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(projectStatusHistory);
      });

      it('should not add a ProjectStatusHistory to an array that contains it', () => {
        const projectStatusHistory: IProjectStatusHistory = { id: 123 };
        const projectStatusHistoryCollection: IProjectStatusHistory[] = [
          {
            ...projectStatusHistory,
          },
          { id: 456 },
        ];
        expectedResult = service.addProjectStatusHistoryToCollectionIfMissing(projectStatusHistoryCollection, projectStatusHistory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProjectStatusHistory to an array that doesn't contain it", () => {
        const projectStatusHistory: IProjectStatusHistory = { id: 123 };
        const projectStatusHistoryCollection: IProjectStatusHistory[] = [{ id: 456 }];
        expectedResult = service.addProjectStatusHistoryToCollectionIfMissing(projectStatusHistoryCollection, projectStatusHistory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(projectStatusHistory);
      });

      it('should add only unique ProjectStatusHistory to an array', () => {
        const projectStatusHistoryArray: IProjectStatusHistory[] = [{ id: 123 }, { id: 456 }, { id: 48141 }];
        const projectStatusHistoryCollection: IProjectStatusHistory[] = [{ id: 123 }];
        expectedResult = service.addProjectStatusHistoryToCollectionIfMissing(projectStatusHistoryCollection, ...projectStatusHistoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const projectStatusHistory: IProjectStatusHistory = { id: 123 };
        const projectStatusHistory2: IProjectStatusHistory = { id: 456 };
        expectedResult = service.addProjectStatusHistoryToCollectionIfMissing([], projectStatusHistory, projectStatusHistory2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(projectStatusHistory);
        expect(expectedResult).toContain(projectStatusHistory2);
      });

      it('should accept null and undefined values', () => {
        const projectStatusHistory: IProjectStatusHistory = { id: 123 };
        expectedResult = service.addProjectStatusHistoryToCollectionIfMissing([], null, projectStatusHistory, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(projectStatusHistory);
      });

      it('should return initial array if no ProjectStatusHistory is added', () => {
        const projectStatusHistoryCollection: IProjectStatusHistory[] = [{ id: 123 }];
        expectedResult = service.addProjectStatusHistoryToCollectionIfMissing(projectStatusHistoryCollection, undefined, null);
        expect(expectedResult).toEqual(projectStatusHistoryCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
