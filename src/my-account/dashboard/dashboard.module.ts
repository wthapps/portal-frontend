import { NgModule } from '@angular/core';

import { SharedModule } from '@wth/shared/shared.module';
import { DashboardComponent } from '@account/dashboard/dashboard.component';
import { DashboardRoutingModule } from '@account/dashboard/dashboard-routing.module';
import { MySharedModule } from '@account/shared/shared.module';

@NgModule({
  imports: [

    DashboardRoutingModule,
    MySharedModule,
    SharedModule
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
