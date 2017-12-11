import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SettingsComponent } from './contact-settings.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'settings',
        component: SettingsComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZContactSettingsRoutingModule {
}
