import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', redirectTo: '/settings/profile', pathMatch: 'full'}
    ])
  ],
  exports: [RouterModule]
})
export class MyHomeRoutingModule {
}
