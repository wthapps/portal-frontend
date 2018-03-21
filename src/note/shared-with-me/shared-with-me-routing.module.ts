import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteSharedWithMeComponent } from './shared-with-me.component';
import { AuthGuard } from '@wth/shared/services';
import { ZNoteFoldersComponent } from 'note/folders/folders.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'shared-with-me',
        component: ZNoteSharedWithMeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'shared-with-me/folders/:id',
        component: ZNoteFoldersComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteSharedWithMeRoutingModule {}
