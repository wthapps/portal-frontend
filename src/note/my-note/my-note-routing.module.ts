import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteMyNoteComponent } from './my-note.component';
import { AuthGuard } from '@wth/shared/services';
import { ZNotePublicViewComponent } from '@notes/detail/public-view.component';

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
        canActivate: [AuthGuard]
      },
      {
        path: 'notes/public/:id',
        component: ZNotePublicViewComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteMyNoteRoutingModule {}
