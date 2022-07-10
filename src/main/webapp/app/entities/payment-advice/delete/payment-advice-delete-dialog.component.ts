import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPaymentAdvice } from '../payment-advice.model';
import { PaymentAdviceService } from '../service/payment-advice.service';

@Component({
  templateUrl: './payment-advice-delete-dialog.component.html',
})
export class PaymentAdviceDeleteDialogComponent {
  paymentAdvice?: IPaymentAdvice;

  constructor(protected paymentAdviceService: PaymentAdviceService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.paymentAdviceService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
