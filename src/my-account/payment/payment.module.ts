import { NgModule } from '@angular/core';

import { MyPaymentRoutingModule } from './payment-routing.module';
import { MyPaymentService } from './payment.service';
import { MyPaymentConfirmComponent } from './payment-confirm.component';
import { MySharedModule } from '../shared/shared.module';
import { CurrentSubscriptionComponent } from '@account/payment/subscription/current-subscription.component';
import { MyPaymentComponent } from './payment.component';
import { PaymentMethodModule } from './payment-method';
import { BillingModule } from './billing';
import { UpgradeModule } from './upgrade';

@NgModule({
  imports: [
    MyPaymentRoutingModule,
    MySharedModule,
    PaymentMethodModule,
    UpgradeModule,
    BillingModule
  ],
  declarations: [
    MyPaymentComponent,
    CurrentSubscriptionComponent,
    MyPaymentConfirmComponent
  ],
  exports: [
    MyPaymentConfirmComponent
  ],
  providers: [
    MyPaymentService
  ]
})

export class MyPaymentModule {}
