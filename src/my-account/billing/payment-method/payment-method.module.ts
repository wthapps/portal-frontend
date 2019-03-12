import { NgModule } from '@angular/core';
import { MySharedModule } from '@account/shared/shared.module';
// import { SharedModule } from '@wth/shared/shared.module';
import { PaymentMethodListComponent } from './payment-method-list.component';
import { PaymentMethodAddModalComponent } from './payment-method-add-modal.component';

import { CreditCardModule } from '@account/shared/credit-card';

@NgModule({
  imports: [
    CreditCardModule,
    MySharedModule,
    // SharedModule
  ],
  declarations: [
    PaymentMethodListComponent,
    PaymentMethodAddModalComponent
  ],
  exports: [
    PaymentMethodListComponent,
    PaymentMethodAddModalComponent
  ],
  providers: []
})

export class PaymentMethodModule {
}
