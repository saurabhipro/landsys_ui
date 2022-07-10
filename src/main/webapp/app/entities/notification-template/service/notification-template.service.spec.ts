import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { INotificationTemplate, NotificationTemplate } from '../notification-template.model';

import { NotificationTemplateService } from './notification-template.service';

describe('NotificationTemplate Service', () => {
  let service: NotificationTemplateService;
  let httpMock: HttpTestingController;
  let elemDefault: INotificationTemplate;
  let expectedResult: INotificationTemplate | INotificationTemplate[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(NotificationTemplateService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      name: 'AAAAAAA',
      templateText: 'AAAAAAA',
      defaultUse: false,
      fileContentType: 'image/png',
      file: 'AAAAAAA',
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

    it('should create a NotificationTemplate', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new NotificationTemplate()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a NotificationTemplate', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          templateText: 'BBBBBB',
          defaultUse: true,
          file: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a NotificationTemplate', () => {
      const patchObject = Object.assign(
        {
          name: 'BBBBBB',
          file: 'BBBBBB',
        },
        new NotificationTemplate()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of NotificationTemplate', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          name: 'BBBBBB',
          templateText: 'BBBBBB',
          defaultUse: true,
          file: 'BBBBBB',
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

    it('should delete a NotificationTemplate', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addNotificationTemplateToCollectionIfMissing', () => {
      it('should add a NotificationTemplate to an empty array', () => {
        const notificationTemplate: INotificationTemplate = { id: 123 };
        expectedResult = service.addNotificationTemplateToCollectionIfMissing([], notificationTemplate);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(notificationTemplate);
      });

      it('should not add a NotificationTemplate to an array that contains it', () => {
        const notificationTemplate: INotificationTemplate = { id: 123 };
        const notificationTemplateCollection: INotificationTemplate[] = [
          {
            ...notificationTemplate,
          },
          { id: 456 },
        ];
        expectedResult = service.addNotificationTemplateToCollectionIfMissing(notificationTemplateCollection, notificationTemplate);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a NotificationTemplate to an array that doesn't contain it", () => {
        const notificationTemplate: INotificationTemplate = { id: 123 };
        const notificationTemplateCollection: INotificationTemplate[] = [{ id: 456 }];
        expectedResult = service.addNotificationTemplateToCollectionIfMissing(notificationTemplateCollection, notificationTemplate);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(notificationTemplate);
      });

      it('should add only unique NotificationTemplate to an array', () => {
        const notificationTemplateArray: INotificationTemplate[] = [{ id: 123 }, { id: 456 }, { id: 93575 }];
        const notificationTemplateCollection: INotificationTemplate[] = [{ id: 123 }];
        expectedResult = service.addNotificationTemplateToCollectionIfMissing(notificationTemplateCollection, ...notificationTemplateArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const notificationTemplate: INotificationTemplate = { id: 123 };
        const notificationTemplate2: INotificationTemplate = { id: 456 };
        expectedResult = service.addNotificationTemplateToCollectionIfMissing([], notificationTemplate, notificationTemplate2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(notificationTemplate);
        expect(expectedResult).toContain(notificationTemplate2);
      });

      it('should accept null and undefined values', () => {
        const notificationTemplate: INotificationTemplate = { id: 123 };
        expectedResult = service.addNotificationTemplateToCollectionIfMissing([], null, notificationTemplate, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(notificationTemplate);
      });

      it('should return initial array if no NotificationTemplate is added', () => {
        const notificationTemplateCollection: INotificationTemplate[] = [{ id: 123 }];
        expectedResult = service.addNotificationTemplateToCollectionIfMissing(notificationTemplateCollection, undefined, null);
        expect(expectedResult).toEqual(notificationTemplateCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
