import { Component, OnInit } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact-pending',
  templateUrl: 'contact-pending.component.html'
})
export class ZChatContactPendingComponent implements OnInit {
  contactItem:any;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.contactItem = this.chatService.getContacts();
  }

  onAccept(contact:any) {
    this.chatService.acceptRequest(contact);
  }

  onDecline(contact:any) {
    this.chatService.declineRequest(contact, false);
  }
}
