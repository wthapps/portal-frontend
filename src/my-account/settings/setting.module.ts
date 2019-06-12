import { SettingsPasswordComponent } from '@account/settings/password/password.component';
import { MyStorageComponent } from '@account/settings/storage/storage.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { MySharedModule } from '../shared/shared.module';
import { MyAccountComponent } from './account/account.component';
import { MyPreferencesComponent } from './preferences/preferences.component';

import { MyProfileComponent } from './profile/profile.component';

import { MySettingRoutingModule } from './setting-routing.module';
import { MySettingComponent } from './setting.component';
import { ModalModule } from '@shared/modals';
import { AutofocusModule } from '@shared/directives/autofocus';
import { ProfileService } from '@shared/user/services';

@NgModule({
  imports: [
    CommonModule,
    MySettingRoutingModule,
    ModalModule,
    AutofocusModule,
    MySharedModule,
  ],
  declarations: [
    MySettingComponent,
    MyProfileComponent,
    SettingsPasswordComponent,
    MyAccountComponent,
    // DeleteAccountComponent,
    MyPreferencesComponent,
    MyStorageComponent
  ],
  exports: [MySettingComponent],
  providers: [ProfileService]
})
export class MySettingModule {}
