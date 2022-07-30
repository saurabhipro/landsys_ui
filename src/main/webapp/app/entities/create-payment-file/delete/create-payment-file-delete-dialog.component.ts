import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICreatePaymentFile } from '../create-payment-file.model';
import { CreatePaymentFileService } from '../service/create-payment-file.service';

@Component({
  templateUrl: './create-payment-file-delete-dialog.component.html',
})
export class CreatePaymentFileDeleteDialogComponent {
  createPaymentFile?: ICreatePaymentFile;

  constructor(protected createPaymentFileService: CreatePaymentFileService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.createPaymentFileService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
