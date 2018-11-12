import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ChatService } from '../shared/services/chat.service';
import { ZChatContactActionsComponent } from '../shared/contact-action/contact-actions.component';

declare var _: any;

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'z-chat-history',
  templateUrl: 'history.component.html',
  styleUrls: ['history.component.scss']
})
export class ZChatHistoryComponent implements OnInit {
  contactItem$: Observable<any>;
  usersOnlineItem$: Observable<any>;
  configActions: any = {
    history: true
  };

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.contactItem$ = this.chatService.getHistoryConversations();
    this.usersOnlineItem$ = this.chatService.getUsersOnline();
  }
}
