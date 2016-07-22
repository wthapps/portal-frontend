import {
  Component,
  OnInit
}                                  from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router
}                                  from '@angular/router';
import {
  REACTIVE_FORM_DIRECTIVES,
  FormBuilder,
  FormGroup,
  AbstractControl,
  Validators
}                     from '@angular/forms';

import {
  DnsService
}                                  from './dns.service';
import {
  CustomValidator,
  UserService,
  Constants,
  ToastsService,
  LoadingService
}                                  from '../../../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'dns-add.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES
  ],
  providers: [CustomValidator]
})

export class DNSAddComponent implements OnInit {
  pageTitle:string = 'New Host';
  errorMessage: string = '';
  hostForm: FormGroup = null;
  hostname: AbstractControl = null;
  ip: AbstractControl = null;

  constructor(private _dnsService:DnsService,
              private _router:Router,
              private _builder:FormBuilder,
              private _loadingService:LoadingService,
              private _toastsService:ToastsService,
              private _userService:UserService) {
  }

  ngOnInit():void {
    if (!this._userService.loggedIn) {
      this.router.navigateByUrl(
        `/login;${Constants.params.next}=${this.router.location.path().replace(/\//g, '\%20')}`
      );
    }

    this.hostForm = this._builder.group({
      host: ['', Validators.compose([Validators.required, CustomValidator.ipHostFormat])],
      ip: ['', Validators.compose([CustomValidator.ipHostFormat])]
    });

    this.hostname = this.hostForm.controls['host'];
    this.ip = this.hostForm.controls['ip'];
  }

  onAddNew(hostname, name, content?:string = '127.0.0.1', type?:string = 'A'):void {
    this._loadingService.start();

    //noinspection TypeScriptValidateJSTypes
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
      'id': 0,
      'name': name,
      'type': type,
      'content': content,
      'ttl': 600,
      'priority': 10,
      'domain_id': 0
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
        if (error['status'] === Constants.HttpStatusCode.PaymentRequired) {
          this.errorMessage = 'Your account have expired!';
        } else if (error['status'] === Constants.HttpStatusCode.Created) {
          this.errorMessage = 'Hostname has already been taken!';
        } else {
          this.errorMessage = 'Unable to add new host!';
        }
      }
    );
  }
}
