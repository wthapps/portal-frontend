import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@shared/services';
import { SubscriptionGuard } from '@shared/guards';

@NgModule({
  imports: [
    RouterModule.forRoot([
      /* define app module routes here, e.g., to lazily load a module
         (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
       */
      {
        path: 'notifications',
        loadChildren:
          './notifications/notifications.module#MyNotificationModule'
      },
      {
        path: 'payment',
        loadChildren: './payment/payment.module#MyPaymentModule'
      },
      {
        path: 'account-deleted',
        loadChildren:
          './account-deleted/account-deleted.module#AccountDeletedModule'
      },
      {
        path: 'users',
        loadChildren:
          './users/user.module#UserModule'
      },
      {
        path: '',
        redirectTo: '/settings/profile',
        pathMatch: 'full',
        canActivate: [AuthGuard, SubscriptionGuard]
      },
      {
        path: '*',
        redirectTo: '/settings/profile',
        pathMatch: 'full',
        canActivate: [AuthGuard, SubscriptionGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
