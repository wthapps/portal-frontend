import { NgModule } from '@angular/core';

import { PricingComponent } from './pricing.component';
import { PricingRoutingModule } from './pricing-routing.module';
import { PortalSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [PricingRoutingModule, PortalSharedModule],
  declarations: [PricingComponent],
  exports: [PricingComponent]
})
export class PricingModule {}
