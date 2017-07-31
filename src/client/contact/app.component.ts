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
  commonEventSub: Subscription;
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;
  labels: Label[] = [];
  // contactMenu: Array<any> = new Array<any>();
  // contactMenu$: Observable<any[]>;
  labels$: Observable<any[]>;

  private destroySubject: Subject<any> = new Subject<any>();


  constructor(private router: Router,
              private resolver: ComponentFactoryResolver,
              private commonEventService: CommonEventService,
              private confirmationService: ConfirmationService,
              private contactService: ZContactService,
              private labelService: LabelService,
              // public contactMenuService: ZContactMenuService
  ) {
    console.log('Environment config', Config);
    this.commonEventSub = this.commonEventService.event.takeUntil(this.destroySubject).subscribe((event: any) => this.doEvent(event));
    this.labelService.labels$
      .takeUntil(this.destroySubject)
      .subscribe((labels: any[]) => {
      // this.labels.length = 0;
      // this.labels.push(...labels);
        this.labels = labels;
      console.debug('app labels: ', this.labels);
    })
    ;

    // this.contactMenuService.contactMenu$.subscribe((menus: any[]) => {
    //   this.contactMenu.length = 0;
    //   this.contactMenu.push(...menus);
    //   console.log('contactMenu: ', menus, this.contactMenu);
    // });
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
    // this.routerSubscription.unsubscribe();
    // this.commonEventSub.unsubscribe();
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
            this.commonEventService.broadcast(event);
          }
        });
        break;

      case 'contact:label:create':
        this.labelService.create(event.payload.label).subscribe(
          (response: any) => {
            // this.labels.push(response.data);
            console.log('contact label is created !!!');

          }
        );
        break;
      case 'contact:label:update':
        let name = event.payload.label.name;
        this.labelService.update(event.payload.label).subscribe(
          (response: any) => {

            // update menu item and label data
            // _.each(this.labels, (label: Label) => {
            //   if (response.data.id == label.id) {
            //     label.name = response.data.name;
            //     return;
            //   }
            // });

            // this.contactMenuService.updateMenuName(response.data);

          }
        );
        break;
      case 'contact:label:delete':
        let label = this.getLabel(event.payload.selectedItem);
        this.labelService.delete(label.id).subscribe(
          (response: any) => {
            // _.remove(this.labels, {name: response.data.name});
            // _.remove(this.contactMenu, {name: response.data.name});
            // this.contactService.contactMenusService.removeMenuByName({name: response.data.name});
          }
        );
        break;
      case 'contact:contact:search':
        console.log('inside contact:contact:search: ', event);
        this.contactService.search(event.payload);
        break;
    }
  }

  // private mapLabelToMenuItem(label: Label): any {
  //   return {
  //     id: label.id,
  //     name: label.name,
  //     link: '/contacts',
  //     hasSubMenu: !label.system,
  //     count: (label.name == 'all contact' ? this.contactService.getAllContacts().length : label.contact_count),
  //     icon: label.name == 'all contact' ? 'fa fa-address-book-o'
  //       : label.name == 'favourite' ? 'fa fa-star'
  //       : label.name == 'labels' ? 'fa fa-tags'
  //       : label.name == 'blacklist' ? 'fa fa-ban'
  //       : label.name == 'social' ? 'fa fa-globe'
  //       : label.name == 'chat' ? 'fa fa-comments-o'
  //       : 'fa fa-folder-o'
  //   };
  // }

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
