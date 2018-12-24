import { DeleteAccountComponent } from '@account/settings/delete-account/delete-account.component';
import { SettingsPasswordComponent } from '@account/settings/password/password.component';
import { MyStorageComponent } from '@account/settings/storage/storage.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedServicesModule } from '@wth/shared/shared-services.module';
import { SharedModule } from '@wth/shared/shared.module';

import { MySharedModule } from '../shared/shared.module';
import { MyAccountComponent } from './account/account.component';
import { MyPreferencesComponent } from './preferences/preferences.component';

import { MyProfileComponent } from './profile/profile.component';

import { MySettingRoutingModule } from './setting-routing.module';
import { MySettingComponent } from './setting.component';

@NgModule({
  imports: [
    CommonModule,
    MySettingRoutingModule,
    MySharedModule.forRoot(),
    SharedModule.forRoot(),
    SharedServicesModule.forRoot()
  ],
  declarations: [
    MySettingComponent,
    MyProfileComponent,
    SettingsPasswordComponent,
    MyAccountComponent,
    DeleteAccountComponent,
    MyPreferencesComponent,
    MyStorageComponent
  ],
  exports: [MySettingComponent]
})
export class MySettingModule {
}
