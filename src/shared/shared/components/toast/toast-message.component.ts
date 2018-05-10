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

import {AfterViewInit, Component} from '@angular/core';
import { Message } from 'primeng/components/common/message';

@Component({
  selector: 'wth-toast',
  templateUrl: 'toast-message.component.html',
  styleUrls: ['toast-message.component.scss']
})
export class ToastsComponent {
  life: number = 3000;
  msgs: Message[] = [];

  constructor() {}
}
