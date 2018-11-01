import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ProfileComponent } from '@wth/shared/user';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
