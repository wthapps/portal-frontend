import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {AccountMenuComponent} from '../menu/account-menu.component';

@Component({
  templateUrl: 'app/account/payment/add-card.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    AccountMenuComponent
  ]
})

export class AccountAddCardComponent {
  PanelTitle:string = "Find Services and add-ons";
}
