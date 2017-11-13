import { Component, Input, ViewChild, OnInit } from '@angular/core';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';
import { WthConfirmService } from '../../../../core/shared/components/confirmation/wth-confirm.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'subscription-edit-modal',
  templateUrl: 'subscription-edit-modal.component.html',
  styleUrls: ['subscription-edit-modal.component.css']
})

export class SubscriptionEditModalComponent implements OnInit {
  @Input() items: any;
  @ViewChild('modal') modal: ModalComponent;

  mode: string = 'view';

  constructor(private commonEventService: CommonEventService, private wthConfirmService: WthConfirmService) {
  }

  ngOnInit() {

  }

  /*
  * @parameter: option: object
  * @data: array of item
  * @mode: add or edit or view. default is add
  * */
  open(options: any = {data: undefined, mode: 'edit'}) {
    if (options.data == undefined) {
      // this.initialize();
    } else {
      this.items = options.data;
      // this.fillData();
    }
    this.modal.open(options).then();
  }

  close(options?: any) {
    if(this.mode === 'edit' || this.mode === 'delete' || this.mode === 'add') {
      this.wthConfirmService.confirm({
        message: 'You are about Update Subscription.' +
        'This action will change your subscription and you will be charged $20/month' +
        'Are you sure you want to update?',
        header: 'Update subscription',
        rejectLabel: 'No',
        acceptLabel: 'Yes, Cancel',
        accept: () => {
          this.modal.close(options).then();
        },
        reject: () => { return; }
      });

    }
    this.modal.close(options).then();
  }

  update() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:subscription:update',
      payload: { accounts: this.items }
    });
  }

  edit() {
    // filter just adding item
    let addingItems = this.items;

    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_account_list_edit_modal',
      payload: {mode: 'edit', data: addingItems}
    });
  }

}
