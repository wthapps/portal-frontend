import { NgModule } from '@angular/core';

import { MyAppsRoutingModule } from './apps-routing.module';
import { MyAppsComponent } from './apps.component';
import { MyAppsListComponent } from './list/list.component';
import { MyAppsDetailComponent } from './detail/detail.component';
import { MyAppsService } from './apps.service';

import { MyAppsSharedModule } from './shared/shared.module';
import { MySharedModule } from '../shared/shared.module';
// import { SharedModule } from '@wth/shared/shared.module';
import { SharedServicesModule } from '@wth/shared/shared-services.module';

@NgModule({
  imports: [
    MyAppsRoutingModule,
    MyAppsSharedModule,
    MySharedModule,
    // SharedModule.forRoot(),
  ],
  declarations: [MyAppsComponent, MyAppsListComponent, MyAppsDetailComponent],
  exports: [MyAppsComponent],
  providers: [MyAppsService]
})
export class MyAppsModule {}
