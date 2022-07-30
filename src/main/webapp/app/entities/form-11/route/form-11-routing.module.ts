import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { Form11Component } from '../list/form-11.component';
import { Form11DetailComponent } from '../detail/form-11-detail.component';
import { Form11UpdateComponent } from '../update/form-11-update.component';
import { Form11RoutingResolveService } from './form-11-routing-resolve.service';

const form11Route: Routes = [
  // {
  //   path: '',
  //   component: Form11Component,
  //   canActivate: [UserRouteAccessService],
  // },
  {
    path: ':id/view',
    component: Form11DetailComponent,
    resolve: {
      form11: Form11RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: '',
    component: Form11UpdateComponent,
    resolve: {
      form11: Form11RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: Form11UpdateComponent,
    resolve: {
      form11: Form11RoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(form11Route)],
  exports: [RouterModule],
})
export class Form11RoutingModule {}
