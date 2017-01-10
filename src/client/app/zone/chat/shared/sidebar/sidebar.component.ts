import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'z-chat-share-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.css']
})

export class ZChatSidebarComponent implements OnInit {
  contacts:any = [];

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.chatService.onContactsUpdate((res:any, newContact:any) => {
      this.contacts = res.data;
    });
    this.chatService.getContacts();
  }
}
