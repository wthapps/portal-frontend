import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ACBillingComponent } from './billing.component';
import { ACBillingDetailsComponent } from './details/details.component';
import { ACBillingHistoryComponent } from './history/history.component';
import { ACReceiptComponent } from './transaction/receipt.component';
import { ACTransactionDetailsComponent } from './transaction/details.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'billing',
        component: ACBillingComponent,
        children: [
          {path: 'details', component: ACBillingDetailsComponent},
          {path: 'history', component: ACBillingHistoryComponent},
          {path: '', component: ACBillingHistoryComponent},
          {path: '*', component: ACBillingHistoryComponent}
        ]
      },
      {path: 'transactions/:id/receipt', component: ACReceiptComponent},
      {path: 'transactions/:id', component: ACTransactionDetailsComponent},
    ])
  ],
  exports: [RouterModule]
})
export class ACBillingRoutingModule {
}
