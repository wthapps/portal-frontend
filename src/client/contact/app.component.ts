import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import './operators';

import { ConfirmationService } from 'primeng/components/common/confirmationservice';

import { Config } from '../core/shared/config/env.config';
import { LabelEditModalComponent } from './label/label-edit-modal.component';
import { Label } from './label/label.model';
import { LabelService } from './label/label.service';

import { CommonEvent } from '../core/shared/services/common-event/common-event';
import { CommonEventAction } from '../core/shared/services/common-event/common-event-action';
import { CommonEventService } from '../core/shared/services/common-event/common-event.service';

/**
 * This class represents the main application component.
 */
declare var _: any;

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
  labels: Label[];
  contactMenu: Array<any> = new Array<any>();

  private destroySubject: Subject<any> = new Subject<any>();


  constructor(private router: Router,
              private resolver: ComponentFactoryResolver,
              private commonEventService: CommonEventService,
              private confirmationService: ConfirmationService,
              private labelService: LabelService) {
    console.log('Environment config', Config);
    this.commonEventSub = this.commonEventService.event.takeUntil(this.destroySubject).subscribe((event: any) => this.doEvent(event));
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });

    this.labelService.getAllLabels().then(
      (response: any) => {
        this.labels = response;

        //map labels to ContactMenu Item
        _.each(this.labels, (label: Label) => {
          this.contactMenu.push(this.mapLabelToMenuItem(label));

        });
        // this.contactMenu.push(label.convertToMenuItem());
        // this.contactMenu.push(
        //   { name: '', link: '', icon: '' },
        //   { name: 'Settings', link: '/settings', icon: 'fa fa-cog'}
        // );
      }
    );
  }

  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.commonEventSub.unsubscribe();
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
            this.labels.push(response.data);
            this.contactMenu.push(this.mapLabelToMenuItem(this.labels.pop()));
          }
        );
        break;
      case 'contact:label:update':
        let name = event.payload.label.name;
        this.labelService.update(event.payload.label).subscribe(
          (response: any) => {

            // update menu item and label data
            _.each(this.labels, (label: Label) => {
              if (response.data.id == label.id) {
                label.name = response.data.name;
                return;
              }
            });

            _.each(this.contactMenu, (menu: Label) => {
              if (response.data.id == menu.id) {
                menu.name = response.data.name;
                return;
              }
            });

          }
        );
        break;
      case 'contact:label:delete':
        let label = this.getLabel(event.payload.selectedItem);
        this.labelService.delete(label.id).subscribe(
          (response: any) => {
            _.remove(this.labels, {name: response.data.name});
            _.remove(this.contactMenu, {name: response.data.name});
          }
        );
        break;
    }
  }

  private mapLabelToMenuItem(label: Label): any {
    return {
      id: label.id,
      name: label.name,
      link: '/contacts',
      hasSubMenu: !label.system,
      count: label.contact_count,
      icon: label.name == 'all contact' ? 'fa fa-address-book-o'
        : label.name == 'favourite' ? 'fa fa-star'
        : label.name == 'labels' ? 'fa fa-tags'
        : label.name == 'blacklist' ? 'fa fa-ban'
        : label.name == 'social' ? 'fa fa-globe'
        : label.name == 'chat' ? 'fa fa-comments-o'
        : 'fa fa-folder-o'
    };
  }

  private getLabel(name: string): Label {
    return _.find(this.labels, {name: name});
  }

  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;
  }
}
