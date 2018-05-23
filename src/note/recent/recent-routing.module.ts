import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@shared/services';
import { ZNoteRecentComponent } from './recent.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ZNoteRecentComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteRecentRoutingModule {}
