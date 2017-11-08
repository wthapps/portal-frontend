import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';

import { InvitationService } from '../../../core/shared/components/invitation/invitation.service';
import { ToastsService } from '../../../core/shared/components/toast/toast-message.service';
import { LoadingService } from '../../../core/shared/components/loading/loading.service';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import { AccountService } from '../../shared/account/account.service';
import { WthConfirmService } from '../../../core/shared/components/confirmation/wth-confirm.service';

declare let _: any;

@Component({
  moduleId: module.id,
  selector: 'account-list',
  templateUrl: 'account-list.component.html',
  providers: [InvitationService]
})

export class AccountListComponent implements OnInit, OnDestroy {
  data: Array<any>;
  items: Array<any> = new Array<any>();
  selectedItems: Array<any> = [];
  isSelectAll: boolean;

  private destroySubject: Subject<any> = new Subject();

  constructor(
    private commonEventService: CommonEventService,
    private accountService: AccountService,
    private toaster: ToastsService,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private wthConfirmService: WthConfirmService
  ) {
  }

  ngOnInit() {
    this.accountService.getAll().subscribe((response: any) => {
      this.items = response.data;
    });
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  openAccountAddModal() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_account_list_edit_modal',
      payload: {mode: 'add', data: null}
    });
  }


  doEvent(event: any) {
    this.loadingService.start('#loading');
    // switch (event.action) {
    //   case 'invitation:send_to_recipients':
    //
    //     this.invitationService.create({recipients: event.payload}).subscribe((response: any) => {
    //         this.items = _.uniqBy([...this.items, ...response.data], 'recipient_email');
    //         this.loadingService.stop('#loading');
    //         this.toaster.success('You have just sent invitation(s) successfully!');
    //       },
    //       (error: any) => {
    //         this.loadingService.stop('#loading');
    //         this.toaster.danger('There is a error when you sent invitation(s)!');
    //       }
    //     );
    //     this.modal.close();
    //     break;
    // }
  }

  view() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_account_edit_modal',
      payload: {mode: 'view', data: this.data}
    });
  }

  edit() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_account_edit_modal',
      payload: {mode: 'edit', data: this.data}
    });
  }

  delete() {
    this.wthConfirmService.confirm({
      message: 'Are you sure you want to delete this account?',
      header: 'Delete account',
      accept: () => {
        this.commonEventService.broadcast({
          channel: 'my_account',
          action: 'my_account:account:delete',
          payload: {data: this.data}
        });
      }
    });
  }

  select(item: any) {
    let selectedItem = _.find(this.selectedItems, (i: any) => i.uuid === item.uuid);
    if(!selectedItem) {
      this.selectedItems.push(item);
      item = Object.assign({},item, {selected: true});
      if(this.selectedItems.length === this.items.length)
        this.isSelectAll = true;
    } else {
      _.remove(this.selectedItems, (i: any) => i.uuid === item.uuid);
      item = Object.assign({},item, {selected: false});
      this.isSelectAll = false;
    }
  }

  selectAll() {
    if(this.selectedItems.length !== this.items.length) {
      this.selectedItems = [...this.items];
      this.items = _.map(this.items, (i: any) => Object.assign({}, i, {selected: true}));
      this.isSelectAll = true;
    } else {
      this.selectedItems.length = 0;
      this.items = _.map(this.items, (i: any) => Object.assign({}, i, {selected: false}));
      this.isSelectAll = false;
    }
  }

  remove(item?: any) {
    // if(item) {
    //   this.invitationService.multiDelete({'ids': [item.id]}).toPromise()
    //     .then((res: any) => _.remove(this.items, (i: any) => i.uuid === item.uuid));
    // } else {
    //   // Remove selected
    //   let ids = _.map(this.selectedItems, 'id');
    //   this.invitationService.multiDelete({'ids': ids}).toPromise()
    //     .then((res: any) => _.remove(this.items, (i: any) => ids.indexOf(i.id) !== -1));
    // }
  }
}
