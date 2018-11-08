import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ProfilePageComponent } from './profile-page.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ProfilePageComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ProfilePageRouting {}
