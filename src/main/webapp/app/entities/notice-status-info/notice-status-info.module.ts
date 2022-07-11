import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { NoticeStatusInfoComponent } from './list/notice-status-info.component';
import { NoticeStatusInfoDetailComponent } from './detail/notice-status-info-detail.component';
import { NoticeStatusInfoUpdateComponent } from './update/notice-status-info-update.component';
import { NoticeStatusInfoDeleteDialogComponent } from './delete/notice-status-info-delete-dialog.component';
import { NoticeStatusInfoRoutingModule } from './route/notice-status-info-routing.module';

@NgModule({
  imports: [SharedModule, NoticeStatusInfoRoutingModule],
  declarations: [
    NoticeStatusInfoComponent,
    NoticeStatusInfoDetailComponent,
    NoticeStatusInfoUpdateComponent,
    NoticeStatusInfoDeleteDialogComponent,
  ],
  entryComponents: [NoticeStatusInfoDeleteDialogComponent],
})
export class NoticeStatusInfoModule {}
