import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SurveyComponent } from './list/survey.component';
import { SurveyDetailComponent } from './detail/survey-detail.component';
import { SurveyUpdateComponent } from './update/survey-update.component';
import { SurveyDeleteDialogComponent } from './delete/survey-delete-dialog.component';
import { SurveyRoutingModule } from './route/survey-routing.module';
import { CreateSurveyLandCompensationComponent } from './create-survey-land-compensation/create-survey-land-compensation.component';
import { LandCompensationCreateComponent } from './modal-create-land-compensation/land-compensation-create.component';

@NgModule({
  imports: [SharedModule, SurveyRoutingModule],
  declarations: [SurveyComponent, SurveyDetailComponent, SurveyUpdateComponent, SurveyDeleteDialogComponent, CreateSurveyLandCompensationComponent, LandCompensationCreateComponent],
  entryComponents: [SurveyDeleteDialogComponent, LandCompensationCreateComponent],
})
export class SurveyModule {}
