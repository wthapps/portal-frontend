import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialSettingComponent } from './setting.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '',  component: ZSocialSettingComponent }
    ])
  ],
  exports: [RouterModule]
})
export class SocialSettingsRoutingModule { }
