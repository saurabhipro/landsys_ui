import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LandComponent } from './list/land.component';
import { LandDetailComponent } from './detail/land-detail.component';
import { LandUpdateComponent } from './update/land-update.component';
import { LandDeleteDialogComponent } from './delete/land-delete-dialog.component';
import { LandRoutingModule } from './route/land-routing.module';

@NgModule({
  imports: [SharedModule, LandRoutingModule],
  declarations: [LandComponent, LandDetailComponent, LandUpdateComponent, LandDeleteDialogComponent],
  entryComponents: [LandDeleteDialogComponent],
})
export class LandModule {}
