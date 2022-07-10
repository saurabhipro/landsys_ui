import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SubDistrictComponent } from './list/sub-district.component';
import { SubDistrictDetailComponent } from './detail/sub-district-detail.component';
import { SubDistrictUpdateComponent } from './update/sub-district-update.component';
import { SubDistrictDeleteDialogComponent } from './delete/sub-district-delete-dialog.component';
import { SubDistrictRoutingModule } from './route/sub-district-routing.module';

@NgModule({
  imports: [SharedModule, SubDistrictRoutingModule],
  declarations: [SubDistrictComponent, SubDistrictDetailComponent, SubDistrictUpdateComponent, SubDistrictDeleteDialogComponent],
  entryComponents: [SubDistrictDeleteDialogComponent],
})
export class SubDistrictModule {}
