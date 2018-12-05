import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Constants } from '@shared/constant';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ApiBaseService } from '@shared/services';
import { InvitationCreateModalComponent } from '@shared/shared/components/invitation/invitation-create-modal.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'invite-contact',
  templateUrl: './invite-contact.component.html',
  styleUrls: ['./invite-contact.component.scss']
})
export class InviteContactComponent implements OnInit {
  @Output() invited: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modal') modal: BsModalComponent;
  @ViewChild('create') createModal: InvitationCreateModalComponent;
  contacts: any;
  loading: any;
  suggestedUsers: any = [];
  selectedUsers: any = [];

  constructor(private apiBaseService: ApiBaseService) {}
  ngOnInit() {}

  openModal() {
    this.apiBaseService.get(`contact/wcontacts`).subscribe(res => {
      this.contacts = res.data.filter(e => !e.wthapps_user);
    })
    this.modal.open();
  }

  openCreate(e: any) {
    this.modal.close();
    let data = [];
    const tmp = [...this.selectedUsers];
    this.selectedUsers = [];
    this.contacts.filter(c => c.selected).forEach(c => {
      if(c.emails && c.emails.length > 0) {
        c.emails.forEach(e => {
          data.push({ fullName: c.name, contactId: c.id, email: e.value });
        })
      } else {
        data.push({ fullName: c.name, contactId: c.id, email: ""});
      }
    });
    this.createModal.open({data: data, back: true});
    this.createModal.event.pipe(take(1)).subscribe(data => {
      if(data.action == 'back') {
        this.onBack();
        this.selectedUsers = tmp;
      }
    })
  }

  onBack() {
    this.createModal.close();
    this.modal.open();
  }

  selectUser(e: any) {
    e.selected = true;
    this.contacts = this.contacts.map(c => {
      if (c.id == e.id) {
        return e;
      }
      return c;
    })
  }

  deselectUser(e: any){
    e.selected = false;
    this.contacts = this.contacts.map(c => {
      if(c.id == e.id) {
        return e;
      }
      return c;
    })
  }

  onCheckboxChange(user){
    if (user.selected) {
      this.selectedUsers.push(user);
    } else {
      this.selectedUsers = this.selectedUsers.filter(u => u.id !== user.id);
    }
  }

  onSearch(e: any) {
    var rgxp = new RegExp(e.query, "i");
    this.suggestedUsers = this.contacts.filter(c => {
      if (c.name.match(rgxp)){
        return true;
      }
      return false;
    });
  }

  onInvited(event) {
    this.invited.emit(event);
  }
}
