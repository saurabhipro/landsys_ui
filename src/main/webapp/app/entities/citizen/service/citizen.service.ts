import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICitizen, getCitizenIdentifier } from '../citizen.model';

export type EntityResponseType = HttpResponse<ICitizen>;
export type EntityArrayResponseType = HttpResponse<ICitizen[]>;

@Injectable({ providedIn: 'root' })
export class CitizenService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/citizens');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(citizen: ICitizen): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(citizen);
    return this.http
      .post<ICitizen>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(citizen: ICitizen): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(citizen);
    return this.http
      .put<ICitizen>(`${this.resourceUrl}/${getCitizenIdentifier(citizen) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(citizen: ICitizen): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(citizen);
    return this.http
      .patch<ICitizen>(`${this.resourceUrl}/${getCitizenIdentifier(citizen) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<ICitizen>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ICitizen[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCitizenToCollectionIfMissing(citizenCollection: ICitizen[], ...citizensToCheck: (ICitizen | null | undefined)[]): ICitizen[] {
    const citizens: ICitizen[] = citizensToCheck.filter(isPresent);
    if (citizens.length > 0) {
      const citizenCollectionIdentifiers = citizenCollection.map(citizenItem => getCitizenIdentifier(citizenItem)!);
      const citizensToAdd = citizens.filter(citizenItem => {
        const citizenIdentifier = getCitizenIdentifier(citizenItem);
        if (citizenIdentifier == null || citizenCollectionIdentifiers.includes(citizenIdentifier)) {
          return false;
        }
        citizenCollectionIdentifiers.push(citizenIdentifier);
        return true;
      });
      return [...citizensToAdd, ...citizenCollection];
    }
    return citizenCollection;
  }

  protected convertDateFromClient(citizen: ICitizen): ICitizen {
    return Object.assign({}, citizen, {
      dob: citizen.dob?.isValid() ? citizen.dob.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dob = res.body.dob ? dayjs(res.body.dob) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((citizen: ICitizen) => {
        citizen.dob = citizen.dob ? dayjs(citizen.dob) : undefined;
      });
    }
    return res;
  }
}
