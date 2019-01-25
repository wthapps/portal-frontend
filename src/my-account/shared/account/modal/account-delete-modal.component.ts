import { Component, Output, Input, ViewChild, OnInit, EventEmitter } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CommonEventService } from '@wth/shared/services/common-event/common-event.service';

@Component({
  moduleId: module.id,
  selector: 'account-delete-modal',
  templateUrl: 'account-delete-modal.component.html'
})

export class AccountDeleteModalComponent implements OnInit {
  @Input() item: any;
  @Output() event: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal') modal: BsModalComponent;
  options: any;

  constructor(private commonEventService: CommonEventService) {

  }

  ngOnInit() {
  }

  /*
  * @parameter: option: object
  * @data: array of item
  * @mode: add or edit or view. default is add
  * */
  open(options: any = { data: undefined, mode: 'edit' }) {
    this.item = options.data;
    this.options = options;
    this.modal.open(options).then();
  }

  close(options?: any) {
    this.modal.close(options).then();
  }

  delete() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:subscription:update',
      payload: { mode: 'delete', accounts: this.item }
    });
    this.modal.close().then();
  }

}
