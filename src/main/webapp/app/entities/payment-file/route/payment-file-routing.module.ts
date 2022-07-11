import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PaymentFileComponent } from '../list/payment-file.component';
import { PaymentFileDetailComponent } from '../detail/payment-file-detail.component';
import { PaymentFileUpdateComponent } from '../update/payment-file-update.component';
import { PaymentFileRoutingResolveService } from './payment-file-routing-resolve.service';

const paymentFileRoute: Routes = [
  {
    path: '',
    component: PaymentFileComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PaymentFileDetailComponent,
    resolve: {
      paymentFile: PaymentFileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PaymentFileUpdateComponent,
    resolve: {
      paymentFile: PaymentFileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PaymentFileUpdateComponent,
    resolve: {
      paymentFile: PaymentFileRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(paymentFileRoute)],
  exports: [RouterModule],
})
export class PaymentFileRoutingModule {}
