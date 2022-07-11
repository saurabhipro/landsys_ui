import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PaymentFileComponent } from './list/payment-file.component';
import { PaymentFileDetailComponent } from './detail/payment-file-detail.component';
import { PaymentFileUpdateComponent } from './update/payment-file-update.component';
import { PaymentFileDeleteDialogComponent } from './delete/payment-file-delete-dialog.component';
import { PaymentFileRoutingModule } from './route/payment-file-routing.module';

@NgModule({
  imports: [SharedModule, PaymentFileRoutingModule],
  declarations: [PaymentFileComponent, PaymentFileDetailComponent, PaymentFileUpdateComponent, PaymentFileDeleteDialogComponent],
  entryComponents: [PaymentFileDeleteDialogComponent],
})
export class PaymentFileModule {}
