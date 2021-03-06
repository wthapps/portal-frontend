import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@shared/services';
import { MyInvitationsComponent } from './invitations/invitations.component';
import { MyAdminComponent } from './admin.component';
import { AccountListComponent } from './accounts/account-list.component';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'admin',
        component: MyAdminComponent,
        canActivate: [AuthGuard, SubscriptionGuard],
        children: [
          { path: '', component: AccountListComponent },
          // { path: 'accounts', component: AccountListComponent },
          { path: 'invitations', component: MyInvitationsComponent }
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MyAdminRoutingModule {}
