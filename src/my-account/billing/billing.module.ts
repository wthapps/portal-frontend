import { NgModule } from '@angular/core';
import { MyBillingRoutingModule } from './billing-routing.module';
import { MySharedModule } from '../shared/shared.module';
import { MyBillingComponent } from './billing.component';
import { MyBillingHistoryComponent } from './history/history.component';
import { MyTransactionDetailsComponent } from './transaction/details.component';
import { MyReceiptComponent } from './transaction/receipt.component';
import { MyTransactionService } from './shared/transaction.service';
import { SharedModule } from '@wth/shared/shared.module';
import { MySubscriptionComponent } from '@account/billing/subscription/subscription.component';
import { MySubscriptionHistoryComponent } from '@account/billing/subscription/subscription-history.component';
import { MyPlanComponent } from '@account/billing/plan/plan.component';
import { PaymentMethodModule } from '@account/billing/payment-method';

@NgModule({
  imports: [
    PaymentMethodModule,

    MyBillingRoutingModule,
    MySharedModule,
    SharedModule
  ],
  declarations: [
    MyBillingComponent,
    MyBillingHistoryComponent,
    MyTransactionDetailsComponent,
    MyReceiptComponent,
    MySubscriptionComponent,
    MySubscriptionHistoryComponent,
    MyPlanComponent
  ],
  exports: [
    PaymentMethodModule,
    MyBillingComponent,
    MyBillingHistoryComponent,
    MyTransactionDetailsComponent,
    MyReceiptComponent,
    MySubscriptionComponent,
    MySubscriptionHistoryComponent,
    MyPlanComponent
  ],
  providers: [MyTransactionService]
})

export class MyBillingModule {
}
