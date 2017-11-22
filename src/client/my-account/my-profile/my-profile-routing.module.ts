import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyAccountMyProfileComponent } from './my-profile.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'my-profile', component: MyAccountMyProfileComponent}
    ])
  ],
  exports: [RouterModule]
})
export class MyAccountMyProfileRoutingModule {
}
