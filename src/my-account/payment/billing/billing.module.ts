import { NgModule } from '@angular/core';
import { MySharedModule } from '@account/shared/shared.module';
import { BillingListComponent } from '@account/payment/billing/billing-list.component';
import { MyTransactionDetailsComponent } from '@account/payment/billing/transaction/details.component';
import { MyReceiptComponent } from '@account/payment/billing/transaction/receipt.component';


@NgModule({
  imports: [
    MySharedModule
  ],
  declarations: [
    BillingListComponent,
    MyTransactionDetailsComponent,
    MyReceiptComponent
  ],
  exports: [
    BillingListComponent
  ],
  providers: [

  ]
})

export class BillingModule {}
