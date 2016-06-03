import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {AccountMenuComponent} from '../../menu/account-menu.component';

import {DnsService, Logger} from './dns.service';

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
  protected pageTitle:string = "New DNS";

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

    let data = {
      "record": record
    };

    let body = JSON.stringify(data);
    this._dnsService.addHost(body).subscribe(
      result => {
        Logger.Info(JSON.stringify(result));
        this._router.navigateByUrl('/account/dns');
      },
      error => {
        Logger.Error(JSON.stringify(error));
      }
    );
  }
}
