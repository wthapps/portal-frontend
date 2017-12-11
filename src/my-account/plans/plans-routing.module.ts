import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyPlansComponent } from './plans.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'plans',
        component: MyPlansComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class MyPlansRoutingModule {
}
