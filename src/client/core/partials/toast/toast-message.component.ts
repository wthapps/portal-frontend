// ## Using
// import {ToastsService} from '../shared/index';
//
// constructor(private _toastsService:ToastsService) {
//   this._toastsService.danger('Message');
// }
//
// ## Options
// ###type:
//   - success
//   - danger
//   - warning
//   - info
//   - bare
//
// ###override
// timeOut:number;
// lastOnBottom:boolean;
// clickToClose:boolean;
//
// ## Example
// this._toastsService.danger('Message', {
//
//   timeOut: 5000, // auto close after 5s
//   lastOnBottom: true,
//   clickToClose: false
// });

import { Component, OnInit, } from '@angular/core';

import { Message } from 'primeng/primeng';

import { ToastsService } from './toast-message.service';

@Component({
  moduleId: module.id,
  selector: 'wth-toast',
  templateUrl: 'toast-message.component.html',
  styleUrls: ['toast-message.component.css']
})
export class ToastsComponent implements OnInit {

  maxStack: number = 5;
  msgs: Message[] = [];
  life: number = 3000;

  constructor(private toastsService: ToastsService) {
    toastsService.set = this.activate.bind(this);
  }

  activate(icon: string, summary: string, detail: string) {
    let promise = new Promise<boolean>((resolve, reject) => {
      this.show(icon, summary, detail);
    });
    return promise;
  }

  ngOnInit() {
    this.msgs = [];
  }

  private show(icon: string, summary: string, detail: string) {

    if (this.msgs.length >= this.maxStack) this.msgs.shift();
    this.msgs.push({severity: icon, summary: summary, detail: detail});

    // new item at top
    /*if (this.toasts.length >= this.maxStack) this.toasts.pop();
    this.toasts.unshift(toast);*/
  }
}
