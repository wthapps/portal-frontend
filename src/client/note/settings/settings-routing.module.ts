import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteSettingsComponent } from './settings.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'settings',
        component: ZNoteSettingsComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteSettingsRoutingModule {
}
