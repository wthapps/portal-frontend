import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

import {AccountMenuComponent} from '../../menu/account-menu.component';

import {IRecord} from './record';
import {DnsService, Logger} from './dns.service';

@Component({
  templateUrl: 'app/account/services/dns/dns.component.html',
  directives: 
  [
    ROUTER_DIRECTIVES,
    AccountMenuComponent
  ]
})

export class AccountServicesDNSComponent implements OnInit {
  protected pageTitle:string = "DNS Service";

  public Records:IRecord[] = [];
  public ErrorMessage:string;

  constructor(private _dnsService: DnsService, private _router: Router) { }

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
    this._dnsService.deleteHost(id).subscribe(
      record => {
        let index = this.Records.findIndex(o => o.id == id);
        this.Records.splice(index, 1);
        Logger.Info(JSON.stringify(record));
      },
      error => {
        Logger.Error(JSON.stringify(error));
      }
    );
  }

  onDisableHost(event, id) {
    event.preventDefault();
    this._dnsService.getHost(id).subscribe(
      result => {
        let record = result;
        record.content = '127.0.0.1';
        let data = {
          "record": record
        };
        let body = JSON.stringify(data);
        this._dnsService.updateHost(body).subscribe(
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
}
