import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteSharedWithMeComponent } from './shared-with-me.component';
import { AuthGuard } from '@wth/shared/services';
import { ZNoteFoldersComponent } from '@notes/folders/folders.component';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'shared-with-me',
        component: ZNoteSharedWithMeComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      },
      {
        path: 'shared-with-me/folders/:id',
        component: ZNoteFoldersComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteSharedWithMeRoutingModule {}
