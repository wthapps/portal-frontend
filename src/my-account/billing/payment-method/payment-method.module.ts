import { NgModule } from '@angular/core';
import { MySharedModule } from '@account/shared/shared.module';
import { SharedModule } from '@wth/shared/shared.module';
import { PaymentMethodComponent } from './payment-method.component';
import { PaymentMethodAddModalComponent } from '@account/billing/payment-method/payment-method-add-modal.component';
// import { PaymentMethodRoutingModule } from './payment-method-routing.module';
// import { NgXCreditCardsModule } from 'ngx-credit-cards';

@NgModule({
  imports: [
    // PaymentMethodRoutingModule,
    // NgXCreditCardsModule,
    MySharedModule,
    SharedModule
  ],
  declarations: [
    PaymentMethodComponent,
    PaymentMethodAddModalComponent
  ],
  exports: [
    PaymentMethodComponent,
    PaymentMethodAddModalComponent
  ],
  providers: []
})

export class PaymentMethodModule {
}
