import { Component, OnInit } from '@angular/core';
import { ChatService } from '../services/chat.service';

declare var _: any;
@Component({
  moduleId: module.id,
  selector: 'z-chat-share-list',
  templateUrl: 'list.component.html'
})
export class ZChatShareListComponent implements OnInit {
  messages: any = [];

  constructor(private chatService: ChatService) {
    this.chatService.onContactSelect((contact:any) => {
      this.chatService.getMessages(contact.group.id, (res:any) => {
        this.messages = res.data;
        // ByMe
        this.messages = _.map(this.messages, (m:any) => {
          if(this.chatService.user.profile.id == m.display.id) {
            m.byMe = true;
          } else {
            m.byMe = false;
          }
          return m;
        });
        console.log(this.messages)
      });
    });
  }

  ngOnInit() {
    // console.log('ngOnInit2')
  }
}
