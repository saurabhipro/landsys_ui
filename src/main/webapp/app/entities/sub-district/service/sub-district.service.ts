import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISubDistrict, getSubDistrictIdentifier } from '../sub-district.model';

export type EntityResponseType = HttpResponse<ISubDistrict>;
export type EntityArrayResponseType = HttpResponse<ISubDistrict[]>;

@Injectable({ providedIn: 'root' })
export class SubDistrictService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/sub-districts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(subDistrict: ISubDistrict): Observable<EntityResponseType> {
    return this.http.post<ISubDistrict>(this.resourceUrl, subDistrict, { observe: 'response' });
  }

  update(subDistrict: ISubDistrict): Observable<EntityResponseType> {
    return this.http.put<ISubDistrict>(`${this.resourceUrl}/${getSubDistrictIdentifier(subDistrict) as number}`, subDistrict, {
      observe: 'response',
    });
  }

  partialUpdate(subDistrict: ISubDistrict): Observable<EntityResponseType> {
    return this.http.patch<ISubDistrict>(`${this.resourceUrl}/${getSubDistrictIdentifier(subDistrict) as number}`, subDistrict, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISubDistrict>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISubDistrict[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSubDistrictToCollectionIfMissing(
    subDistrictCollection: ISubDistrict[],
    ...subDistrictsToCheck: (ISubDistrict | null | undefined)[]
  ): ISubDistrict[] {
    const subDistricts: ISubDistrict[] = subDistrictsToCheck.filter(isPresent);
    if (subDistricts.length > 0) {
      const subDistrictCollectionIdentifiers = subDistrictCollection.map(subDistrictItem => getSubDistrictIdentifier(subDistrictItem)!);
      const subDistrictsToAdd = subDistricts.filter(subDistrictItem => {
        const subDistrictIdentifier = getSubDistrictIdentifier(subDistrictItem);
        if (subDistrictIdentifier == null || subDistrictCollectionIdentifiers.includes(subDistrictIdentifier)) {
          return false;
        }
        subDistrictCollectionIdentifiers.push(subDistrictIdentifier);
        return true;
      });
      return [...subDistrictsToAdd, ...subDistrictCollection];
    }
    return subDistrictCollection;
  }
}
