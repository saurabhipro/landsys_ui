import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISubDistrict } from '../sub-district.model';
import { SubDistrictService } from '../service/sub-district.service';

@Component({
  templateUrl: './sub-district-delete-dialog.component.html',
})
export class SubDistrictDeleteDialogComponent {
  subDistrict?: ISubDistrict;

  constructor(protected subDistrictService: SubDistrictService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.subDistrictService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
