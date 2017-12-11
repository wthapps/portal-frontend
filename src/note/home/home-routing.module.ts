import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', redirectTo: '/my-note', pathMatch: 'full'}
    ])
  ],
  exports: [RouterModule]
})
export class BaseHomeRoutingModule {
}
