import { Injectable }     from '@angular/core';
import { AppearanceNewUserOnline } from '../actions/appearance_new_user_online';
import { AppearanceAllUsersOnline } from '../actions/appearance_all_users_online';
import { AppearanceNewUserOffline } from '../actions/appearance_new_user_offline';
import { ChatSendMessage } from '../actions/chat_send_message';
import { ChatNotification } from '../actions/chat_notification';
import { ChatActions } from '../actions/chat_actions';
import { CommonNotification } from '../actions/common_notification';

@Injectable()
export class ChannelActionFactoryService {
  appearance_new_user_online:string = 'appearance_new_user_online';
  appearance_all_users_online:string = 'appearance_all_users_online';
  appearance_new_user_offline:string = 'appearance_new_user_offline';
  chat_send_message:string = 'chat_send_message';
  chat_notification:string = 'chat_notification';
  common_notification: string = 'common_notification';
  action:any;
  data:any;

  create(data:any, service:any) {
    this.action = data.action;
    this.data = data.data;
    let action:any;
    switch(this.action) {
      case this.appearance_all_users_online:
        action = new AppearanceAllUsersOnline(service);
        break;
      case this.appearance_new_user_online:
        action = new AppearanceNewUserOnline(service);
        break;
      case this.appearance_new_user_offline:
        action = new AppearanceNewUserOffline(service);
        break;
      case this.chat_send_message:
        action = new ChatSendMessage(service);
        break;
      case this.chat_notification:
        action = new ChatNotification(service);
        break;
      case this.common_notification:
        action = new CommonNotification(service);
        break;
      default:
        action = new ChatActions(service);
    }
    return action;
  }
}

