import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TablePricingComponent } from './table-pricing.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [TablePricingComponent],
  exports: [TablePricingComponent],
  providers: []
})

export class TablePricingModule {
}
