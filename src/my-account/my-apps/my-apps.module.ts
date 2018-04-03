import { NgModule } from '@angular/core';

import { MyMyAppsRoutingModule } from './my-apps-routing.module';
import { MySharedModule } from '../shared/shared.module';
import { MyMyAppsComponent } from './my-apps.component';
import { MyMyAppsListComponent } from './list/list.component';
import { MyMyAppsDetailComponent } from './detail/detail.component';
import { MyMyAppsDetailAddComponent } from './detail/detail-add.component';
import { MyDNSComponent } from './dns/dns.component';
import { MyDNSEditComponent } from './dns/dns-edit.component';

import { MyMyAppsService } from './my-apps.service';
import { MyDNSService } from './dns/dns.service';
import { MyAppsSharedModule } from '../apps/shared/shared.module';

import { SharedModule } from '@wth/shared/shared.module';

@NgModule({
  imports: [
    MyAppsSharedModule.forRoot(),
    MyMyAppsRoutingModule,
    MySharedModule.forRoot(),
    SharedModule.forRoot()
  ],
  declarations: [
    MyMyAppsComponent,
    MyMyAppsListComponent,
    MyMyAppsDetailComponent,
    MyMyAppsDetailAddComponent,
    MyDNSComponent,
    MyDNSEditComponent
  ],
  exports: [
    MyMyAppsComponent,
    MyMyAppsListComponent,
    MyMyAppsDetailComponent,
    MyMyAppsDetailAddComponent,
    MyDNSComponent,
    MyDNSEditComponent
  ],
  providers: [MyMyAppsService, MyDNSService]
})
export class MyMyAppsModule {}
