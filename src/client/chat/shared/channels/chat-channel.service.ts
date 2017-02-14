import { Injectable }     from '@angular/core';
import { CableService } from '../../../core/shared/channels/cable.service';
import { UserService } from '../../../core/shared/services/user.service';
import { StorageService } from '../../../core/shared/services/storage.service';

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

  addMessage(groupId:any, data:any) {

    let item = this.storage.find('chat_messages_group_' + groupId);
    if (item && item.value) {
      item.value.data.push(data);
      let currentGroupId = this.storage.find('contact_select').value.group.id;
      console.log('currentGroupId', currentGroupId );
      if(currentGroupId == groupId) {
        console.log('addMessage', item.value);
        this.storage.save('current_chat_messages', item);

        console.log('addMessage2', this.storage.find('current_chat_messages').value);
      }

    }
  }

  unsubscribe(groupId:any) {
    App["groupChat" + groupId].unsubscribe();
  }
}


