import { NgModule } from '@angular/core';

import { SharedModule } from '@wth/shared/shared.module';
import { DashboardComponent } from '@account/dashboard/dashboard.component';
import { DashboardRoutingModule } from '@account/dashboard/dashboard-routing.module';

@NgModule({
  imports: [
    DashboardRoutingModule,
    SharedModule.forRoot()
  ],
  declarations: [
    DashboardComponent
  ],
  exports: [
    DashboardComponent
  ],
  providers: []
})
export class DashboardModule {}
