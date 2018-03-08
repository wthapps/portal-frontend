import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@shared/services';
import { MyBillingComponent } from './billing.component';
import { MyBillingHistoryComponent } from './history/history.component';
import { MyReceiptComponent } from './transaction/receipt.component';
import { MyTransactionDetailsComponent } from './transaction/details.component';
import { MySubscriptionComponent } from '@account/billing/subscription/subscription.component';
import { MySubscriptionHistoryComponent } from '@account/billing/subscription/subscription-history.component';
import { MyPlanComponent } from '@account/billing/plan/plan.component';
import { PaymentMethodComponent } from '@account/billing/payment-method/payment-method.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'billing',
        component: MyBillingComponent,
        canActivate: [AuthGuard],
        children: [
          {path: 'subscription', component: MySubscriptionComponent},
          {path: 'subscription_history', component: MySubscriptionHistoryComponent},
          {path: 'payment_method', component: PaymentMethodComponent},
          {path: 'plan', component: MyPlanComponent},
          {path: 'history', component: MyBillingHistoryComponent},
          {path: '', component: MyBillingHistoryComponent},
          {path: '*', component: MyBillingHistoryComponent}
        ]
      },
      {path: 'transactions/:id/receipt', component: MyReceiptComponent, canActivate: [AuthGuard]},
      {path: 'transactions/:id', component: MyTransactionDetailsComponent, canActivate: [AuthGuard]},
    ])
  ],
  exports: [RouterModule]
})
export class MyBillingRoutingModule {
}
