import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PartialsModule } from '../../core/partials/partials.module';

import { ACSharedModule } from '../shared/shared.module';

import { ACBillingRoutingModule } from './billing-routing.module';
import { ACBillingComponent } from './billing.component';
import { ACTransactionService } from './shared/transaction.service';
import { ACBillingDetailsComponent } from './details/details.component';
import { ACBillingHistoryComponent } from './history/history.component';
import { ACTransactionDetailsComponent } from './transaction/details.component';
import { ACReceiptComponent } from './transaction/receipt.component';




@NgModule({
  imports: [
    CommonModule,
    PartialsModule,
    ReactiveFormsModule,
    ACBillingRoutingModule,
    ACSharedModule
  ],
  declarations: [
    ACBillingComponent,
    ACBillingDetailsComponent,
    ACBillingHistoryComponent,
    ACTransactionDetailsComponent,
    ACReceiptComponent
  ],
  exports: [
    ACBillingComponent,
    ACTransactionDetailsComponent,
    ACReceiptComponent
  ],
  providers: [ACTransactionService]
})

export class ACBillingModule {
}
