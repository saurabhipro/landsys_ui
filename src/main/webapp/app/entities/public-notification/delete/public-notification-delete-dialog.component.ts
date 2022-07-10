import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPublicNotification } from '../public-notification.model';
import { PublicNotificationService } from '../service/public-notification.service';

@Component({
  templateUrl: './public-notification-delete-dialog.component.html',
})
export class PublicNotificationDeleteDialogComponent {
  publicNotification?: IPublicNotification;

  constructor(protected publicNotificationService: PublicNotificationService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.publicNotificationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
