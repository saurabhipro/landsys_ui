import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { Form11Component } from './list/form-11.component';
import { Form11DetailComponent } from './detail/form-11-detail.component';
import { Form11UpdateComponent } from './update/form-11-update.component';
import { Form11DeleteDialogComponent } from './delete/form-11-delete-dialog.component';
import { Form11RoutingModule } from './route/form-11-routing.module';

@NgModule({
  imports: [SharedModule, Form11RoutingModule],
  declarations: [Form11Component, Form11DetailComponent, Form11UpdateComponent, Form11DeleteDialogComponent],
  entryComponents: [Form11DeleteDialogComponent],
})
export class Form11Module {}
