import { Component, OnInit } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact-sent-request',
  templateUrl: 'contact-sent-request.component.html'
})
export class ZChatContactSentRequestComponent implements OnInit {
  contactItem:any;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.contactItem = this.chatService.getContacts();
  }

  onResend(contact:any) {
    this.chatService.addContact([contact.display.id]);
  }
}
