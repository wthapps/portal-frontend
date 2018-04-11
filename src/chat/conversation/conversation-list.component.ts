import { Component, OnInit } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { Store } from '@ngrx/store';

@Component({
  moduleId: module.id,
  templateUrl: 'conversation-list.component.html'
})
export class ConversationListComponent implements OnInit {
  selectContact: any;

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.selectContact = this.chatService.getContactSelect();
    if (this.selectContact && this.selectContact.value) {
      this.chatService.router.navigate([
        `${this.chatService.constant.conversationUrl}/${
          this.selectContact.value.id
        }`
      ]);
    }
  }
}
