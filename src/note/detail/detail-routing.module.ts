import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteDetailEditComponent } from './edit.component';
import { AuthGuard } from '@wth/shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'new_note', component: ZNoteDetailEditComponent, outlet: 'detail', canActivate: [AuthGuard]},
      {path: 'notes/:id', component: ZNoteDetailEditComponent, outlet: 'detail', canActivate: [AuthGuard]}
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteDetailRoutingModule {
}
