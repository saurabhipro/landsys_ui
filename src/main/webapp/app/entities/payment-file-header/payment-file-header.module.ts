import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PaymentFileHeaderComponent } from './list/payment-file-header.component';
import { PaymentFileHeaderDetailComponent } from './detail/payment-file-header-detail.component';
import { PaymentFileHeaderUpdateComponent } from './update/payment-file-header-update.component';
import { PaymentFileHeaderDeleteDialogComponent } from './delete/payment-file-header-delete-dialog.component';
import { PaymentFileHeaderRoutingModule } from './route/payment-file-header-routing.module';

@NgModule({
  imports: [SharedModule, PaymentFileHeaderRoutingModule],
  declarations: [
    PaymentFileHeaderComponent,
    PaymentFileHeaderDetailComponent,
    PaymentFileHeaderUpdateComponent,
    PaymentFileHeaderDeleteDialogComponent,
  ],
  entryComponents: [PaymentFileHeaderDeleteDialogComponent],
})
export class PaymentFileHeaderModule {}
