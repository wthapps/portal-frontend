import { Component, ViewChild, Input, Output, OnDestroy, EventEmitter, OnInit } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';


import { ApiBaseService } from '@wth/shared/services';
import { ModalComponent } from '@shared/shared/components/base/components';
import { SharingModalOptions, SharingRecipient } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
declare var $: any;
declare var _: any;

@Component({
  selector: 'sharing-modal-v1',
  templateUrl: 'sharing-modal-v1.component.html',
  styleUrls: ['sharing-modal-v1.component.scss']
})
export class SharingModalV1Component implements OnInit, OnDestroy, ModalComponent {
  @ViewChild('modal') modal: BsModalComponent;
  filteredContacts: any = [];
  selectedContacts: any = [];
  sharingRecipients: any = [];
  role: any = {name: 'view'};
  roles: any = [];
  hasChanged: boolean;
  deleting: boolean;
  textContacts = [];

  @Output() onSave: EventEmitter<any> = new EventEmitter<any>();


  constructor(private apiBaseService: ApiBaseService, private sharingModalService: SharingModalService) {
  }

  ngOnInit(){
    this.sharingModalService.onOpen$.subscribe(e => {
      this.open(e);
    });
  }

  ngOnDestroy() {}

  close() {
    this.modal.close().then();
  }

  save() {
    const newRecipients: Array<SharingRecipient> = this.selectedContacts.map(s => { return { role_id: this.role.id, user: s}})
    const data = { sharingRecipients: [...this.sharingRecipients, ...newRecipients], role: this.role};
    // short distance
    this.onSave.emit(data);
    // long distance
    this.sharingModalService.save.next(data);
    this.modal.close().then();
  }

  open(options: SharingModalOptions = {sharingRecipients: []}) {
    this.getRoles();
    if (options) {
      this.sharingRecipients = options.sharingRecipients;
    } else {
      this.sharingRecipients = [];
    }
    // reset textContacts, selectedContacts
    this.textContacts = [];
    this.selectedContacts = [];
    this.modal.open().then();
  }

  complete(e: any) {
    let body: any;
    body = {'q': (e.query === 'undefined' ? '' : 'name:' + e.query)};
    this.apiBaseService.post('users/search', body).subscribe(res => {
      const selectedContactIds = this.selectedContacts.map(ct => ct.id);
      const sharingRecipientIds = this.sharingRecipients.map(sc => sc.user.id);
      this.filteredContacts = res['data'].filter(ct => !selectedContactIds.includes(ct.id) && !sharingRecipientIds.includes(ct.id));
    });
  }

  selectContact(contact: any) {
    this.selectedContacts.push(contact);
    this.hasChanged = true;
  }

  unSelectContact(contact: any) {
    _.remove(this.selectedContacts, (c: any) => {
      return c['id'] == contact['id'];
    });
    this.hasChanged = true;
  }

  getRoles() {
    this.apiBaseService.get('common/roles', {module_name: 'Media'}).subscribe((response) => {
      this.roles = response.data.sort((a, b) => a.id - b.id);
      this.role = this.roles[0];
    });
  }

  toggleRemoving(contact: any) {
    this.hasChanged = true;
    contact._destroy = !contact._destroy;
  }

  changeRole(e: any) {
    this.role = e;
  }

  changeRecipientRole(recipient: any, r: any) {
    recipient.role_id = r.id;
    recipient.role = r;
    this.hasChanged = true;
  }
}
