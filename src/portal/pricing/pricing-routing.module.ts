import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PricingComponent } from './pricing.component';

@NgModule({
  imports: [
    RouterModule.forChild([{ path: 'pricing', component: PricingComponent }])
  ],
  exports: [RouterModule]
})
export class PricingRoutingModule {}
