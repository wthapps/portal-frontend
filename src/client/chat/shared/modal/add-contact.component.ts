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
  contacts: any;
  type: string = 'addContact';
  title: string = 'Message';
  filter: any;
  conversationSelect: any;

  constructor(private chatService: ChatService ) {

  }

  ngOnInit() {
    //
  }

  add() {
    if(this.type == 'addContact') {
      this.addContact();
    }
    if(this.type == 'addMember') {
      this.addMember();
    }
    if(this.type == 'shareContact') {
      this.shareContact();
    }
  }

  open() {
    if(this.type == 'addContact') {
      this.title = 'Message';
    }
    if(this.type == 'addMember') {
      this.title = 'Add To Conversation';
    }
    if(this.type == 'shareContact') {
      this.title = 'Share Contact';
    }
    this.chatService.getUserContacts().subscribe((res:any) => {
      this.contacts = res.data;
      if(this.title == 'Add To Conversation') {
        this.conversationSelect = this.chatService.getContactSelect().value;
        if(this.conversationSelect && this.conversationSelect.group_json.users_json) {

          this.contacts = _.map(this.contacts, (contact: any) => {
            for(let user of this.conversationSelect.group_json.users_json) {
              contact.checked = false;
              contact.inConversation = false;
              if(contact.id == user.id) {
                contact.checked = true;
                contact.inConversation = true;
                break
              }
            }
            return contact;
          });
        }
      }
    });

    this.modal.open();
  }

  checkBox(contact: any) {
    contact.checked = true;
  }

  addContact() {
    let contacts = _.filter(this.contacts, { checked: true });
    let ids = _.map(contacts, 'id');
    this.chatService.chatContactService.addContact(ids);
    this.modal.close();
  }

  addMember() {
    let contacts = _.filter(_.filter(this.contacts, { checked: true}), {inConversation: false});
    let ids = _.map(contacts, 'id');
    this.chatService.addMembersGroup(ids);
    this.modal.close();
  }

  shareContact() {
    let contacts = _.filter(this.contacts, { checked: true });
    let ids = _.map(contacts, 'id');
    this.chatService.shareContact(ids);
    this.modal.close();
  }

  search() {
    this.chatService.router.navigate([`${this.chatService.constant.searchNewContactsUrl}`]);
  }
}
