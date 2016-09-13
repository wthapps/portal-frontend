import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {
  FooterPromotionComponent
} from '../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'products.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    FooterPromotionComponent
  ]
})

export class ProductsComponent {
  pageTitle: string = 'Products';
}
