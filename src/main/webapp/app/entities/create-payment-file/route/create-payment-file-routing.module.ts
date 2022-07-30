import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CreatePaymentFileComponent } from '../list/create-payment-file.component';
import { CreatePaymentFileDetailComponent } from '../detail/create-payment-file-detail.component';
import { CreatePaymentFileUpdateComponent } from '../update/create-payment-file-update.component';
import { CreatePaymentFileRoutingResolveService } from './create-payment-file-routing-resolve.service';

const createPaymentFileRoute: Routes = [
  {
    path: '',
    component: CreatePaymentFileComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CreatePaymentFileDetailComponent,
    resolve: {
      createPaymentFile: CreatePaymentFileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CreatePaymentFileUpdateComponent,
    resolve: {
      createPaymentFile: CreatePaymentFileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CreatePaymentFileUpdateComponent,
    resolve: {
      createPaymentFile: CreatePaymentFileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(createPaymentFileRoute)],
  exports: [RouterModule],
})
export class CreatePaymentFileRoutingModule {}
