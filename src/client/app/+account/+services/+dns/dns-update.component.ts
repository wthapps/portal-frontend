import {
  Component,
  OnInit
}                             from '@angular/core';
import
{
  ROUTER_DIRECTIVES,
  ActivatedRoute,
  Router
}                             from '@angular/router';
import {
  REACTIVE_FORM_DIRECTIVES,
  FormBuilder,
  FormGroup,
  FormControl,
  AbstractControl,
  Validators
}                             from '@angular/forms';
import {
  DnsService
}                             from './dns.service';
import {
  Record,
  Type
}                             from './record';
import {
  CustomValidator,
  UserService,
  Constants,
  ToastsService,
  LoadingService
}                             from '../../../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'dns-update.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    REACTIVE_FORM_DIRECTIVES
  ]
})

export class DNSUpdateComponent implements OnInit {
  pageTitle:string = 'Edit Host';
  errorMessage:string;
  types:Type[] = [
    {'value': 'A', 'name': 'IPv4'},
    {'value': 'AAAA', 'name': 'IPv6'}
  ];
  type:Type = new Type();
  record:Record = new Record();
  hostForm:FormGroup = null;
  host:AbstractControl = null;
  ip:AbstractControl = null;

  private selected_id:number = null;

  constructor(private dnsService:DnsService,
              private router:Router,
              private route:ActivatedRoute,
              private builder:FormBuilder,
              private loadingService:LoadingService,
              private userService:UserService,
              private toastsService:ToastsService) {
    this.hostForm = this.builder.group({
      host: ['', Validators.compose([Validators.required, CustomValidator.ipHostFormat])],
      ip: ['', Validators.compose([CustomValidator.ipHostFormat])]
    });
    this.host = this.hostForm.controls['host'];
    this.ip = this.hostForm.controls['ip'];
  }

  ngOnInit():void {
    this.route.params.subscribe((params) => {
      this.selected_id = +params['id'];
    });

    this.loadingService.start();

    this.dnsService.getHost(this.selected_id).subscribe(
      result => {
        this.loadingService.stop();
        this.record = result;
        this.type = this.types.find(o => o.value == this.record.type);

        // init data form
        (<FormControl>this.host).updateValue(this.record.name);
        (<FormControl>this.ip).updateValue(this.record.content);

      },
      error => {
        this.loadingService.stop();
        if (error['status'] === Constants.HttpStatusCode.PaymentRequired) {
          this.errorMessage = 'Your account have expired!';
        } else if (error['status'] === Constants.HttpStatusCode.Created) {
          this.errorMessage = 'Hostname has already been taken!';
        } else {
          this.errorMessage = 'Unable to edit the host!';
        }
        this.toastsService.danger(this.errorMessage);
      }
    );
  }

  onUpdateHost(domain:string, name:string, content:string) {
    this.loadingService.start();

    // tslint:disable-next-line
    let ipV4 = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/;
    // tslint:disable-next-line
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

    this.record.domain_id = 0;
    this.record.name = name;
    this.record.type = type;
    this.record.content = content;

    let body = JSON.stringify(this.record);

    this.dnsService.updateHost(body, this.record.id).subscribe(
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
          this.errorMessage = 'Unable to edit the host!';
        }
      }
    );
  }

  onTypeChange(item:string) {
    this.type = this.types.find(o => o.value == item);
  }
}
