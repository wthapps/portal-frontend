import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TablePricingComponent } from './table-pricing.component';
import { LoadingModule } from '../loading/loading.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    LoadingModule
  ],
  declarations: [TablePricingComponent],
  exports: [TablePricingComponent],
  providers: []
})

export class TablePricingModule {
}
