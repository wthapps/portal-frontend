import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZContactMyProfileComponent } from './my-profile.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'my-profile',
        component: ZContactMyProfileComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZContactMyProfileRoutingModule {
}
