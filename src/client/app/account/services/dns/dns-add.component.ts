import {Component}                 from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router
}                                  from '@angular/router';
import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators
}                                  from '@angular/common';

import {AccountMenuComponent}      from '../../menu/account-menu.component';
import {DnsService, Logger}        from './dns.service';
import {CustomValidators}          from '../../../shared/validator/custom-validators';

@Component({
  moduleId: module.id,
  templateUrl: 'dns-add.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    FORM_DIRECTIVES,
    AccountMenuComponent
  ]
})

export class AccountServicesDNSAddComponent {
  protected pageTitle:string = "New Host";

  //TODO recheck regular expressions for ip addresses
  public IPV4 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  constructor(private _dnsService:DnsService,
              private _router:Router,
              private _builder:FormBuilder) {
    this.group = this._builder.group({
      ip: ['',
        Validators.compose([Validators.required, CustomValidators.ipHostFormat])
      ],
      host: ['',
        Validators.compose([Validators.required, CustomValidators.ipHostFormat])
      ],
    });
  }

  onAddNew(domain, name, content, type?:string = 'AAAA'):void {
    if (this.IPV4.test(content)) {
      type = 'A';
    }
    console.log(type, content);
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

  public group:ControlGroup;
}
