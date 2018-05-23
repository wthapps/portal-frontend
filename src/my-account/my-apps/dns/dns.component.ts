import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';

import { Record } from './record';
import { MyDNSService } from './dns.service';

import { UserService } from '@wth/shared/services/user.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';
import { Constants } from '@wth/shared/constant/config/constants';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'apps-dns',
  templateUrl: 'dns.component.html'
})

export class MyDNSComponent implements OnInit {

  inValidPlan: boolean = false;
  records: Array<Record> = [];
  errorMessage: string;

  private app_id: number = 0;
  private sub: any;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private wthConfirmService: WthConfirmService,
              private loadingService: LoadingService,
              private toastsService: ToastsService,
              private dnsService: MyDNSService,
              private router: Router) {
  }


  ngOnInit(): void {
    this.sub = this.route.params.subscribe(
      params => {
        this.app_id = +params['id'];
      });
    this.getHost(this.userService.getSyncProfile().id);
  }

  getHost(id: number) {
    this.loadingService.start();
    this.dnsService.get(id).subscribe(
      (res: any) => {
        if (res.data != 'empty') {
          this.records = res.data;
        }
        this.loadingService.stop();
      },
      (error: any) => {
        this.errorMessage = <any>error;
        if (error.status === Constants.HttpStatusCode.PaymentRequired) {
          this.inValidPlan = true;
        }
        this.loadingService.stop();
      }
    );
  }

  addHost(event: any): void {
    event.preventDefault();
    if (this.inValidPlan) {
      this.showUpgrading();
      return;
    } else {
      this.router.navigateByUrl(`/my-apps/${this.app_id}/add`);
    }
  }

  editHost(event: any, id: number): void {
    event.preventDefault();
    if (this.inValidPlan) {
      this.showUpgrading();
      return;
    } else {
      this.router.navigateByUrl(`/my-apps/${this.app_id}/edit/${id}`);
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
      this.wthConfirmService.confirm({
        message: 'Are you sure to delete ' + hostname + ' ?',
        header: 'My Hosts',
        accept: () => {
          this.loadingService.start();
          this.dnsService.delete(id, this.userService.getSyncProfile().id).subscribe(
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
      });
    }
  }

  showUpgrading(): void {
    this.wthConfirmService.confirm({
      message: 'Upgrading your accounts to continue?',
      header: 'My Hosts',
      accept: () => {
        this.router.navigateByUrl('/account/plans');
      }
    });
  }
}
