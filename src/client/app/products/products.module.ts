import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsComponent } from './products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { PartialsModule } from '../partials/partials.module';

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
