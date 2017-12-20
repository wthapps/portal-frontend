import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: '', redirectTo: '/welcome', pathMatch: 'full', canActivate: [AuthGuard]}
    ])
  ],
  exports: [RouterModule]
})
export class MyHomeRoutingModule {
}
