import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteFoldersComponent } from "note/folders/folders.component";
import { AuthGuard } from "@shared/services";
import { ZNoteSharedByMeComponent } from "note/shared-by-me/shared-by-me.component";

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'shared-by-me',
        component: ZNoteSharedByMeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'shared-by-me/folders/:id',
        component: ZNoteFoldersComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteSharedByMeRoutingModule {
}
