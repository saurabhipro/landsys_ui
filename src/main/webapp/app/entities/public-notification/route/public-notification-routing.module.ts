import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PublicNotificationComponent } from '../list/public-notification.component';
import { PublicNotificationDetailComponent } from '../detail/public-notification-detail.component';
import { PublicNotificationUpdateComponent } from '../update/public-notification-update.component';
import { PublicNotificationRoutingResolveService } from './public-notification-routing-resolve.service';

const publicNotificationRoute: Routes = [
  {
    path: '',
    component: PublicNotificationComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PublicNotificationDetailComponent,
    resolve: {
      publicNotification: PublicNotificationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PublicNotificationUpdateComponent,
    resolve: {
      publicNotification: PublicNotificationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PublicNotificationUpdateComponent,
    resolve: {
      publicNotification: PublicNotificationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(publicNotificationRoute)],
  exports: [RouterModule],
})
export class PublicNotificationRoutingModule {}
