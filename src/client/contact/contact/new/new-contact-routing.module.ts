import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ZNewContactComponent } from './new-contact.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'new-contact',
        component: ZNewContactComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNewContactRoutingModule {
}
