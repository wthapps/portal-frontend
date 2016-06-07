import {Component}                 from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {AccountMenuComponent}      from '../../menu/account-menu.component';

import {DnsService, Logger}        from './dns.service';

@Component({
  moduleId: module.id,
  templateUrl: 'dns-add.component.html',
  directives:
  [
    ROUTER_DIRECTIVES,
    AccountMenuComponent
  ]
})

export class AccountServicesDNSAddComponent {
  protected pageTitle:string = "New Host";

  constructor(private _dnsService:DnsService, private _router: Router) {}

  onAddNew(domain, name, type, content): void {
    let record = {
      "id": 0,
      "name": name,
      "type": type,
      "content": content,
      "ttl": 600,
      "priority": 10,
      "domain_id": domain
    };
    let body = JSON.stringify(record);
    this._dnsService.addHost(body).subscribe(
      result => {
        this._router.navigateByUrl('/account/dns');
      },
      error => {
        Logger.Error(JSON.stringify(error));
      }
    );
  }
}
