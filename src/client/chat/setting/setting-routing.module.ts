import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZChatSettingComponent } from './setting.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'setting',
        component: ZChatSettingComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatSettingRoutingModule {
}
