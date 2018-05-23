import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteFoldersComponent } from './folders.component';
import { AuthGuard } from '@wth/shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'folders/:id',
        component: ZNoteFoldersComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteFoldersRoutingModule {}
