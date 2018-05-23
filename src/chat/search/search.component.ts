import { Component } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'z-chat-search',
  templateUrl: 'search.component.html',
  styleUrls: ['search.component.scss']
})
export class ZChatSearchComponent {
  conversations: any;
  name: any;
  events: any;
  params: any;

  constructor(private chatService: ChatService, private router: Router) {
    this.events = this.router.events
      .filter((event: any) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        let paths = event.url
          .toString()
          .split('/')[1]
          .split('?');
        if (paths[1]) {
          this.params = paths[1].substring(2, paths[1].length);
          this.getConversations();
        }
      });
  }

  getConversations() {
    this.chatService.apiBaseService
      .get(`zone/chat/search`, {
        q: this.params
      })
      .subscribe((res: any) => {
        this.conversations = res.data;
      });
  }

  delayAndGetConversations() {
    setTimeout(() => {
      this.getConversations();
    }, 300);
  }
}
