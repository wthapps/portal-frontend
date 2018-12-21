// ## Using
// import {LoadingService} from '../shared/index';
//
// constructor(private _loadingService:LoadingService) {
// }
//
// ## Start
// this._loadingService.start(); // loading fullpage
// this._loadingService.start('#example');
// this._loadingService.start('.example');
//
// ## Stop
// this._loadingService.stop();
// this._loadingService.stop('#example');
// this._loadingService.stop('.example');

import { Component, OnInit } from '@angular/core';

import { LoadingService } from './loading.service';

declare var $: any;

@Component({
  selector: 'wth-loading',
  templateUrl: 'loading.component.html',
  styleUrls: ['loading.component.scss']
})
export class LoadingComponent implements OnInit {
  display = false;

  constructor(private loadingService: LoadingService) {
    loadingService.set = this.activate.bind(this);
  }

  ngOnInit() {
    this.display = false;
  }

  activate(action: boolean, el: string) {
    const promise = new Promise<boolean>(() => {
      this.show(action, el);
    });
    return promise;
  }

  private show(action: boolean, el: string) {
    if (el && $(el).length) {
      if (action) {
        $(el).wrap('<div class="inside-loading"></div>');
      } else {
        $(el).unwrap();
      }
    } else {
      this.display = action;
    }
  }
}
