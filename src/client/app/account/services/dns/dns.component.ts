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
  UserService, 
  CONFIG,
  HttpStatusCode
}                       from '../../../shared/index';
import {
  LoadingService,
  TopMessageService,
  DialogService
}                       from '../../../partials/index';

@Component({
  moduleId: module.id,
  templateUrl: 'dns.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [
    LoadingService,
    TopMessageService
  ]
})

export class AccountServicesDNSComponent implements OnInit {
  public pageTitle:string = "My Hosts";
  public Records:Record[] = [];
  public ErrorMessage:string;
  public DownloadLink: string;
  public inValidPlan:boolean = false;
  private _dnsProductId:number = 2; //@TODO: temporary using product id that will changed to uuid

  constructor(private _dnsService: DnsService,
              private _dialogService: DialogService,
              private _userService:UserService,
              private _router:Router,
              private _loadingService:LoadingService,
              private _topMessageService:TopMessageService) {}

  ngOnInit():void {

    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }

    this._loadingService.start();
    this.inValidPlan = false;
    this._dnsService.getHosts().subscribe(
      record => {
        this.inValidPlan = false;
        this._loadingService.stop();
        this.Records = record;
      },
      error => {
        this._loadingService.stop();
        let body = JSON.parse(error['_body']);
        if (error['status'] == HttpStatusCode.PaymentRequired) {
          this.inValidPlan = true;
          if (body.data != 'empty') {
            var list = <Record[]>body.data;
            for (var i in list) {
              let current = list[i];
              current.updated_at = new Date(current.updated_at.toString());
            }
            this.Records = list;
          }
        }
        else {
          this.ErrorMessage = JSON.stringify(error);
          this._topMessageService.danger(this.ErrorMessage);
        }
      }
    );

    this._dnsService.getProduct(this._dnsProductId).subscribe(
      product => {
        this._loadingService.stop();
        this.DownloadLink = product.download_link;
      },
      error => {
        this._loadingService.stop();
        this.ErrorMessage = JSON.stringify(error);
        this._topMessageService.danger(this.ErrorMessage);
      }
    );
  }

  onDeleteHost(event, id:number) : void {
    event.preventDefault();

    if (this.inValidPlan) {
      this.showUpgrading();
      return;
    }
    else {
      let index = this.Records.findIndex(o => o.id == id);
      let hostname = this.Records[index].name + '.' + 'wthdns.com';
      this._dialogService.activate('Are you sure to delete ' + hostname + '?', 'My Hosts', 'Yes', 'No').then((responseOK) => {
        if (responseOK) {
          this._loadingService.start();
          this._dnsService.deleteHost(id).subscribe(
            record => {
              this._loadingService.stop();
              this.Records.splice(index, 1);
            },
            error => {
              this._loadingService.stop();
              if (error['status'] == HttpStatusCode.PaymentRequired) {
                this.showUpgrading();
              }
              else {
                this.ErrorMessage = JSON.stringify(error);
                this._topMessageService.danger(this.ErrorMessage);
              }
            }
          );
        }
      });
    }
  }

  onEditHost(event, id:number) : void {
    event.preventDefault();
    if (this.inValidPlan) {
      this.showUpgrading();
      return;
    } 
    else {
      this._router.navigateByUrl('/account/dns/' + id);
    }
  }

  onAddHost(event) : void {
    event.preventDefault();
    if (this.inValidPlan) {
      this.showUpgrading();
      return;
    }
    else {
      this._router.navigateByUrl('/account/dns/add');
    }
  }

  private showUpgrading():void {
    this._dialogService.activate('Upgrading your accounts to continute?', 'My Hosts', 'Yes', 'No').then((responseOK) => {
      if (responseOK) {
        this._router.navigateByUrl('/account/payment');
      }
    });
  }
}
