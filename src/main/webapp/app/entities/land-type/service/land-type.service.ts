import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILandType, getLandTypeIdentifier } from '../land-type.model';

export type EntityResponseType = HttpResponse<ILandType>;
export type EntityArrayResponseType = HttpResponse<ILandType[]>;

@Injectable({ providedIn: 'root' })
export class LandTypeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/land-types');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(landType: ILandType): Observable<EntityResponseType> {
    return this.http.post<ILandType>(this.resourceUrl, landType, { observe: 'response' });
  }

  update(landType: ILandType): Observable<EntityResponseType> {
    return this.http.put<ILandType>(`${this.resourceUrl}/${getLandTypeIdentifier(landType) as number}`, landType, { observe: 'response' });
  }

  partialUpdate(landType: ILandType): Observable<EntityResponseType> {
    return this.http.patch<ILandType>(`${this.resourceUrl}/${getLandTypeIdentifier(landType) as number}`, landType, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILandType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILandType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLandTypeToCollectionIfMissing(landTypeCollection: ILandType[], ...landTypesToCheck: (ILandType | null | undefined)[]): ILandType[] {
    const landTypes: ILandType[] = landTypesToCheck.filter(isPresent);
    if (landTypes.length > 0) {
      const landTypeCollectionIdentifiers = landTypeCollection.map(landTypeItem => getLandTypeIdentifier(landTypeItem)!);
      const landTypesToAdd = landTypes.filter(landTypeItem => {
        const landTypeIdentifier = getLandTypeIdentifier(landTypeItem);
        if (landTypeIdentifier == null || landTypeCollectionIdentifiers.includes(landTypeIdentifier)) {
          return false;
        }
        landTypeCollectionIdentifiers.push(landTypeIdentifier);
        return true;
      });
      return [...landTypesToAdd, ...landTypeCollection];
    }
    return landTypeCollection;
  }
}
