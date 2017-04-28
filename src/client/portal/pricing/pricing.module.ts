import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartialsModule } from '../../core/partials/partials.module';

import { PricingComponent } from './pricing.component';
import { PricingRoutingModule } from './pricing-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PartialsModule,
    PricingRoutingModule
  ],
  declarations: [PricingComponent],
  exports: [PricingComponent]
})

export class PricingModule {
}
