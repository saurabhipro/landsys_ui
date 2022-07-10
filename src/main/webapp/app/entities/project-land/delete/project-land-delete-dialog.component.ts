import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProjectLand } from '../project-land.model';
import { ProjectLandService } from '../service/project-land.service';

@Component({
  templateUrl: './project-land-delete-dialog.component.html',
})
export class ProjectLandDeleteDialogComponent {
  projectLand?: IProjectLand;

  constructor(protected projectLandService: ProjectLandService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.projectLandService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
