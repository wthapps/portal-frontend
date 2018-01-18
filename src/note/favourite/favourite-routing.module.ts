import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from "@shared/services";
import { ZNoteFavouriteComponent } from './favourite.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ZNoteFavouriteComponent,
        canActivate: [AuthGuard]
      },
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteFavouriteRoutingModule {
}
