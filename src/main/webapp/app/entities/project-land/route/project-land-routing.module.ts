import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProjectLandComponent } from '../list/project-land.component';
import { ProjectLandDetailComponent } from '../detail/project-land-detail.component';
import { ProjectLandUpdateComponent } from '../update/project-land-update.component';
import { ProjectLandRoutingResolveService } from './project-land-routing-resolve.service';

const projectLandRoute: Routes = [
  {
    path: '',
    component: ProjectLandComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProjectLandDetailComponent,
    resolve: {
      projectLand: ProjectLandRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProjectLandUpdateComponent,
    resolve: {
      projectLand: ProjectLandRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProjectLandUpdateComponent,
    resolve: {
      projectLand: ProjectLandRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(projectLandRoute)],
  exports: [RouterModule],
})
export class ProjectLandRoutingModule {}
