import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILandCompensation } from '../land-compensation.model';
import { LandCompensationService } from '../service/land-compensation.service';

@Component({
  templateUrl: './land-compensation-delete-dialog.component.html',
})
export class LandCompensationDeleteDialogComponent {
  landCompensation?: ILandCompensation;

  constructor(protected landCompensationService: LandCompensationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.landCompensationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
