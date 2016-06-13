import {Component, OnInit}         from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {AccountMenuComponent}      from '../../menu/account-menu.component';

import {IRecord}                   from './record';
import {DnsService, Logger}        from './dns.service';
import {DialogService}             from '../../../partials/dialogs/index';

@Component({
  moduleId: module.id,
  templateUrl: 'dns.component.html',
  directives:
  [
    ROUTER_DIRECTIVES,
    AccountMenuComponent
  ]
})

export class AccountServicesDNSComponent implements OnInit {
  protected pageTitle:string = "My Hosts";

  public Records:IRecord[] = [];
  public ErrorMessage:string;

  constructor(private _dnsService: DnsService, 
              private _router: Router,
              private _dialogService: DialogService) { }

  ngOnInit() :void {
    this._dnsService.getHosts().subscribe(
      record => this.Records = record,
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
