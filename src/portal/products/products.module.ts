import { NgModule } from '@angular/core';

import { ProductsComponent } from './products.component';
import { ProductsRoutingModule } from './products-routing.module';
import { PortalSharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    ProductsRoutingModule,
    PortalSharedModule.forRoot()
  ],
  declarations: [ProductsComponent],
  exports: [ProductsComponent]
})

export class ProductsModule {
}
