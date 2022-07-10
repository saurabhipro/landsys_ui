import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PublicNotificationComponent } from './list/public-notification.component';
import { PublicNotificationDetailComponent } from './detail/public-notification-detail.component';
import { PublicNotificationUpdateComponent } from './update/public-notification-update.component';
import { PublicNotificationDeleteDialogComponent } from './delete/public-notification-delete-dialog.component';
import { PublicNotificationRoutingModule } from './route/public-notification-routing.module';

@NgModule({
  imports: [SharedModule, PublicNotificationRoutingModule],
  declarations: [
    PublicNotificationComponent,
    PublicNotificationDetailComponent,
    PublicNotificationUpdateComponent,
    PublicNotificationDeleteDialogComponent,
  ],
  entryComponents: [PublicNotificationDeleteDialogComponent],
})
export class PublicNotificationModule {}
