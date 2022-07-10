import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LandCompensationComponent } from './list/land-compensation.component';
import { LandCompensationDetailComponent } from './detail/land-compensation-detail.component';
import { LandCompensationUpdateComponent } from './update/land-compensation-update.component';
import { LandCompensationDeleteDialogComponent } from './delete/land-compensation-delete-dialog.component';
import { LandCompensationRoutingModule } from './route/land-compensation-routing.module';

@NgModule({
  imports: [SharedModule, LandCompensationRoutingModule],
  declarations: [
    LandCompensationComponent,
    LandCompensationDetailComponent,
    LandCompensationUpdateComponent,
    LandCompensationDeleteDialogComponent,
  ],
  entryComponents: [LandCompensationDeleteDialogComponent],
})
export class LandCompensationModule {}
