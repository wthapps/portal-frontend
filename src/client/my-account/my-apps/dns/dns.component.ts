import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { ConfirmationService } from 'primeng/components/common/api';

import { Constants } from '../../../core/shared/config/constants';
import { UserService } from '../../../core/shared/services/user.service';
import { LoadingService } from '../../../core/partials/loading/loading.service';
import { ToastsService } from '../../../core/partials/toast/toast-message.service';

import { Record } from './record';
import { ACDNSService } from './dns.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'apps-dns',
  templateUrl: 'dns.component.html'
})

export class ACDNSComponent implements OnInit {

  inValidPlan: boolean = false;
  records: Array<Record> = [];
  errorMessage: string;

  private app_id: number = 0;
  private sub: any;

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private confirmationService: ConfirmationService,
              private loadingService: LoadingService,
              private toastsService: ToastsService,
              private dnsService: ACDNSService,
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
      this.confirmationService.confirm({
        message: 'Are you sure to delete ' + hostname + ' ?',
        header: 'My Hosts',
        accept: () => {
          this.loadingService.start();
          this.dnsService.delete(id, this.userService.profile.id).subscribe(
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
    this.confirmationService.confirm({
      message: 'Upgrading your accounts to continue?',
      header: 'My Hosts',
      accept: () => {
        this.router.navigateByUrl('/account/plans');
      }
    });
  }
}
