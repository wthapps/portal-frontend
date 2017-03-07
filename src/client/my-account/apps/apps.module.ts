import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PartialsModule } from '../../core/partials/partials.module';

import { ACAppsRoutingModule } from './apps-routing.module';
import { ACAppsComponent } from './apps.component';
import { ACAppsListComponent } from './list/list.component';
import { ACAppsDetailComponent } from './detail/detail.component';
import { ACAppsService } from './apps.service';
import { ACAppsSharedModule } from './shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    PartialsModule,
    ReactiveFormsModule,
    ACAppsRoutingModule,
    ACAppsSharedModule.forRoot()
  ],
  declarations: [
    ACAppsComponent,
    ACAppsListComponent,
    ACAppsDetailComponent
  ],
  exports: [
    ACAppsComponent
  ],
  providers: [ACAppsService]
})

export class ACAppsModule {
}
