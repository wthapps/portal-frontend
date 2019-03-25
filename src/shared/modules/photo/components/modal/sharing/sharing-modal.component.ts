import { Component, ViewChild, Input, Output, OnDestroy, EventEmitter, OnInit } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ApiBaseService, CommonEventHandler, CommonEventService, CommonEvent } from '@wth/shared/services';
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';
import { SharingModalService } from './sharing-modal.service';
import { SharingModalOptions, SharingModalResult, SharingEditParams } from './sharing-modal';
import { ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import Sharing from '@shared/modules/photo/models/sharing.model';
import MediaList from '@shared/modules/photo/models/list-functions/media-list.model';
import { MediaType } from '@shared/modules/photo/models/interfaces/media';

declare var $: any;
declare var _: any;

@Component({
  selector: 'sharing-modal',
  templateUrl: 'sharing-modal.component.html',
  styleUrls: ['sharing-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SharingModalComponent extends CommonEventHandler implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;
  channel: any = 'SharingModalComponent';
  // context
  modes = { loading: "loading", add: "add", update: "update", updating: "updating" };
  cMode = this.modes.loading;
  changed: boolean;
  // input data
  objects: Array<MediaType> = [];
  // output:
  // event on share
  onDone: any;
  // display data
  sharing: Sharing = new Sharing();
  contacts: any = [];
  newUsers: Array<any> = [];
  role: any = { name: 'view' };
  roles: any = [];
  contactsFilter: any = [];
  updatedUsers: Array<any> = [];
  deletedUsers: Array<any> = [];
  @Output() onSave: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    public sharingModalService: SharingModalService,
    public commonEventService: CommonEventService,
    private apiBaseService: ApiBaseService,
    private toastsService: ToastsService
  ) {
    super(commonEventService);
  }

  ngOnInit() {
    // 
  }

  close() {
    this.cancel();
    this.modal.close().then();
  }

  cancel() {
    // reset removed users
    this.sharing.recipients.forEach(user => {
      user._destroy = null;
    });
    // reset update users
    this.updatedUsers.forEach(recipient => {
      const updatedIndex = this.sharing.recipients.map((item: any) => { return item.id; }).indexOf(recipient.id);
      if (updatedIndex >= 0) {
        this.sharing.recipients[updatedIndex].role = recipient.role;
        this.sharing.recipients[updatedIndex].role_id = recipient.role_id;
      }
    });
    this.resetUserLists();
    if (this.cMode == this.modes.updating) {
      this.changeMode(this.modes.update);
    } else {
      this.changeMode(this.modes.add);
    }
  }

  save() {
    const newUsers: any = this.newUsers.map(n => { return { role_id: this.role.id, recipient_id: n.id } });
    if (this.cMode == this.modes.add && !MediaList.isSingleSharing(this.objects)) {
      const data: any = {
        objects: this.objects.map((s: any) => { return { id: s.id, model: s.model } }),
        recipients: newUsers,
        role_id: this.role.id
      };
      this.apiBaseService.post('media/sharings', data).subscribe(res => {
        this.sharing = new Sharing(res.data);
        if (this.onDone) this.onDone(res.data);
        this.onSave.emit(res.data);
        this.changeMode(this.modes.update);
        this.resetUserLists();
      });
    } else {
      const data: SharingEditParams = {
        recipients: this.sharing.recipients.map(s => { return { id: s.id, role_id: s.role_id, recipient_id: s.user.id, _destroy: s._destroy } }),
        users: newUsers,
        id: this.sharing.id
      };
      this.apiBaseService.post('media/sharings/edit_recipients', data).subscribe(res => {
        this.sharing = new Sharing(res.data);
        if (this.onDone) this.onDone(res.data);
        this.onSave.emit(res.data);
        this.changeMode(this.modes.update);
      });
    }
  }

  open(event: CommonEvent) {
    this.modal.open().then();
    this.getRoles();
    this.resetUserLists();
    this.sharing = new Sharing();
    this.objects = event.payload;
    this.cMode = this.modes.loading;
    // output
    this.onDone = event.onDone;
    if (MediaList.existRecipients(this.objects)) {
      this.objects[0].callGetSharing().then(res => {
        this.sharing = new Sharing(res.data);
        this.changeMode(this.modes.update);
      });
    } else {
      this.loadContacts().subscribe(res => {
        this.contacts = res.data;
        this.contactsFilter = [...this.contacts];
        this.changeMode(this.modes.add);
      })
    }
    document.getElementById('p-chips-sharing').addEventListener('keyup', (event) => {
      let chips: HTMLInputElement = <HTMLInputElement>document.getElementById('p-chips-sharing');
      this.contactsFilter = this.contacts.filter(c => {
        return c.name.toLowerCase().indexOf(chips.value) != -1;
      })
    });
  }

  update(event: CommonEvent) {
    if (this.newUsers.length > 0 && this.sharing.recipients.length === 0) {
      this.modal.close().then();
      this.toastsService.success(`You created a share for ${this.newUsers.length} user(s) successful!`);
    } else {
      this.sharing.recipients = event.payload || [];
      this.toastsService.success(`You updated sharing user(s) successful!`);
    }
    this.resetUserLists();
    this.changed = false;
  }

  selectUser(user: any) {
    this.changed = true;
    this.selectContact(user);
    // reset value
    let chips: HTMLInputElement = <HTMLInputElement>document.getElementById('p-chips-sharing');
    chips.value = '';
  }

  unSelectUser(user: any) {
    _.remove(this.newUsers, (selectedUser: any) => {
      return selectedUser.id === user.id;
    });
    this.selectContact(user);
    this.changed = this.newUsers.length > 0 ? true : false;
  }

  getRoles() {
    this.apiBaseService.get('common/roles', { module_name: 'Media' }).subscribe((response) => {
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
    if (this.deletedUsers.length > 0) {
      this.cMode = this.modes.updating;
    } else {
      this.cMode = this.modes.update;
    }
    this.changed = this.deletedUsers.length > 0 ? true : false;
  }

  changeRole(role: any, recipient: any = null) {
    if (!recipient) {
      this.role = role;
    } else if (role.id !== recipient.role_id) {
      const updatedIndex = this.updatedUsers.map((item: any) => {
        return item.id;
      }).indexOf(recipient.id);
      if (updatedIndex < 0) {
        this.updatedUsers.push({ ...recipient });
      }
      recipient.role_id = role.id;
      recipient.role = role;

      this.changed = this.updatedUsers.length > 0 ? true : false;
      if (this.updatedUsers.length > 0) {
        this.cMode = this.modes.updating;
      } else {
        this.cMode = this.modes.update;
      }
    }
  }

  clickContact(contact) {
    this.selectContact(contact);
    this.newUsers = this.contacts.filter(c => c.selected == true);
    this.changed = true;
  }

  selectContact(user) {
    this.contacts = this.contacts.map(c => {
      if (c.id == user.id) c.selected = !c.selected;
      return c;
    });
  }

  deSelectContact() {
    this.contacts = this.contacts.map(c => {
      c.selected = false;
      return c;
    });
  }

  changeMode(mode: string) {
    this.cMode = mode;
    if (this.cMode == this.modes.add) {
      if (this.contacts.length == 0) {
        this.loadContacts().subscribe(res => {
          this.contacts = res.data;
          this.contactsFilter = [...this.contacts];
        });
      }
    }
  }

  clickDone() {
    if (this.cMode == this.modes.add && this.sharing.recipients.length > 0) {
      if (this.contacts.length > 0) {
        this.changeMode(this.modes.update);
      } else {
        this.changeMode(this.modes.add);
      }
    } else {
      this.close();
    }
  }

  loadContacts() {
    return this.apiBaseService.get("account/get_my_contacts_accounts?size=1000");
  }

  resetUserLists() {
    this.newUsers = [];
    this.updatedUsers = [];
    this.deletedUsers = [];
    this.deSelectContact();
    this.changed = false;
  }
}
