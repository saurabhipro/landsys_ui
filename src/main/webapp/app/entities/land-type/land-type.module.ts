import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LandTypeComponent } from './list/land-type.component';
import { LandTypeDetailComponent } from './detail/land-type-detail.component';
import { LandTypeUpdateComponent } from './update/land-type-update.component';
import { LandTypeDeleteDialogComponent } from './delete/land-type-delete-dialog.component';
import { LandTypeRoutingModule } from './route/land-type-routing.module';

@NgModule({
  imports: [SharedModule, LandTypeRoutingModule],
  declarations: [LandTypeComponent, LandTypeDetailComponent, LandTypeUpdateComponent, LandTypeDeleteDialogComponent],
  entryComponents: [LandTypeDeleteDialogComponent],
})
export class LandTypeModule {}
