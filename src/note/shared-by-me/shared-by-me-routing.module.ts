import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteFoldersComponent } from '@notes/folders/folders.component';
import { AuthGuard } from '@shared/services';
import { ZNoteSharedByMeComponent } from '@notes/shared-by-me/shared-by-me.component';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'shared-by-me',
        component: ZNoteSharedByMeComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      },
      {
        path: 'shared-by-me/folders/:id',
        component: ZNoteFoldersComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteSharedByMeRoutingModule {}
