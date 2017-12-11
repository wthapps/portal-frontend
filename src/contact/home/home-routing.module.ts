import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', redirectTo: '/contacts', pathMatch: 'full' }
    ])
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule {
}
