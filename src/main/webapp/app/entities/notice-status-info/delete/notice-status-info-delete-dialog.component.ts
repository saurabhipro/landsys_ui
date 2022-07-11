import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { INoticeStatusInfo } from '../notice-status-info.model';
import { NoticeStatusInfoService } from '../service/notice-status-info.service';

@Component({
  templateUrl: './notice-status-info-delete-dialog.component.html',
})
export class NoticeStatusInfoDeleteDialogComponent {
  noticeStatusInfo?: INoticeStatusInfo;

  constructor(protected noticeStatusInfoService: NoticeStatusInfoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.noticeStatusInfoService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
