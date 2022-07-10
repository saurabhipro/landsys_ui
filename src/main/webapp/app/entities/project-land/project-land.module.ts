import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ProjectLandComponent } from './list/project-land.component';
import { ProjectLandDetailComponent } from './detail/project-land-detail.component';
import { ProjectLandUpdateComponent } from './update/project-land-update.component';
import { ProjectLandDeleteDialogComponent } from './delete/project-land-delete-dialog.component';
import { ProjectLandRoutingModule } from './route/project-land-routing.module';

@NgModule({
  imports: [SharedModule, ProjectLandRoutingModule],
  declarations: [ProjectLandComponent, ProjectLandDetailComponent, ProjectLandUpdateComponent, ProjectLandDeleteDialogComponent],
  entryComponents: [ProjectLandDeleteDialogComponent],
})
export class ProjectLandModule {}
