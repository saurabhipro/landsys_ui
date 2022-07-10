import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILand } from '../land.model';
import { LandService } from '../service/land.service';

@Component({
  templateUrl: './land-delete-dialog.component.html',
})
export class LandDeleteDialogComponent {
  land?: ILand;

  constructor(protected landService: LandService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.landService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
