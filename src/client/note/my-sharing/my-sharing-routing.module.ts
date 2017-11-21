import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNoteMySharingComponent } from './my-sharing.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'my-sharing',
        component: ZNoteMySharingComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteMySharingRoutingModule {
}
