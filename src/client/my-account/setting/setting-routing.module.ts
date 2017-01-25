import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SettingComponent } from './setting.component';
import { ProfileComponent } from './profile.component';
import { MyAccountComponent } from './my-account.component';
import { PreferencesComponent } from './preferences.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        // path: 'setting',
        path: '',
        component: SettingComponent,
        children: [
          {path: 'preferences', component: PreferencesComponent},
          {path: 'account', component: MyAccountComponent},
          {path: 'profile', component: ProfileComponent},
          {path: '', component: ProfileComponent},
          {path: '*', component: ProfileComponent}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class SettingRoutingModule {
}
