import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'vpn.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class AccountServicesVPNComponent {
  pageTitle:string = 'VPN Service';
}
