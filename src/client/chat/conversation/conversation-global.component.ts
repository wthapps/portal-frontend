import { Component, OnInit } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';

@Component({
  moduleId: module.id,
  templateUrl: 'conversation-global.component.html'
})
export class ZChatConversationGlobalComponent implements OnInit {
  selectContact: any;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.selectContact = this.chatService.getContactSelect();
    if (this.selectContact && this.selectContact.value) {
      console.log('inti chatService');
      this.chatService.router.navigate([`${this.chatService.constant.conversation_url}/${this.selectContact.value.id}`]);
    }
  }
}
