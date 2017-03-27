import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { ZChatShareAddContactComponent } from '../shared/modal/add-contact.component';

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact',
  templateUrl: 'contact.component.html'
})
export class ZChatContactComponent implements OnInit {
  contactItem:any;
  @ViewChild('addContact') addContact: ZChatShareAddContactComponent;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.contactItem = this.chatService.getContacts();
  }

  newContact() {
    this.addContact.type = 'addContact';
    this.addContact.modal.open();
  }
}
