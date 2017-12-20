import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot([
      /* define app module routes here, e.g., to lazily load a module
         (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
       */
      // { path: 'settings', loadChildren: './settings/contact-settings.module#SettingsModule'}
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

