import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LandComponent } from '../list/land.component';
import { LandDetailComponent } from '../detail/land-detail.component';
import { LandUpdateComponent } from '../update/land-update.component';
import { LandRoutingResolveService } from './land-routing-resolve.service';

const landRoute: Routes = [
  {
    path: '',
    component: LandComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LandDetailComponent,
    resolve: {
      land: LandRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LandUpdateComponent,
    resolve: {
      land: LandRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LandUpdateComponent,
    resolve: {
      land: LandRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(landRoute)],
  exports: [RouterModule],
})
export class LandRoutingModule {}
