import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { KhatedarComponent } from './list/khatedar.component';
import { KhatedarDetailComponent } from './detail/khatedar-detail.component';
import { KhatedarUpdateComponent } from './update/khatedar-update.component';
import { KhatedarDeleteDialogComponent } from './delete/khatedar-delete-dialog.component';
import { KhatedarRoutingModule } from './route/khatedar-routing.module';
import { ViewKhatedarComponent } from './view-khatedar/view-khatedar.component';
import { ViewCitizenComponent } from './view-khatedar/view-citizen/view-citizen.component';
import { ViewSurveyComponent } from './view-khatedar/view-survey/view-survey.component';

@NgModule({
  imports: [SharedModule, KhatedarRoutingModule],
  declarations: [
    KhatedarComponent,
    KhatedarDetailComponent,
    KhatedarUpdateComponent,
    KhatedarDeleteDialogComponent,
    ViewKhatedarComponent,
    ViewCitizenComponent,
    ViewSurveyComponent,
  ],
  entryComponents: [KhatedarDeleteDialogComponent],
})
export class KhatedarModule {}
