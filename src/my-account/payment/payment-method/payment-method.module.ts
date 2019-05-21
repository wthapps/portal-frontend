import { NgModule } from '@angular/core';
import { MySharedModule } from '@account/shared/shared.module';
import { PaymentMethodListComponent } from './payment-method-list.component';
import { PaymentMethodAddModalComponent } from './payment-method-add-modal.component';

import { CreditCardModule } from '@account/shared/credit-card';
import { PaymentMethodService } from '@account/payment/payment-method/payment-method.service';
import { PaymentGatewayModule } from '@account/shared/payment-gateway';

@NgModule({
  imports: [
    CreditCardModule,
    MySharedModule,
    PaymentGatewayModule,
  ],
  declarations: [
    PaymentMethodListComponent,
    PaymentMethodAddModalComponent
  ],
  exports: [
    PaymentMethodListComponent,
    PaymentMethodAddModalComponent
  ],
  providers: [PaymentMethodService]
})

export class PaymentMethodModule {
}
