import { Component, OnInit } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact',
  templateUrl: 'contact-online.component.html'
})
export class ZChatContactOnlineComponent implements OnInit {
  usersOnlineItem:any;
  contactItem:any;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.contactItem = this.chatService.getConversations();
    this.usersOnlineItem = this.chatService.getUsersOnline();
    console.log(this.contactItem);
  }
}
