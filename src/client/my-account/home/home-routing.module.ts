import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: '/setting/profile', pathMatch: 'full' }
    ])
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
