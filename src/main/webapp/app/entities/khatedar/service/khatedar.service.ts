import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IKhatedar, getKhatedarIdentifier } from '../khatedar.model';
import { Project } from 'app/entities/project/project.model';

export type EntityResponseType = HttpResponse<IKhatedar>;
export type EntityArrayResponseType = HttpResponse<IKhatedar[]>;

@Injectable({ providedIn: 'root' })
export class KhatedarService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/khatedars');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(khatedar: IKhatedar): Observable<EntityResponseType> {
    return this.http.post<IKhatedar>(this.resourceUrl, khatedar, { observe: 'response' });
  }

  update(khatedar: IKhatedar): Observable<EntityResponseType> {
    return this.http.put<IKhatedar>(`${this.resourceUrl}/${getKhatedarIdentifier(khatedar) as number}`, khatedar, { observe: 'response' });
  }

  partialUpdate(khatedar: IKhatedar): Observable<EntityResponseType> {
    return this.http.patch<IKhatedar>(`${this.resourceUrl}/${getKhatedarIdentifier(khatedar) as number}`, khatedar, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IKhatedar>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IKhatedar[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addKhatedarToCollectionIfMissing(khatedarCollection: IKhatedar[], ...khatedarsToCheck: (IKhatedar | null | undefined)[]): IKhatedar[] {
    const khatedars: IKhatedar[] = khatedarsToCheck.filter(isPresent);
    if (khatedars.length > 0) {
      const khatedarCollectionIdentifiers = khatedarCollection.map(khatedarItem => getKhatedarIdentifier(khatedarItem)!);
      const khatedarsToAdd = khatedars.filter(khatedarItem => {
        const khatedarIdentifier = getKhatedarIdentifier(khatedarItem);
        if (khatedarIdentifier == null || khatedarCollectionIdentifiers.includes(khatedarIdentifier)) {
          return false;
        }
        khatedarCollectionIdentifiers.push(khatedarIdentifier);
        return true;
      });
      return [...khatedarsToAdd, ...khatedarCollection];
    }
    return khatedarCollection;
  }

  downloadTemplate(): Observable<Blob> {
    return this.http.get(`${this.resourceUrl}/downloadTemplate`, { responseType: 'blob' });
  }

  downloadCSV(): Observable<Blob> {
    return this.http.get(`${this.resourceUrl}/downloadTemplate2`, { responseType: 'blob' });
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    const req = new HttpRequest('POST', `${this.resourceUrl}/upload`, formData, {
      reportProgress: true,
      responseType: 'blob',
    });
    return this.http.request(req);
  }

  filter(filterBy: string, filterString: string, contextProject: Project): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const url = '/api/searchCitizen/projectId/' + contextProject.id + '/' + filterBy + '/' + filterString;
    // eslint-disable-next-line no-console
    console.log(url);
    return this.http.get(url);
  }
}
