import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SequenceGenComponent } from './list/sequence-gen.component';
import { SequenceGenDetailComponent } from './detail/sequence-gen-detail.component';
import { SequenceGenUpdateComponent } from './update/sequence-gen-update.component';
import { SequenceGenDeleteDialogComponent } from './delete/sequence-gen-delete-dialog.component';
import { SequenceGenRoutingModule } from './route/sequence-gen-routing.module';

@NgModule({
  imports: [SharedModule, SequenceGenRoutingModule],
  declarations: [SequenceGenComponent, SequenceGenDetailComponent, SequenceGenUpdateComponent, SequenceGenDeleteDialogComponent],
  entryComponents: [SequenceGenDeleteDialogComponent],
})
export class SequenceGenModule {}
