import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteMyNoteComponent } from './my-note.component';
import { AuthGuard } from '@wth/shared/services';

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
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteMyNoteRoutingModule {}
