import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IForm11 } from '../form-11.model';
import { Form11Service } from '../service/form-11.service';

@Component({
  templateUrl: './form-11-delete-dialog.component.html',
})
export class Form11DeleteDialogComponent {
  form11?: IForm11;

  constructor(protected form11Service: Form11Service, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.form11Service.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
