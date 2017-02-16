import { Component, OnInit } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-conversation',
  templateUrl: 'conversation.component.html'
})
export class ZChatConversationComponent implements OnInit{
  item: any;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.item = this.chatService.getCurrentMessages();
  }
}
