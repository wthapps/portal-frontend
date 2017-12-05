import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';


import { Config } from '../../../core/shared/config/env.config';
import { LoadingService } from '../../../core/shared/components/loading/loading.service';

import { ZContactService } from '../../shared/services/contact.service';
import { CommonEventService } from '../../../core/shared/services/common-event/common-event.service';
import { CommonEventAction } from '../../../core/shared/services/common-event/common-event-action';
import { ContactAddGroupModalComponent } from '../../shared/modal/contact-add-group/contact-add-group-modal.component';
import { CommonEvent } from '../../../core/shared/services/common-event/common-event';
import { Constants } from '../../../core/shared/config/constants';
import { _wu } from '../../../core/shared/utils/utils';
import { _contact } from '../../shared/utils/contact.functions';
import { GroupService } from '../../group/group.service';
import { InvitationCreateModalComponent } from '../../../core/shared/components/invitation/invitation-create-modal.component';
import { Recipient } from '../../../core/shared/components/invitation/recipient.model';
import { InvitationService } from '../../../core/shared/components/invitation/invitation.service';
import { ToastsService } from '../../../core/shared/components/toast/toast-message.service';
import { WthConfirmService } from '../../../core/shared/components/confirmation/wth-confirm.service';
import { UserService } from '../../../core/shared/services/user.service';

declare var _: any;
@Component({
  moduleId: module.id,
  selector: 'z-contact-list',
  templateUrl: 'contact-list.component.html'
})
export class ZContactListComponent implements OnInit, OnDestroy, AfterViewInit, CommonEventAction {
  @ViewChild('modal') modal: ContactAddGroupModalComponent;
  @ViewChild('invitationModal') invitationModal: InvitationCreateModalComponent;
  @ViewChild('introModal') introModal: any;

  ITEM_PER_PAGE: number = 20;
  page: number = 1;

  contacts: any = [];
  filteredContacts: Array<any> = new Array<any>();
  actionsToolbarEvent: Subscription;
  tokens: any;
  tokensActionsBar: any;
  contact$: Observable<any>;
  originalContacts: any = [];
  data: any = [
  {
    title: 'Welcome to WTH!Contact',
    icon: '../../assets/images_new/pricing/contact-book.png',
    content: "WTH!Contact help you organize your acquaintance's contacts infomations",
  }
  ];

  linkSocial: string = `${Config.SUB_DOMAIN.SOCIAL}/profile/`;
  linkChat: string = `${Config.SUB_DOMAIN.CHAT}/conversations/`;
  _contact: any = _contact;

  private destroySubject: Subject<any> = new Subject<any>();

  constructor(
    public contactService: ZContactService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private wthConfirmService: WthConfirmService,
    private userService: UserService,
    private groupService: GroupService,
    private loadingService: LoadingService,
    private commonEventService: CommonEventService,
    private invitationService: InvitationService,
    private toaster: ToastsService
  ) {
    this.commonEventService.filter((event: CommonEvent) => event.channel == Constants.contactEvents.common).takeUntil(this.destroySubject).subscribe((event: CommonEvent) => {
      this.doEvent(event);
    });
    this.page = 1;
    this.contact$ = this.contactService.contacts$;

  }

  ngOnInit() {
    this.commonEventService.filter((event: CommonEvent) => event.channel == Constants.contactEvents.actionsToolbar).takeUntil(this.destroySubject).subscribe((event: CommonEvent) => {
      let tmp = _.cloneDeep(this.contactService.selectedObjects);
      this.contactService.selectedObjects = [event.payload];
      this.doActionsToolbar(event);
      this.contactService.selectedObjects = tmp;
    });


    this.route.params.forEach((params: Params) => {
      this.contactService.resetSelectedObjects();
      if (params['search']) {
        this.contactService.search({search_value: params['search']});
      } else {
        switch (params['group']) {
          case 'all contacts':
          case 'undefined':
            this.contactService.filter({group: undefined});
            break;
          default:
            this.contactService.filter({group: params['group']});
            break;
        }
      }
    });

    this.contactService.contacts$
      .takeUntil(this.destroySubject)
      .subscribe((contacts: any[]) => {
        this.contacts = contacts.slice(0, this.ITEM_PER_PAGE * this.page);
        this.loadingService.stop();
      });

    if(!this.userService.profile.introduction.contact) this.introModal.open();
  }

  ngAfterViewInit() {
    this.loadingService.start('#contact-list');

    this.contactService.initLoad$
      .takeUntil(this.destroySubject)
      .subscribe((data: any) => {
        if (data === true)
          this.loadingService.stop('#contact-list');
      });
    this.cdr.detectChanges();
  }

  confirmDeleteContacts() {
    this.contactService.confirmDeleteContacts();
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  onLoadMore() {
    this.page += 1;
    this.contactService.onLoadMore();
  }

  viewContactDetail(contactId: any) {
    this.router.navigate(['contacts/detail/' + contactId]).then();
  }

  editContact(contactId: any) {
    this.router.navigate(['contacts/' + contactId]).then();
  }

  doEvent(event: any) {
    switch (event.action) {
      case 'open_add_group_modal':
        let groups: any[] = [];
        if (this.contactService.selectedObjects.length > 1) {
          groups = _contact.getSameLables(this.contactService.selectedObjects);
        } else if (this.contactService.selectedObjects.length == 1) {
          groups = this.contactService.selectedObjects[0].groups;
          event.mode = 'edit';
        }

        this.modal.open({mode: event.mode, groups: groups, contacts: this.contactService.selectedObjects});
        break;

      // this will handle all cases as: favourite, add to group
      // after updating, deleting, importing we must update local CONTACT list data
      case 'contact:contact:update':
        let selectedObjects = (event.payload && event.payload.selectedObjects) ? event.payload.selectedObjects : this.contactService.selectedObjects;
        // there are two cases must be handled: SINGLE selected object and MULTIPLE selected objects
        this.contactService.update(selectedObjects).subscribe((res: any) => {
          console.log(res);
        });
        break;
      case 'invitation:send_to_recipients':
          this.invitationService.create({recipients: event.payload}).subscribe((response: any) => {
            // this.invitationModal.close();
            this.toaster.success('You have just sent invitation(s) successfully!');
          });
        break;
    }
  }

  toggleGroup(name: string) {
    let group = _.find(this.groupService.getAllGroupSyn(), (group: any) => {
      return group.name == name;
    });
    if (_contact.isContactsHasGroupName(this.contactService.selectedObjects, name)) {
      _contact.removeGroupContactsByName(this.contactService.selectedObjects, name);
    } else {
      _contact.addGroupContacts(this.contactService.selectedObjects, group);
    }
    this.contactService.update(this.contactService.selectedObjects).subscribe((res: any) => {
      console.log(res);
    });
  }

  doActionsToolbar(event: any) {
    if (event.action == 'favourite') {
      // this.toggleGroupB(this.contactService.selectedObjects, 'favourite');
      this.toggleGroup('favourite');
    }

    if (event.action == 'blacklist') {
      this.toggleGroup('blacklist');
    }

    if (event.action == 'tag') {
      this.doEvent({action: 'open_add_group_modal'});
    }

    if (event.action == 'delete') {
      this.contactService.confirmDeleteContacts(this.contactService.selectedObjects);
    }

    if (event.action == 'social') {
      if (this.contactService.selectedObjects && this.contactService.selectedObjects[0].wthapps_user && this.contactService.selectedObjects[0].wthapps_user.uuid) {
        window.location.href = this.linkSocial + this.contactService.selectedObjects[0].wthapps_user.uuid;
      }
    }

    if (event.action == 'chat') {
      if (this.contactService.selectedObjects && this.contactService.selectedObjects[0].wthapps_user && this.contactService.selectedObjects[0].wthapps_user.uuid) {
        window.location.href = this.linkChat + this.contactService.selectedObjects[0].wthapps_user.uuid;
      }
    }

    if (event.action == 'view_detail') {
      this.viewContactDetail(this.contactService.selectedObjects[0].id);
    }

    if (event.action == 'edit_contact') {
      this.router.navigate(['contacts', this.contactService.selectedObjects[0].id, {mode: 'edit'}]).then();
    }

    if (event.action == 'invitation:open_modal') {
      let recipients: Array<Recipient> = new Array<Recipient>();
      let objects: any[] = _.get(event, 'payload.objects', this.contactService.selectedObjects);
      _.forEach(objects, (contact: any) => {
        if(contact.wthapps_user == null) {
          _.forEach(contact.emails, (email: any) => {
            recipients.push(new Recipient({email: email.value, fullName: contact.name, contactId: contact.id}));
          });
        }
      });
      this.invitationModal.open({data: recipients});
    }
  }

  // showInvitation(): boolean {
  //   let result = true;
  //   _.forEach(this.contactService.selectedObjects, (contact: any) => {
  //       if (contact.wthapps_user != null) {
  //         result = false;
  //         return;
  //       }
  //       if (contact.emails.length == 0 || contact.emails[0].value == '') {
  //         result = false;
  //         return;
  //       }
  //   });
  //   return result;
  // }

  addTags(event: any) {
    this.modal.open();
  }

}
