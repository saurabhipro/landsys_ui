import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPaymentFile } from '../payment-file.model';
import { PaymentFileService } from '../service/payment-file.service';

@Component({
  templateUrl: './payment-file-delete-dialog.component.html',
})
export class PaymentFileDeleteDialogComponent {
  paymentFile?: IPaymentFile;

  constructor(protected paymentFileService: PaymentFileService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paymentFileService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
