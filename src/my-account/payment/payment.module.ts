import { NgModule } from '@angular/core';

import { MyPaymentRoutingModule } from './payment-routing.module';
import { MyPaymentService } from './payment.service';
import { MyPaymentComponent } from './payment.component';
import { MyPaymentConfirmComponent } from './payment-confirm.component';

import { MySharedModule } from '../shared/shared.module';
import { SharedModule } from '@wth/shared/shared.module';
import { SharedServicesModule } from '@wth/shared/shared-services.module';

@NgModule({
  imports: [
    MyPaymentRoutingModule,
    MySharedModule.forRoot(),
    SharedModule.forRoot(),
    SharedServicesModule.forRoot()
  ],
  declarations: [MyPaymentComponent, MyPaymentConfirmComponent],
  exports: [MyPaymentComponent, MyPaymentConfirmComponent],
  providers: [MyPaymentService]
})
export class MyPaymentModule {}
