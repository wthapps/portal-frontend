import { Component, OnInit } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact',
  templateUrl: 'contact-black-list.component.html'
})
export class ZChatContactBlackListComponent implements OnInit {
  contactItem:any;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.contactItem = this.chatService.getContacts();
  }

  removeBlackList(contact:any) {
    this.chatService.removeBlackList(contact);
  }
}
