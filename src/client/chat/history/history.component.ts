import { Component, OnInit, ViewChild } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { ZChatContactActionsComponent } from '../shared/contact-action/contact-actions.component';

@Component({
  moduleId: module.id,
  selector: 'z-chat-history',
  templateUrl: 'history.component.html'
})
export class ZChatHistoryComponent implements OnInit {
  contactItem: any;
  configActions: any = {
    history: true
  };

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {

    this.contactItem = this.chatService.getHistoryContacts();
  }
}
