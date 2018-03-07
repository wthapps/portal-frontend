import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@shared/services';
import { ZMyProfileComponent } from '@shared/shared/components/profile/my-profile/my-profile.component';
import { ZChatMyProfileComponent } from '@chat/my-profile/my-profile.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'my-profile',
        component: ZChatMyProfileComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: '',
            component: ZMyProfileComponent
          }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatMyProfileRoutingModule {
}
