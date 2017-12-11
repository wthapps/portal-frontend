import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';

import { InvitationService } from '@wth/shared/shared/components/invitation/invitation.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';
import { LoadingService } from '@wth/shared/shared/components/loading/loading.service';
import { CommonEventService } from '@wth/shared/services/common-event/common-event.service';
import { AccountService } from '../../shared/account/account.service';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { UserService } from '@wth/shared/services/user.service';

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
  currentUser: any;
  private destroySubject: Subject<any> = new Subject();

  constructor(
    private commonEventService: CommonEventService,
    private accountService: AccountService,
    private toaster: ToastsService,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private wthConfirmService: WthConfirmService,
    private userService: UserService
  ) {

  }

  ngOnInit() {
    this.currentUser = this.userService.profile;
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
      payload: {mode: 'edit', accountAction: 'add', data: new Array<any>(), accounts: this.items}
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

  view(item: any) {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_account_edit_modal',
      payload: {mode: 'view', data: item}
    });
  }

  edit(item: any) {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_account_edit_modal',
      payload: {mode: 'edit', data: item}
    });
  }

  delete(item: any) {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_delete_modal',
      payload: {mode: 'edit', accountAction: 'delete', data: [item], accounts: this.items}
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
