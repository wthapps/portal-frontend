import { NgModule } from '@angular/core';

import { MyAppsRoutingModule } from './apps-routing.module';
import { MyAppsComponent } from './apps.component';
import { MyAppsListComponent } from './list/list.component';
import { MyAppsDetailComponent } from './detail/detail.component';
import { MyAppsService } from './apps.service';

import { MyAppsSharedModule } from './shared/shared.module';
import { MySharedModule } from '../shared/shared.module';
import { CoreSharedModule } from '../../core/shared/shared.module';


@NgModule({
  imports: [
    MyAppsRoutingModule,
    MyAppsSharedModule.forRoot(),
    MySharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    MyAppsComponent,
    MyAppsListComponent,
    MyAppsDetailComponent
  ],
  exports: [
    MyAppsComponent
  ],
  providers: [MyAppsService]
})

export class MyAppsModule {
}
