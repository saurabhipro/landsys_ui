import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { NotificationTemplateComponent } from '../list/notification-template.component';
import { NotificationTemplateDetailComponent } from '../detail/notification-template-detail.component';
import { NotificationTemplateUpdateComponent } from '../update/notification-template-update.component';
import { NotificationTemplateRoutingResolveService } from './notification-template-routing-resolve.service';

const notificationTemplateRoute: Routes = [
  {
    path: '',
    component: NotificationTemplateComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: NotificationTemplateDetailComponent,
    resolve: {
      notificationTemplate: NotificationTemplateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: NotificationTemplateUpdateComponent,
    resolve: {
      notificationTemplate: NotificationTemplateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: NotificationTemplateUpdateComponent,
    resolve: {
      notificationTemplate: NotificationTemplateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(notificationTemplateRoute)],
  exports: [RouterModule],
})
export class NotificationTemplateRoutingModule {}
