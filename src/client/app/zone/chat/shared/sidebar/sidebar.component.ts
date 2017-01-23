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
    this.chatService.handler.addListener('on_default_contact_select_side_bar', 'on_default_contact_select', (contact:any) => {
      this.chatService.router.navigate([`/zone/chat/conversation/${contact.id}`]);
    });
    this.item = this.chatService.getContacts();
  }
}
