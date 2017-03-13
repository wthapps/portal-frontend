import { Injectable }     from '@angular/core';
import { CableService } from '../../../core/shared/channels/cable.service';
import { UserService } from '../../../core/shared/services/user.service';
import { StorageService } from '../../../core/shared/services/storage.service';
import { ChatCommonService } from '../services/chat.common.service';

declare let ActionCable: any;
declare let App: any;
declare let $: any;
declare let _: any;

@Injectable()
export class ChatChannelService extends CableService {

  constructor(private userService: UserService,
              private storage: StorageService,
              private chatCommonService: ChatCommonService) {
    super();
  }

  subscribe(groupId:any) {
    let _this = this;
    if(this.userService.loggedIn) {
      this.createConnectionInstance(this.userService);
      if(App["groupChat" + groupId] == undefined) {
        App["groupChat" + groupId] = App.cable.subscriptions.create(
          {channel: "ChatChannel", group_id: groupId},
          {
            connected: function(){
              console.log('connected');
            },
            disconnected: function(){console.log('chat disconnected')},
            received: function(data: any){
              console.log('chat received', data);
              if (data.type == "send_message_chat") {
                _this.addMessage(data.group, data.message);
              }
            }
          }
        );
      }
    }
  }

  sendMessage(groupId:any, message:any, file?:any) {
    App["groupChat" + groupId].send({type: "send_message_chat", group: groupId, message: message, file: file});
  }

  sendContactMessage(groupId:any, message:any, contact?:any) {
    App["groupChat" + groupId].send({type: "send_message_chat", group: groupId, message: message, contact: contact});
  }

  addMessage(groupId:any, data:any) {
    this.chatCommonService.addMessage(groupId, data);
  }

  unsubscribe(groupId:any) {
    App["groupChat" + groupId].unsubscribe();
  }
}


