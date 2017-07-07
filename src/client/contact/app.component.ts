import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Config } from '../core/shared/config/env.config';

import { Subscription } from 'rxjs/Subscription';
import './operators';
import 'rxjs/add/operator/filter';
import { CommonEventAction } from '../core/shared/services/common-event/common-event-action';
import { CommonEvent } from '../core/shared/services/common-event/common-event';
import { CommonEventService } from '../core/shared/services/common-event/common-event.service';
import { LabelEditModalComponent } from './label/label-edit-modal.component';
import { ConfirmationService } from 'primeng/primeng';

/**
 * This class represents the main application component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  entryComponents: [
    LabelEditModalComponent
  ]
})
export class AppComponent implements OnInit, OnDestroy, CommonEventAction {
  routerSubscription: Subscription;
  commonEventSub: Subscription;
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;

  constructor(private router: Router,
              private resolver: ComponentFactoryResolver,
              private commonEventService: CommonEventService,
              private confirmationService: ConfirmationService
  ) {
    console.log('Environment config', Config);
    this.commonEventSub = this.commonEventService.event.subscribe((event: any) => this.doEvent(event));
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
    this.commonEventSub.unsubscribe();
  }

  doEvent(event: CommonEvent) {
    switch(event.action) {
      case 'contact:label:create':
      case 'contact:label:edit':
        this.loadModalComponent(LabelEditModalComponent);
        this.modal.mode = (<Array<string>>event.action.split(':')).pop();
        this.modal.open();
        break;
      case 'contact:label:delete':
        this.confirmationService.confirm({
          message: 'Are you sure to this label',
          accept: () => {
            console.log('yes deleted!!!');
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
