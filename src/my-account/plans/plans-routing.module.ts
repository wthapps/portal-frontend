import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MyPlansComponent } from './plans.component';
import { AuthGuard } from '@wth/shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'plans',
        component: MyPlansComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MyPlansRoutingModule {
}
