import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { INoticeStatusInfo, NoticeStatusInfo } from '../notice-status-info.model';
import { NoticeStatusInfoService } from '../service/notice-status-info.service';

@Injectable({ providedIn: 'root' })
export class NoticeStatusInfoRoutingResolveService implements Resolve<INoticeStatusInfo> {
  constructor(protected service: NoticeStatusInfoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<INoticeStatusInfo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((noticeStatusInfo: HttpResponse<NoticeStatusInfo>) => {
          if (noticeStatusInfo.body) {
            return of(noticeStatusInfo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new NoticeStatusInfo());
  }
}
