import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, combineLatest, map } from 'rxjs/operators';

import { ZContactService, ITEM_PER_PAGE, MY_CONTACTS, OTHER_CONTACTS } from '../../shared/services/contact.service';
import { ContactAddGroupModalComponent } from '../../shared/modal/contact-add-group/contact-add-group-modal.component';
import { _contact } from '../../shared/utils/contact.functions';
import { GroupService } from '../../group/group.service';
import { InvitationCreateModalComponent } from '../../../shared/shared/components/invitation/invitation-create-modal.component';
import { LoadingService } from '../../../shared/shared/components/loading/loading.service';
import { Recipient } from '../../../shared/shared/components/invitation/recipient.model';

import { Config } from '../../../shared/constant/config/env.config';
import { Constants } from '../../../shared/constant/config/constants';
import {
  CommonEvent,
  CommonEventAction,
  CommonEventService
} from '@wth/shared/services';
import { Contact } from '@contacts/contact/contact.model';

declare var _: any;
@Component({
  selector: 'z-contact-list',
  templateUrl: 'contact-list.component.html'
  // animations: [routeAnimation]
})
export class ZContactListComponent
  implements OnInit, OnDestroy, AfterViewInit, CommonEventAction {
  @ViewChild('modal') modal: ContactAddGroupModalComponent;
  @ViewChild('invitationModal') invitationModal: InvitationCreateModalComponent;


  contacts: any = [];
  filteredContacts: Array<any> = new Array<any>();
  contact$: Observable<any>;
  originalContacts: any = [];
  loaded = false;
  pageTitle: string;

  linkSocial = `${Config.SUB_DOMAIN.SOCIAL}/profile/`;
  linkChat = `${Config.SUB_DOMAIN.CHAT}/conversations/`;
  _contact: any = _contact;
  label$: Observable<string> ;
  inOtherPage = false;
  private pageSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);

  private destroySubject: Subject<any> = new Subject<any>();

  constructor(
    public contactService: ZContactService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private groupService: GroupService,
    private loadingService: LoadingService,
    private commonEventService: CommonEventService,
  ) {
    this.commonEventService
      .filter(
        (event: CommonEvent) => event.channel === Constants.contactEvents.common
      )
      .pipe(takeUntil(this.destroySubject))
      .subscribe((event: CommonEvent) => {
        this.doEvent(event);
      });
    // this.page = 1;
    this.contact$ = this.contactService.contacts$;
    this.label$ = this.route.paramMap.pipe(
      map(paramMap => paramMap.get('group'))
    );
    this.route.data
      .pipe(takeUntil(this.destroySubject))
      .subscribe(data => {
      if (data && data.page) {
        this.inOtherPage = (data.page === OTHER_CONTACTS);
        this.pageTitle = this.inOtherPage ? 'Other contacts' :
          this.route.snapshot.paramMap.get('group') || 'My contacts';
        this.contactService.setCurrentPage(data.page);
      }
    });
  }

  ngOnInit() {
    this.commonEventService
      .filter(
        (event: CommonEvent) =>
          event.channel === Constants.contactEvents.actionsToolbar
      )
      .pipe(takeUntil(this.destroySubject))
      .subscribe((event: CommonEvent) => {
        const tmp = _.cloneDeep(this.contactService.selectedObjects);
        this.contactService.selectedObjects = [event.payload];
        this.doActionsToolbar(event);
        this.contactService.selectedObjects = tmp;
      });

    this.route.params.forEach((params: Params) => {
      this.contactService.resetSelectedObjects();
      if (params['search']) {
        this.contactService.search({ search_value: params['search'] });
      } else {
        const category = location.pathname === '/others' ? 'others' : 'myContacts';
        let group = '';
        switch (params['group']) {
          case 'my contacts':
          case 'undefined':
            group = undefined;
            break;
          default:
            group = params['group'];
            break;
        }
        this.contactService.filter({ category: category, group: group });
      }
    });

    this.contactService.contacts$
      .pipe(
        combineLatest(this.pageSubject),
        takeUntil(this.destroySubject))
      .subscribe(([contacts, page]) => {
        this.contacts = contacts.slice(0, ITEM_PER_PAGE * page);
        this.loadingService.stop();
      });
  }

  ngAfterViewInit() {
    this.loadingService.start('#contact-list');

    this.contactService.initLoad$
      .pipe(takeUntil(this.destroySubject))
      .subscribe((data: any) => {
        if (data === true) {
          this.loaded = true;
          this.loadingService.stop('#contact-list');
        }
      });
    this.cdr.detectChanges();
  }

  confirmDeleteContacts() {
    this.contactService.confirmDeleteContacts()
    .then(ct => this.router.navigate(['contacts']));
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  onLoadMore() {
    this.pageSubject.next(this.pageSubject.getValue() + 1);
  }

  onItemSelected(contact: Contact) {
    this.contactService.viewContactDetail(contact);
  }

  viewContactDetail(contact: Contact) {
    this.contactService.viewContactDetail(contact);
  }

  editContact(contactId: any) {
    this.contactService.editContact(contactId);
  }

  doEvent(event: any) {
    switch (event.action) {
      case 'open_add_group_modal':
        let groups: any[] = [];
        if (this.contactService.selectedObjects.length > 1) {
          groups = _contact.getSameLables(this.contactService.selectedObjects);
        } else if (this.contactService.selectedObjects.length === 1) {
          groups = this.contactService.selectedObjects[0].groups;
          event.mode = 'edit';
        }

        this.modal.open({
          mode: event.mode,
          groups: groups,
          contacts: this.contactService.selectedObjects
        });
        break;

      // this will handle all cases as: favourite, add to group
      // after updating, deleting, importing we must update local CONTACT list data
      case 'contact:contact:update':
        const selectedObjects =
          event.payload && event.payload.selectedObjects
            ? event.payload.selectedObjects
            : this.contactService.selectedObjects;
        // there are two cases must be handled: SINGLE selected object and MULTIPLE selected objects
        this.contactService.update(selectedObjects).subscribe((res: any) => {
          console.log(res);
        });
        break;
    }
  }

  toggleGroup(name: string): void {
    const group = _.find(this.groupService.getAllGroupSyn(), (gr: any) => {
      return gr.name === name;
    });
    if (
      _contact.isContactsHasGroupName(this.contactService.selectedObjects, name)
    ) {
      _contact.removeGroupContactsByName(
        this.contactService.selectedObjects,
        name
      );
    } else {
      _contact.addGroupContacts(this.contactService.selectedObjects, group);
    }
    this.contactService
      .update(this.contactService.selectedObjects)
      .subscribe((res: any) => {
        console.log(res);
      });
  }

  doActionsToolbar(event: any) {
    switch (event.action) {
      case 'favourite':
        this.toggleGroup('favourite');
        break;
      case 'blacklist':
        this.toggleGroup('blacklist');
        break;
      case 'tag':
        this.doEvent({ action: 'open_add_group_modal' });
        break;
      case 'delete':
        this.confirmDeleteContacts();
        break;
      case 'social':
        if (this.contactService.selectedObjects &&
            this.contactService.selectedObjects[0].wthapps_user &&
            this.contactService.selectedObjects[0].wthapps_user.uuid) {
          window.location.href =
          this.linkSocial +
          this.contactService.selectedObjects[0].wthapps_user.uuid;
        }
        break;

      case 'chat':
        if (this.contactService.selectedObjects &&
            this.contactService.selectedObjects[0].wthapps_user &&
            this.contactService.selectedObjects[0].wthapps_user.uuid) {
          window.location.href =
          this.linkChat +
          this.contactService.selectedObjects[0].wthapps_user.uuid;
        }
        break;

      case 'view_detail':
        this.viewContactDetail(this.contactService.selectedObjects[0]);
        break;

      case 'edit_contact':
        this.router.navigate(['contacts', this.contactService.selectedObjects[0].id, 'edit']).then();
        break;
      case 'invitation:open_modal':
        const recipients: Array<Recipient> = new Array<Recipient>();
        const objects: any[] = _.get(event, 'payload.objects', this.contactService.selectedObjects);

        _.forEach(objects, (contact: any) => {
          if (contact.wthapps_user == null) {
            _.forEach(contact.emails, (email: any) => {
              recipients.push(
                new Recipient({
                  email: email.value,
                  fullName: contact.name,
                  contactId: contact.id
                })
              );
            });
          }
        });
        this.invitationModal.open({ data: recipients });
        break;
    }
  }
  addTags(event: any) {
    this.modal.open();
  }
}
