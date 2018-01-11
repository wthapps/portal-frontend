import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteDetailEditComponent } from './edit.component';
import { AuthGuard } from '@wth/shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'notes/:id', component: ZNoteDetailEditComponent, canActivate: [AuthGuard]}
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteDetailRoutingModule {
}
