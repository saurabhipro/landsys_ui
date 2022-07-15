import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PaymentFileHeaderComponent } from '../list/payment-file-header.component';
import { PaymentFileHeaderDetailComponent } from '../detail/payment-file-header-detail.component';
import { PaymentFileHeaderUpdateComponent } from '../update/payment-file-header-update.component';
import { PaymentFileHeaderRoutingResolveService } from './payment-file-header-routing-resolve.service';

const paymentFileHeaderRoute: Routes = [
  {
    path: '',
    component: PaymentFileHeaderComponent,
    data: {
      defaultSort: 'id,asc',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PaymentFileHeaderDetailComponent,
    resolve: {
      paymentFileHeader: PaymentFileHeaderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PaymentFileHeaderUpdateComponent,
    resolve: {
      paymentFileHeader: PaymentFileHeaderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PaymentFileHeaderUpdateComponent,
    resolve: {
      paymentFileHeader: PaymentFileHeaderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(paymentFileHeaderRoute)],
  exports: [RouterModule],
})
export class PaymentFileHeaderRoutingModule {}
