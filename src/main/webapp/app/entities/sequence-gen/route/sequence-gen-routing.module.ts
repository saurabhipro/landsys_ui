import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SequenceGenComponent } from '../list/sequence-gen.component';
import { SequenceGenDetailComponent } from '../detail/sequence-gen-detail.component';
import { SequenceGenUpdateComponent } from '../update/sequence-gen-update.component';
import { SequenceGenRoutingResolveService } from './sequence-gen-routing-resolve.service';

const sequenceGenRoute: Routes = [
  {
    path: '',
    component: SequenceGenComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SequenceGenDetailComponent,
    resolve: {
      sequenceGen: SequenceGenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SequenceGenUpdateComponent,
    resolve: {
      sequenceGen: SequenceGenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SequenceGenUpdateComponent,
    resolve: {
      sequenceGen: SequenceGenRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sequenceGenRoute)],
  exports: [RouterModule],
})
export class SequenceGenRoutingModule {}
