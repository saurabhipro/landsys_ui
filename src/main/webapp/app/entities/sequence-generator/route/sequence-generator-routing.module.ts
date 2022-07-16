import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SequenceGeneratorComponent } from '../list/sequence-generator.component';
import { SequenceGeneratorDetailComponent } from '../detail/sequence-generator-detail.component';
import { SequenceGeneratorUpdateComponent } from '../update/sequence-generator-update.component';
import { SequenceGeneratorRoutingResolveService } from './sequence-generator-routing-resolve.service';

const sequenceGeneratorRoute: Routes = [
  {
    path: '',
    component: SequenceGeneratorComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SequenceGeneratorDetailComponent,
    resolve: {
      sequenceGenerator: SequenceGeneratorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SequenceGeneratorUpdateComponent,
    resolve: {
      sequenceGenerator: SequenceGeneratorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SequenceGeneratorUpdateComponent,
    resolve: {
      sequenceGenerator: SequenceGeneratorRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sequenceGeneratorRoute)],
  exports: [RouterModule],
})
export class SequenceGeneratorRoutingModule {}
