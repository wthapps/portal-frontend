import {
  Component,
  OnInit
}                             from '@angular/core';
import
{
  ROUTER_DIRECTIVES,
  OnActivate,
  RouteSegment,
  Router
}                             from '@angular/router';
import {
  FORM_DIRECTIVES,
  FormBuilder,
  ControlGroup,
  Validators
}                             from '@angular/common';
import {
  DnsService
}                             from './dns.service';
import {
  Record,
  Type
}                             from './record';
import {
  CustomValidators,
  UserService,
  CONFIG,
  HttpStatusCode,
  ToastsService
}                             from '../../../shared/index';
import {
  LoadingService,
  TopMessageService
}                             from '../../../partials/index';

@Component({
  moduleId: module.id,
  templateUrl: 'dns-update.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    FORM_DIRECTIVES
  ],
  providers: [
    LoadingService,
    TopMessageService
  ]
})

export class AccountServicesDNSUpdateComponent implements OnInit, OnActivate {
  public pageTitle:string = "Edit Host";
  public errorMessage:string;
  public types:Type[] = [
    {'value': 'A', 'name': 'IPv4'},
    {'value': 'AAAA', 'name': 'IPv6'}
  ];
  public type:Type = new Type();
  public Record:Record = new Record();
  public group:ControlGroup;
  private _id:number;

  constructor(private _dnsService:DnsService,
              private _router:Router,
              private _builder:FormBuilder,
              private _loadingService:LoadingService,
              private _topMessageService:TopMessageService,
              private _userService:UserService,
              private _toastsService:ToastsService
  ) {}

  ngOnInit():void {
    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }

    this._loadingService.start();

    this.group = this._builder.group({
      ip: ['',
        Validators.compose([Validators.required, CustomValidators.ipHostFormat])
      ],
      host: ['',
        Validators.compose([Validators.required, CustomValidators.ipHostFormat])
      ],
    });

    this._dnsService.getHost(this._id).subscribe(
      result => {
        this._loadingService.stop();
        this.Record = result;
        this.type = this.types.find(o => o.value == this.Record.type);
      },
      error => {
        this._loadingService.stop();
        if (error['status'] === HttpStatusCode.PaymentRequired) {
          this.errorMessage = 'Your account have expired!';
        } else if (error['status'] === HttpStatusCode.Created) {
          this.errorMessage = 'Hostname has already been taken!';
        } else {
          this.errorMessage = 'Unable to edit the host!';
        }
        this._topMessageService.danger(this.errorMessage);
      }
    );
  }

  onUpdateHost(domain, name, content) {
    this._loadingService.start();

    //noinspection TypeScriptValidateJSTypes
    let ipV4 = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/;
    let ipV6 = /^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$/;

    let type = 'A';

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

    this.Record.domain_id = 0;
    this.Record.name = name;
    this.Record.type = type;
    this.Record.content = content;

    let body = JSON.stringify(this.Record);

    this._dnsService.updateHost(body, this.Record.id).subscribe(
      result => {
        this._loadingService.stop();
        this._router.navigateByUrl('/account/dns');
      },
      error => {
        this._loadingService.stop();
        this._toastsService.danger(this.errorMessage);
        this._topMessageService.danger(this.errorMessage);
        if (error['status'] === HttpStatusCode.PaymentRequired) {
          this.errorMessage = 'Your account have expired!';
        } else if (error['status'] === HttpStatusCode.Created) {
          this.errorMessage = 'Hostname has already been taken!';
        } else {
          this.errorMessage = 'Unable to edit the host!';
        }
      }
    );
  }

  routerOnActivate(curr:RouteSegment):void {
    this._id = Number(curr.getParam('id').toString());
  }

  onTypeChange(item) {
    this.type = this.types.find(o => o.value == item);
  }

  onBack():void {
  }
}
