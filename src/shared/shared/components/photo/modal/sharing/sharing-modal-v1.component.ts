import { Component, ViewChild, Input, Output, OnDestroy, EventEmitter, OnInit } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';


import { ApiBaseService } from '@wth/shared/services';
import { ModalComponent } from '@shared/shared/components/base/components';
import { SharingModalOptions, SharingRecipient, SharingModalResult, SharingCreateParams } from '@shared/shared/components/photo/modal/sharing/sharing-modal';
import { SharingModalService } from '@shared/shared/components/photo/modal/sharing/sharing-modal.service';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';

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
  // newUsers: Array<any> [];
  updatedUsers: Array<any> = [];
  deletedUsers: Array<any> = [];
  newUsers: Array<any> = [];
  sharedUsers: any = [];
  role: any = {name: 'view'};
  roles: any = [];
  hasChanged: boolean;
  deleting: boolean;
  textUsers = [];
  loading = false;
  sub: any;

  @Output() onSave: EventEmitter<any> = new EventEmitter<any>();


  constructor(
    private apiBaseService: ApiBaseService,
    private sharingModalService: SharingModalService,
    private toastsService: ToastsService
    ) {
  }

  ngOnInit() {
    this.sharingModalService.onOpen$.subscribe(e => {
      this.open(e);
    });

    this.sub = this.sharingModalService.update$.subscribe((recipients: Array<any>) => {
      this.update(recipients);
    });
  }

  get updating(): boolean {
    return (this.updatedUsers.length + this.deletedUsers.length) > 0 ? true : false;
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  close() {
    this.cancel();
    this.modal.close().then();
  }

  cancel() {
    // reset removed users
    this.sharedUsers.forEach(user => {
      user._destroy = null;
    });

    // reset update users
    this.updatedUsers.forEach(recipient => {
      const updatedIndex = this.sharedUsers.map((item: any) => { return item.id; }).indexOf(recipient.id);
      if (updatedIndex >= 0) {
        this.sharedUsers[updatedIndex].role = recipient.role;
        this.sharedUsers[updatedIndex].role_id = recipient.role_id;
      }
    });


    this.resetUserLists();
  }

  save() {
    // const sharedUsers: SharingRecipient = this.sharedUsers.map(u => {return {role_id: u.role_id, , }};
    const newUsers: any = this.newUsers.map(n => { return { role_id: this.role.id, recipient_id: n.id}});
    const data: SharingModalResult = this.updating ? { recipients: this.sharedUsers, users: [], role: this.role} :
      { recipients: this.sharedUsers, users: newUsers, role: this.role};

    // short distance
    this.onSave.emit(data);
    // long distance
    this.sharingModalService.save.next(data);

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
    this.resetUserLists();
    this.modal.open().then();
  }


  update(recipients: Array<any> = []) {
    if (this.newUsers.length > 0 && this.sharedUsers.length === 0) {
      this.modal.close().then();
      this.toastsService.success(`You created a share for ${this.newUsers.length} user(s) successful!`);
    } else {
      this.sharedUsers = recipients || [];
      this.toastsService.success(`You updated sharing user(s) successful!`);
    }
    this.resetUserLists();
    this.hasChanged = false;
  }

  complete(e: any) {
    this.apiBaseService.get(`account/search?q=${e.query}`).subscribe(res => {
      const selectedIds = this.newUsers.map(ct => ct.id);
      const sharedIds = this.sharedUsers.map(sc => sc.user.id);
      this.users = res.data.filter(ct => !selectedIds.includes(ct.id) && !sharedIds.includes(ct.id));
    });
  }

  selectUser(user: any) {
    this.newUsers.push({...user, role_id: this.role.id});
    this.hasChanged = true;
  }

  unSelectUser(user: any) {
    _.remove(this.newUsers, (selectedUser: any) => {
      return selectedUser.id === user.id;
    });
    _.remove(this.textUsers, (selectedUser: any) => {
      return selectedUser.id === user.id;
    });
    this.hasChanged = this.newUsers.length > 0 ? true : false;
  }

  getRoles() {
    this.apiBaseService.get('common/roles', {module_name: 'Media'}).subscribe((response) => {
      this.roles = response.data.sort((a, b) => a.id - b.id);
      this.role = this.roles[0];
    });
  }

  toggleRemoving(recipient: any) {
    recipient._destroy = !recipient._destroy;

    const deletedIndex = this.deletedUsers.map((item: any) => {
      return item.id;
    }).indexOf(recipient.user.id);

    if (recipient._destroy) {
      if (deletedIndex < 0) {
        this.deletedUsers.push(recipient.user);
      }
    } else {
      this.deletedUsers.splice(deletedIndex, 1);
    }
    this.hasChanged = this.deletedUsers.length > 0 ? true : false;
  }

  changeRole(role: any, recipient: any = null) {
    if (!recipient) {
      this.role = role;
    } else if (role.id !== recipient.role_id) {
      const updatedIndex = this.updatedUsers.map((item: any) => {
        return item.id;
      }).indexOf(recipient.id);
      if (updatedIndex < 0) {
        this.updatedUsers.push({...recipient});
      }
      recipient.role_id = role.id;
      recipient.role = role;

      this.hasChanged = this.updatedUsers.length > 0 ? true : false;
    }
  }

  resetUserLists() {
    this.textUsers = [];
    this.newUsers = [];
    this.updatedUsers = [];
    this.deletedUsers = [];
    this.hasChanged = false;
  }
}
