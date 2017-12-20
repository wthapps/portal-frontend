import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@shared/services';
import { ZChatMyProfileComponent } from './my-profile.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'my-profile',
        component: ZChatMyProfileComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatMyProfileRoutingModule {
}
