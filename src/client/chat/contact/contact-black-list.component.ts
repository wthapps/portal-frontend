import { Component, OnInit } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact',
  templateUrl: 'contact-black-list.component.html'
})
export class ZChatContactBlackListComponent implements OnInit {
  blacklist:any;

  constructor(private chatService: ChatService) {
  }

  ngOnInit() {
    this.chatService.apiBaseService.post('users/users_blacklist/get_users_blacklist', {module_name: 'chat'}).subscribe((res:any) => {
      this.blacklist = res.data;
    });
  }

  removeBlackList(user:any) {
    this.chatService.apiBaseService.post('users/users_blacklist/remove_users_blacklist', {user_id: user.id, module_name: 'chat'}).subscribe((res:any) => {
      this.blacklist = res.data;
    });
  }
}
