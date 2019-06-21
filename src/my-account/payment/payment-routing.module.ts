import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuard } from '@wth/shared/services';
import { CurrentSubscriptionComponent } from './subscription/current-subscription.component';
import { MyPaymentComponent } from './payment.component';
import { PaymentMethodListComponent } from './payment-method/payment-method-list.component';
import { BillingListComponent } from '@account/payment/billing';
import { SubscriptionUpgradeComponent } from './subscription/subscription-upgrade.component';
import { SubscriptionAlertComponent } from './subscription/subscription-alert.component';
import { TransactionDetailComponent } from '@account/payment/billing/transaction/transaction-detail.component';
import { SubscriptionGuard } from '@shared/guards';

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
          },
          {
            path: 'billings/transactions/:id',
            component: TransactionDetailComponent,
          },
          {
            path: 'billings',
            component: BillingListComponent,
          },
        ]
      },
      {
        path: 'subscription/upgrade',
        component: SubscriptionUpgradeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'subscription/alert',
        component: SubscriptionAlertComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MyPaymentRoutingModule {}
