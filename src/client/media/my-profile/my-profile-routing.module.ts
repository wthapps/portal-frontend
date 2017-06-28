import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaMyProfileComponent } from './my-profile.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'my-profile', component: ZMediaMyProfileComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaMyProfileRoutingModule {
}
