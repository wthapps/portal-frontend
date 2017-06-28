import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZChatMyProfileComponent } from './my-profile.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'my-profile',
        component: ZChatMyProfileComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatMyProfileRoutingModule {
}
