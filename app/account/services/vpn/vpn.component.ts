import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {AccountMenuComponent} from '../../menu/account-menu.component';

@Component({
    templateUrl: 'app/account/services/vpn/vpn.component.html',
    directives: [
        ROUTER_DIRECTIVES,
        AccountMenuComponent
    ]
})

export class AccountServicesVPNComponent {
    pageTitle:string = "VPN Service";
}