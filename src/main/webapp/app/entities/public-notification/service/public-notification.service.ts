import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPublicNotification, getPublicNotificationIdentifier } from '../public-notification.model';

export type EntityResponseType = HttpResponse<IPublicNotification>;
export type EntityArrayResponseType = HttpResponse<IPublicNotification[]>;

@Injectable({ providedIn: 'root' })
export class PublicNotificationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/public-notifications');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(publicNotification: IPublicNotification): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(publicNotification);
    return this.http
      .post<IPublicNotification>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(publicNotification: IPublicNotification): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(publicNotification);
    return this.http
      .put<IPublicNotification>(`${this.resourceUrl}/${getPublicNotificationIdentifier(publicNotification) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(publicNotification: IPublicNotification): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(publicNotification);
    return this.http
      .patch<IPublicNotification>(`${this.resourceUrl}/${getPublicNotificationIdentifier(publicNotification) as number}`, copy, {
        observe: 'response',
      })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPublicNotification>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPublicNotification[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPublicNotificationToCollectionIfMissing(
    publicNotificationCollection: IPublicNotification[],
    ...publicNotificationsToCheck: (IPublicNotification | null | undefined)[]
  ): IPublicNotification[] {
    const publicNotifications: IPublicNotification[] = publicNotificationsToCheck.filter(isPresent);
    if (publicNotifications.length > 0) {
      const publicNotificationCollectionIdentifiers = publicNotificationCollection.map(
        publicNotificationItem => getPublicNotificationIdentifier(publicNotificationItem)!
      );
      const publicNotificationsToAdd = publicNotifications.filter(publicNotificationItem => {
        const publicNotificationIdentifier = getPublicNotificationIdentifier(publicNotificationItem);
        if (publicNotificationIdentifier == null || publicNotificationCollectionIdentifiers.includes(publicNotificationIdentifier)) {
          return false;
        }
        publicNotificationCollectionIdentifiers.push(publicNotificationIdentifier);
        return true;
      });
      return [...publicNotificationsToAdd, ...publicNotificationCollection];
    }
    return publicNotificationCollection;
  }

  protected convertDateFromClient(publicNotification: IPublicNotification): IPublicNotification {
    return Object.assign({}, publicNotification, {
      date: publicNotification.date?.isValid() ? publicNotification.date.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((publicNotification: IPublicNotification) => {
        publicNotification.date = publicNotification.date ? dayjs(publicNotification.date) : undefined;
      });
    }
    return res;
  }
}
