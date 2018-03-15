import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProductsComponent } from './products.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'products', redirectTo: '/apps', pathMatch: 'full'},
      {path: 'apps', component: ProductsComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ProductsRoutingModule {
}
