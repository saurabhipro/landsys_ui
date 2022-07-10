import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HissaType } from 'app/entities/enumerations/hissa-type.model';
import { IProjectLand, ProjectLand } from '../project-land.model';

import { ProjectLandService } from './project-land.service';

describe('ProjectLand Service', () => {
  let service: ProjectLandService;
  let httpMock: HttpTestingController;
  let elemDefault: IProjectLand;
  let expectedResult: IProjectLand | IProjectLand[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ProjectLandService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      remarks: 'AAAAAAA',
      documentsContentType: 'image/png',
      documents: 'AAAAAAA',
      hissaType: HissaType.SINGLE_OWNER,
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

    it('should create a ProjectLand', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new ProjectLand()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a ProjectLand', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          remarks: 'BBBBBB',
          documents: 'BBBBBB',
          hissaType: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a ProjectLand', () => {
      const patchObject = Object.assign({}, new ProjectLand());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of ProjectLand', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          remarks: 'BBBBBB',
          documents: 'BBBBBB',
          hissaType: 'BBBBBB',
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

    it('should delete a ProjectLand', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addProjectLandToCollectionIfMissing', () => {
      it('should add a ProjectLand to an empty array', () => {
        const projectLand: IProjectLand = { id: 123 };
        expectedResult = service.addProjectLandToCollectionIfMissing([], projectLand);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(projectLand);
      });

      it('should not add a ProjectLand to an array that contains it', () => {
        const projectLand: IProjectLand = { id: 123 };
        const projectLandCollection: IProjectLand[] = [
          {
            ...projectLand,
          },
          { id: 456 },
        ];
        expectedResult = service.addProjectLandToCollectionIfMissing(projectLandCollection, projectLand);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a ProjectLand to an array that doesn't contain it", () => {
        const projectLand: IProjectLand = { id: 123 };
        const projectLandCollection: IProjectLand[] = [{ id: 456 }];
        expectedResult = service.addProjectLandToCollectionIfMissing(projectLandCollection, projectLand);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(projectLand);
      });

      it('should add only unique ProjectLand to an array', () => {
        const projectLandArray: IProjectLand[] = [{ id: 123 }, { id: 456 }, { id: 81460 }];
        const projectLandCollection: IProjectLand[] = [{ id: 123 }];
        expectedResult = service.addProjectLandToCollectionIfMissing(projectLandCollection, ...projectLandArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const projectLand: IProjectLand = { id: 123 };
        const projectLand2: IProjectLand = { id: 456 };
        expectedResult = service.addProjectLandToCollectionIfMissing([], projectLand, projectLand2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(projectLand);
        expect(expectedResult).toContain(projectLand2);
      });

      it('should accept null and undefined values', () => {
        const projectLand: IProjectLand = { id: 123 };
        expectedResult = service.addProjectLandToCollectionIfMissing([], null, projectLand, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(projectLand);
      });

      it('should return initial array if no ProjectLand is added', () => {
        const projectLandCollection: IProjectLand[] = [{ id: 123 }];
        expectedResult = service.addProjectLandToCollectionIfMissing(projectLandCollection, undefined, null);
        expect(expectedResult).toEqual(projectLandCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
