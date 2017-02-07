import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: '/media/photo', pathMatch: 'full' }
    ])
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
