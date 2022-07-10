import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProjectStatusHistoryComponent } from './list/project-status-history.component';
import { ProjectStatusHistoryDetailComponent } from './detail/project-status-history-detail.component';
import { ProjectStatusHistoryUpdateComponent } from './update/project-status-history-update.component';
import { ProjectStatusHistoryDeleteDialogComponent } from './delete/project-status-history-delete-dialog.component';
import { ProjectStatusHistoryRoutingModule } from './route/project-status-history-routing.module';

@NgModule({
  imports: [SharedModule, ProjectStatusHistoryRoutingModule],
  declarations: [
    ProjectStatusHistoryComponent,
    ProjectStatusHistoryDetailComponent,
    ProjectStatusHistoryUpdateComponent,
    ProjectStatusHistoryDeleteDialogComponent,
  ],
  entryComponents: [ProjectStatusHistoryDeleteDialogComponent],
})
export class ProjectStatusHistoryModule {}
