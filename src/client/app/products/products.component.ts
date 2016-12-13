import { Component } from '@angular/core';

/**
 * This class represents the lazy loaded ProductsComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'page-products',
  templateUrl: 'products.component.html'
})

export class ProductsComponent {
  pageTitle: string = 'Products';
}