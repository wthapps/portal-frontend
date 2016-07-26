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

  constructor(private dnsService:DnsService,
              private router:Router,
              private builder:FormBuilder,
              private loadingService:LoadingService,
              private toastsService:ToastsService,
              private userService:UserService) {
  }

  ngOnInit():void {    

    this.hostForm = this.builder.group({
      host: ['', Validators.compose([Validators.required, CustomValidator.ipHostFormat])],
      ip: ['', Validators.compose([CustomValidator.ipHostFormat])]
    });

    this.hostname = this.hostForm.controls['host'];
    this.ip = this.hostForm.controls['ip'];
  }

  onAddNew(hostname, name, content?:string = '127.0.0.1', type?:string = 'A'):void {
    this.loadingService.start();

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
    this.dnsService.addHost(body).subscribe(
      result => {
        this.loadingService.stop();
        this.router.navigateByUrl('/account/dns');
      },
      error => {
        this.loadingService.stop();
        this.toastsService.danger(this.errorMessage);
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
