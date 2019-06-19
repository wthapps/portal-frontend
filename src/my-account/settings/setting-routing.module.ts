import { SettingsPasswordComponent } from '@account/settings/password/password.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@wth/shared/services';
import { MyAccountComponent } from './account/account.component';
import { MyPreferencesComponent } from './preferences/preferences.component';
import { MyProfileComponent } from './profile/profile.component';
import { MySettingComponent } from './setting.component';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'settings',
        component: MySettingComponent,
        canActivate: [AuthGuard, SubscriptionGuard],
        children: [
          { path: 'preferences', component: MyPreferencesComponent },
          { path: 'account', component: MyAccountComponent },
          { path: 'profile', component: MyProfileComponent },
          { path: 'password', component: SettingsPasswordComponent },
          { path: '', component: MySettingComponent },
          { path: '*', component: MySettingComponent }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MySettingRoutingModule {}
