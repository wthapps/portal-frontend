import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteFoldersComponent } from './folders.component';
import { AuthGuard } from '@wth/shared/services';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'folders/:id',
        component: ZNoteFoldersComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteFoldersRoutingModule {}
