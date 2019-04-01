import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@shared/services';
import { ZChatSettingComponent } from './setting.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'settings',
        component: ZChatSettingComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatSettingRoutingModule {}
