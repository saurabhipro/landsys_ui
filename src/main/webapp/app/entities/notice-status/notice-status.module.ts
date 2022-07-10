import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NoticeStatusComponent } from './list/notice-status.component';
import { NoticeStatusDetailComponent } from './detail/notice-status-detail.component';
import { NoticeStatusUpdateComponent } from './update/notice-status-update.component';
import { NoticeStatusDeleteDialogComponent } from './delete/notice-status-delete-dialog.component';
import { NoticeStatusRoutingModule } from './route/notice-status-routing.module';

@NgModule({
  imports: [SharedModule, NoticeStatusRoutingModule],
  declarations: [NoticeStatusComponent, NoticeStatusDetailComponent, NoticeStatusUpdateComponent, NoticeStatusDeleteDialogComponent],
  entryComponents: [NoticeStatusDeleteDialogComponent],
})
export class NoticeStatusModule {}
