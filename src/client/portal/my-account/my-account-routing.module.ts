import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyAccountComponent } from './my-account.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'my-account', component: MyAccountComponent}
    ])
  ],
  exports: [RouterModule]
})
export class MyAccountRoutingModule {
}
