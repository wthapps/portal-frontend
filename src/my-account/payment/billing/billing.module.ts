import { NgModule } from '@angular/core';
import { MySharedModule } from '@account/shared/shared.module';
import { BillingListComponent } from '@account/payment/billing/billing-list.component';
import { TransactionDetailComponent } from '@account/payment/billing/transaction/transaction-detail.component';
import { TransactionService } from './transaction/transaction.service';


@NgModule({
  imports: [
    MySharedModule
  ],
  declarations: [
    BillingListComponent,
    TransactionDetailComponent
  ],
  exports: [
    BillingListComponent,
    TransactionDetailComponent
  ],
  providers: [
    TransactionService
  ]
})

export class BillingModule {}
