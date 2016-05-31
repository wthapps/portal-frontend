import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES, OnActivate, RouteSegment, Router} from '@angular/router';

import {AccountMenuComponent} from '../../menu/account-menu.component';

import {DnsService, Logger} from './dns.service';
import {IRecord, Type} from './record';

@Component({
  templateUrl: 'app/account/services/dns/dns-update.component.html',
  directives: 
  [
    ROUTER_DIRECTIVES,
    AccountMenuComponent
  ]
})

export class AccountServicesDNSUpdateComponent implements OnInit, OnActivate {
  protected pageTitle:string = "Edit DNS";

  public types:Type[] = [
    { "value" : 'A', "name" : 'IPv4' },
    { "value" : 'AAAA', "name" : 'IPv6' }
  ];

  public type:Type = new Type();

  public Record:IRecord = new IRecord();

  constructor(private _dnsService: DnsService, private _router: Router) { }

  ngOnInit() :void {
    this._dnsService.getHost(this._id).subscribe(
      result => {
        this.Record = result;
        this.type = this.types.find(o => o.value == this.Record.type);
      },
      error => {
        Logger.Error(JSON.stringify(error));
      }
    );
  }

  onUpdateHost(event, domain, name, type, content) {
    event.preventDefault();

    this.Record.domain_id = Number(domain);
    this.Record.name = name;
    this.Record.type = type;
    this.Record.content = content;

    let data = {
      "record": this.Record
    };
    let body = JSON.stringify(data);
    Logger.Info(body);
    this._dnsService.updateHost(body).subscribe(
      result => {
        Logger.Info(JSON.stringify(result));
        this._router.navigateByUrl('/account/dns');
      },
      error => {
        Logger.Error(JSON.stringify(error));
      }
    );
  }

  routerOnActivate(curr:RouteSegment):void {
    this._id = Number(curr.getParam('id').toString());
    Logger.Info(this._id.toString());
  }

  onBack():void {
  }

  private _id: number;
}
