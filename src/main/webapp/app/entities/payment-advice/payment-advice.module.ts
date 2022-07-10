import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PaymentAdviceComponent } from './list/payment-advice.component';
import { PaymentAdviceDetailComponent } from './detail/payment-advice-detail.component';
import { PaymentAdviceUpdateComponent } from './update/payment-advice-update.component';
import { PaymentAdviceDeleteDialogComponent } from './delete/payment-advice-delete-dialog.component';
import { PaymentAdviceRoutingModule } from './route/payment-advice-routing.module';

@NgModule({
  imports: [SharedModule, PaymentAdviceRoutingModule],
  declarations: [PaymentAdviceComponent, PaymentAdviceDetailComponent, PaymentAdviceUpdateComponent, PaymentAdviceDeleteDialogComponent],
  entryComponents: [PaymentAdviceDeleteDialogComponent],
})
export class PaymentAdviceModule {}
