import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ACSettingComponent } from './setting.component';

import { ACProfileComponent } from './profile/profile.component';
import { ACAccountComponent } from './account/account.component';
import { ACPreferencesComponent } from './preferences/preferences.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'setting',
        component: ACSettingComponent,
        children: [
          {path: 'preferences', component: ACPreferencesComponent},
          {path: 'account', component: ACAccountComponent},
          {path: 'profile', component: ACProfileComponent},
          {path: '', component: ACProfileComponent},
          {path: '*', component: ACProfileComponent}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ACSettingRoutingModule {
}
