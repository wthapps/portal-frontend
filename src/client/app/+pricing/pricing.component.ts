import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'pricing.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class PricingComponent{
  pageTitle:string = 'Products';
  
}
