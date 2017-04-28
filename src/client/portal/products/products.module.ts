import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartialsModule } from '../../core/partials/partials.module';

import { ProductsComponent } from './products.component';
import { ProductsRoutingModule } from './products-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ProductsRoutingModule,
    PartialsModule
  ],
  declarations: [ProductsComponent],
  exports: [ProductsComponent]
})

export class ProductsModule {
}
