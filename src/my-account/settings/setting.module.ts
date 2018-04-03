import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MySettingRoutingModule } from './setting-routing.module';
import { MySettingComponent } from './setting.component';

import { MyProfileComponent } from './profile/profile.component';
import { MyAccountComponent } from './account/account.component';
import { MyPreferencesComponent } from './preferences/preferences.component';

import { MySharedModule } from '../shared/shared.module';
import { SharedModule } from '@wth/shared/shared.module';
import { SettingsPasswordComponent } from '@account/settings/password/password.component';
import { DeleteAccountComponent } from '@account/settings/delete-account/delete-account.component';

@NgModule({
  imports: [
    CommonModule,
    MySettingRoutingModule,
    MySharedModule.forRoot(),
    SharedModule.forRoot()
  ],
  declarations: [
    MySettingComponent,
    MyProfileComponent,
    SettingsPasswordComponent,
    MyAccountComponent,
    DeleteAccountComponent,
    MyPreferencesComponent
  ],
  exports: [MySettingComponent]
})
export class MySettingModule {}
