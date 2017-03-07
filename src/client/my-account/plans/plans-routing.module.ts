import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ACPlansComponent } from './plans.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'plans',
        component: ACPlansComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ACPlansRoutingModule {
}
