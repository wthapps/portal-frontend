import {
  Component,
  ViewChild,
  OnInit
}                                  from '@angular/core';
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
import {
  DnsService
}                                  from './dns.service';
import {
  CustomValidators,
  UserService,
  CONFIG,
  HttpStatusCode,
  ToastsService
}                                  from '../../../shared/index';
import {
  LoadingService,
  TopMessageService
}                                  from '../../../partials/index';

@Component({
  moduleId: module.id,
  templateUrl: 'dns-add.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    FORM_DIRECTIVES
  ],
  providers: [
    LoadingService,
    TopMessageService
  ]
})

export class AccountServicesDNSAddComponent implements OnInit{
  public pageTitle:string = "New Host";
  public errorMessage:string;
  public group:ControlGroup;

  constructor(private _dnsService:DnsService,
              private _router:Router,
              private _builder:FormBuilder,
              private _loadingService:LoadingService,
              private _toastsService:ToastsService,
              private _topMessageService:TopMessageService,
              private _userService:UserService
  ) {}

  ngOnInit():void {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }

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
    this._loadingService.start();

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
        this._loadingService.stop();
        this._router.navigateByUrl('/account/dns');
      },
      error => {
        this._loadingService.stop();
        this._toastsService.danger(this.errorMessage);
        this._topMessageService.danger(this.errorMessage);
        if (error['status'] == HttpStatusCode.PaymentRequired) {
          this.errorMessage = 'Your account have expired!';
        }
        else if (error['status'] == HttpStatusCode.Created) {
          this.errorMessage = 'Hostname has already been taken!';
        }
        else {
          this.errorMessage = 'Unable to add new host!';
        }
      }
    );
  }
}
