import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ApiBaseService, AuthService } from '@wth/shared/services';
import { CommonEventService } from '@wth/shared/services/common-event/common-event.service';
import { UserService } from '@wth/shared/services/user.service';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';


import { InvitationService } from '@wth/shared/shared/components/invitation/invitation.service';
import { ToastsService } from '@wth/shared/shared/components/toast/toast-message.service';

import { Observable, Subject } from 'rxjs';
import { AccountService } from '../../shared/account/account.service';

import * as fromRoot from '../../store';
import * as fromAccount from '../../store/account';

declare let _: any;

@Component({
  selector: 'account-list',
  templateUrl: 'account-list.component.html',
  styleUrls: ['account-list.component.scss'],
  providers: [InvitationService]
})

export class AccountListComponent implements OnInit, OnDestroy {
  data: Array<any>;
  items: Array<any> = new Array<any>();
  selectedItems: Array<any> = [];
  isSelectAll: boolean;
  currentUser: any;
  modal: any;
  user$: Observable<any>;
  subscription: any;
  parent: any;

  private destroySubject: Subject<any> = new Subject();

  constructor(
    public authService: AuthService,
    private commonEventService: CommonEventService,
    private accountService: AccountService,
    private toaster: ToastsService,
    private route: ActivatedRoute,
    private wthConfirmService: WthConfirmService,
    private userService: UserService,
    private api: ApiBaseService,
    private store: Store<fromRoot.State>
  ) {
    this.user$ = this.store.pipe(select(fromRoot.selectAllUsers));
  }

  ngOnInit() {
    this.currentUser = this.authService.user;

    this.store.dispatch({ type: fromAccount.ActionTypes.GET_ACCOUNTS, payload: { ...this.userService.getSyncProfile() } });

    this.api.get(`account/accounts/${this.currentUser.id}/subscription`).subscribe(
      (response: any) => {
        this.subscription = response.data;
        // if (response.data.next_billing_date === null) {
        //   this.subscription.next_billing_date = moment().add(1, 'months');
        // }
      }
    );
    this.api.get(`account/accounts/${this.currentUser.id}/parent`).subscribe(
      (response: any) => {
        this.parent = response.data;
      }
    );
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  acceptRequest(item: any) {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:accept_request_ownership',
      payload: { user: item }
    });
  }

  view(item: any) {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_account_edit_modal',
      payload: { mode: 'view', data: item }
    });
  }


  edit(item: any) {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_account_edit_modal',
      payload: { mode: 'edit', data: item }
    });
  }

  delete(item: any) {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_delete_modal',
      payload: {
        mode: 'edit',
        accountAction: 'delete',
        data: [item],
        accounts: this.items,
        subscription: this.subscription
      }
    });
  }

  openAccountAddModal() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_account_list_edit_modal',
      payload: {
        mode: 'edit',
        accountAction: 'add',
        data: new Array<any>(),
        accounts: this.items,
        subscription: this.subscription
      }
    });
  }

  openRequestOwnershipModal() {
    this.commonEventService.broadcast({
      channel: 'my_account',
      action: 'my_account:account:open_request_ownership_modal',
      payload: {
        user: this.currentUser,
        parent: this.parent
      }
    });
  }

  select(item: any) {
    let selectedItem = _.find(this.selectedItems, (i: any) => i.uuid === item.uuid);
    if (!selectedItem) {
      this.selectedItems.push(item);
      item = Object.assign({}, item, { selected: true });
      if (this.selectedItems.length === this.items.length) {
        this.isSelectAll = true;
      }
    } else {
      _.remove(this.selectedItems, (i: any) => i.uuid === item.uuid);
      item = Object.assign({}, item, { selected: false });
      this.isSelectAll = false;
    }
  }

  selectAll() {
    if (this.selectedItems.length !== this.items.length) {
      this.selectedItems = [...this.items];
      this.items = _.map(this.items, (i: any) => Object.assign({}, i, { selected: true }));
      this.isSelectAll = true;
    } else {
      this.selectedItems.length = 0;
      this.items = _.map(this.items, (i: any) => Object.assign({}, i, { selected: false }));
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
