import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', redirectTo: '/photos', pathMatch: 'full'}
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaHomeRoutingModule {
}
