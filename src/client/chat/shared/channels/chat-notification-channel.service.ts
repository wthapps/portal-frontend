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
              _this.removeNotification(data);
            }
            if (data.type == "notification_count") {
              _this.addNotification(data);
            }
            if (data.type == "added_contact") {
              _this.addContact(data);
            }
          },
        }
      );
    }
  }

  markAsRead(groupId:any) {
    App.chatNotification.send({type: "mark_as_read", group_id: groupId});
  }

  addedContactNotification(groupId:any) {
    App.chatNotification.send({type: "added_contact", group_id: groupId});
  }

  removeNotification(data:any) {
    let item = this.storage.find('chat_contacts');
    if(item && item.value) {
      let contact = _.find(item.value.data, (contact:any) => {if(contact.group_json.id == data.group_id) return contact});
      if (contact) {
        contact.notification_count = 0
      }
    }
  }

  addNotification(data:any) {
    let item = this.storage.find('chat_contacts');
    if(item && item.value) {
      let contact = _.find(item.value.data, (contact:any) => {if(contact.group_json.id == data.group_id) return contact});
      if (contact && contact.notification) {
        contact.notification_count = data.count
      }
    }
  }

  addContact(data:any) {
    let item = this.storage.find('chat_contacts');
    let index = _.findIndex(item.value.data, { id: data.group_user.id });
    if(index == -1) {
      item.value.data.push(data.group_user);
      let recentContacts = _.filter(item.value.data, ['favourite', false]);
      this.storage.save('chat_recent_contacts', recentContacts);
    }
  }
}


