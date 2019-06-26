import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@shared/services';
import { ZNoteFavouriteComponent } from './favourite.component';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ZNoteFavouriteComponent,
        canActivate: [AuthGuard, SubscriptionGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class ZNoteFavouriteRoutingModule {}
