import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthGuard } from '@shared/services';
import { MyBillingComponent } from './billing.component';
import { MyBillingDetailsComponent } from './details/details.component';
import { MyBillingHistoryComponent } from './history/history.component';
import { MyReceiptComponent } from './transaction/receipt.component';
import { MyTransactionDetailsComponent } from './transaction/details.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'billing',
        component: MyBillingComponent,
        canActivate: [AuthGuard],
        children: [
          {path: 'details', component: MyBillingDetailsComponent},
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
