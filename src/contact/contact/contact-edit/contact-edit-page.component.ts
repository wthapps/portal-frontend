import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Contact } from '../contact.model';
import { ZContactService } from '../../shared/services/contact.service';
import { ToastsService } from '../../../shared/shared/components/toast/toast-message.service';
import { Constants } from '../../../shared/constant/config/constants';

import { _contact } from '../../shared/utils/contact.functions';
import { GroupService } from '@contacts/group/group.service';
import { InvitationCreateModalComponent } from '@shared/shared/components/invitation/invitation-create-modal.component';
import { ContactAddGroupModalComponent } from '@contacts/shared/modal/contact-add-group/contact-add-group-modal.component';

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
  mode: string = 'view';
  pageTitle: string;

  readonly tooltip: any = Constants.tooltip;
  formValid: boolean = false;
  _contact: any = _contact;
  hasBack = false;
  readonly urls = Constants.baseUrls;
  readonly avatarDefault: any = Constants.img.avatar;

  constructor(
    private router: Router,
    private contactService: ZContactService,
    private groupService: GroupService,
    private location: Location,
    private route: ActivatedRoute,
    private toastsService: ToastsService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
        this.contactService.clearSelected();
        const id = params['id'];
        if (params['mode'] !== undefined) {
          this.mode = params['mode'];
        } else {
          this.mode = 'create';
        }

        if (this.mode === 'view') {
          this.hasBack = true;
        }
        if (id !== undefined && id !== 'new') {
          this.get(id);
        }

        if (this.mode === 'view') {
          this.pageTitle = 'Contact details';
          this.hasBack = true;
        } else if (this.mode === 'create') {
          this.pageTitle = 'Create contact';
          this.contact =  new Contact(DEFAULT_CONTACT_PARAMS);
        } else {
          this.hasBack = false;
          this.pageTitle = 'Edit contact';
        }
      });
  }

  ngOnDestroy(): void {}

  eventForm(form: any) {
    this.formValid = form.valid;
  }

  toggleGroup(name: string) {
    let group = _.find(this.groupService.getAllGroupSyn(), (group: any) => {
      return group.name == name;
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
        this.contactService.confirmDeleteContacts([this.contact]);
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

      case 'add_to_contacts':
        this.contact.my_contact = true;
          this.contactService.updateMultiple({contacts: [this.contact]}).subscribe(response => {
            this.toastsService.success('You added others to your contacts successful!');
          });
        break;
    }
  }

  doEvent(event: any) {
    switch (event.action) {
      case 'contact:contact:create':
        let data = event.payload.item;
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
        this.contactService
          .update(event.payload.item)
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
}
