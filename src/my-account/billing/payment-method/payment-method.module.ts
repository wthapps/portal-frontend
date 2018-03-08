import { NgModule } from '@angular/core';
import { MySharedModule } from '@account/shared/shared.module';
import { SharedModule } from '@wth/shared/shared.module';
import { PaymentMethodComponent } from './payment-method.component';
// import { PaymentMethodRoutingModule } from './payment-method-routing.module';

@NgModule({
  imports: [
    // PaymentMethodRoutingModule,
    MySharedModule,
    SharedModule
  ],
  declarations: [
    PaymentMethodComponent
  ],
  exports: [
    PaymentMethodComponent
  ],
  providers: []
})

export class PaymentMethodModule {
}
