import { Component, Input, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';

import { BsModalComponent } from 'ng2-bs3-modal';
import { CommonEventService } from '@wth/shared/services/common-event/common-event.service';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { ApiBaseService } from '@wth/shared/services';

declare var _: any;
declare let moment:any;


@Component({
  selector: 'subscription-edit-modal',
  templateUrl: 'subscription-edit-modal.component.html',
  styleUrls: ['subscription-edit-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class SubscriptionEditModalComponent implements OnInit, AfterViewInit {
  @Input() items: Array<any>;
  @ViewChild('modal') modal: BsModalComponent;

  mode: string = 'view';
  accountAction: string = 'add'; //'add' or 'delete'
  operatingItems: Array<any>;
  subscription: any = {
    accountCount: 0,
    accountAmount: 0,
    currentAmount: 0,
    subAccountCount: 0,
    fullAccountCount: 0,
    subPrice: 0,
    fullPrice: 0,
    billingDate: moment()
  };


  constructor(private commonEventService: CommonEventService,
              private api: ApiBaseService,
              private wthConfirmService: WthConfirmService) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {

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
    if (this.accountAction == 'delete') {
      // remove deleting items form
      // _.remove(this.items, (item: any) => {
      //   return item.id == options.data[0].id;
      // });
    }
    if (this.accountAction == 'add') {
      this.subscription = options.subscription;
      this.items = this.items.concat(this.operatingItems);
    }

    // load current subscription
    this.getCurrentSubscription(options.user);

    this.updateSubscription();

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

  getCurrentSubscription(user: any) {
    this.api.get(`account/accounts/${user.id}/subscription`).subscribe(
      (response: any) => {
        this.subscription = response.data;
      }
    );
  }

  updateSubscription() {
    // update subscription info here
    // Adding case: base on number of days until next billing date

    // Deleting case: just subtract full price or sub price
  }

  update() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:subscription:update',
      payload: { accounts: this.operatingItems, subscription: this.subscription, mode: this.accountAction }
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
