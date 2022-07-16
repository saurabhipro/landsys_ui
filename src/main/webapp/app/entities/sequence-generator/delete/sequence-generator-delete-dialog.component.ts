import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISequenceGenerator } from '../sequence-generator.model';
import { SequenceGeneratorService } from '../service/sequence-generator.service';

@Component({
  templateUrl: './sequence-generator-delete-dialog.component.html',
})
export class SequenceGeneratorDeleteDialogComponent {
  sequenceGenerator?: ISequenceGenerator;

  constructor(protected sequenceGeneratorService: SequenceGeneratorService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.sequenceGeneratorService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
