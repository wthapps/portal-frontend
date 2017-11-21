import { Component, Input, ViewChild, OnInit, ViewEncapsulation } from '@angular/core';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';
import { WthConfirmService } from '../../../../core/shared/components/confirmation/wth-confirm.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'subscription-edit-modal',
  templateUrl: 'subscription-edit-modal.component.html',
  styleUrls: ['subscription-edit-modal.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SubscriptionEditModalComponent implements OnInit {
  @Input() items: Array<any>;
  @ViewChild('modal') modal: ModalComponent;

  mode: string = 'view';
  accountAction: string = 'add'; //'add' or 'delete'
  operatingItems: Array<any>;
  subscription: any = {
    accountAmount: 30
  };
  constructor(private commonEventService: CommonEventService, private wthConfirmService: WthConfirmService) {
  }

  ngOnInit() {

  }

  /*
  * @parameter: option: object
  * @data: array of item
  * @mode: add or edit or view. default is add
  * */
  open(options: any = {data: undefined, mode: 'edit', accountAction: 'add'}) {
    this.mode = options.mode;
    this.accountAction = options.accountAction;
    this.items = options.accounts;
    this.operatingItems = options.data;
    // this.subscription = options.subscription;
    if (this.accountAction == 'delete') {
      // remove deleting items form
      _.remove(this.items, (item: any) => {
        return item.id == options.data[0].id;
      });
    }
    if (this.accountAction == 'add') {
      this.items = this.items.concat(this.operatingItems);
    }

    this.modal.open(options).then();
  }

  close(options?: any) {
    // if(this.mode === 'edit' || this.mode === 'delete' || this.mode === 'add') {
    //   this.wthConfirmService.confirm({
    //     message: 'You are about Update Subscription.' +
    //     'This action will change your subscription and you will be charged $20/month' +
    //     'Are you sure you want to cancel ' + this.accountAction + ' account',
    //     header: 'Cancel updating subscription' ,
    //     rejectLabel: 'No',
    //     acceptLabel: 'Yes, Cancel',
    //     accept: () => {
    //       this.modal.close(options).then();
    //     },
    //     reject: () => { return; }
    //   });
    //
    // }
    this.modal.close(options).then();
  }

  update() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:subscription:update',
      payload: { accounts: this.operatingItems, subscription: this.subscription }
    });
    this.modal.close().then();
  }

  edit() {
    // filter just adding item
    _.forEach(this.operatingItems, (oi: any) => {
      _.remove(this.items, (item: any) => {
          return item.id == oi.id;
      });
    });
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_account_list_edit_modal',
      payload: {mode: 'edit', data: this.operatingItems, accounts: this.items}
    });
  }

}
