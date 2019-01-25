import { Injectable } from '@angular/core';
import { AppearanceNewUserOnline } from '../actions/appearance_new_user_online';
import { AppearanceAllUsersOnline } from '../actions/appearance_all_users_online';
import { AppearanceNewUserOffline } from '../actions/appearance_new_user_offline';
import { ChatActions } from '../actions/chat_actions';
import { CommonNotification } from '../actions/common_notification';

@Injectable()
export class ChannelActionFactoryService {
  readonly appearance_new_user_online = 'appearance_new_user_online';
  readonly appearance_all_users_online = 'appearance_all_users_online';
  readonly appearance_new_user_offline = 'appearance_new_user_offline';
  readonly chat_send_message = 'chat_send_message';
  readonly chat_notification = 'chat_notification';
  readonly chat_message_delete = 'CHAT_MESSAGE_DELETE';
  readonly common_notification: string = 'common_notification';
  action;
  data;

  create(data, service) {
    this.action = data.action;
    this.data = data.data;
    let action;
    switch (this.action) {
      case this.appearance_all_users_online:
        action = new AppearanceAllUsersOnline(service);
        break;
      case this.appearance_new_user_online:
        action = new AppearanceNewUserOnline(service);
        break;
      case this.appearance_new_user_offline:
        action = new AppearanceNewUserOffline(service);
        break;
      case this.chat_message_delete:
      case this.chat_send_message:
        action = new ChatActions(service);
        break;
      case this.chat_notification:
        action = new ChatActions(service);
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


