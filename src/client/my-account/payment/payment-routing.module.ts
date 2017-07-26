import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyPaymentComponent } from './payment.component';
import { MyPaymentConfirmComponent } from './payment-confirm.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'payment',
        component: MyPaymentComponent
      },
      {
        path: 'payment/confirm',
        component: MyPaymentConfirmComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class MyPaymentRoutingModule {
}
