import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PaymentAdviceDetailsComponent } from './list/payment-advice-details.component';
import { PaymentAdviceDetailsDetailComponent } from './detail/payment-advice-details-detail.component';
import { PaymentAdviceDetailsUpdateComponent } from './update/payment-advice-details-update.component';
import { PaymentAdviceDetailsDeleteDialogComponent } from './delete/payment-advice-details-delete-dialog.component';
import { PaymentAdviceDetailsRoutingModule } from './route/payment-advice-details-routing.module';

@NgModule({
  imports: [SharedModule, PaymentAdviceDetailsRoutingModule],
  declarations: [
    PaymentAdviceDetailsComponent,
    PaymentAdviceDetailsDetailComponent,
    PaymentAdviceDetailsUpdateComponent,
    PaymentAdviceDetailsDeleteDialogComponent,
  ],
  entryComponents: [PaymentAdviceDetailsDeleteDialogComponent],
})
export class PaymentAdviceDetailsModule {}
