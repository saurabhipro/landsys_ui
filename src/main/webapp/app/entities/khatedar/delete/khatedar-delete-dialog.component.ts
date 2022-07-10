import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IKhatedar } from '../khatedar.model';
import { KhatedarService } from '../service/khatedar.service';

@Component({
  templateUrl: './khatedar-delete-dialog.component.html',
})
export class KhatedarDeleteDialogComponent {
  khatedar?: IKhatedar;

  constructor(protected khatedarService: KhatedarService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.khatedarService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
