import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteTrashComponent } from './trash.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'trash',
        component: ZNoteTrashComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteTrashRoutingModule {
}
