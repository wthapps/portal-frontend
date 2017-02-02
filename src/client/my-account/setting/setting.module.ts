import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PartialsModule } from '../../core/partials/partials.module';

import { ACSettingRoutingModule } from './setting-routing.module';
import { ACSettingComponent } from './setting.component';

import { ACProfileComponent } from './profile/profile.component';
import { ACAccountComponent } from './account/account.component';
import { ACPreferencesComponent } from './preferences/preferences.component';
import { ACSharedModule } from '../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    ACSettingRoutingModule,
    PartialsModule,
    ReactiveFormsModule,
    ACSharedModule
  ],
  declarations: [
    ACSettingComponent,
    ACProfileComponent,
    ACAccountComponent,
    ACPreferencesComponent
  ],
  exports: [
    ACSettingComponent
  ]
})

export class ACSettingModule {
}
