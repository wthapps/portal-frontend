import { Component, ViewChild, Input, Output, OnDestroy, EventEmitter, OnInit } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ApiBaseService } from '../../../services';


@Component({
  selector: 'w-share-editor',
  templateUrl: 'share-editor.component.html',
  styleUrls: ['share-editor.component.scss']
})
export class ShareEditorComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: BsModalComponent;

  @Input() object: any;
  @Input() roles: Array<any> = [];
  @Input() title: string;

  @Output() save: EventEmitter<any> = new EventEmitter<any>();

  users: any = [];
  updatedUsers: Array<any> = [];
  deletedUsers: Array<any> = [];
  newUsers: Array<any> = [];
  sharedUsers: Array<any> = [];
  role: any = {name: 'view'};

  hasChanged: boolean;
  deleting: boolean;
  loading = false;

  constructor(
    private apiBaseService: ApiBaseService,
    ) {
  }

  ngOnInit() {

  }

  get updating(): boolean {
    return (this.updatedUsers.length + this.deletedUsers.length) > 0 ? true : false;
  }

  open(options: any) {
    this.title = options.title;
    this.object = options.object;

    this.resetUserLists();
    this.modal.open().then();
  }

  close() {
    this.cancel();
    this.modal.close().then();
  }

  cancel() {
    this.object.users.forEach(u => delete u.removed);
    this.resetUserLists();
  }

  onSave() {
    this.save.emit({newUsers: this.newUsers, updatedUsers: this.updatedUsers, deletedUsers: this.deletedUsers});
  }

  ngOnDestroy() {
  }


  update(recipients: Array<any> = []) {
    if (this.newUsers.length > 0 && this.sharedUsers.length === 0) {
      this.modal.close().then();
    } else {
      this.sharedUsers = recipients || [];
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
    this.hasChanged = true;
  }

  unSelectUser(user: any) {
    this.newUsers.forEach((u, i) => {
      if (u.id === user.id) {
        this.newUsers.splice(i, 1);
      }
    });
    this.hasChanged = this.newUsers.length > 0 ? true : false;
  }

  getRoles() {
    this.apiBaseService.get('common/roles', {module_name: 'Media'}).subscribe((response) => {
      this.roles = response.data.sort((a, b) => a.id - b.id);
      this.role = this.roles[0];
    });
  }

  toggleRemoving(user: any) {
    let existingUser = true;

    this.deletedUsers.forEach((u, i) => {
      if (u.id === user.id) {
        this.sharedUsers.splice(i, 1);
        existingUser = false;
        return;
      }
    });
    if (existingUser) {
      this.deletedUsers.push(user);
    }
    user.removed = !user.removed;

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
    this.newUsers = [];
    this.updatedUsers = [];
    this.deletedUsers = [];
    this.hasChanged = false;
  }
}
