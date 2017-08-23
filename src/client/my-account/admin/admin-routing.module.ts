import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyInvitationsComponent } from './invitations/invitations.component';
import { MyAdminComponent } from './admin.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'admin',
        component: MyAdminComponent,
        children: [
          {path: '', component: MyInvitationsComponent},
          {path: 'invitations', component: MyInvitationsComponent}
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MyAdminRoutingModule {
}
