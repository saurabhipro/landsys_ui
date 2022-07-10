import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INoticeStatus, NoticeStatus } from '../notice-status.model';
import { NoticeStatusService } from '../service/notice-status.service';

@Injectable({ providedIn: 'root' })
export class NoticeStatusRoutingResolveService implements Resolve<INoticeStatus> {
  constructor(protected service: NoticeStatusService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INoticeStatus> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((noticeStatus: HttpResponse<NoticeStatus>) => {
          if (noticeStatus.body) {
            return of(noticeStatus.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new NoticeStatus());
  }
}
