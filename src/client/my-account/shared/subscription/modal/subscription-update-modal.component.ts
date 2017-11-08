import { Component, Input, ViewChild, OnInit } from '@angular/core';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'subscription-update-modal',
  templateUrl: 'subscription-update-modal.component.html',
  styleUrls: ['subscription-update-modal.component.css']
})

export class SubscriptionUpdateModalComponent implements OnInit {
  @Input() data: any;
  @ViewChild('modal') modal: ModalComponent;

  type: string = 'items';

  constructor(private commonEventService: CommonEventService) {
  }

  ngOnInit() {

  }

  /*
  * @parameter: option: object
  * @data: array of item
  * @mode: add or edit or view. default is add
  * */
  open(options: any = {data: undefined, mode: 'add'}) {
    if (options.data == undefined) {
      // this.initialize();
    } else {
      this.data = options.data;
      // this.fillData();
    }
    this.modal.open(options).then();
  }

  close(options?: any) {
    this.modal.close(options).then();
  }

  update() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:subscription:update',
      payload: this.data
    });
  }

  edit() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_account_list_edit_modal',
      payload: {mode: 'edit', data: null}
    });
  }

}
