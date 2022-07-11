import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INoticeStatusInfo, getNoticeStatusInfoIdentifier } from '../notice-status-info.model';

export type EntityResponseType = HttpResponse<INoticeStatusInfo>;
export type EntityArrayResponseType = HttpResponse<INoticeStatusInfo[]>;

@Injectable({ providedIn: 'root' })
export class NoticeStatusInfoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/notice-status-infos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(noticeStatusInfo: INoticeStatusInfo): Observable<EntityResponseType> {
    return this.http.post<INoticeStatusInfo>(this.resourceUrl, noticeStatusInfo, { observe: 'response' });
  }

  update(noticeStatusInfo: INoticeStatusInfo): Observable<EntityResponseType> {
    return this.http.put<INoticeStatusInfo>(
      `${this.resourceUrl}/${getNoticeStatusInfoIdentifier(noticeStatusInfo) as number}`,
      noticeStatusInfo,
      { observe: 'response' }
    );
  }

  partialUpdate(noticeStatusInfo: INoticeStatusInfo): Observable<EntityResponseType> {
    return this.http.patch<INoticeStatusInfo>(
      `${this.resourceUrl}/${getNoticeStatusInfoIdentifier(noticeStatusInfo) as number}`,
      noticeStatusInfo,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<INoticeStatusInfo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<INoticeStatusInfo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addNoticeStatusInfoToCollectionIfMissing(
    noticeStatusInfoCollection: INoticeStatusInfo[],
    ...noticeStatusInfosToCheck: (INoticeStatusInfo | null | undefined)[]
  ): INoticeStatusInfo[] {
    const noticeStatusInfos: INoticeStatusInfo[] = noticeStatusInfosToCheck.filter(isPresent);
    if (noticeStatusInfos.length > 0) {
      const noticeStatusInfoCollectionIdentifiers = noticeStatusInfoCollection.map(
        noticeStatusInfoItem => getNoticeStatusInfoIdentifier(noticeStatusInfoItem)!
      );
      const noticeStatusInfosToAdd = noticeStatusInfos.filter(noticeStatusInfoItem => {
        const noticeStatusInfoIdentifier = getNoticeStatusInfoIdentifier(noticeStatusInfoItem);
        if (noticeStatusInfoIdentifier == null || noticeStatusInfoCollectionIdentifiers.includes(noticeStatusInfoIdentifier)) {
          return false;
        }
        noticeStatusInfoCollectionIdentifiers.push(noticeStatusInfoIdentifier);
        return true;
      });
      return [...noticeStatusInfosToAdd, ...noticeStatusInfoCollection];
    }
    return noticeStatusInfoCollection;
  }
}
