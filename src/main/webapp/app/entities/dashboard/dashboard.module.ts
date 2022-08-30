import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { DASHBOARD_ROUTE } from './dashboard.route';
import { DashboardComponent } from './dashboard.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild([DASHBOARD_ROUTE])],
  declarations: [DashboardComponent],
})
export class DashboardModule {}
