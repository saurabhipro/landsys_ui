import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { INoticeStatus } from '../notice-status.model';
import { NoticeStatusService } from '../service/notice-status.service';

@Component({
  templateUrl: './notice-status-delete-dialog.component.html',
})
export class NoticeStatusDeleteDialogComponent {
  noticeStatus?: INoticeStatus;

  constructor(protected noticeStatusService: NoticeStatusService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.noticeStatusService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
