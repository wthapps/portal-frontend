import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteTrashComponent } from './trash.component';
import { AuthGuard } from '@wth/shared/services';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'trash',
        component: ZNoteTrashComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteTrashRoutingModule {}
