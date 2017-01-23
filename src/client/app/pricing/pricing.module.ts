import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { PricingComponent } from './pricing.component';
import { PricingRoutingModule } from './pricing-routing.module';
import { PartialsModule } from '../partials/partials.module';

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
