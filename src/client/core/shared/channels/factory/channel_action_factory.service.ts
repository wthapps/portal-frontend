import { Injectable }     from '@angular/core';
import { AppearanceNewUserOnline } from '../actions/appearance_new_user_online';
import { AppearanceAllUsersOnline } from '../actions/appearance_all_users_online';
import { AppearanceNewUserOffline } from '../actions/appearance_new_user_offline';
import { ChatSendMessage } from '../actions/chat_send_message';
import { ChatNotification } from '../actions/chat_notification';

@Injectable()
export class ChannelActionFactoryService {
  appearance_new_user_online:string = 'appearance_new_user_online';
  appearance_all_users_online:string = 'appearance_all_users_online';
  appearance_new_user_offline:string = 'appearance_new_user_offline';
  chat_send_message:string = 'chat_send_message';
  chat_notification:string = 'chat_notification';
  action:any;
  data:any;

  create(data:any, service:any){
    this.action = data.action;
    this.data = data.data;
    let action:any;
    switch(this.action) {
      case this.appearance_all_users_online:
        action = new AppearanceAllUsersOnline(this.data, service);
        break;
      case this.appearance_new_user_online:
        action = new AppearanceNewUserOnline(this.data, service);
        break;
      case this.appearance_new_user_offline:
        action = new AppearanceNewUserOffline(this.data, service);
        break;
      case this.chat_send_message:
        action = new ChatSendMessage(this.data, service);
        break;
      case this.chat_notification:
        action = new ChatNotification(this.data, service);
        break;
    }
    return action;
  }
}


