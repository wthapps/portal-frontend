import { NgModule } from '@angular/core';
import { MySharedModule } from '@account/shared/shared.module';
import { CurrentSubscriptionComponent } from './current-subscription.component';
import { SubscriptionAlertComponent } from './subscription-alert.component';
import { SubscriptionUpgradeComponent } from './subscription-upgrade.component';
import { PaymentMethodModule } from '@account/payment/payment-method';
import { PlanModule } from '@shared/common/plan';
import { StorageModule } from '@shared/common/storage';
import { SubscriptionModule } from '@shared/common/subscription';

@NgModule({
  imports: [
    MySharedModule,
    PaymentMethodModule,
    PlanModule,
    StorageModule,
    SubscriptionModule
  ],
  declarations: [
    CurrentSubscriptionComponent,
    SubscriptionUpgradeComponent,
    SubscriptionAlertComponent,
  ]
})

export class MySubscriptionModule {}
