import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

declare var _:any;

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-add-contact',
  templateUrl: 'add-contact.component.html'
})

export class ZChatShareAddContactComponent implements OnInit {

  @ViewChild('modal') modal: ModalComponent;
  friends:any = [];
  contactsItem:any;
  type:string = "addContact";
  filter:any;

  constructor(private chatService: ChatService ) {

  }

  ngOnInit() {
    this.chatService.getFriends().subscribe(
    (res:any) => {
      this.friends = res.data;
    });
    this.contactsItem = this.chatService.getContacts();
  }

  add() {
    if(this.type == "addContact") {
      this.addContact();
    } else {
      this.addMember();
    }
  }

  addContact() {
    let contacts = _.filter(this.contactsItem.value.data, { checked: true });
    let ids = _.map(contacts, 'display.id');
    this.chatService.addContact(ids);
    this.modal.close();
  }

  addMember() {
    let contacts = _.filter(this.contactsItem.value.data, { checked: true });
    let ids = _.map(contacts, 'display.id');
    this.chatService.addMembersGroup(ids);
    this.modal.close();
  }

  search() {
    this.chatService.router.navigate([`${this.chatService.constant.searchUrl}`]);
  }
}
