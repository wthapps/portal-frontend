import {
  Component, OnInit, OnDestroy, ViewEncapsulation, ViewContainerRef, ViewChild,
  ComponentFactoryResolver
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
import { SubscriptionUpdateModalComponent } from './shared/subscription/modal/subscription-update-modal.component';
import { CommonEventService } from '../core/shared/services/common-event/common-event.service';


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
    SubscriptionUpdateModalComponent
  ]
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;
  routerSubscription: Subscription;

  constructor(private router: Router,
              private resolver: ComponentFactoryResolver,
              private commonEventService: CommonEventService) {
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

  doEvent(event: any) {
    switch (event.action) {
      case 'my_account:account:open_account_list_edit_modal':
        this.loadModalComponent(AccountListEditModalComponent);
        this.modal.open({mode: event.payload.mode, data: undefined});
        break;
      case 'my_account:account:open_account_edit_modal':
        this.loadModalComponent(AccountEditModalComponent);
        this.modal.open({mode: event.payload.mode, data: undefined});
        break;
      case 'my_account:account:open_account_detail_modal':
        this.loadModalComponent(AccountDetailModalComponent);
        this.modal.open();
        break;
      case 'my_account:subscription:open_subscription_update_modal':
        this.loadModalComponent(SubscriptionUpdateModalComponent);
        this.modal.open({mode: 'update'});
        break;
      case 'my_account:subscription:update':
        console.log('update subscription::::', event.payload);
        break;
    }
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
  }

  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;
  }
}
