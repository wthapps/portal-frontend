import { Component, ComponentFactoryResolver, ViewChild, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/last';
import { ConfirmDialogModel } from '../shared/shared/models/confirm-dialog.model';
import { Constants } from '../shared/constant/config/constants';



import { ZContactService } from './shared/services/contact.service';
import { Group } from './group/group.model';
import { GroupService } from './group/group.service';
import { GroupEditModalComponent } from './group/group-edit-modal.component';
import { GoogleApiService } from './shared/services/google-api.service';
import { Config } from '../shared/constant/config/env.config';

import { ZContactSharedSettingsComponent } from './shared/modal/settings/settings.component';
import { CommonEvent, CommonEventAction, CommonEventService } from '@wth/shared/services';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  entryComponents: [
    GroupEditModalComponent,
    ZContactSharedSettingsComponent
  ]
})
export class AppComponent implements OnInit, OnDestroy, CommonEventAction {

  routerSubscription: Subscription;
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;
  modalComponent: any;
  modal: any;
  groups: Group[] = [];
  groups$: Observable<any[]>;
  contactMenu: Array<any> = new Array<any>();
  contactEvents: any = Constants.contactEvents;

  confirmDialog: ConfirmDialogModel = Constants.confirmDialog;

  private destroySubject: Subject<any> = new Subject<any>();


  constructor(private router: Router,
              private resolver: ComponentFactoryResolver,
              private commonEventService: CommonEventService,
              public contactService: ZContactService,
              private groupService: GroupService,
              private googleApiService: GoogleApiService,
              private wthConfirmService: WthConfirmService) {
    console.log('Environment config', Config, this.confirmDialog);
    this.commonEventService.filter((event: CommonEvent) => event.channel == Constants.contactEvents.common)
      .takeUntil(this.destroySubject)
      .subscribe((event: CommonEvent) => {
        this.doEvent(event);
      });
    this.groupService.groups$
      .takeUntil(this.destroySubject)
      .subscribe((groups: any[]) => {
        this.groups = groups;
      });
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .takeUntil(this.destroySubject)
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });

    this.groupService.getAllGroups()
      .then((groups: any[]) => console.debug('getAllGroups: ', groups))
      .then(() => this.contactService.initialLoad())
      .then(() => this.googleApiService.handleClientLoad());
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  doEvent(event: CommonEvent) {
    console.log('doEvent inside app component', event);
    switch (event.action) {
      case 'contact:group:open_modal_edit':
        this.loadModalComponent(GroupEditModalComponent);
        this.modal.open({
          mode: event.payload.mode,
          item: this.getGroup(event.payload.selectedItem) || new Group()
        });
        break;
      case 'contact:group:open_modal_setting':
        this.loadModalComponent(ZContactSharedSettingsComponent);
        this.modal.open();
        break;
      case 'contact:group:delete':
        let group = this.getGroup(event.payload.selectedItem);
        this.groupService.delete(group.id).subscribe(
          (res: any) => {
            console.log(res);
          });
        break;
    }
  }

  private getGroup(name: string): Group {
    return this.groupService.getGroupByName(name);
  }

  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;
  }
}
