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
import { CommonEventService } from '../shared/shared/services/common-event/common-event.service';
import { WthConfirmService } from '../shared/shared/components/confirmation/wth-confirm.service';
import { SubscriptionService } from './shared/subscription/subscription.service';
import { ToastsService } from '../shared/shared/components/toast/toast-message.service';
import { AccountService } from './shared/account/account.service';
import { Config } from '@shared/constant/config/env.config';

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
    SubscriptionEditModalComponent
  ]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;
  routerSubscription: Subscription;

  constructor(
    private router: Router,
    private resolver: ComponentFactoryResolver,
    private commonEventService: CommonEventService,
    private wthConfirmService: WthConfirmService,
    private accountService: AccountService,
    private subscriptionService: SubscriptionService,
    private toastsService: ToastsService
  ) {
    console.log('Environment config', Config);
    this.commonEventService.filter((event: any) => event.channel == 'my_account').subscribe((event: any) => {
      this.doEvent(event);
    });
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });
  }

  ngAfterViewInit() {
    $(document).on('hidden.bs.modal', '.modal', () => {
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
        this.accountService.update(event.payload.data).subscribe(
          (response: any) => {
            console.log('update_account:::', response.data);
            this.toastsService.success('You have just update account successfully!')
          });

        break;
      case 'my_account:account:send_request_ownership':
        this.toastsService.success('You have just sent request ownership successfully!')
        break;
      case 'my_account:account:accept_request_ownership':
        this.toastsService.success('You have just accept request ownership successfully!')
        break;
      case 'my_account:account:reject_request_ownership':
        this.toastsService.success('You have just reject request ownership successfully!')
        break;
      case 'my_account:account:open_accept_request_ownership_modal':
        this.loadModalComponent(AccountRequestAcceptModalComponent);
        this.modal.open({...event.payload});
        break;
      // Subscription
      case 'my_account:subscription:open_subscription_update_modal':
        this.loadModalComponent(SubscriptionEditModalComponent);
        this.modal.open({...event.payload});
        break;
      case 'my_account:subscription:update':
        this.wthConfirmService.confirm({
          message: 'You are about Update Subscription.' +
          'This action will change your subscription and you will be charged $' +
          // event.payload.subscription.accountAmount + '/month' +
          'Are you sure you want to update?',
          header: 'Update subscription',
          acceptLabel: 'Yes, Update',
          accept: () => {
            this.subscriptionService.update({id: 0, ...event.payload}).subscribe((response: any) => {
              this.toastsService.success('You have just changed your subscription successfully!')
            });
          }
        });
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
