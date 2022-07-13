import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPaymentAdviceDetails } from '../payment-advice-details.model';
import { PaymentAdviceDetailsService } from '../service/payment-advice-details.service';

@Component({
  templateUrl: './payment-advice-details-delete-dialog.component.html',
})
export class PaymentAdviceDetailsDeleteDialogComponent {
  paymentAdviceDetails?: IPaymentAdviceDetails;

  constructor(protected paymentAdviceDetailsService: PaymentAdviceDetailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paymentAdviceDetailsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
