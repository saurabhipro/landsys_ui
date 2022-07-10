import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
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
    return this.http.post<ICitizen>(this.resourceUrl, citizen, { observe: 'response' });
  }

  update(citizen: ICitizen): Observable<EntityResponseType> {
    return this.http.put<ICitizen>(`${this.resourceUrl}/${getCitizenIdentifier(citizen) as number}`, citizen, { observe: 'response' });
  }

  partialUpdate(citizen: ICitizen): Observable<EntityResponseType> {
    return this.http.patch<ICitizen>(`${this.resourceUrl}/${getCitizenIdentifier(citizen) as number}`, citizen, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICitizen>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICitizen[]>(this.resourceUrl, { params: options, observe: 'response' });
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
}
