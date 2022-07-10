import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CitizenComponent } from './list/citizen.component';
import { CitizenDetailComponent } from './detail/citizen-detail.component';
import { CitizenUpdateComponent } from './update/citizen-update.component';
import { CitizenDeleteDialogComponent } from './delete/citizen-delete-dialog.component';
import { CitizenRoutingModule } from './route/citizen-routing.module';

@NgModule({
  imports: [SharedModule, CitizenRoutingModule],
  declarations: [CitizenComponent, CitizenDetailComponent, CitizenUpdateComponent, CitizenDeleteDialogComponent],
  entryComponents: [CitizenDeleteDialogComponent],
})
export class CitizenModule {}
