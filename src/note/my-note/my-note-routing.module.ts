import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteMyNoteComponent } from './my-note.component';
import { AuthGuard } from '@wth/shared/services';
import { ZNotePublicViewComponent } from '@notes/detail/public-view.component';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'my-note',
        component: ZNoteMyNoteComponent,
        children: [
          {
            path: 'folders/:id',
            redirectTo: '/folders/:id',
            pathMatch: 'full'
          }
        ],
        canActivate: [AuthGuard, SubscriptionGuard]
      },
      {
        path: 'notes/public/:id',
        component: ZNotePublicViewComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteMyNoteRoutingModule {}
