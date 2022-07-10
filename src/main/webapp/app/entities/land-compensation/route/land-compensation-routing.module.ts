import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LandCompensationComponent } from '../list/land-compensation.component';
import { LandCompensationDetailComponent } from '../detail/land-compensation-detail.component';
import { LandCompensationUpdateComponent } from '../update/land-compensation-update.component';
import { LandCompensationRoutingResolveService } from './land-compensation-routing-resolve.service';

const landCompensationRoute: Routes = [
  {
    path: '',
    component: LandCompensationComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LandCompensationDetailComponent,
    resolve: {
      landCompensation: LandCompensationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LandCompensationUpdateComponent,
    resolve: {
      landCompensation: LandCompensationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LandCompensationUpdateComponent,
    resolve: {
      landCompensation: LandCompensationRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(landCompensationRoute)],
  exports: [RouterModule],
})
export class LandCompensationRoutingModule {}
