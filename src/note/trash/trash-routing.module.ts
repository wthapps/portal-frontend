import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteTrashComponent } from './trash.component';
import { AuthGuard } from '@wth/shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'trash',
        component: ZNoteTrashComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteTrashRoutingModule {
}
