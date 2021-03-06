import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormGroup,
  AbstractControl,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';

import { CustomValidator } from '@wth/shared/shared/validator/custom.validator';
import { UserService } from '@wth/shared/services/user.service';
import { MenuItemBreadcrumb } from '@wth/shared/shared/components/breadcrumb/breadcrumb';
import { MyDNSService } from './dns.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';
import { Constants } from '@wth/shared/constant/config/constants';

@Component({
  moduleId: module.id,
  selector: 'apps-dns-edit',
  templateUrl: 'dns-edit.component.html'
})

export class MyDNSEditComponent implements OnInit {
  panelTitle: string = 'Add Host';
  errorMessage: string = '';

  form: FormGroup;
  host: AbstractControl;
  domain: AbstractControl;
  ip: AbstractControl;
  submitted: boolean = false;
  submittedAdd: boolean = true;

  breadcrumbs: MenuItemBreadcrumb[];

  private app_id: number = 0;
  private dns_id: number = 0;
  private sub: any;

  constructor(private dnsService: MyDNSService,
              private router: Router,
              private fb: FormBuilder,
              private route: ActivatedRoute,
              private loadingService: LoadingService,
              private toastsService: ToastsService,
              private userService: UserService) {

    this.form = fb.group({
      'host': ['',
        Validators.compose([Validators.required, CustomValidator.ipHostFormat])
      ],
      'domain': ['0',
        Validators.compose([Validators.required])
      ],
      'ip': ['',
        Validators.compose([CustomValidator.ipHostFormat])
      ]
    });

    this.host = this.form.controls['host'];
    this.domain = this.form.controls['domain'];
    this.ip = this.form.controls['ip'];
  }

  ngOnInit(): void {
    this.breadcrumbs = [];
    this.sub = this.route.url.subscribe(
      params => {
        this.app_id = +params[0].path;
        //console.log('params:', params);
        //console.log('params[0]:', params[0].path);

        // check type is 'edit' or 'add new service'
        if (params[1].path !== 'add') {
          this.submittedAdd = false;
          this.dns_id = +params[2].path;
          this.getHost(+params[2].path);
          this.panelTitle = 'Edit Host';
        }

        this.getBreadcrumbs(+params[0].path, this.panelTitle);
      }
    );
  }


  onSubmit(values: any): void {
    this.submitted = true;
    if (this.form.valid) {
      // tslint:disable-next-line
      let ipV4 = /^([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])\\.([01]?[0-9]?[0-9]|2[0-4][0-9]|25[0-5])$/;
      // tslint:disable-next-line
      let ipV6 = /^((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*::((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4}))*|((?:[0-9A-Fa-f]{1,4}))((?::[0-9A-Fa-f]{1,4})){7}$/;

      let type: string = 'A';
      if (values.ip === '') {
        values.ip = '127.0.0.1';
      }
      if (ipV4.test(values.ip)) {
        type = 'A';
      }
      if (ipV6.test(values.ip)) {
        type = 'AAAA';
      }

      let body = JSON.stringify({
        id: 0,
        name: values.host,
        type: type,
        content: values.ip,
        ttl: 600,
        priority: 10,
        domain_id: 0
      });

      //console.log(body);

      this.loadingService.start();
      if (this.submittedAdd) { // add new host
        this.dnsService.addNewHost(body, this.userService.getSyncProfile().id).subscribe(
          result => {
            this.loadingService.stop();
            this.router.navigateByUrl(`/my-apps/${this.app_id}`);
          },
          (error: any) => {
            this.loadingService.stop();
            if (error.status === Constants.HttpStatusCode.PaymentRequired) {
              this.errorMessage = 'Your account have expired!';
            } else if (error.status === Constants.HttpStatusCode.Conflict) {
              this.errorMessage = 'Hostname has already been taken!';
            } else {
              this.errorMessage = 'Unable to add new host!';
            }
            this.toastsService.danger(this.errorMessage);
          }
        );
      } else {
        this.dnsService.updateHost(this.dns_id, body, this.userService.getSyncProfile().id).subscribe(
          result => {
            this.loadingService.stop();
            this.router.navigateByUrl(`/account/my-apps/${this.app_id}`);
          },
          (error: any) => {
            this.loadingService.stop();
            if (error.status === Constants.HttpStatusCode.PaymentRequired) {
              this.errorMessage = 'Your account have expired!';
            } else if (error.status === Constants.HttpStatusCode.Conflict) {
              this.errorMessage = 'Hostname has already been taken!';
            } else {
              this.errorMessage = 'Unable to add new host!';
            }
            this.toastsService.danger(this.errorMessage);
          }
        );
      }
    }
  }

  getHost(id: number): void {
    this.dnsService.getHost(id, this.userService.getSyncProfile().id).subscribe(
      (result: any) => {
        //console.log(result);
        (<FormControl>this.host).setValue(result.data.name);
        (<FormControl>this.ip).setValue(result.data.description);
      },
      error => this.errorMessage = <any>error
    );
  }

  getBreadcrumbs(id: number, label: string) {
    this.dnsService.get(`apps/${id}`).subscribe(
      (res: any) => {
        this.breadcrumbs.push({label: 'App List', url: '/my-apps'});
        this.breadcrumbs.push({label: res.data.display_name, url: '/my-apps/' + res.data.id});
        this.breadcrumbs.push({label: label});
      },
      error => this.errorMessage = <any>error
    );
  }

  onBack(event: any): void {
    event.preventDefault();
    this.router.navigateByUrl(`/my-apps/${this.app_id}`);
  }
}
