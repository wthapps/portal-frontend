import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { ProductsComponent } from './products.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ProductsComponent],
  exports: [ProductsComponent]
})

export class ProductsModule {
}
