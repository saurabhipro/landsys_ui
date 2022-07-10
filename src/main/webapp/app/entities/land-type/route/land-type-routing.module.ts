import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LandTypeComponent } from '../list/land-type.component';
import { LandTypeDetailComponent } from '../detail/land-type-detail.component';
import { LandTypeUpdateComponent } from '../update/land-type-update.component';
import { LandTypeRoutingResolveService } from './land-type-routing-resolve.service';

const landTypeRoute: Routes = [
  {
    path: '',
    component: LandTypeComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LandTypeDetailComponent,
    resolve: {
      landType: LandTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LandTypeUpdateComponent,
    resolve: {
      landType: LandTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LandTypeUpdateComponent,
    resolve: {
      landType: LandTypeRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(landTypeRoute)],
  exports: [RouterModule],
})
export class LandTypeRoutingModule {}
