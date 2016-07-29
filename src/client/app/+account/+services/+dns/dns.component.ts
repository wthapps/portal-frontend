import {
  Component,
  OnInit
}                       from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router
}                       from '@angular/router';
import {
  Record
}                       from './record';
import {
  DnsService
}                       from './dns.service';
import {
  ServicesService
}                       from '../services.service';

import {
  UserService,
  Constants,
  LoadingService,
  ToastsService,
  DialogService
}                       from '../../../shared/index';


@Component({
  moduleId: module.id,
  templateUrl: 'dns.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [UserService, DnsService]
})

export class DNSComponent implements OnInit {
  public pageTitle:string = 'My Hosts';
  public Records:Record[] = [];
  public ErrorMessage:string;
  public DownloadLink:string;
  public inValidPlan:boolean = false;
  private _dnsProductId:number = 2; //@TODO: temporary using product id that will changed to uuid

  constructor(private dnsService:DnsService,
              private dialogService:DialogService,
              private userService:UserService,
              private router:Router,
              private loadingService:LoadingService,
              private toastsService:ToastsService,
              private servicesService:ServicesService) {
  }

  ngOnInit():void {
    this.loadingService.start();
    this.inValidPlan = false;
    this.dnsService.getHosts().subscribe(
      record => {
        this.inValidPlan = false;
        this.loadingService.stop();
        this.Records = record;
      },
      error => {
        this.loadingService.stop();
        let body = JSON.parse(error['_body']);
        if (error['status'] === Constants.HttpStatusCode.PaymentRequired) {
          this.inValidPlan = true;
          if (body.data !== 'empty') {
            var list = <Record[]>body.data;
            for (var i in list) {
              let current = list[i];
              current.updated_at = new Date(current.updated_at.toString());
            }
            this.Records = list;
          }
        } else {
          this.ErrorMessage = JSON.stringify(error);
          this.toastsService.danger(this.ErrorMessage);
        }
      }
    );

    this.dnsService.getProduct(this._dnsProductId).subscribe(
      product => {
        this.loadingService.stop();
        this.DownloadLink = product.download_link;
      },
      error => {
        this.loadingService.stop();
        this.ErrorMessage = JSON.stringify(error);
        this.toastsService.danger(this.ErrorMessage);
      }
    );
  }

  onDeleteHost(event: any, id:number):void {
    event.preventDefault();

    if (this.inValidPlan) {
      this.showUpgrading();
      return;
    } else {
      let index = this.Records.findIndex(o => o.id == id);
      let hostname = this.Records[index].name + '.' + 'wthdns.com';
      this.dialogService.activate('Are you sure to delete ' + hostname + '?', 'My Hosts', 'Yes', 'No').then((responseOK) => {
        if (responseOK) {
          this.loadingService.start();
          this.dnsService.deleteHost(id).subscribe(
            record => {
              this.loadingService.stop();
              this.Records.splice(index, 1);
            },
            error => {
              this.loadingService.stop();
              if (error['status'] === Constants.HttpStatusCode.PaymentRequired) {
                this.showUpgrading();
              } else {
                this.ErrorMessage = JSON.stringify(error);
                this.toastsService.danger(this.ErrorMessage);
              }
            }
          );
        }
      });
    }
  }

  onEditHost(event: any, id:number):void {
    event.preventDefault();
    if (this.inValidPlan) {
      this.showUpgrading();
      return;
    } else {
      this.router.navigateByUrl('/account/dns/' + id);
    }
  }

  onAddHost(event: any):void {
    event.preventDefault();
    if (this.inValidPlan) {
      this.showUpgrading();
      return;
    } else {
      this.router.navigateByUrl('/account/dns/add');
    }
  }

  onDelete(event: any):void {
    event.preventDefault();
    this.dialogService.activate('Are you sure to delete Dynamic DNS service ?', 'Dynamic DNS service', 'Yes', 'No').then((responseOK) => {
      if (responseOK) {
        this.loadingService.start();
        this.servicesService.deleteUserProduct(this._dnsProductId).subscribe(
          result => {
            this.loadingService.stop();
            this.router.navigateByUrl('/account/setting/dashboard');
          },
          error => {
            this.loadingService.stop();
            if (error['status'] === Constants.HttpStatusCode.PaymentRequired) {
              this.showUpgrading();
            }
          }
        );
      }
    });
  }

  private showUpgrading():void {
    this.dialogService.activate('Upgrading your accounts to continute?', 'My Hosts', 'Yes', 'No').then((responseOK) => {
      if (responseOK) {
        this.router.navigateByUrl('/account/payment');
      }
    });
  }
}
