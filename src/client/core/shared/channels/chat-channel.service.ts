import { Injectable }     from '@angular/core';
import { CableService } from './cable.service';
import { StorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';

declare let ActionCable: any;
declare let App: any;
declare let $: any;
declare let _: any;

@Injectable()
export class ChatChannelService extends CableService {

  constructor(private userService: UserService, private storage: StorageService) {
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
            connected(){
              console.log('chat connected', groupId);
            },
            disconnected(){console.log('chat disconnected')},
            received(data: any){
              console.log('chat received', data);
              if (data.type == "send_message_chat") {
                _this.addMessage(data.group, data.message);
              }
            },
          }
        );
      }
    }
  }

  sendMessage(groupId:any, message:any, file?:any) {
    App["groupChat" + groupId].send({type: "send_message_chat", group: groupId, message: message, file: file});
  }

  addMessage(groupId:any, data:any) {
    let item = this.storage.find('chat_messages_group_' + groupId);
    if (item && item.value) {
      item.value.data.push(data);
      let currentGroupId = this.storage.find('contact_select').value.group.id;
      if(currentGroupId == groupId)
        this.storage.save('current_chat_messages', item.value);
    }
  }

  unsubscribe(groupId:any) {
    App["groupChat" + groupId].unsubscribe();
  }
}


