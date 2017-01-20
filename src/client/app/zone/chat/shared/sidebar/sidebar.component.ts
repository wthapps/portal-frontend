import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

declare var $:any;
@Component({
  moduleId: module.id,
  selector: 'z-chat-share-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.css']
})

export class ZChatSidebarComponent implements OnInit {
  item:any;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.item = this.chatService.getContacts();
  }
}
