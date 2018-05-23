import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteSettingsComponent } from './settings.component';
import { AuthGuard } from '@wth/shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'settings',
        component: ZNoteSettingsComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteSettingsRoutingModule {}
