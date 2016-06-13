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

  constructor(private _dnsService:DnsService,
              private _router:Router,
              private _builder:FormBuilder) {
    this.group = this._builder.group({
      host: ['',
        Validators.compose([Validators.required, CustomValidators.ipHostFormat])
      ],
      ip: ['',
        Validators.compose([CustomValidators.ipHostFormat])
      ]
    });
  }

  onAddNew(domain, name, content?:string = '127.0.0.1', type?:string = 'A'):void {

    let ipV4 = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/;
    let ipV6 = /^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$/;

    if (content.length === 0) {
      content = '127.0.0.1';
    }
    if (type.length === 0) {
      type = 'A';
    }
    if (ipV4.test(content)) {
      type = 'A';
    }
    if (ipV6.test(content)) {
      type = 'AAAA';
    }
    
    let record = {
      "id": 0,
      "name": name,
      "type": type,
      "content": content,
      "ttl": 600,
      "priority": 10,
      "domain_id": 0
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
