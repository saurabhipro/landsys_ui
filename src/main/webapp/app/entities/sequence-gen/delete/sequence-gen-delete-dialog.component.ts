import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISequenceGen } from '../sequence-gen.model';
import { SequenceGenService } from '../service/sequence-gen.service';

@Component({
  templateUrl: './sequence-gen-delete-dialog.component.html',
})
export class SequenceGenDeleteDialogComponent {
  sequenceGen?: ISequenceGen;

  constructor(protected sequenceGenService: SequenceGenService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sequenceGenService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
