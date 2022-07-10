import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILandType } from '../land-type.model';
import { LandTypeService } from '../service/land-type.service';

@Component({
  templateUrl: './land-type-delete-dialog.component.html',
})
export class LandTypeDeleteDialogComponent {
  landType?: ILandType;

  constructor(protected landTypeService: LandTypeService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.landTypeService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
