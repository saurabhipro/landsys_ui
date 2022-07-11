import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPaymentFileRecon } from '../payment-file-recon.model';
import { PaymentFileReconService } from '../service/payment-file-recon.service';

@Component({
  templateUrl: './payment-file-recon-delete-dialog.component.html',
})
export class PaymentFileReconDeleteDialogComponent {
  paymentFileRecon?: IPaymentFileRecon;

  constructor(protected paymentFileReconService: PaymentFileReconService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paymentFileReconService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
