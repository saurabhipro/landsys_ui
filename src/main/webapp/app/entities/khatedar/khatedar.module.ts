import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { KhatedarComponent } from './list/khatedar.component';
import { KhatedarDetailComponent } from './detail/khatedar-detail.component';
import { KhatedarUpdateComponent } from './update/khatedar-update.component';
import { KhatedarDeleteDialogComponent } from './delete/khatedar-delete-dialog.component';
import { KhatedarRoutingModule } from './route/khatedar-routing.module';

@NgModule({
  imports: [SharedModule, KhatedarRoutingModule],
  declarations: [KhatedarComponent, KhatedarDetailComponent, KhatedarUpdateComponent, KhatedarDeleteDialogComponent],
  entryComponents: [KhatedarDeleteDialogComponent],
})
export class KhatedarModule {}
