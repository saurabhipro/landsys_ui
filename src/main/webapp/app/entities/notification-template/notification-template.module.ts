import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NotificationTemplateComponent } from './list/notification-template.component';
import { NotificationTemplateDetailComponent } from './detail/notification-template-detail.component';
import { NotificationTemplateUpdateComponent } from './update/notification-template-update.component';
import { NotificationTemplateDeleteDialogComponent } from './delete/notification-template-delete-dialog.component';
import { NotificationTemplateRoutingModule } from './route/notification-template-routing.module';

@NgModule({
  imports: [SharedModule, NotificationTemplateRoutingModule],
  declarations: [
    NotificationTemplateComponent,
    NotificationTemplateDetailComponent,
    NotificationTemplateUpdateComponent,
    NotificationTemplateDeleteDialogComponent,
  ],
  entryComponents: [NotificationTemplateDeleteDialogComponent],
})
export class NotificationTemplateModule {}
