import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {
  TablePricingComponent,
  FooterPromotionComponent
} from '../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'pricing.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    TablePricingComponent,
    FooterPromotionComponent
  ]
})

export class PricingComponent {
  pageTitle: string = 'Products';

}
