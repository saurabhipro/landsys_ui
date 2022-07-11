import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { HissaType } from 'app/entities/enumerations/hissa-type.model';
import { SurveyStatus } from 'app/entities/enumerations/survey-status.model';
import { ISurvey, Survey } from '../survey.model';

import { SurveyService } from './survey.service';

describe('Survey Service', () => {
  let service: SurveyService;
  let httpMock: HttpTestingController;
  let elemDefault: ISurvey;
  let expectedResult: ISurvey | ISurvey[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SurveyService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      surveyor: 'AAAAAAA',
      hissaType: HissaType.SINGLE_OWNER,
      sharePercentage: 0,
      area: 0,
      landMarketValue: 0,
      structuralValue: 0,
      horticultureValue: 0,
      forestValue: 0,
      distanceFromCity: 0,
      remarks: 'AAAAAAA',
      status: SurveyStatus.OPEN,
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

    it('should create a Survey', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Survey()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Survey', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          surveyor: 'BBBBBB',
          hissaType: 'BBBBBB',
          sharePercentage: 1,
          area: 1,
          landMarketValue: 1,
          structuralValue: 1,
          horticultureValue: 1,
          forestValue: 1,
          distanceFromCity: 1,
          remarks: 'BBBBBB',
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

    it('should partial update a Survey', () => {
      const patchObject = Object.assign(
        {
          hissaType: 'BBBBBB',
          sharePercentage: 1,
          horticultureValue: 1,
          distanceFromCity: 1,
          remarks: 'BBBBBB',
          status: 'BBBBBB',
        },
        new Survey()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Survey', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          surveyor: 'BBBBBB',
          hissaType: 'BBBBBB',
          sharePercentage: 1,
          area: 1,
          landMarketValue: 1,
          structuralValue: 1,
          horticultureValue: 1,
          forestValue: 1,
          distanceFromCity: 1,
          remarks: 'BBBBBB',
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

    it('should delete a Survey', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addSurveyToCollectionIfMissing', () => {
      it('should add a Survey to an empty array', () => {
        const survey: ISurvey = { id: 123 };
        expectedResult = service.addSurveyToCollectionIfMissing([], survey);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(survey);
      });

      it('should not add a Survey to an array that contains it', () => {
        const survey: ISurvey = { id: 123 };
        const surveyCollection: ISurvey[] = [
          {
            ...survey,
          },
          { id: 456 },
        ];
        expectedResult = service.addSurveyToCollectionIfMissing(surveyCollection, survey);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Survey to an array that doesn't contain it", () => {
        const survey: ISurvey = { id: 123 };
        const surveyCollection: ISurvey[] = [{ id: 456 }];
        expectedResult = service.addSurveyToCollectionIfMissing(surveyCollection, survey);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(survey);
      });

      it('should add only unique Survey to an array', () => {
        const surveyArray: ISurvey[] = [{ id: 123 }, { id: 456 }, { id: 83995 }];
        const surveyCollection: ISurvey[] = [{ id: 123 }];
        expectedResult = service.addSurveyToCollectionIfMissing(surveyCollection, ...surveyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const survey: ISurvey = { id: 123 };
        const survey2: ISurvey = { id: 456 };
        expectedResult = service.addSurveyToCollectionIfMissing([], survey, survey2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(survey);
        expect(expectedResult).toContain(survey2);
      });

      it('should accept null and undefined values', () => {
        const survey: ISurvey = { id: 123 };
        expectedResult = service.addSurveyToCollectionIfMissing([], null, survey, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(survey);
      });

      it('should return initial array if no Survey is added', () => {
        const surveyCollection: ISurvey[] = [{ id: 123 }];
        expectedResult = service.addSurveyToCollectionIfMissing(surveyCollection, undefined, null);
        expect(expectedResult).toEqual(surveyCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
