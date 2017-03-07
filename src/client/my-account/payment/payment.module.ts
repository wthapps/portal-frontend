import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { PartialsModule } from '../../core/partials/partials.module';
import { ACPaymentRoutingModule } from './payment-routing.module';
import { ACPaymentService } from './payment.service';
import { ACPaymentComponent } from './payment.component';
import { ACPaymentConfirmComponent } from './payment-confirm.component';

@NgModule({
  imports: [
    CommonModule,
    ACPaymentRoutingModule,
    ReactiveFormsModule,
    PartialsModule
  ],
  declarations: [
    ACPaymentComponent,
    ACPaymentConfirmComponent
  ],
  exports: [
    ACPaymentComponent,
    ACPaymentConfirmComponent
  ],
  providers: [
    ACPaymentService
  ]
})

export class ACPaymentModule {
}
