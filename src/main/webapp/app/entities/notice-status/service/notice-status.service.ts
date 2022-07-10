import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INoticeStatus, getNoticeStatusIdentifier } from '../notice-status.model';

export type EntityResponseType = HttpResponse<INoticeStatus>;
export type EntityArrayResponseType = HttpResponse<INoticeStatus[]>;

@Injectable({ providedIn: 'root' })
export class NoticeStatusService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/notice-statuses');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(noticeStatus: INoticeStatus): Observable<EntityResponseType> {
    return this.http.post<INoticeStatus>(this.resourceUrl, noticeStatus, { observe: 'response' });
  }

  update(noticeStatus: INoticeStatus): Observable<EntityResponseType> {
    return this.http.put<INoticeStatus>(`${this.resourceUrl}/${getNoticeStatusIdentifier(noticeStatus) as number}`, noticeStatus, {
      observe: 'response',
    });
  }

  partialUpdate(noticeStatus: INoticeStatus): Observable<EntityResponseType> {
    return this.http.patch<INoticeStatus>(`${this.resourceUrl}/${getNoticeStatusIdentifier(noticeStatus) as number}`, noticeStatus, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<INoticeStatus>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<INoticeStatus[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addNoticeStatusToCollectionIfMissing(
    noticeStatusCollection: INoticeStatus[],
    ...noticeStatusesToCheck: (INoticeStatus | null | undefined)[]
  ): INoticeStatus[] {
    const noticeStatuses: INoticeStatus[] = noticeStatusesToCheck.filter(isPresent);
    if (noticeStatuses.length > 0) {
      const noticeStatusCollectionIdentifiers = noticeStatusCollection.map(
        noticeStatusItem => getNoticeStatusIdentifier(noticeStatusItem)!
      );
      const noticeStatusesToAdd = noticeStatuses.filter(noticeStatusItem => {
        const noticeStatusIdentifier = getNoticeStatusIdentifier(noticeStatusItem);
        if (noticeStatusIdentifier == null || noticeStatusCollectionIdentifiers.includes(noticeStatusIdentifier)) {
          return false;
        }
        noticeStatusCollectionIdentifiers.push(noticeStatusIdentifier);
        return true;
      });
      return [...noticeStatusesToAdd, ...noticeStatusCollection];
    }
    return noticeStatusCollection;
  }
}
