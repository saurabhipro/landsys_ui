import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NoticeStatusInfoComponent } from '../list/notice-status-info.component';
import { NoticeStatusInfoDetailComponent } from '../detail/notice-status-info-detail.component';
import { NoticeStatusInfoUpdateComponent } from '../update/notice-status-info-update.component';
import { NoticeStatusInfoRoutingResolveService } from './notice-status-info-routing-resolve.service';

const noticeStatusInfoRoute: Routes = [
  {
    path: '',
    component: NoticeStatusInfoComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NoticeStatusInfoDetailComponent,
    resolve: {
      noticeStatusInfo: NoticeStatusInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NoticeStatusInfoUpdateComponent,
    resolve: {
      noticeStatusInfo: NoticeStatusInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NoticeStatusInfoUpdateComponent,
    resolve: {
      noticeStatusInfo: NoticeStatusInfoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(noticeStatusInfoRoute)],
  exports: [RouterModule],
})
export class NoticeStatusInfoRoutingModule {}
