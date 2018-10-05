import { NgModule } from '@angular/core';
import { MySharedModule } from '@account/shared/shared.module';
import { SharedModule } from '@wth/shared/shared.module';
import { PaymentMethodListComponent } from './payment-method-list.component';
import { PaymentMethodAddModalComponent } from './payment-method-add-modal.component';
// import { NgXCreditCardsModule } from 'ngx-credit-cards';

@NgModule({
  imports: [
    // NgXCreditCardsModule,
    // PaymentMethodRoutingModule,
    MySharedModule,
    SharedModule
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
