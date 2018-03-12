import {
  Component, OnInit, OnDestroy, ViewEncapsulation, ViewContainerRef, ViewChild,
  ComponentFactoryResolver, AfterViewInit
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

import {
  AccountListEditModalComponent,
  AccountEditModalComponent,
  AccountDeleteModalComponent,
  AccountRequestSendModalComponent,
  AccountRequestAcceptModalComponent
} from './shared/account/modal/index';
import { SubscriptionEditModalComponent } from './shared/subscription/modal/subscription-edit-modal.component';
import { CommonEventService } from '../shared/services/common-event/common-event.service';
import { WthConfirmService } from '../shared/shared/components/confirmation/wth-confirm.service';
import { SubscriptionService } from './shared/subscription/subscription.service';
import { ToastsService } from '../shared/shared/components/toast/toast-message.service';
import { AccountService } from './shared/account/account.service';
import { Config } from '@shared/constant/config/env.config';
import { Store } from '@ngrx/store';
import * as fromRoot from './store';
import * as fromAccount from './store/account';
import { AuthService, UserService } from '@wth/shared/services';
import { AccountRequestOwnershipModalComponent } from '@account/admin/accounts/account-request-ownership-modal.component';


declare let $: any;

/**
 * This class represents the main application component.
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  entryComponents: [
    AccountListEditModalComponent,
    AccountEditModalComponent,
    AccountDeleteModalComponent,
    AccountRequestSendModalComponent,
    AccountRequestAcceptModalComponent,
    AccountRequestOwnershipModalComponent,
    SubscriptionEditModalComponent
  ]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;
  routerSubscription: Subscription;
  currentUser: any;

  constructor(
    public authService: AuthService,
    private router: Router,
    private resolver: ComponentFactoryResolver,
    private commonEventService: CommonEventService,
    private wthConfirmService: WthConfirmService,
    private accountService: AccountService,
    private subscriptionService: SubscriptionService,
    private toastsService: ToastsService,
    private userService: UserService,
    private store: Store<fromRoot.State>
  ) {
    this.commonEventService.filter((event: any) => event.channel == 'my_account').subscribe((event: any) => {
      this.doEvent(event);
    });
  }

  ngOnInit() {
    this.currentUser = this.userService.getSyncProfile();

    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });

    // fix scroll to top after changing route
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
  }

  ngAfterViewInit() {
    $(document).on('hide.bs.modal', '.modal', () => {
      if ($('.modal:visible').length) {
        $(document.body).addClass('modal-open');
      }
    });
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  doEvent(event: any) {
    switch (event.action) {
      // Account
      case 'my_account:account:open_account_list_edit_modal':
        this.loadModalComponent(AccountListEditModalComponent);
        this.modal.open({...event.payload});
        break;
      case 'my_account:account:open_account_edit_modal':
        this.loadModalComponent(AccountEditModalComponent);
        this.modal.open({...event.payload});
        break;
      case 'my_account:account:open_delete_modal':
        this.loadModalComponent(AccountDeleteModalComponent);
        this.modal.open({...event.payload});
        break;
      case 'my_account:account:update':
        this.store.dispatch(new fromAccount.Update(event.payload.data));
        // this.accountService.update(event.payload.data).subscribe(
        //   (response: any) => {
        //     console.log('update_account:::', response.data);
        //     this.toastsService.success('You have just update account successfully!');
        //   });

        break;
      case 'my_account:account:open_request_ownership_modal':
        this.loadModalComponent(AccountRequestOwnershipModalComponent);
        this.modal.open({...event.payload});
        break;
      case 'my_account:account:send_request_ownership':
        this.accountService.requestOwnership(this.currentUser).subscribe((response: any) => {
          this.toastsService.success('You have just sent request ownership successfully!');
        });
        break;
      case 'my_account:account:accept_request_ownership':
        this.accountService.acceptOwnership({
            id: this.currentUser.id,
            requestedId: event.payload.user.id
          }).subscribe((response: any) => {
          this.toastsService.success('You have just accepted request ownership successfully!');
        });
        break;
      case 'my_account:account:reject_request_ownership':
        this.toastsService.success('You have just reject request ownership successfully!');
        break;
      case 'my_account:account:open_accept_request_ownership_modal':
        this.loadModalComponent(AccountRequestAcceptModalComponent);
        this.modal.open({...event.payload});
        break;
      // Subscription
      case 'my_account:subscription:open_subscription_update_modal':
        this.loadModalComponent(SubscriptionEditModalComponent);
        this.modal.open({...event.payload, user: this.currentUser});
        break;
      case 'my_account:subscription:update':
        if (event.payload.mode === 'add') {
          this.store.dispatch(new fromAccount.AddMany(event.payload));
        } else if (event.payload.mode === 'delete') {
          this.store.dispatch(new fromAccount.Update({...event.payload.accounts[0], removing: true}));
        }
        break;
    }
  }


  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;
  }
}
