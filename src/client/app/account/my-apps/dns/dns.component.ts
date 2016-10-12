import {
  Component,
  OnInit
}                       from '@angular/core';
import {
  Router,
  ActivatedRoute
}                       from '@angular/router';
import {
  Record
}                       from './record';

import {
  ApiBaseService,
  UserService,
  //2 LoadingService,
  //2 ToastsService,
  //2 DialogService,
  Constants
}                       from '../../../shared/index';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'app-dns',
  templateUrl: 'dns.component.html'
})

export class DNSComponent implements OnInit {

  inValidPlan: boolean = false;
  records: Array<Record> = [];
  errorMessage: string;

  private app_id: number = 0;
  private sub: any;

  constructor(private route: ActivatedRoute,
              private dnsService: ApiBaseService,
              private userService: UserService,
              //2 private dialogService: DialogService,
              //2 private loadingService: LoadingService,
              //2 private toastsService: ToastsService,
              private router: Router) {
  }


  ngOnInit(): void {
    this.sub = this.route.params.subscribe(
      params => {
        this.app_id = +params['id'];
      });
    this.getHost(this.userService.profile.id);
  }

  getHost(id: number) {
    //2 this.loadingService.start();
    this.dnsService.get(`users/${id}/dns/records`).subscribe(
      (res: any) => {
        if (res.data != 'empty') {
          this.records = res.data;
        }
        //2 this.loadingService.stop();
      },
      (error: any) => {
        this.errorMessage = <any>error;
        if (error.status === Constants.HttpStatusCode.PaymentRequired) {
          this.inValidPlan = true;
        }
        //2 this.loadingService.stop();
      }
    );
  }

  addHost(event: any): void {
    event.preventDefault();
    if (this.inValidPlan) {
      this.showUpgrading();
      return;
    } else {
      this.router.navigateByUrl(`/account/my-apps/${this.app_id}/add`);
    }
  }

  editHost(event: any, id: number): void {
    event.preventDefault();
    if (this.inValidPlan) {
      this.showUpgrading();
      return;
    } else {
      this.router.navigateByUrl(`/account/my-apps/${this.app_id}/edit/${id}`);
    }
  }

  deleteHost(event: any, id: number): void {
    event.preventDefault();
    if (this.inValidPlan) {
      this.showUpgrading();
      return;
    } else {
      let record_item = _.find(this.records, {'id': id});
      let hostname = record_item.name + '.' + 'wthdns.com';
      // tslint:disable-next-line
      //2
      /*this.dialogService.activate('Are you sure to delete <strong class="text-danger">' + hostname + '</strong> ?', 'My Hosts', 'Yes', 'No').then((responseOK) => {
        if (responseOK) {
          this.loadingService.start();
          this.dnsService.delete(`users/${this.userService.profile.id}/dns/records/${id}`).subscribe(
            record => {
              this.records = _.reject(this.records, {'id': id});
              this.loadingService.stop();
            },
            error => {
              this.loadingService.stop();
              this.errorMessage = <any>error;
              this.toastsService.danger(<any>error);
            }
          );
        }
      });*/
    }
  }

  showUpgrading(): void {
    //2
    /*this.dialogService.activate('Upgrading your accounts to continue?', 'My Hosts', 'Yes', 'No').then((responseOK) => {
      if (responseOK) {
        this.router.navigateByUrl('/account/plans');
      }
    });*/
  }
}
