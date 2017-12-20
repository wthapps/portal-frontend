import { NgModule } from '@angular/core';
import { MyBillingRoutingModule } from './billing-routing.module';
import { MySharedModule } from '../shared/shared.module';
import { MyBillingComponent } from './billing.component';
import { MyBillingDetailsComponent } from './details/details.component';
import { MyBillingHistoryComponent } from './history/history.component';
import { MyTransactionDetailsComponent } from './transaction/details.component';
import { MyReceiptComponent } from './transaction/receipt.component';
import { MyTransactionService } from './shared/transaction.service';
import { SharedModule } from '@wth/shared/shared.module';

@NgModule({
  imports: [
    MyBillingRoutingModule,
    MySharedModule.forRoot(),
    SharedModule.forRoot()
  ],
  declarations: [
    MyBillingComponent,
    MyBillingDetailsComponent,
    MyBillingHistoryComponent,
    MyTransactionDetailsComponent,
    MyReceiptComponent
  ],
  exports: [
    MyBillingComponent,
    MyBillingDetailsComponent,
    MyBillingHistoryComponent,
    MyTransactionDetailsComponent,
    MyReceiptComponent
  ],
  providers: [MyTransactionService]
})

export class MyBillingModule {
}
