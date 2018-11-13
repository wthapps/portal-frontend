import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewEncapsulation
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription ,  Observable ,  Subject ,  timer } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { ConfirmDialogModel } from '../shared/shared/models/confirm-dialog.model';
import { Constants } from '../shared/constant/config/constants';

import { ZContactService } from './shared/services/contact.service';
import { Group } from './group/group.model';
import { GroupService } from './group/group.service';
import { GroupEditModalComponent } from './group/group-edit-modal.component';
import { GoogleApiService } from './shared/services/google-api.service';
import { Config } from '../shared/constant/config/env.config';

import { ZContactSharedSettingsComponent } from './shared/modal/settings/settings.component';
import {
  AuthService,
  CommonEvent,
  CommonEventAction,
  CommonEventService
} from '@wth/shared/services';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';
import { PromptUpdateService } from './../shared/services/service-worker/prompt-update.service';
import { UserService } from './../shared/services/user.service';s
import { IntroductionModalComponent } from '@wth/shared/modals/introduction/introduction.component';
import { User } from '@shared/shared/models';
import { SwUpdate } from '@angular/service-worker';
import { HeaderComponent } from '@shared/partials/header';

const GAPI_TIMEOUT = 2000;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  entryComponents: [GroupEditModalComponent, ZContactSharedSettingsComponent]
})
export class AppComponent
  implements OnInit, OnDestroy, AfterViewInit, CommonEventAction {
  @ViewChild('modalContainer', { read: ViewContainerRef })
  modalContainer: ViewContainerRef;
  @ViewChild('introduction') introduction: IntroductionModalComponent;

  @ViewChild('header') header: HeaderComponent;

  routerSubscription: Subscription;
  modalComponent: any;
  modal: any;
  groups: Group[] = [];
  groups$: Observable<any[]>;
  user$: Observable<User>;
  loggedIn: boolean;

  contactMenu: Array<any> = new Array<any>();
  contactEvents: any = Constants.contactEvents;

  confirmDialog: ConfirmDialogModel = Constants.confirmDialog;

  private destroySubject: Subject<any> = new Subject<any>();

  constructor(
    public authService: AuthService,
    private userService: UserService,
    private router: Router,
    private resolver: ComponentFactoryResolver,
    private commonEventService: CommonEventService,
    public contactService: ZContactService,
    private groupService: GroupService,
    private googleApiService: GoogleApiService,
    private promptUpdate: PromptUpdateService,
    private swUpdate: SwUpdate,
    private wthConfirmService: WthConfirmService
  ) {
    console.log('Environment config', Config, this.confirmDialog);
    this.user$ = userService.profile$;
    this.loggedIn = userService.loggedIn;
    promptUpdate.checkForUpdate();

    // Subscribe common channel in header component
    if (this.swUpdate.isEnabled) {
      this.swUpdate.checkForUpdate()
      .then((res) => {
        this.header.subscribeChanneService();
      });
    }
    this.commonEventService
      .filter(
        (event: CommonEvent) => event.channel === Constants.contactEvents.common
      ).pipe(
        takeUntil(this.destroySubject)
      )
      .subscribe((event: CommonEvent) => {
        this.doEvent(event);
      });
    this.groupService.groups$
      .pipe(
        takeUntil(this.destroySubject)
      )
      .subscribe((groups: any[]) => {
        this.groups = groups;
      });
  }

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(
        takeUntil(this.destroySubject),
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {
        document.body.scrollTop = 0;
      });

    this.groupService
      .getAllGroups()
      .then((groups: any[]) => console.log('getAllGroups: ', groups))
      .then(() => this.contactService.initialLoad())
      .then(() => this.contactService.loadUserSetttings())
      .then(() => timer(GAPI_TIMEOUT).subscribe(_ => this.googleApiService.handleClientLoad()));
  }

  ngAfterViewInit() {
    if (
      !this.authService.user.introduction ||
      !this.authService.user.introduction.contact
    ) {
      this.introduction.open();
    }
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  doEvent(event: CommonEvent) {
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
        const group = this.getGroup(event.payload.selectedItem);
        this.groupService.delete(group.id).subscribe((res: any) => {
        });
        break;
    }
  }

  private getGroup(name: string): Group {
    return this.groupService.getGroupByName(name);
  }

  private loadModalComponent(component: any) {
    const modalComponentFactory = this.resolver.resolveComponentFactory(
      component
    );
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(
      modalComponentFactory
    );
    this.modal = this.modalComponent.instance;
  }
}
