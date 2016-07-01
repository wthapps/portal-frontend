import {
  Component,
  OnInit,
  ViewChild
}                            from '@angular/core';
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

import {DnsService, Logger}   from './dns.service';
import {IRecord, Type}        from './record';
import {CustomValidators}     from '../../../shared/validator/custom-validators';
import {LoadingService}       from '../../../partials/loading/index';
import {TopMessageService}    from '../../../partials/topmessage/index';
import {UserService, CONFIG}  from '../../../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'dns-update.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    FORM_DIRECTIVES
  ],
  providers: [
    LoadingService
  ]
})

export class AccountServicesDNSUpdateComponent implements OnInit, OnActivate {
  protected pageTitle:string = "Edit Host";
  errorMessage:string;
  @ViewChild('dnsUpdate') dnsUpdate;

  public types:Type[] = [
    {"value": 'A', "name": 'IPv4'},
    {"value": 'AAAA', "name": 'IPv6'}
  ];

  public type:Type = new Type();

  public Record:IRecord = new IRecord();

  constructor(private _dnsService:DnsService,
              private _router:Router,
              private _builder:FormBuilder,
              private _loadingService:LoadingService,
              private _topMessageService:TopMessageService,
              private _userService:UserService) {

    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }

    this.group = this._builder.group({
      ip: ['',
        Validators.compose([Validators.required, CustomValidators.ipHostFormat])
      ],
      host: ['',
        Validators.compose([Validators.required, CustomValidators.ipHostFormat])
      ],
    });
  }

  ngOnInit():void {
    this._dnsService.getHost(this._id).subscribe(
      result => {
        this.Record = result;
        this.type = this.types.find(o => o.value == this.Record.type);
      },
      error => {
        Logger.Error(JSON.stringify(error));
      }
    );
  }

  onUpdateHost(domain, name, content) {
    // start loading
    this._loadingService.start(this.dnsUpdate.nativeElement);

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
        //Logger.Error(JSON.stringify(error));
        let err = JSON.stringify(error);
        //Logger.Error(err);
        this.errorMessage = err;
        if (error.status === 409) {
          this.errorMessage = 'Hostname has already been taken';
        }
        // stop loading
        this._loadingService.stop();
        this._topMessageService.danger(this.errorMessage);
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

  private _id:number;
  public group:ControlGroup;
}
