import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PaymentAdviceDetailsComponent } from '../list/payment-advice-details.component';
import { PaymentAdviceDetailsDetailComponent } from '../detail/payment-advice-details-detail.component';
import { PaymentAdviceDetailsUpdateComponent } from '../update/payment-advice-details-update.component';
import { PaymentAdviceDetailsRoutingResolveService } from './payment-advice-details-routing-resolve.service';

const paymentAdviceDetailsRoute: Routes = [
  {
    path: '',
    component: PaymentAdviceDetailsComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PaymentAdviceDetailsDetailComponent,
    resolve: {
      paymentAdviceDetails: PaymentAdviceDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PaymentAdviceDetailsUpdateComponent,
    resolve: {
      paymentAdviceDetails: PaymentAdviceDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PaymentAdviceDetailsUpdateComponent,
    resolve: {
      paymentAdviceDetails: PaymentAdviceDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(paymentAdviceDetailsRoute)],
  exports: [RouterModule],
})
export class PaymentAdviceDetailsRoutingModule {}
