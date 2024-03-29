import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PaymentAdviceComponent } from './list/payment-advice.component';
import { PaymentAdviceDetailComponent } from './detail/payment-advice-detail.component';
import { PaymentAdviceUpdateComponent } from './update/payment-advice-update.component';
import { PaymentAdviceDeleteDialogComponent } from './delete/payment-advice-delete-dialog.component';
import { PaymentAdviceRoutingModule } from './route/payment-advice-routing.module';
import { CreatePaymentComponent } from './create-payment/create-payment.component';
import { CreatePaymentLandCompensationComponent } from './create-payment-advise-land-compensation/create-payment-advise-land-compensation.component';
import { ModalCreatePaymentAdviceComponent } from './modal-create-advise/modal-create-advise.component';
import { CreatePaymentAdviceCustomComponent } from './create-advise-custom/create-advise-custom..component';
import { ModalCitizenListComponent } from './modal-citizen-list/modal-citizen-list.component';

@NgModule({
  imports: [SharedModule, PaymentAdviceRoutingModule],
  declarations: [PaymentAdviceComponent, PaymentAdviceDetailComponent, PaymentAdviceUpdateComponent, PaymentAdviceDeleteDialogComponent, CreatePaymentComponent, CreatePaymentLandCompensationComponent, ModalCreatePaymentAdviceComponent, CreatePaymentAdviceCustomComponent, ModalCitizenListComponent],
  entryComponents: [PaymentAdviceDeleteDialogComponent, ModalCreatePaymentAdviceComponent],
})
export class PaymentAdviceModule {}
