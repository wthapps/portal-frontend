import { Injectable }     from '@angular/core';
import { StorageService } from '../../../core/shared/services/storage.service';
import { UserService } from '../../../core/shared/services/user.service';
import { CableService } from '../../../core/shared/channels/cable.service';

declare let App: any;
declare let $: any;
declare let _: any;

@Injectable()
export class ChatNotificationChannelService extends CableService {

  constructor(private userService: UserService, private storage: StorageService) {
    super();
  }

  subscribe() {
    let _this = this;
    if(this.userService.loggedIn) {
      this.createConnectionInstance(this.userService);
      App.chatNotification = App.cable.subscriptions.create(
        {channel: "ChatNotificationChannel"},
        {
          connected(){
            console.log('chat notification connected');
          },
          disconnected(){console.log('chat notification disconnected')},
          received(data: any){
            console.log('chat notification recive', data);
            if (data.type == "mark_as_read") {
              _this.removeNotification(data.group);
            }
            if (data.type == "notification_count") {
              _this.addNotification(data);
            }
          },
        }
      );
    }
  }

  markAsRead(groupId:any) {
    App.chatNotification.send({type: "mark_as_read", group: groupId});
  }

  removeNotification(groupId:any) {
    let item = this.storage.find('chat_contacts');
    if(item && item.value) {
      let contact = _.find(item.value.data, (contact:any) => {if(contact.group.id == groupId) return contact});
      if (contact) {
        contact.notification = 0
      }
    }
  }

  addNotification(data:any) {
    let item = this.storage.find('chat_contacts');
    if(item && item.value) {
      let contact = _.find(item.value.data, (contact:any) => {if(contact.group.id == data.group) return contact});
      if (contact) {
        contact.notification = data.count
      }
    }
  }
}


