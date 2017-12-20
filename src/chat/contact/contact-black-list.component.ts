import { Component, OnInit } from '@angular/core';
import { ChatService } from '../shared/services/chat.service';
import { ApiBaseService } from '@wth/shared/services';

@Component({
  moduleId: module.id,
  selector: 'z-chat-contact',
  templateUrl: 'contact-black-list.component.html'
})
export class ZChatContactBlackListComponent implements OnInit {
  blacklist: any;
  count: any;

  constructor(private chatService: ChatService, private apiBaseService: ApiBaseService) {
  }

  ngOnInit() {
    this.chatService.apiBaseService.post('users/users_blacklist/get_users_blacklist', {module_name: 'chat'}).subscribe((res:any) => {
      this.blacklist = res.data;
    });
    this.apiBaseService.post('zone/chat/contact/contact_tab_count').subscribe((res: any) => {
      this.count = res.data;
    });
  }

  removeBlackList(user:any) {
    this.chatService.apiBaseService.post('users/users_blacklist/remove_users_blacklist', {user_id: user.id, module_name: 'chat'}).subscribe((res:any) => {
      this.blacklist = res.data;
      this.count.blacklist -= 1;
    });
  }
}
