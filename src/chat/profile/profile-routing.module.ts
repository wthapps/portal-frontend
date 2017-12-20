import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@shared/services';
import { ZChatProfileComponent } from './profile.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'profile/:id',
        component: ZChatProfileComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatProfileRoutingModule {
}
