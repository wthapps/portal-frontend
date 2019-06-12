import { NgModule } from '@angular/core';
import { MySharedModule } from '@account/shared/shared.module';
import { CurrentSubscriptionComponent } from './current-subscription.component';
import { SubscriptionAlertComponent } from './subscription-alert.component';
import { SubscriptionUpgradeComponent } from './subscription-upgrade.component';
import { PaymentMethodModule } from '@account/payment/payment-method';
import { PlanModule } from '@shared/common/plan';
import { StorageModule } from '@shared/common/storage';
import { SubscriptionModule } from '@shared/common/subscription';
import { SubscriptionAlertModalComponent } from './subscription-alert-modal.component';
import { BsModalModule } from 'ng2-bs3-modal';
import { SubscriptionCancelModalComponent } from './modal/subscription-cancel-modal.component';
import { ModalModule } from '@shared/modals';
import { AccountService } from '@account/shared/account/account.service';

@NgModule({
  imports: [
    BsModalModule,

    MySharedModule,
    ModalModule,
    PaymentMethodModule,
    PlanModule,
    StorageModule,
    SubscriptionModule
  ],
  declarations: [
    CurrentSubscriptionComponent,
    SubscriptionUpgradeComponent,
    SubscriptionAlertComponent,
    SubscriptionAlertModalComponent,
    SubscriptionCancelModalComponent
  ],
  exports: [
    CurrentSubscriptionComponent,
    SubscriptionUpgradeComponent,
    SubscriptionAlertComponent,
    SubscriptionAlertModalComponent,
    SubscriptionCancelModalComponent
  ],
  providers: [AccountService]
})
export class MySubscriptionModule {}
