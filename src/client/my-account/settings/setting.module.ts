import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MySettingRoutingModule } from './setting-routing.module';
import { MySettingComponent } from './setting.component';

import { MyProfileComponent } from './profile/profile.component';
import { MyAccountComponent } from './account/account.component';
import { MyPreferencesComponent } from './preferences/preferences.component';

import { MySharedModule } from '../shared/shared.module';
import { CoreSharedModule } from '../../core/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    MySettingRoutingModule,
    MySharedModule.forRoot(),
    CoreSharedModule.forRoot(),
  ],
  declarations: [
    MySettingComponent,
    MyProfileComponent,
    MyAccountComponent,
    MyPreferencesComponent
  ],
  exports: [
    MySettingComponent
  ]
})

export class MySettingModule {
}
