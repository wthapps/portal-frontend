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

  subscribeChat(group_id) {
    let _this = this;
    if(this.userService.loggedIn) {
      this.createConnectionInstance(this.userService);
      App.personalChat = App.cable.subscriptions.create(
        {channel: "ChatChannel", group_id: group_id},
        {
          connected(){
            console.log('chat connected');
            _this.getHistory(group_id);
            _this.sendMessage('friend_id');
          },
          disconnected(){console.log('chat disconnected')},
          received(data:any){console.log('chat received', data)}
        }
      );
    }
  }

  getHistory(group_id:number){
    App.personalChat.send({type: "history", group_id: group_id})
  }

  sendMessage(message:any) {
    App.personalChat.send({type: "text", body: "This is a cool chat app." })
  }

  unsubscribe() {
    App.personalChat.unsubscribe();
  }
}


