import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

declare var _: any;
@Component({
  moduleId: module.id,
  selector: 'z-chat-share-list',
  templateUrl: 'list.component.html'
})
export class ZChatShareListComponent implements OnInit {
  item: any = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.item = this.chatService.getCurrentMessages();
    this.chatService.subscribeChanel();
  }
}
