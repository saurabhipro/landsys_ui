import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISurvey, getSurveyIdentifier } from '../survey.model';

export type EntityResponseType = HttpResponse<ISurvey>;
export type EntityArrayResponseType = HttpResponse<ISurvey[]>;

@Injectable({ providedIn: 'root' })
export class SurveyService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/surveys');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(survey: ISurvey): Observable<EntityResponseType> {
    return this.http.post<ISurvey>(this.resourceUrl, survey, { observe: 'response' });
  }

  update(survey: ISurvey): Observable<EntityResponseType> {
    return this.http.put<ISurvey>(`${this.resourceUrl}/${getSurveyIdentifier(survey) as number}`, survey, { observe: 'response' });
  }

  partialUpdate(survey: ISurvey): Observable<EntityResponseType> {
    return this.http.patch<ISurvey>(`${this.resourceUrl}/${getSurveyIdentifier(survey) as number}`, survey, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISurvey>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISurvey[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSurveyToCollectionIfMissing(surveyCollection: ISurvey[], ...surveysToCheck: (ISurvey | null | undefined)[]): ISurvey[] {
    const surveys: ISurvey[] = surveysToCheck.filter(isPresent);
    if (surveys.length > 0) {
      const surveyCollectionIdentifiers = surveyCollection.map(surveyItem => getSurveyIdentifier(surveyItem)!);
      const surveysToAdd = surveys.filter(surveyItem => {
        const surveyIdentifier = getSurveyIdentifier(surveyItem);
        if (surveyIdentifier == null || surveyCollectionIdentifiers.includes(surveyIdentifier)) {
          return false;
        }
        surveyCollectionIdentifiers.push(surveyIdentifier);
        return true;
      });
      return [...surveysToAdd, ...surveyCollection];
    }
    return surveyCollection;
  }
}
