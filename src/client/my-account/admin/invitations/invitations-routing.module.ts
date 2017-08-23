import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyInvitationsComponent } from './invitations.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'invitations',
        component: MyInvitationsComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class MyInvitationsRoutingModule {
}
