import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'billing.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class SupportBillingComponent {
  pageTitle:string = 'Support Page';
}
