import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'products.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class ProductsComponent{
  pageTitle:string = 'Products';
  
}
