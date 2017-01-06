import { Injectable }     from '@angular/core';
import { UserService } from '../../shared/index';
import { CableService } from './cable.service';

declare let ActionCable: any;
declare let App: any;
declare let $: any;

@Injectable()
export class ChatChannelService extends CableService {

  constructor(private userService: UserService) {
    super();
  }

  subscribeChat(friend_id) {
    if(this.userService.loggedIn) {
      this.createChatInstance(this.userService.profile.id, friend_id);
      App.personal_chat = App.cable.subscriptions.create(
        {channel: "ChatChannel"},
        {
          connected: function(){console.log('chat connected')},
          disconnected: function(){console.log('chat disconnected')},
          received: function(data){console.log('chat received', data)}
        }
      );
    }
  }

  unsubscribe() {
    App.personal_chat.unsubscribe();
  }
}


