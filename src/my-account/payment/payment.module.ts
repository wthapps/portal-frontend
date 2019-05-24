import { NgModule } from '@angular/core';

import { MyPaymentRoutingModule } from './payment-routing.module';
import { MyPaymentService } from './payment.service';
import { MyPaymentConfirmComponent } from './payment-confirm.component';
import { MySharedModule } from '../shared/shared.module';
import { MyPaymentComponent } from './payment.component';
import { PaymentMethodModule } from './payment-method';
import { BillingModule } from './billing';
import { UpgradeModule } from './upgrade';
import { SubscriptionModule } from './subscription';

@NgModule({
  imports: [
    MyPaymentRoutingModule,
    MySharedModule,
    PaymentMethodModule,
    UpgradeModule,
    SubscriptionModule,
    BillingModule
  ],
  declarations: [
    MyPaymentComponent,
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
