import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { ZContactService } from '@contacts/shared/services/contact.service';
import { ApiBaseService, UrlService, CommonEventService, CommonEvent } from '@shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { _contact } from '@contacts/shared/utils/contact.functions';
import { GroupService } from '@contacts/group/group.service';
import { Config, Constants } from '@shared/constant';
import { Recipient } from '@shared/shared/components/invitation/recipient.model';
import { ContactAddGroupModalComponent } from '@contacts/shared/modal/contact-add-group/contact-add-group-modal.component';
import { InvitationCreateModalComponent } from '@shared/shared/components/invitation/invitation-create-modal.component';
import { Subscription } from 'rxjs/Subscription';
import { Contact } from '@contacts/contact/contact.model';

declare var _: any;

@Component({
  selector: 'contact-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss']
})
export class ContactSearchComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ContactAddGroupModalComponent;
  @ViewChild('invitationModal') invitationModal: InvitationCreateModalComponent;

  contacts: any;
  nextMine: any;
  nextWTH: any;
  sub: Subscription;
  _contact: any = _contact;

  readonly linkSocial = `${Config.SUB_DOMAIN.SOCIAL}/profile/`;
  readonly linkChat = `${Config.SUB_DOMAIN.CHAT}/conversations/`;

  constructor(
    public contactService: ZContactService,
    private route: ActivatedRoute,
    private router: Router,
    private urlService: UrlService,
    private commonEventService: CommonEventService,
    private groupService: GroupService,
    private apiBaseService: ApiBaseService
  ) {
    this.route.params.subscribe(params => {
      if (!params['id']  || params['id'] === 'mine') {
        this.getMine(params);
      }
      if (params['id'] === 'others') {
        this.getOtherContacts(params);
      }
      if (params['id'] === 'wth') {
        this.getWTH(params);
      }

    });
  }

  ngOnInit() {
    this.contactService.selectedObjects = [];
    this.sub = this.commonEventService
      .filter((event: CommonEvent) => event.channel === Constants.contactEvents.actionsToolbar)
      .subscribe((event: CommonEvent) => {
        const tmp = [...this.contactService.selectedObjects];
        this.contactService.selectedObjects = [event.payload];
        this.doActionsToolbar(event);
        this.contactService.selectedObjects = tmp;
      });
  }

  ngOnDestroy() {
    if (this.sub && !this.sub.closed) this.sub.unsubscribe();
  }

  getOtherContacts(params: any): void {
    this.apiBaseService.get(`contact/search/other_contacts`, { q: `name:${params.q || ''}` })
      .toPromise().then(res => {
        this.contacts = res.data;
        this.nextWTH = res.meta.links.next;
      });
  }

  getMine(params: any): void {
    this.apiBaseService.get(`contact/search/my_contacts`, {q: `name:${params.q || ''}`})
    .toPromise().then(res => {
        this.contacts = res.data;
        this.nextWTH = res.meta.links.next;
      });
  }

  getWTH(params: any): void {
    this.apiBaseService.get(`contact/search/wth_users_not_in_contact`, {q: `name:${params.q || ''}`})
    .toPromise().then(res => {
        this.contacts = res.data;
        this.nextWTH = res.meta.links.next;
      });
  }

  onItemSelected(contact: Contact) {
    if (this.route.snapshot.paramMap.get('id') !== 'wth')
      this.contactService.viewContactDetail(contact);
    else {
    }
  }

  onLoadMore() {

  }

  doActionsToolbar(event: any) {
    if (event.action === 'favourite') {
      // this.toggleGroupB(this.contactService.selectedObjects, 'favourite');
      this.toggleGroup('favourite');
    }

    if (event.action === 'blacklist') {
      this.toggleGroup('blacklist');
    }

    if (event.action === 'tag') {
      this.doEvent({ action: 'open_add_group_modal' });
    }

    if (event.action === 'delete') {
      const selectedIds = this.contactService.selectedObjects.map(ct => ct.id);
      this.contactService.confirmDeleteContacts()
        .then(contact => this.contacts = this.contacts.filter(ct => !selectedIds.includes(ct.id)));
    }

    if (event.action === 'save') {
      this.save();
    }

    if (event.action === 'social') {
      if (
        this.contactService.selectedObjects &&
        this.contactService.selectedObjects[0].wthapps_user &&
        this.contactService.selectedObjects[0].wthapps_user.uuid
      ) {
        window.location.href =
          this.linkSocial +
          this.contactService.selectedObjects[0].wthapps_user.uuid;
      }
    }

    if (event.action === 'chat') {
      if (
        this.contactService.selectedObjects &&
        this.contactService.selectedObjects[0].wthapps_user &&
        this.contactService.selectedObjects[0].wthapps_user.uuid
      ) {
        window.location.href =
          this.linkChat +
          this.contactService.selectedObjects[0].wthapps_user.uuid;
      }
    }

    if (event.action === 'view_detail') {
      this.router.navigate(['contacts', this.contactService.selectedObjects[0].id, {mode: 'view'}]).then();
    }

    if (event.action === 'edit_contact') {
      this.router
        .navigate([
          'contacts',
          this.contactService.selectedObjects[0].id,
          { mode: 'edit' }
        ])
        .then();
    }

    if (event.action === 'invitation:open_modal') {
      const recipients: Array<Recipient> = new Array<Recipient>();
      const objects: any[] = _.get(
        event,
        'payload.objects',
        this.contactService.selectedObjects
      );
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
    }
  }

  toggleGroup(name: string) {
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
        // update contact
        this.contacts = this.contacts.map(contact => {
          // if contact
          if (!contact.settings) {
            if (Array.isArray(res.data)) {
              res.data.forEach(c => {
                if (c.id === contact.id) {c.selected = contact.selected;
                  contact = c;
                }
              });
            } else {
              if (res.data.id === contact.id) {res.data.selected = contact.selected;
                contact = res.data;
              }
            }
          }
          return contact;
        });
      });
  }

  save() {
    const tmp = [...this.contactService.selectedObjects];
    this.contactService.selectedObjects = [];
    tmp.forEach(data => {
      this.apiBaseService.post(`contact/contacts/save`, data).subscribe(res => {
        this.contacts = this.contacts.map(contact => {
          if (contact.settings && contact.id === res.data.wthapps_user_id) {
            res.data.selected = data.selected;
            if (res.data.selected) this.contactService.selectedObjects.push(res.data);
            this.contactService.createCallback(res.data);
            return res.data;
          }
          return contact;
        });
      });
    });
  }

  addTags(event: any) {
    this.modal.open();
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
}
