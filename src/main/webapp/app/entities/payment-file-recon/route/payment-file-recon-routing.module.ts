import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PaymentFileReconComponent } from '../list/payment-file-recon.component';
import { PaymentFileReconDetailComponent } from '../detail/payment-file-recon-detail.component';
import { PaymentFileReconUpdateComponent } from '../update/payment-file-recon-update.component';
import { PaymentFileReconRoutingResolveService } from './payment-file-recon-routing-resolve.service';

const paymentFileReconRoute: Routes = [
  {
    path: '',
    component: PaymentFileReconComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PaymentFileReconDetailComponent,
    resolve: {
      paymentFileRecon: PaymentFileReconRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PaymentFileReconUpdateComponent,
    resolve: {
      paymentFileRecon: PaymentFileReconRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PaymentFileReconUpdateComponent,
    resolve: {
      paymentFileRecon: PaymentFileReconRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(paymentFileReconRoute)],
  exports: [RouterModule],
})
export class PaymentFileReconRoutingModule {}
