import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SubDistrictComponent } from '../list/sub-district.component';
import { SubDistrictDetailComponent } from '../detail/sub-district-detail.component';
import { SubDistrictUpdateComponent } from '../update/sub-district-update.component';
import { SubDistrictRoutingResolveService } from './sub-district-routing-resolve.service';

const subDistrictRoute: Routes = [
  {
    path: '',
    component: SubDistrictComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SubDistrictDetailComponent,
    resolve: {
      subDistrict: SubDistrictRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SubDistrictUpdateComponent,
    resolve: {
      subDistrict: SubDistrictRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SubDistrictUpdateComponent,
    resolve: {
      subDistrict: SubDistrictRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(subDistrictRoute)],
  exports: [RouterModule],
})
export class SubDistrictRoutingModule {}
