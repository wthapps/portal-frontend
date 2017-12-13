import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteSharedWithMeComponent } from './shared-with-me.component';
import { AuthGuard } from '@wth/shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'shared-with-me',
        component: ZNoteSharedWithMeComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteSharedWithMeRoutingModule {
}
