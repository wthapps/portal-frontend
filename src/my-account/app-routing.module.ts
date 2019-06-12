import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forRoot([
      /* define app module routes here, e.g., to lazily load a module
         (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
       */
      {
        path: '',
        redirectTo: '/settings/profile',
        pathMatch: 'full'
      },
      {
        path: 'contact',
        loadChildren: './contact-us/contact.module#ContactUsModule'
      },
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
      }
    ])
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
