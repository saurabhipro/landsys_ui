import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NoticeStatusComponent } from '../list/notice-status.component';
import { NoticeStatusDetailComponent } from '../detail/notice-status-detail.component';
import { NoticeStatusUpdateComponent } from '../update/notice-status-update.component';
import { NoticeStatusRoutingResolveService } from './notice-status-routing-resolve.service';

const noticeStatusRoute: Routes = [
  {
    path: '',
    component: NoticeStatusComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NoticeStatusDetailComponent,
    resolve: {
      noticeStatus: NoticeStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NoticeStatusUpdateComponent,
    resolve: {
      noticeStatus: NoticeStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NoticeStatusUpdateComponent,
    resolve: {
      noticeStatus: NoticeStatusRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(noticeStatusRoute)],
  exports: [RouterModule],
})
export class NoticeStatusRoutingModule {}
