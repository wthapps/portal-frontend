import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { ContactSearchComponent } from '@contacts/search/search.component';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'search',
        canActivate: [AuthGuard, SubscriptionGuard],
        children: [
          {
            path: '',
            component: ContactSearchComponent
          },
          {
            path: ':id',
            component: ContactSearchComponent
          }
        ]
      },
    ])
  ],
  exports: [RouterModule]
})
export class ZContactSearchRoutingModule { }
