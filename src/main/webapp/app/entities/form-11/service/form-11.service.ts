import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IForm11, getForm11Identifier } from '../form-11.model';

export type EntityResponseType = HttpResponse<IForm11>;
export type EntityArrayResponseType = HttpResponse<IForm11[]>;

@Injectable({ providedIn: 'root' })
export class Form11Service {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/form-11-s');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(form11: IForm11): Observable<EntityResponseType> {
    return this.http.post<IForm11>(this.resourceUrl, form11, { observe: 'response' });
  }

  update(form11: IForm11): Observable<EntityResponseType> {
    return this.http.put<IForm11>(`${this.resourceUrl}/${getForm11Identifier(form11) as number}`, form11, { observe: 'response' });
  }

  partialUpdate(form11: IForm11): Observable<EntityResponseType> {
    return this.http.patch<IForm11>(`${this.resourceUrl}/${getForm11Identifier(form11) as number}`, form11, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IForm11>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IForm11[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addForm11ToCollectionIfMissing(form11Collection: IForm11[], ...form11sToCheck: (IForm11 | null | undefined)[]): IForm11[] {
    const form11s: IForm11[] = form11sToCheck.filter(isPresent);
    if (form11s.length > 0) {
      const form11CollectionIdentifiers = form11Collection.map(form11Item => getForm11Identifier(form11Item)!);
      const form11sToAdd = form11s.filter(form11Item => {
        const form11Identifier = getForm11Identifier(form11Item);
        if (form11Identifier == null || form11CollectionIdentifiers.includes(form11Identifier)) {
          return false;
        }
        form11CollectionIdentifiers.push(form11Identifier);
        return true;
      });
      return [...form11sToAdd, ...form11Collection];
    }
    return form11Collection;
  }
 
  downloadForm11(form11: IForm11): Observable<Blob> {
    const url =  this.applicationConfigService.getEndpointFor('api/form11/download');
    return this.http.post(url, form11, { responseType: 'blob' });
  }

}
