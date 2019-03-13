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
import { UserService } from './../shared/services/user.service';
import { IntroductionModalComponent } from '@wth/shared/modals/introduction/introduction.component';
import { User } from '@shared/shared/models';
import { HeaderComponent } from '@shared/partials/header';
import { CheckForUpdateService } from './../shared/services/service-worker/check-for-update.service';
import { LogUpdateService } from './../shared/services/service-worker/log-update.service';
import { CardEditModalComponent } from './shared/card/components';
import { SwPushService } from '@shared/services/service-worker/sw-push.service';
import { ProfileService } from '@shared/user/services';
import { CardService } from '@contacts/shared/card';
import { PageVisibilityService } from '@shared/services/page-visibility.service';


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
  @ViewChild('cardEditModal') cardEditModal: CardEditModalComponent;


  @ViewChild('header') header: HeaderComponent;

  routerSubscription: Subscription;
  modalComponent: any;
  modal: any;
  groups: Group[] = [];
  groups$: Observable<any[]>;
  user$: Observable<any>;
  profile$: Observable<any>;
  loggedIn$: Observable<boolean>;
  sharedCardNum$: Observable<number>;
  contactMenu: Array<any> = new Array<any>();
  contactEvents: any = Constants.contactEvents;

  confirmDialog: ConfirmDialogModel = Constants.confirmDialog;

  private destroySubject: Subject<any> = new Subject<any>();

  constructor(
    public authService: AuthService,
    private router: Router,
    private resolver: ComponentFactoryResolver,
    private commonEventService: CommonEventService,
    public contactService: ZContactService,
    private groupService: GroupService,
    private profileService: ProfileService,
    private googleApiService: GoogleApiService,
    private visibilityService: PageVisibilityService,
    private swPush: SwPushService,
    public cardService: CardService,
    private promptUpdate: PromptUpdateService
  ) {
    this.user$ = authService.user$;
    this.loggedIn$ = authService.loggedIn$;
    this.profile$ = this.profileService.getProfile();
    this.sharedCardNum$ = this.cardService.sharedCardNum$;

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
    this.cardService.getSharedCardNum();

    this.visibilityService.reloadIfProfileInvalid();
  }

  ngAfterViewInit() {
    if (
      !this.authService.user.introduction ||
      !this.authService.user.introduction.contact
    ) {
      this.introduction.open();
    }

    this.contactService.initialLoad()
    .then(() => this.groupService.getAllGroups())
    .then(() => {
      timer(GAPI_TIMEOUT).subscribe(_ => {
          this.contactService.loadUserSetttings();
          this.googleApiService.handleClientLoad();
        });
    });
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

  reload(payload: any) {
    if (payload.sharedCardNum) {
      this.cardService.getSharedCardNum();
    }
  }

  createCard() {
    this.profileService.get(this.authService.user.uuid);
    this.cardEditModal.open({mode: 'create', card: null, cardType: 'business'});
  }

  onSave(payload: any) {
    if (payload.mode === 'edit') {
      console.log('updating card:::', payload.card);
      this.cardService.update(payload.card).subscribe(response => {
        console.log('response');
      });

    } else if (payload.mode === 'create') {
      console.log('create card:::', payload.card);
      this.cardService.createCard(payload.card);
      this.cardEditModal.close();
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
