import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@wth/shared/services';
import { ZMyProfileComponent } from '@shared/shared/components/profile/my-profile/my-profile.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'my-profile',
        component: ZMyProfileComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZContactMyProfileRoutingModule {}
