import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CreatePaymentFileComponent } from './list/create-payment-file.component';
import { CreatePaymentFileDetailComponent } from './detail/create-payment-file-detail.component';
import { CreatePaymentFileUpdateComponent } from './update/create-payment-file-update.component';
import { CreatePaymentFileDeleteDialogComponent } from './delete/create-payment-file-delete-dialog.component';
import { CreatePaymentFileRoutingModule } from './route/create-payment-file-routing.module';

@NgModule({
  imports: [SharedModule, CreatePaymentFileRoutingModule],
  declarations: [
    CreatePaymentFileComponent,
    CreatePaymentFileDetailComponent,
    CreatePaymentFileUpdateComponent,
    CreatePaymentFileDeleteDialogComponent,
  ],
  entryComponents: [CreatePaymentFileDeleteDialogComponent],
})
export class CreatePaymentFileModule {}
