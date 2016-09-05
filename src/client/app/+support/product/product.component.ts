import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'product.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
  //, styleUrls: ['support.component.css']
})

export class SupportProductComponent {
  pageTitle:string = 'Support Page';
}
