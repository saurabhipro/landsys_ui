import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SequenceGeneratorComponent } from './list/sequence-generator.component';
import { SequenceGeneratorDetailComponent } from './detail/sequence-generator-detail.component';
import { SequenceGeneratorUpdateComponent } from './update/sequence-generator-update.component';
import { SequenceGeneratorDeleteDialogComponent } from './delete/sequence-generator-delete-dialog.component';
import { SequenceGeneratorRoutingModule } from './route/sequence-generator-routing.module';

@NgModule({
  imports: [SharedModule, SequenceGeneratorRoutingModule],
  declarations: [
    SequenceGeneratorComponent,
    SequenceGeneratorDetailComponent,
    SequenceGeneratorUpdateComponent,
    SequenceGeneratorDeleteDialogComponent,
  ],
  entryComponents: [SequenceGeneratorDeleteDialogComponent],
})
export class SequenceGeneratorModule {}
