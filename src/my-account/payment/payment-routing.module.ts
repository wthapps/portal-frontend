import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MyPaymentComponent } from './payment.component';
import { MyPaymentConfirmComponent } from './payment-confirm.component';
import { AuthGuard } from '@wth/shared/services';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'payment',
        component: MyPaymentComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'payment/confirm',
        component: MyPaymentConfirmComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MyPaymentRoutingModule {}
