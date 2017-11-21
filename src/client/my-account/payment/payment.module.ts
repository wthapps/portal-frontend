import { NgModule } from '@angular/core';

import { MyPaymentRoutingModule } from './payment-routing.module';
import { MyPaymentService } from './payment.service';
import { MyPaymentComponent } from './payment.component';
import { MyPaymentConfirmComponent } from './payment-confirm.component';

import { MySharedModule } from '../shared/shared.module';
import { CoreSharedModule } from '../../core/shared/shared.module';

@NgModule({
  imports: [
    MyPaymentRoutingModule,
    MySharedModule.forRoot(),
    CoreSharedModule.forRoot()
  ],
  declarations: [
    MyPaymentComponent,
    MyPaymentConfirmComponent
  ],
  exports: [
    MyPaymentComponent,
    MyPaymentConfirmComponent
  ],
  providers: [
    MyPaymentService
  ]
})

export class MyPaymentModule {
}
