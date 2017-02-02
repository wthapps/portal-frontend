import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PartialsModule } from '../../core/partials/partials.module';

import { ACMyAppsComponent } from './my-apps.component';
import { ACMyAppsRoutingModule } from './my-apps-routing.module';
import { ACMyAppsListComponent } from './list/list.component';
import { ACMyAppsDetailAddComponent } from './detail/detail-add.component';
import { ACMyAppsDetailComponent } from './detail/detail.component';
import { ACAppsSharedModule } from '../apps/shared/shared.module';
import { ACMyAppsService } from './my-apps.service';
import { ACDNSService } from './dns/dns.service';
import { ACDNSComponent } from './dns/dns.component';
import { ACDNSEditComponent } from './dns/dns-edit.component';

@NgModule({
  imports: [
    CommonModule,
    ACMyAppsRoutingModule,
    ReactiveFormsModule,
    PartialsModule,
    ACAppsSharedModule.forRoot()
  ],
  declarations: [
    ACMyAppsComponent,
    ACMyAppsListComponent,
    ACMyAppsDetailComponent,
    ACMyAppsDetailAddComponent,
    ACDNSComponent,
    ACDNSEditComponent
  ],
  exports: [
    ACMyAppsComponent
  ],
  providers: [
    ACMyAppsService,
    ACDNSService
  ]
})

export class ACMyAppsModule {
}
