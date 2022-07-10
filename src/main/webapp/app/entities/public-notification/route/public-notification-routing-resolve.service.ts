import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPublicNotification, PublicNotification } from '../public-notification.model';
import { PublicNotificationService } from '../service/public-notification.service';

@Injectable({ providedIn: 'root' })
export class PublicNotificationRoutingResolveService implements Resolve<IPublicNotification> {
  constructor(protected service: PublicNotificationService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPublicNotification> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((publicNotification: HttpResponse<PublicNotification>) => {
          if (publicNotification.body) {
            return of(publicNotification.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PublicNotification());
  }
}
