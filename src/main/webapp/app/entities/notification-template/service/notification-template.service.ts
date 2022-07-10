import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { INotificationTemplate, getNotificationTemplateIdentifier } from '../notification-template.model';

export type EntityResponseType = HttpResponse<INotificationTemplate>;
export type EntityArrayResponseType = HttpResponse<INotificationTemplate[]>;

@Injectable({ providedIn: 'root' })
export class NotificationTemplateService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/notification-templates');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(notificationTemplate: INotificationTemplate): Observable<EntityResponseType> {
    return this.http.post<INotificationTemplate>(this.resourceUrl, notificationTemplate, { observe: 'response' });
  }

  update(notificationTemplate: INotificationTemplate): Observable<EntityResponseType> {
    return this.http.put<INotificationTemplate>(
      `${this.resourceUrl}/${getNotificationTemplateIdentifier(notificationTemplate) as number}`,
      notificationTemplate,
      { observe: 'response' }
    );
  }

  partialUpdate(notificationTemplate: INotificationTemplate): Observable<EntityResponseType> {
    return this.http.patch<INotificationTemplate>(
      `${this.resourceUrl}/${getNotificationTemplateIdentifier(notificationTemplate) as number}`,
      notificationTemplate,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<INotificationTemplate>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<INotificationTemplate[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addNotificationTemplateToCollectionIfMissing(
    notificationTemplateCollection: INotificationTemplate[],
    ...notificationTemplatesToCheck: (INotificationTemplate | null | undefined)[]
  ): INotificationTemplate[] {
    const notificationTemplates: INotificationTemplate[] = notificationTemplatesToCheck.filter(isPresent);
    if (notificationTemplates.length > 0) {
      const notificationTemplateCollectionIdentifiers = notificationTemplateCollection.map(
        notificationTemplateItem => getNotificationTemplateIdentifier(notificationTemplateItem)!
      );
      const notificationTemplatesToAdd = notificationTemplates.filter(notificationTemplateItem => {
        const notificationTemplateIdentifier = getNotificationTemplateIdentifier(notificationTemplateItem);
        if (notificationTemplateIdentifier == null || notificationTemplateCollectionIdentifiers.includes(notificationTemplateIdentifier)) {
          return false;
        }
        notificationTemplateCollectionIdentifiers.push(notificationTemplateIdentifier);
        return true;
      });
      return [...notificationTemplatesToAdd, ...notificationTemplateCollection];
    }
    return notificationTemplateCollection;
  }
}
