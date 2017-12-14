import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZContactMyProfileComponent } from './my-profile.component';
import { AuthGuard } from '@wth/shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'my-profile',
        component: ZContactMyProfileComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZContactMyProfileRoutingModule {
}
