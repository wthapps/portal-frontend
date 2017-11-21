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

import { Component } from '@angular/core';
import { Message } from 'primeng/primeng';

@Component({
  moduleId: module.id,
  selector: 'wth-toast',
  templateUrl: 'toast-message.component.html',
  styleUrls: ['toast-message.component.css']
})
export class ToastsComponent {
  life: number = 3000;
  msgs: Message[] = [];

  constructor() {
  }
}
