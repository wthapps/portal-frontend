import {Component, OnInit}         from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {IRecord}                   from './record';
import {DnsService, Logger}        from './dns.service';
import {DialogService}             from '../../../partials/dialogs/index';

import {UserService, CONFIG}       from '../../../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'dns.component.html',
  directives:
  [
    ROUTER_DIRECTIVES
  ]
})

export class AccountServicesDNSComponent implements OnInit {
  protected pageTitle:string = "My Hosts";

  public Records:IRecord[] = [];
  public ErrorMessage:string;
  public DownloadLink: string;

  constructor(private _dnsService: DnsService,
              private _dialogService: DialogService,
              private _userService:UserService,
              private _router:Router) {

    if (!this._userService.loggedIn) {
      this._router.navigateByUrl(`/login;${CONFIG.params.next}=${this._router._location.path().replace(/\//g, '\%20')}`);
    }

  }

  ngOnInit():void {
    this._dnsService.getHosts().subscribe(
      record => this.Records = record,
      error => {
        this.ErrorMessage = <any>error;
        Logger.Error(JSON.stringify(error));
      }
    );

    this._dnsService.getProduct(1).subscribe(
      product => {
        this.DownloadLink = product.download_link;
      },
      error => {
        this.ErrorMessage = <any>error;
        Logger.Error(JSON.stringify(error));
      }
    );
  }

  onDeleteHost(event, id:number) {
    event.preventDefault();
    let index = this.Records.findIndex(o => o.id == id);
    let hostname = this.Records[index].name + '.' + 'wthdns.com';
    this._dialogService.activate('Are you sure to delete ' + hostname + '?', 'My Hosts', 'Yes', 'No').then((responseOK) => {
      if (responseOK) {
        this._dnsService.deleteHost(id).subscribe(
          record => {
            this.Records.splice(index, 1);
            Logger.Info(JSON.stringify(record));
          },
          error => {
            Logger.Error(JSON.stringify(error));
          }
        );
      }
    });
  }
/*@TODO: to disable this feature
  onDisableHost(event, id) {
    event.preventDefault();
    this._dnsService.getHost(id).subscribe(
      result => {
        let record = result;
        record.content = '127.0.0.1';
        let body = JSON.stringify(record);
        this._dnsService.updateHost(body, record.id).subscribe(
          result => {
            Logger.Info(JSON.stringify(result));
          },
          error => {
            Logger.Error(JSON.stringify(error));
          }
        );
      },
      error => {
        Logger.Error(JSON.stringify(error));
      }
    );
  }
*/
}
