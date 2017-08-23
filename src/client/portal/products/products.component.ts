import { Component } from '@angular/core';
import { fadeInAnimation } from '../../core/shared/animations/route.animation';

/**
 * This class represents the lazy loaded ProductsComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-products',
  templateUrl: 'products.component.html',
  styleUrls: ['products.component.css'],
  host: {
    "[@fadeInAnimation]": 'true'
  },
  animations: [fadeInAnimation]
})

export class ProductsComponent {
}
