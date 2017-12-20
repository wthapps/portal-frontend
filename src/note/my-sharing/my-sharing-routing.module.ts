import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteMySharingComponent } from './my-sharing.component';
import { ZNoteFoldersComponent } from "note/folders/folders.component";
import { AuthGuard } from "@shared/services";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'my-sharing',
        component: ZNoteMySharingComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'my-sharing/folders/:id',
        component: ZNoteFoldersComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteMySharingRoutingModule {
}
