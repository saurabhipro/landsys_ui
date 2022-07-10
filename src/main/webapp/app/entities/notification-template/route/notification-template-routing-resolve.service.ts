import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INotificationTemplate, NotificationTemplate } from '../notification-template.model';
import { NotificationTemplateService } from '../service/notification-template.service';

@Injectable({ providedIn: 'root' })
export class NotificationTemplateRoutingResolveService implements Resolve<INotificationTemplate> {
  constructor(protected service: NotificationTemplateService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INotificationTemplate> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((notificationTemplate: HttpResponse<NotificationTemplate>) => {
          if (notificationTemplate.body) {
            return of(notificationTemplate.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new NotificationTemplate());
  }
}
