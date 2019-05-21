import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { CurrentSubscriptionComponent } from './subscription/current-subscription.component';
import { MyPaymentComponent } from './payment.component';
import { PaymentMethodListComponent } from './payment-method/payment-method-list.component';
import { BillingListComponent } from '@account/payment/billing';
import { UpgradeCompletionComponent } from '@account/payment/upgrade';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MyPaymentComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: 'subscription',
            component: CurrentSubscriptionComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'payment_method',
            component: PaymentMethodListComponent,
            canActivate: [AuthGuard]
          },
          {
            path: 'billings',
            component: BillingListComponent,
            canActivate: [AuthGuard]
          }
        ]
      },
      {
        path: 'upgrade',
        component: UpgradeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'upgrade_completion',
        component: UpgradeCompletionComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MyPaymentRoutingModule {}
