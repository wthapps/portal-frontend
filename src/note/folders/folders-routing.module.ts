import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteFoldersComponent } from './folders.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'folders/:id', component: ZNoteFoldersComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteFoldersRoutingModule {
}
