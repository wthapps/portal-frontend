import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZContactSettingsComponent } from './contact-settings.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'settings',
        component: ZContactSettingsComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZContactSettingsRoutingModule {
}
