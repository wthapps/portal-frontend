import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteSharedWithMeComponent } from './shared-with-me.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'shared-with-me',
        component: ZNoteSharedWithMeComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteSharedWithMeRoutingModule {
}
