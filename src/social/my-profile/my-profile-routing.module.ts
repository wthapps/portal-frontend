import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZSocialMyProfileComponent } from './my-profile.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', component: ZSocialMyProfileComponent},
      ])
  ],
  exports: [RouterModule]
})
export class MyProfileRoutingModule { }
