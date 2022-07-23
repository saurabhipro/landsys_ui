import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { KhatedarComponent } from '../list/khatedar.component';
import { KhatedarDetailComponent } from '../detail/khatedar-detail.component';
import { KhatedarUpdateComponent } from '../update/khatedar-update.component';
import { KhatedarRoutingResolveService } from './khatedar-routing-resolve.service';
import { ViewKhatedarComponent } from '../view-khatedar/view-khatedar.component';

const khatedarRoute: Routes = [
  {
    path: '',
    component: KhatedarComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },

  {
    path: ':id/view1',
    component: ViewKhatedarComponent,
    resolve: {
      khatedar: KhatedarRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },

  {
    path: ':id/view',
    component: KhatedarDetailComponent,
    resolve: {
      khatedar: KhatedarRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },

  {
    path: 'new',
    component: KhatedarUpdateComponent,
    resolve: {
      khatedar: KhatedarRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: KhatedarUpdateComponent,
    resolve: {
      khatedar: KhatedarRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(khatedarRoute)],
  exports: [RouterModule],
})
export class KhatedarRoutingModule {}
