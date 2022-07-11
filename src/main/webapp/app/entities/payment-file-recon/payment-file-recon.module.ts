import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PaymentFileReconComponent } from './list/payment-file-recon.component';
import { PaymentFileReconDetailComponent } from './detail/payment-file-recon-detail.component';
import { PaymentFileReconUpdateComponent } from './update/payment-file-recon-update.component';
import { PaymentFileReconDeleteDialogComponent } from './delete/payment-file-recon-delete-dialog.component';
import { PaymentFileReconRoutingModule } from './route/payment-file-recon-routing.module';

@NgModule({
  imports: [SharedModule, PaymentFileReconRoutingModule],
  declarations: [
    PaymentFileReconComponent,
    PaymentFileReconDetailComponent,
    PaymentFileReconUpdateComponent,
    PaymentFileReconDeleteDialogComponent,
  ],
  entryComponents: [PaymentFileReconDeleteDialogComponent],
})
export class PaymentFileReconModule {}
