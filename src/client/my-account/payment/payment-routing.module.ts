import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ACPaymentComponent } from './payment.component';
import { ACPaymentConfirmComponent } from './payment-confirm.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'payment',
        component: ACPaymentComponent
      },
      {
        path: 'payment/confirm',
        component: ACPaymentConfirmComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ACPaymentRoutingModule {
}
