import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Config } from '../core/shared/config/env.config';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import './operators';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/last';

import { CommonEventAction } from '../core/shared/services/common-event/common-event-action';
import { CommonEvent } from '../core/shared/services/common-event/common-event';
import { CommonEventService } from '../core/shared/services/common-event/common-event.service';
import { LabelEditModalComponent } from './label/label-edit-modal.component';
import { ConfirmationService } from 'primeng/primeng';
import { LabelService } from './label/label.service';
import { Subject } from 'rxjs/Subject';
import { Label } from './label/label.model';
import { ZContactSharedSettingsComponent } from './shared/modal/settings/settings.component';
import { ZContactService } from './shared/services/contact.service';

/**
 * This class represents the main application component.
 */
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html',
  entryComponents: [
    LabelEditModalComponent,
    ZContactSharedSettingsComponent
  ]
})
export class AppComponent implements OnInit, OnDestroy, CommonEventAction {
  routerSubscription: Subscription;
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;
  labels: Label[] = [];
  labels$: Observable<any[]>;
  contactMenu: Array<any> = new Array<any>();
  contactMenu$: Observable<any[]>;

  private destroySubject: Subject<any> = new Subject<any>();


  constructor(private router: Router,
              private resolver: ComponentFactoryResolver,
              private commonEventService: CommonEventService,
              private confirmationService: ConfirmationService,
              private contactService: ZContactService,
              private labelService: LabelService
  ) {
    console.log('Environment config', Config);
    this.commonEventService.filter((event: CommonEvent) => event.channel == 'contactCommonEvent').takeUntil(this.destroySubject).subscribe((event: CommonEvent) => {
      this.doEvent(event);
    })
    this.labelService.labels$
      .takeUntil(this.destroySubject)
      .subscribe((labels: any[]) => {
        this.labels = labels;
    });
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .takeUntil(this.destroySubject)
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });

    this.labelService.getAllLabels().then((labels: any[]) => console.debug('getAllLabels: ', labels));
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  doEvent(event: CommonEvent) {
    console.log('doEvent inside app component', event);
    switch (event.action) {
      case 'contact:label:open_modal_edit':
        this.loadModalComponent(LabelEditModalComponent);
        this.modal.open({
          mode: event.payload.mode,
          item: this.getLabel(event.payload.selectedItem) || new Label()
        });
        break;
      case 'contact:label:open_modal_setting':
        this.loadModalComponent(ZContactSharedSettingsComponent);
        this.modal.open();
        break;
      case 'contact:label:delete_confirm':
        this.confirmationService.confirm({
          message: 'Are you sure to this label',
          accept: () => {
            event.action = 'contact:label:delete';
            event.payload.selectedItem = this.getLabel(event.payload.selectedItem);
            this.commonEventService.broadcast({channel: 'contactCommonEvent', action: event.action, payload: event.payload});
          }
        });
        break;

      case 'contact:label:create':
        this.labelService.create(event.payload.label).subscribe(
          () =>{});
        break;
      case 'contact:label:update':
        let name = event.payload.label.name;
        this.labelService.update(event.payload.label).subscribe(
          () => {});
        break;
      case 'contact:label:delete':
        let label = this.getLabel(event.payload.selectedItem);
        this.labelService.delete(label.id).subscribe(() => {});
        break;
      case 'contact:contact:search':
        console.log('inside contact:contact:search: ', event);
        this.contactService.search(event.payload);
        break;
    }
  }

  private getLabel(name: string): Label {
    // return _.find(this.labelService.getAllLabels(), {name: name});
    return this.labelService.getLabelByName(name);
  }

  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;
  }
}
