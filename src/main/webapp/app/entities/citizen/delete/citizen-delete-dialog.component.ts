import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICitizen } from '../citizen.model';
import { CitizenService } from '../service/citizen.service';

@Component({
  templateUrl: './citizen-delete-dialog.component.html',
})
export class CitizenDeleteDialogComponent {
  citizen?: ICitizen;

  constructor(protected citizenService: CitizenService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.citizenService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
