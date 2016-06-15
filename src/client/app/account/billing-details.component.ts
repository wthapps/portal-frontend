import {Component}                    from '@angular/core';
import {ROUTER_DIRECTIVES}            from '@angular/router';
import {AccountMenuComponent}         from './menu/account-menu.component';

@Component({
  moduleId: module.id,
  templateUrl: 'billing-details.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    AccountMenuComponent
  ]
})

export class BillingDetailsComponent {
  PanelTitle:string = 'Billing details';
}
