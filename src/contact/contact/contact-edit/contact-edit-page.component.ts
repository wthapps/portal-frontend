import { CommonEventService } from './../../../shared/services/common-event/common-event.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

import { Contact } from '../contact.model';
import { ZContactService } from '../../shared/services/contact.service';
import { ToastsService } from '../../../shared/shared/components/toast/toast-message.service';
import { Constants } from '../../../shared/constant/config/constants';

import { _contact } from '../../shared/utils/contact.functions';
import { GroupService } from '@contacts/group/group.service';
import { InvitationCreateModalComponent } from '@shared/shared/components/invitation/invitation-create-modal.component';
import { ContactAddGroupModalComponent } from '@contacts/shared/modal/contact-add-group/contact-add-group-modal.component';
import { CommonEvent } from '@shared/services';

declare var _: any;

const DEFAULT_CONTACT_PARAMS = {
  phones: [
    {
      category: 'mobile'
    }
  ],
  emails: [
    {
      category: 'work'
    }
  ],

  addresses: [
    {
      category: 'work'
    },
    {
      category: 'home'
    }
  ],
  social_media: [
    {
      category: 'wthapps'
    }
  ]
};
@Component({
  selector: 'contact-edit-page',
  templateUrl: 'contact-edit-page.component.html',
  styleUrls: ['contact-edit-page.component.scss']
})
export class ZContactEditPageComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ContactAddGroupModalComponent;

  @ViewChild('invitationModal') invitationModal: InvitationCreateModalComponent;

  contact: Contact = new Contact(DEFAULT_CONTACT_PARAMS);

  emails = [];
  mode = 'view';
  pageTitle: string;

  readonly tooltip: any = Constants.tooltip;
  formValid = false;
  _contact: any = _contact;
  hasBack = false;
  viewOnly = false;
  isWthContact = false;
  readonly urls = Constants.baseUrls;
  readonly avatarDefault: any = Constants.img.avatar;
  private destroySubject: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private contactService: ZContactService,
    private groupService: GroupService,
    private location: Location,
    private route: ActivatedRoute,
    private commonEventService: CommonEventService,
    private toastsService: ToastsService
  ) {
    this.commonEventService
      .filter(
        (event: CommonEvent) => event.channel === Constants.contactEvents.common
      )
      .pipe(
        takeUntil(this.destroySubject))
      .subscribe((event: CommonEvent) => {
        this.doEvent(event);
      });
  }

  ngOnInit() {
    this.route.paramMap.forEach((paramMap: any) => {
      this.contactService.clearSelected();
      const id = paramMap.get('id');
      this.mode = paramMap.get('mode') || 'create';
      this.isWthContact = paramMap.get('wth') && paramMap.get('wth') === 'true';

      if (this.mode === 'view') {
        this.hasBack = true;
      }
      if (id && id !== 'new') {
        if (this.isWthContact) {
          this.viewOnly = true;
          this.getWthContact(id);
        } else
          this.get(id);
      }

      if (this.mode === 'view') {
        this.pageTitle = 'Contact details';
        this.hasBack = true;
      } else if (this.mode === 'create') {
        this.pageTitle = 'Create contact';
        this.contact = new Contact(DEFAULT_CONTACT_PARAMS);
      } else {
        this.hasBack = false;
        this.pageTitle = 'Edit contact';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroySubject.next('');
    this.destroySubject.complete();
  }

  eventForm(form: any) {
    this.formValid = form.valid;
  }

  toggleGroup(name: string) {
    const group = _.find(this.groupService.getAllGroupSyn(), (gr) => {
      return gr.name === name;
    });

    if (_contact.isContactsHasGroupName([this.contact], name)) {
      _contact.removeGroupContactsByName([this.contact], name);
    } else {
      _contact.addGroupContacts([this.contact], group);
    }
    this.contactService.update([this.contact]).subscribe((res: any) => {
      this.contact = res.data;
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

      case 'delete':
        this.contactService.confirmDeleteContacts([this.contact])
          .then(ct => this.router.navigate(['contacts']));
        break;

      case 'edit_contact':
        this.router
          .navigate(['contacts/', this.contact.id, 'edit'])
          .then();
        this.hasBack = false;
        this.mode = 'edit';
        break;

      case 'tag':
        this.modal.open({
          mode: 'edit',
          groups: this.contact.groups,
          contacts: [this.contact]
        });
        break;
      default:
        break;
    }
  }

  doEvent(event: any) {
    switch (event.action) {
      case 'contact:contact:create':
        const data = event.payload.item;
        delete data['id'];
        delete data['uuid'];
        this.contactService
          .create(data)
          .subscribe((response: any) => {
            this.toastsService.success(
              'Contact has been just created successfully!'
            );
            this.router.navigate([
              'contacts',
              response.data.id,
              { mode: 'view' }
            ]);
          });
        break;
      case 'contact:contact:update':
        const item = event.payload.item || event.payload.selectedObjects || this.contactService.selectedObjects;
        this.contactService
          .update(item)
          .subscribe((response: any) => {
            this.toastsService.success(
              'Contact has been just updated successfully!'
            );
            this.location.back();
          });
        break;
      case 'contact:contact:remove_email':
        _.remove(this.emails, email => {
          return email.value === event.payload.value;
        });
        break;
      case 'contact:contact:edit_email':
        this.contactService
          .checkEmails({ emails_attributes: [event.payload.item] })
          .subscribe(response => {
            const currentEmails = _.map(event.payload.emails, 'value.value');
            _.remove(this.emails, e => {
              return currentEmails.indexOf(e.value) < 0;
            });

            // this.emails = this.emails.concat(response.data);
            const emails = _.map(this.emails, 'value');
            response.data.forEach(email => {
              if (emails.indexOf(email.value) < 0) {
                this.emails = this.emails.concat(email);
              }
            });
          });
        break;
    }
  }

  invite(email: any) {
    this.invitationModal.open({
      data: [
        {
          contactId: this.contact.id,
          email: email.value,
          fullName: this.contact.name
        }
      ]
    });
  }

  gotoEdit() {
    this.router.navigate(['/contacts', this.contact.id, { mode: 'edit' }]);
    this.pageTitle = 'Edit contact';
  }

  goBack() {
    this.hasBack = true;
    this.location.back();
  }

  private get(id: number) {
    this.contactService.getIdLocalThenNetwork(id).subscribe(ct => {
      this.contact = Object.assign({}, ct);
      const emails = this.contact.emails.filter(email => email.value !== '');
      if (emails.length > 0) {
        this.contactService
          .checkEmails({ emails_attributes: emails })
          .subscribe(response => {
            this.emails = response.data;
          });
      }
    });
  }

  private getWthContact(id: number) {
    this.contactService.getWthContact(id).subscribe(res => {
      console.log('get WTH Contact: ', res);
      this.contact = res.data;
    });
  }
}
