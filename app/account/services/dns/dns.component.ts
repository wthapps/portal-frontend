import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {AccountMenuComponent} from '../../menu/account-menu.component';

@Component({
    templateUrl: 'app/account/services/dns/dns.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        AccountMenuComponent
    ]
})

export class AccountServicesDNSComponent {
    pageTitle:string = "DNS Service";
}