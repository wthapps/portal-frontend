import { NgModule } from '@angular/core';

import { MyPaymentRoutingModule } from './payment-routing.module';
import { MyPaymentService } from './payment.service';
import { MyPaymentConfirmComponent } from './payment-confirm.component';
import { MySharedModule } from '../shared/shared.module';
import { MyPaymentComponent } from './payment.component';
import { PaymentMethodModule } from './payment-method';
import { BillingModule } from './billing';
import { AccountService } from '@account/shared/account/account.service';
import { MySubscriptionModule } from './subscription/subscription.module';

@NgModule({
  imports: [
    MyPaymentRoutingModule,
    MySharedModule,
    PaymentMethodModule,
    MySubscriptionModule,
    BillingModule
  ],
  declarations: [MyPaymentComponent, MyPaymentConfirmComponent],
  exports: [MyPaymentConfirmComponent],
  providers: [AccountService, MyPaymentService]
})
export class MyPaymentModule {}
