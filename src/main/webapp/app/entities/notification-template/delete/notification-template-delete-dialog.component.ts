import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { INotificationTemplate } from '../notification-template.model';
import { NotificationTemplateService } from '../service/notification-template.service';

@Component({
  templateUrl: './notification-template-delete-dialog.component.html',
})
export class NotificationTemplateDeleteDialogComponent {
  notificationTemplate?: INotificationTemplate;

  constructor(protected notificationTemplateService: NotificationTemplateService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.notificationTemplateService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
