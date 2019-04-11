import { CommonEventService } from './../../../shared/services/common-event/common-event.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { Observable } from 'rxjs';
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
import { CardService } from '@contacts/shared/card';
import { CardEditModalComponent } from '@contacts/shared/card/components';
import { ProfileService } from '@shared/user/services';
import { PUBLIC, BUSINESS, NONE } from '@contacts/shared/card/card.constant';

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
  @ViewChild('cardDetailModal') cardDetailModal: CardEditModalComponent;

  contact: Contact = new Contact(DEFAULT_CONTACT_PARAMS);
  card$: Observable<any>;
  emails: String[] = [];
  business_cards = [];
  public_cards = [];
  mode = 'view';
  pageTitle: string;
  saving = false;

  readonly tooltip: any = Constants.tooltip;
  readonly mediaType = Constants.mediaType;
  readonly PUBLIC = PUBLIC;
  readonly BUSINESS = BUSINESS;
  readonly NONE = NONE;
  formValid = false;
  _contact: any = _contact;
  hasBack = false;
  viewOnly = false;
  isWthContact = false;
  readonly urls = Constants.baseUrls;
  readonly avatarDefault: any = Constants.img.avatar;
  readonly BIZ_CARD = `Business Cards help you share private contact information with other users`;
  readonly PUBLIC_CARD = `All the information in your Public Profile card will be public`;
  private destroySubject: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private contactService: ZContactService,
    private groupService: GroupService,
    private cardService: CardService,
    private profileService: ProfileService,
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
      this.saving = false;

      if (this.mode === 'view') {
        this.hasBack = true;
      }
      if (id && id !== 'new') {
        if (this.isWthContact) {
          this.viewOnly = true;
          this.getWthContact(id);
        } else {
          this.get(id);
        }
      }

      if (this.mode === 'view') {
        this.pageTitle = '';
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

      case 'edit_contact': {
      const id = this.contact.id || this.route.snapshot.paramMap.get('id');
        this.contactService.editContact(id);
        this.hasBack = false;
        this.mode = 'edit';
        break;
      }
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
          }, error => { this.saving = true; this.toastsService.danger('Something wrong happens. Please retry'); });
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
          }, error => { this.saving = true; this.toastsService.danger('Something wrong happens. Please retry'); });
        break;
      case 'contact:contact:remove_email': {
        const { value } = event.payload;
        _.remove(this.emails, email => {
          return email === value;
        });

        const user_ids = this.public_cards.reduce((acc, card) => (card.email === value ? [...acc, card.id] : acc), []);
        this.public_cards = this.public_cards.filter(card => card.email !== value && !user_ids.includes(card.user_id));
        this.business_cards = this.business_cards.filter(card => card.email !== value && !user_ids.includes(card.user_id));
        break;
      }
      case 'contact:contact:edit_email': {
        const emails = event.payload.emails;

        this.public_cards = this.public_cards.filter(card => emails.includes(card.email));
        const user_ids = this.public_cards.map(card => card.user_id);
        this.business_cards = this.business_cards.filter(card => user_ids.includes(card.user_id));
        this.checkEmails([event.payload.item.value]);
        break;
      }
    }
  }

  invite(email: any) {
    this.invitationModal.open({
      data: [
        {
          contactId: this.contact.id,
          email: email,
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

  trackByCard(index, card) {
    return card ? card.id : index;
  }

  viewCard(card: any) {
    if (card.card_type === 'business') {
      this.card$ = this.cardService.getItem();
      this.cardService.getCard(card.uuid);
    } else {
      this.card$ = this.profileService.profile$;
      this.profileService.getProfileNew(card.uuid);
    }
    this.cardDetailModal.open({});
  }

  private get(id: number) {
    this.contactService.getIdLocalThenNetwork(id).subscribe(ct => {
      this.contact = Object.assign({}, ct);
      const emails = this.contact.emails.reduce((arr, item) => item.value !== '' ? [...arr, item.value] : arr, []);
      if (emails.length > 0) {
        this.checkEmails(emails);
      }
    });
  }

  private checkEmails(emails): void {

    this.contactService
    .checkEmails({ emails })
    .subscribe(response => {
      this.public_cards = _.uniqBy(this.public_cards.concat(response.public_cards), 'id');
      this.business_cards = _.uniqBy(this.business_cards.concat(response.business_cards), 'id');
    });
  }

  private getWthContact(id: number) {
    this.contactService.getWthContact(id).subscribe(res => {
      this.contact = res.data;
    });
  }
}
