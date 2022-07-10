import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CitizenComponent } from '../list/citizen.component';
import { CitizenDetailComponent } from '../detail/citizen-detail.component';
import { CitizenUpdateComponent } from '../update/citizen-update.component';
import { CitizenRoutingResolveService } from './citizen-routing-resolve.service';

const citizenRoute: Routes = [
  {
    path: '',
    component: CitizenComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CitizenDetailComponent,
    resolve: {
      citizen: CitizenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CitizenUpdateComponent,
    resolve: {
      citizen: CitizenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CitizenUpdateComponent,
    resolve: {
      citizen: CitizenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(citizenRoute)],
  exports: [RouterModule],
})
export class CitizenRoutingModule {}
