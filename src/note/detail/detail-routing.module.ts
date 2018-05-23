import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteDetailEditComponent } from './edit.component';
import { AuthGuard } from '@wth/shared/services';
import { ZNotePublicViewComponent } from '@notes/detail/public-view.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'new_note',
        component: ZNoteDetailEditComponent,
        outlet: 'detail',
        canActivate: [AuthGuard]
      },
      {
        path: 'note_public/:id',
        component: ZNotePublicViewComponent,
        outlet: 'detail',
        canActivate: [AuthGuard]
      },
      {
        path: 'notes/:id',
        component: ZNoteDetailEditComponent,
        outlet: 'detail',
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteDetailRoutingModule {}
