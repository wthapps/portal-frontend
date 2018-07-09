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
  users: any = [];
  selectedUsers: any = [];
  sharedUsers: any = [];
  role: any = {name: 'view'};
  roles: any = [];
  hasChanged: boolean;
  deleting: boolean;
  textUsers = [];

  @Output() onSave: EventEmitter<any> = new EventEmitter<any>();


  constructor(private apiBaseService: ApiBaseService, private sharingModalService: SharingModalService) {
  }

  ngOnInit() {
    this.sharingModalService.onOpen$.subscribe(e => {
      this.open(e);
    });
  }

  ngOnDestroy() {}

  close() {
    this.modal.close().then();
  }

  save() {
    const newRecipients: Array<SharingRecipient> = this.selectedUsers.map(s => { return { role_id: this.role.id, user: s}})
    const data = { sharingRecipients: [...this.sharedUsers, ...newRecipients], role: this.role};
    // short distance
    this.onSave.emit(data);
    // long distance
    this.sharingModalService.save.next(data);
    this.modal.close().then();
  }

  open(options: SharingModalOptions = {sharingRecipients: []}) {
    this.getRoles();
    if (options && options.sharingRecipients) {
      this.sharedUsers = options.sharingRecipients;
    } else {
      this.sharedUsers = [];
    }
    // reset textContacts, selectedContacts
    this.textUsers = [];
    this.selectedUsers = [];
    this.modal.open().then();
  }

  complete(e: any) {
    this.apiBaseService.get(`account/search?q=${e.query}`).subscribe(res => {
      const selectedIds = this.selectedUsers.map(ct => ct.id);
      const sharedIds = this.sharedUsers.map(sc => sc.user.id);
      this.users = res.data.filter(ct => !selectedIds.includes(ct.id) && !sharedIds.includes(ct.id));
    });
  }

  selectUser(user: any) {
    this.selectedUsers.push(user);
    this.hasChanged = true;
  }

  unSelectUser(user: any) {
    _.remove(this.selectedUsers, (selectedUser: any) => {
      return selectedUser.id === user.id;
    });
    this.hasChanged = true;
  }

  getRoles() {
    this.apiBaseService.get('common/roles', {module_name: 'Media'}).subscribe((response) => {
      this.roles = response.data.sort((a, b) => a.id - b.id);
      this.role = this.roles[0];
    });
  }

  toggleRemoving(user: any) {
    this.hasChanged = true;
    user._destroy = !user._destroy;
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
