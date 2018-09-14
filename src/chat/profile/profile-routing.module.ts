import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@shared/services';
import { ZChatProfileComponent } from './profile.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'profile', loadChildren:
        './profile.module#ZChatProfileModule'
      },
      {  path: ':id',
        component: ZChatProfileComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZChatProfileRoutingModule {}
