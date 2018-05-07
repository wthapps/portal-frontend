import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { BsModalComponent } from 'ng2-bs3-modal';

import { WthAppsBaseModal } from '../../shared/shared/interfaces/wthapps-base-modal';
import { ZContactService } from '@contacts/shared/services/contact.service';
import { ApiBaseService, UrlService, CommonEventService, CommonEvent } from '@shared/services';
import { ActivatedRoute, Router } from '@angular/router';
import { _contact } from '@contacts/shared/utils/contact.functions';
import { GroupService } from '@contacts/group/group.service';
import { Config, Constants } from '@shared/constant';
import { Recipient } from '@shared/shared/components/invitation/recipient.model';

declare var $: any;
declare var _: any;

@Component({
  selector: 'contact-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss']
})
export class ContactSearchComponent implements OnInit, OnDestroy{
  contacts: any;
  nextMine: any;
  nextWTH: any;
  sub: any;
  _contact: any = _contact;

  linkSocial: string = `${Config.SUB_DOMAIN.SOCIAL}/profile/`;
  linkChat: string = `${Config.SUB_DOMAIN.CHAT}/conversations/`;

  constructor(
    private contactService: ZContactService,
    private route: ActivatedRoute,
    private router: Router,
    private urlService: UrlService,
    private commonEventService: CommonEventService,
    private groupService: GroupService,
    private apiBaseService: ApiBaseService
  ){
    this.route.params.subscribe(params => {
      if (!params['category'] || params['category'] == 'all') {
        this.getAll(params);
      }
      if (params['category'] == 'mine') {
        this.getMine(params);
      }
      if (params['category'] == 'wth') {
        this.getWTH(params);
      }

    })
  }

  ngOnInit() {
    this.contactService.selectedObjects = [];
    this.sub = this.commonEventService
      .filter((event: CommonEvent) => event.channel == Constants.contactEvents.actionsToolbar)
      .subscribe((event: CommonEvent) => {
        let tmp = _.cloneDeep(this.contactService.selectedObjects);
        this.contactService.selectedObjects = [event.payload];
        this.doActionsToolbar(event);
        this.contactService.selectedObjects = tmp;
      })
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  getAll(params: any) {
    this.apiBaseService.get(`contact/search/wth_users_not_in_contact`, {q: `name:${params.q}`}).subscribe(res => {
        this.contacts = res.data;
        this.nextWTH = res.meta.links.next;
        this.apiBaseService.get(`contact/search/my_contacts`, {q: `name:${params.q}`}).subscribe(res2 => {
          this.contacts = [...this.contacts, ...res2.data];
          this.nextMine = res2.meta.links.next;
        });
      });
  }

  getMine(params: any) {
    this.apiBaseService.get(`contact/search/my_contacts`, {q: `name:${params.q}`}).subscribe(res => {
        this.contacts = res.data;
        this.nextWTH = res.meta.links.next;
      });
  }

  getWTH(params: any) {
    this.apiBaseService.get(`contact/search/wth_users_not_in_contact`, {q: `name:${params.q}`}).subscribe(res => {
        this.contacts = res.data;
        this.nextWTH = res.meta.links.next;
      });
  }

  onLoadMore() {

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
      // this.doEvent({ action: 'open_add_group_modal' });
    }

    if (event.action == 'delete') {
      this.contactService.confirmDeleteContacts(
        this.contactService.selectedObjects
      );
    }

    if (event.action == 'social') {
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

    if (event.action == 'chat') {
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

    if (event.action == 'view_detail') {
      this.router.navigate(['contacts/detail/' + this.contactService.selectedObjects[0].id]).then();
    }

    if (event.action == 'edit_contact') {
      this.router
        .navigate([
          'contacts',
          this.contactService.selectedObjects[0].id,
          { mode: 'edit' }
        ])
        .then();
    }

    if (event.action == 'invitation:open_modal') {
      let recipients: Array<Recipient> = new Array<Recipient>();
      let objects: any[] = _.get(
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
      // this.invitationModal.open({ data: recipients });
    }
  }

  toggleGroup(name: string) {
    let group = _.find(this.groupService.getAllGroupSyn(), (group: any) => {
      return group.name == name;
    });
    if (
      _contact.isContactsHasGroupName(this.contactService.selectedObjects, name)
    ) {
      _contact.removeGroupContactsByName(
        this.contactService.selectedObjects,
        name
      );
    } else {
      console.log(this.contactService.selectedObjects);

      _contact.addGroupContacts(this.contactService.selectedObjects, group);
    }

    this.contactService
      .update(this.contactService.selectedObjects)
      .subscribe((res: any) => {
        console.log(res);
        // update contact
        this.contacts = this.contacts.map(contact => {
          // if contact
          if (!contact.settings) {
            if(Array.isArray(res.data)) {
              res.data.forEach(c => {
                if (c.id == contact.id) contact = c;
              })
            } else {
              if (res.data.id == contact.id) contact = res.data;
            }
          }
          return contact;
        })
      });
  }
}
