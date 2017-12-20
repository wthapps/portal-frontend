import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@wth/shared/services';
import { MySettingComponent } from './setting.component';
import { MyProfileComponent } from './profile/profile.component';
import { MyAccountComponent } from './account/account.component';
import { MyPreferencesComponent } from './preferences/preferences.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'settings',
        component: MySettingComponent,
        canActivate: [AuthGuard],
        children: [
          {path: 'preferences', component: MyPreferencesComponent},
          {path: 'account', component: MyAccountComponent},
          {path: 'profile', component: MyProfileComponent},
          {path: 'password', component: MyAccountComponent},
          {path: 'delete_account', component: MyAccountComponent},
          {path: '', component: MySettingComponent},
          {path: '*', component: MySettingComponent}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MySettingRoutingModule {
}
