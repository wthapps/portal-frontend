import {
  Component, OnInit, OnDestroy, ViewEncapsulation, ViewContainerRef, ViewChild,
  ComponentFactoryResolver, AfterViewInit
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import './operators';
import 'rxjs/add/operator/filter';

import { Config } from '../core/shared/config/env.config';
import {
  AccountListEditModalComponent,
  AccountEditModalComponent,
  AccountDetailModalComponent
} from './shared/account/modal/index';
import { SubscriptionEditModalComponent } from './shared/subscription/modal/subscription-edit-modal.component';
import { CommonEventService } from '../core/shared/services/common-event/common-event.service';
import { WthConfirmService } from '../core/shared/components/confirmation/wth-confirm.service';
import { SubscriptionService } from './shared/subscription/subscription.service';
import { Constants } from '../core/shared/config/constants';

declare var $: any;

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  encapsulation: ViewEncapsulation.None,
  entryComponents: [
    AccountListEditModalComponent,
    AccountEditModalComponent,
    AccountDetailModalComponent,
    SubscriptionEditModalComponent
  ]
})
export class AppComponent implements OnInit, OnDestroy, OnDestroy {
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;
  routerSubscription: Subscription;

  constructor(
    private router: Router,
    private resolver: ComponentFactoryResolver,
    private commonEventService: CommonEventService,
    private wthConfirmService: WthConfirmService,
    private subscriptionService: SubscriptionService
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
      case 'my_account:account:open_account_detail_modal':
        this.loadModalComponent(AccountDetailModalComponent);
        this.modal.open();
        break;
      case 'my_account:account:open_account_delete_confirmation_modal':
        this.wthConfirmService.confirm({
          message: 'You are about Delete account.' +
          'This action will change your current subscription' +
          'Are you sure you want to delete this account?',
          header: 'Delete account',
          acceptLabel: 'Yes, Delete',
          accept: () => {
            this.loadModalComponent(SubscriptionEditModalComponent);
            this.modal.open({data: event.payload.data, mode: 'edit', accountAction: 'delete'});
          }
        });
        break;
      case 'my_account:account:update':
        // this.wthConfirmService.confirm({
        //   message: 'You are about Update Subscription.' +
        //   'This action will change your subscription and you will be charged $20/month' +
        //   'Are you sure you want to update?',
        //   header: 'Update subscription',
        //   acceptLabel: 'Yes, Update',
        //   accept: () => {
        //    this.subscriptionService.update({subscription: {...event.payload}}).subscribe((response: any) => {
        //      console.log(response.data);
        //    });
        //   }
        // });
        break;

      // Subscription
      case 'my_account:subscription:open_subscription_update_modal':
        this.loadModalComponent(SubscriptionEditModalComponent);
        this.modal.open({...event.payload});
        break;
      case 'my_account:subscription:update':
        this.wthConfirmService.confirm({
          message: 'You are about Update Subscription.' +
          'This action will change your subscription and you will be charged $20/month' +
          'Are you sure you want to update?',
          header: 'Update subscription',
          acceptLabel: 'Yes, Update',
          accept: () => {
            this.subscriptionService.update({id: 0, ...event.payload}).subscribe((response: any) => {
              console.log(response.data);
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
