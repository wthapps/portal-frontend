import { Component, OnInit } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { ApiBaseService } from '@wth/shared/services';
import { Observable } from 'rxjs';

@Component({
  selector: 'z-chat-contact',
  templateUrl: 'contact-online.component.html'
})
export class ZChatContactOnlineComponent implements OnInit {
  usersOnlineItem$: Observable<any>;
  contactItem: any;
  count: any;

  constructor(
    private chatService: ChatService,
    private apiBaseService: ApiBaseService
  ) {}

  ngOnInit() {
    this.contactItem = this.chatService.getConversations();
    this.usersOnlineItem$ = this.chatService.getUsersOnline();
    this.apiBaseService
      .post('zone/chat/contact/contact_tab_count')
      .subscribe((res: any) => {
        this.count = res.data;
      });
  }
}
