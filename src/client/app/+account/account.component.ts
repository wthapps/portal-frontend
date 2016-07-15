import {
  Component,
  OnInit,
  OnDestroy
}                                 from '@angular/core';
import {
  ROUTER_DIRECTIVES
}                                 from '@angular/router';

import {
  StreamEmitter
}                                 from '../shared/index';

import {
  ContentPresenterComponent,
  AccountMenuViewModel,
  //DnsService,
  ServicesService
}                                 from './index';


@Component({
  moduleId: module.id,
  templateUrl: 'account.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    ContentPresenterComponent
  ],
  viewProviders: [
    StreamEmitter,
    //DnsService,
    ServicesService
  ]
})
export class AccountComponent implements OnInit, OnDestroy {
  public pageTitle:string = 'Account setting';
  public menu:AccountMenuViewModel = null;

  constructor(private _streamEmitter:StreamEmitter) {
    this.menu = new AccountMenuViewModel(this._streamEmitter);
  }

  ngOnInit():void {
    this.menu.load();
  }

  ngOnDestroy() {
    this.unload();
  }

  private unload():void {
    if (this.menu !== null) {
      this.menu.unload();
    }
  }
}
