import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPaymentFileHeader } from '../payment-file-header.model';
import { PaymentFileHeaderService } from '../service/payment-file-header.service';

@Component({
  templateUrl: './payment-file-header-delete-dialog.component.html',
})
export class PaymentFileHeaderDeleteDialogComponent {
  paymentFileHeader?: IPaymentFileHeader;

  constructor(protected paymentFileHeaderService: PaymentFileHeaderService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paymentFileHeaderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
