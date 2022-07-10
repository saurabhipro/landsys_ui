import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILand, getLandIdentifier } from '../land.model';

export type EntityResponseType = HttpResponse<ILand>;
export type EntityArrayResponseType = HttpResponse<ILand[]>;

@Injectable({ providedIn: 'root' })
export class LandService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/lands');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(land: ILand): Observable<EntityResponseType> {
    return this.http.post<ILand>(this.resourceUrl, land, { observe: 'response' });
  }

  update(land: ILand): Observable<EntityResponseType> {
    return this.http.put<ILand>(`${this.resourceUrl}/${getLandIdentifier(land) as number}`, land, { observe: 'response' });
  }

  partialUpdate(land: ILand): Observable<EntityResponseType> {
    return this.http.patch<ILand>(`${this.resourceUrl}/${getLandIdentifier(land) as number}`, land, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILand>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILand[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLandToCollectionIfMissing(landCollection: ILand[], ...landsToCheck: (ILand | null | undefined)[]): ILand[] {
    const lands: ILand[] = landsToCheck.filter(isPresent);
    if (lands.length > 0) {
      const landCollectionIdentifiers = landCollection.map(landItem => getLandIdentifier(landItem)!);
      const landsToAdd = lands.filter(landItem => {
        const landIdentifier = getLandIdentifier(landItem);
        if (landIdentifier == null || landCollectionIdentifiers.includes(landIdentifier)) {
          return false;
        }
        landCollectionIdentifiers.push(landIdentifier);
        return true;
      });
      return [...landsToAdd, ...landCollection];
    }
    return landCollection;
  }
}
