import { NgModule } from '@angular/core';
import { MySharedModule } from '@account/shared/shared.module';
import { CurrentSubscriptionComponent } from './current-subscription.component';
import { SubscriptionAlertComponent } from './subscription-alert.component';
import { SubscriptionUpgradeComponent } from './subscription-upgrade.component';
import { PaymentMethodModule } from '@account/payment/payment-method';
// import { SubscriptionRoutingModule } from '@account/payment/subscription/subscription-routing.module';


@NgModule({
  imports: [
    MySharedModule,
    PaymentMethodModule
  ],
  declarations: [
    CurrentSubscriptionComponent,
    SubscriptionUpgradeComponent,
    SubscriptionAlertComponent,
  ],
  exports: [

  ]
})

export class SubscriptionModule {}
