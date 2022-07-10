import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProjectStatusHistoryComponent } from '../list/project-status-history.component';
import { ProjectStatusHistoryDetailComponent } from '../detail/project-status-history-detail.component';
import { ProjectStatusHistoryUpdateComponent } from '../update/project-status-history-update.component';
import { ProjectStatusHistoryRoutingResolveService } from './project-status-history-routing-resolve.service';

const projectStatusHistoryRoute: Routes = [
  {
    path: '',
    component: ProjectStatusHistoryComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProjectStatusHistoryDetailComponent,
    resolve: {
      projectStatusHistory: ProjectStatusHistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProjectStatusHistoryUpdateComponent,
    resolve: {
      projectStatusHistory: ProjectStatusHistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProjectStatusHistoryUpdateComponent,
    resolve: {
      projectStatusHistory: ProjectStatusHistoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(projectStatusHistoryRoute)],
  exports: [RouterModule],
})
export class ProjectStatusHistoryRoutingModule {}
