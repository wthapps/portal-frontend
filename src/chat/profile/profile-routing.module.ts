import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZChatProfileComponent } from './profile.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'profile/:id',
        component: ZChatProfileComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatProfileRoutingModule {
}
