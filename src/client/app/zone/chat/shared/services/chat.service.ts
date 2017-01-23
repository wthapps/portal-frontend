import { Injectable }     from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { ApiBaseService } from '../../../../shared/services/apibase.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { HandlerService } from '../../../../shared/services/handler.service';
import { ChatChannelService } from '../../../../shared/channels/chat-channel.service';
import { ChatNotificationChannelService } from '../../../../shared/channels/chat-notification-channel.service';
import { Router } from '@angular/router';

declare var _:any;

@Injectable()
export class ChatService {

  constructor(public storage: StorageService,
              private apiBaseService: ApiBaseService,
              public user: UserService,
              public chanel: ChatChannelService,
              public notificationChannel: ChatNotificationChannelService,
              public router: Router,
              public handler: HandlerService,) {
    this.storage.save('chat_contacts', null);
    this.storage.save('contact_select', null);
    this.storage.save('current_chat_messages', null);
  }

  getContacts() {
    let res:any = this.storage.find('chat_contacts');
    if(res && res.value) {
      return res;
    } else {
      this.apiBaseService.get('zone/chat/contacts').subscribe(
        (res:any) => {
          this.storage.save('chat_contacts', res);
          this.setDefaultSelectContact();
        }
      );
      return res;
    }
  }

  addContact(ids:number) {
    this.apiBaseService.post('zone/chat/create_contact', {user_id: ids}).subscribe(
      (res:any) => {
        let item = this.storage.find('chat_contacts');
        let index = _.findIndex(item.value.data, { id: res.data.id });
        if(index != -1) {
          // this.handler.triggerEvent('on_contacts_change', res);
        } else {
          item.value.data.push(res.data);
          // this.handler.triggerEvent('on_contacts_change', res);
        }
      }
    );
  }

  setDefaultSelectContact() {
    let res:any = this.storage.find('chat_contacts');
    if(res && res.value && res.value.data[0]) {
      this.storage.save('contact_select', res.value.data[0]);
      this.handler.triggerEvent('on_default_contact_select', res.value.data[0]);
      this.getMessages(res.value.data[0].group.id);
    }
  }

  selectContact(contact:any) {
    this.storage.save('contact_select', contact);
    this.handler.triggerEvent('on_contact_select', contact);
  }

  getContactSelect() {
    return this.storage.find('contact_select');
  }

  getFriends() {
    return this.apiBaseService.get('zone/chat/friends');
  }

  getMessages(groupId:number) {
    let item:any = this.storage.find('chat_messages_group_' + groupId);
    if(item && item.value) {
      this.storage.save('current_chat_messages', item.value);
    } else {
      this.apiBaseService.get('zone/chat/messages/' + groupId).subscribe(
        (res:any) => {
          this.storage.save('chat_messages_group_' + groupId, res);
          this.storage.save('current_chat_messages', res);
        }
      );
    }
  }

  getCurrentMessages() {
    this.handler.addListener('get_messages_after_select', 'on_contact_select', (contact:any) => {
      this.getMessages(contact.group.id);
    });
    return this.storage.find('current_chat_messages');
  }

  subscribeChanel() {
    this.handler.addListener('subscribe_chanel_after_select', 'on_contact_select', (contact:any) => {
      this.chanel.subscribeChat(contact.group.id);
    });
  }

  subscribeNotification() {
    this.handler.addListener('remove_notification_after_select', 'on_contact_select', (contact:any) => {
      // this.chanel.subscribeChat(contact.group.id);
      console.log('subscribeNotification', contact);
      this.notificationChannel.markAsRead(contact.group.id);
    });
    this.notificationChannel.subscribe();
  }

  sendMessage(message:any) {
    let item = this.storage.find('contact_select');
    if (item && item.value && message) {
      this.chanel.sendMessage(item.value.group.id, message);
    }
  }

  addMessage(groupId:any, res:any) {

    let item = this.storage.find('chat_messages_group_' + groupId);
    item.value.data.push(res);

    this.storage.save('current_chat_messages', item);
  }
}


