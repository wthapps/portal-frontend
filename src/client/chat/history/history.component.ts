import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { ZChatContactActionsComponent } from '../shared/contact-action/contact-actions.component';

declare var _: any;

@Component({
  moduleId: module.id,
  encapsulation: ViewEncapsulation.None,
  selector: 'z-chat-history',
  templateUrl: 'history.component.html',
  styleUrls: ['history.component.css']
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
