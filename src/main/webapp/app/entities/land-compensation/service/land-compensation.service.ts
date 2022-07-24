import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILandCompensation, getLandCompensationIdentifier } from '../land-compensation.model';
import { ISurvey } from '../../survey/survey.model';

export type EntityResponseType = HttpResponse<ILandCompensation>;
export type EntityArrayResponseType = HttpResponse<ILandCompensation[]>;

@Injectable({ providedIn: 'root' })
export class LandCompensationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/land-compensations');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(landCompensation: ILandCompensation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(landCompensation);
    return this.http
      .post<ILandCompensation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(landCompensation: ILandCompensation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(landCompensation);
    return this.http
      .put<ILandCompensation>(`${this.resourceUrl}/${getLandCompensationIdentifier(landCompensation) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(landCompensation: ILandCompensation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(landCompensation);
    return this.http
      .patch<ILandCompensation>(`${this.resourceUrl}/${getLandCompensationIdentifier(landCompensation) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ILandCompensation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ILandCompensation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLandCompensationToCollectionIfMissing(
    landCompensationCollection: ILandCompensation[],
    ...landCompensationsToCheck: (ILandCompensation | null | undefined)[]
  ): ILandCompensation[] {
    const landCompensations: ILandCompensation[] = landCompensationsToCheck.filter(isPresent);
    if (landCompensations.length > 0) {
      const landCompensationCollectionIdentifiers = landCompensationCollection.map(
        landCompensationItem => getLandCompensationIdentifier(landCompensationItem)!
      );
      const landCompensationsToAdd = landCompensations.filter(landCompensationItem => {
        const landCompensationIdentifier = getLandCompensationIdentifier(landCompensationItem);
        if (landCompensationIdentifier == null || landCompensationCollectionIdentifiers.includes(landCompensationIdentifier)) {
          return false;
        }
        landCompensationCollectionIdentifiers.push(landCompensationIdentifier);
        return true;
      });
      return [...landCompensationsToAdd, ...landCompensationCollection];
    }
    return landCompensationCollection;
  }

  getCompensationFromSurveyId(id: number): Observable<HttpResponse<ILandCompensation>> {
    return this.http.get<ILandCompensation>(`/api/land-compensations?surveyId.equals=${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(landCompensation: ILandCompensation): ILandCompensation {
    return Object.assign({}, landCompensation, {
      orderDate: landCompensation.orderDate?.isValid() ? landCompensation.orderDate.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.orderDate = res.body.orderDate ? dayjs(res.body.orderDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((landCompensation: ILandCompensation) => {
        landCompensation.orderDate = landCompensation.orderDate ? dayjs(landCompensation.orderDate) : undefined;
      });
    }
    return res;
  }
}
