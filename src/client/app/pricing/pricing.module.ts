import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { PricingComponent } from './pricing.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [PricingComponent],
  exports: [PricingComponent]
})

export class PricingModule {
}
