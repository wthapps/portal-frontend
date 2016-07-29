import {
  Component
}                                 from '@angular/core';
import {
  ROUTER_DIRECTIVES
}                                 from '@angular/router';

import {
  DnsService,
  ServicesService,
  AccountMenuComponent
}                                 from './index';

@Component({
  moduleId: module.id,
  templateUrl: 'account.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    AccountMenuComponent
  ],
  viewProviders: [
    DnsService,
    ServicesService
  ]
})
export class AccountComponent {
  pageTitle: string = 'Account Settings';

}
