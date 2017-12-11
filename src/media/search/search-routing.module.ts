import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ZMediaSearchComponent } from './search.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'search',
        component: ZMediaSearchComponent,
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZMediaSearchRoutingModule {
}
