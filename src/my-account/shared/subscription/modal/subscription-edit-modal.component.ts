import { Component, Input, ViewChild, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { BsModalComponent } from 'ng2-bs3-modal';
import { CommonEventService } from '@wth/shared/services/common-event/common-event.service';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { ApiBaseService } from '@wth/shared/services';
import { Constants } from '@wth/shared/constant';

declare var _: any;
declare let moment: any;


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
    amount: 0,
    accountAmount: 0,
    accountCount: 0,
    next_billing_date: null
  };
  editing: any = {
    accountCount: 0,
    accountPrice: 0,
    accountAmount: 0
  };
  plan: any;
  constants = Constants;

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
  open(options: any = {data: undefined, mode: 'edit', accountAction: 'add', subscription: {}}) {
    this.mode = options.mode;
    this.accountAction = options.accountAction;
    this.items = options.accounts;
    this.operatingItems = options.data;
    this.subscription = options.subscription;
    this.plan = options.user.plan;

    if (this.accountAction === 'delete') {
      // remove deleting items form
      // _.remove(this.items, (item: any) => {
      //   return item.id == options.data[0].id;
      // });
    }
    if (this.accountAction === 'add') {
      this.editing = options.editing;
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
        if (response.data.next_billing_date === null) {
          this.subscription.next_billing_date = moment().add(1, 'months');
        }
      }
    );
  }

  updateSubscription() {
    // update subscription info here
    // Adding case: base on number of days until next billing date

    // Deleting case: just subtract full price or sub price
  }

  update() {
    this.modal.close().then();
    if (this.mode === 'edit' || this.mode === 'delete' || this.mode === 'add') {
      let editingAmount = 0;

      if (this.mode === 'edit' && this.accountAction === 'add') {
        editingAmount = parseFloat(this.subscription.amount) + this.editing.accountCount * this.editing.accountPrice;
      } else if (this.mode === 'edit' && this.accountAction === 'delete') {
        editingAmount = parseFloat(this.subscription.amount) - this.editing.accountCount * this.editing.accountPrice;
      }
      this.wthConfirmService.confirm({
        message: `You are about Update subscription. <br>
        This action will change your subscription and you will be charged $${editingAmount}/month. <br>
        Are you sure you want to update your current subscription.`,
        header: 'Update subscription' ,
        rejectLabel: 'Cancel',
        acceptLabel: 'Update',
        accept: () => {
          this.commonEventService.broadcast({
            channel: 'my_account',
            action: 'my_account:subscription:update',
            payload: { accounts: this.operatingItems, subscription: this.subscription, mode: this.accountAction }
          });
        },
        reject: () => { return; }
      });

    }
    // this.commonEventService.broadcast({
    //   channel: 'my_account',
    //   action: 'my_account:subscription:update',
    //   payload: { accounts: this.operatingItems, subscription: this.subscription, mode: this.accountAction }
    // });
    // this.modal.close().then();
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
