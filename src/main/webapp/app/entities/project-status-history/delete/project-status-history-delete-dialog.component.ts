import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProjectStatusHistory } from '../project-status-history.model';
import { ProjectStatusHistoryService } from '../service/project-status-history.service';

@Component({
  templateUrl: './project-status-history-delete-dialog.component.html',
})
export class ProjectStatusHistoryDeleteDialogComponent {
  projectStatusHistory?: IProjectStatusHistory;

  constructor(protected projectStatusHistoryService: ProjectStatusHistoryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.projectStatusHistoryService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
